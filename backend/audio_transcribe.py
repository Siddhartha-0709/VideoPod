import os
import wave
import subprocess
import sys
import json
from vosk import Model, KaldiRecognizer

def transcribe_audio_with_timestamps(audio_path, model_path):
    """
    Transcribe the audio file using Vosk and include timestamps for sentences.
    """
    if not os.path.exists(model_path):
        print("Model path not found. Download a Vosk model from https://alphacephei.com/vosk/models")
        sys.exit(1)

    model = Model(model_path)
    recognizer = KaldiRecognizer(model, 16000)
    recognizer.SetWords(True)  # Enable word-level timestamps

    # Open the WAV file
    with wave.open(audio_path, "rb") as wf:
        if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getframerate() != 16000:
            print("Audio file must be WAV format, mono, 16-bit, 16kHz")
            sys.exit(1)

        print("Transcribing audio...")
        transcription_data = []
        while True:
            data = wf.readframes(4000)
            if len(data) == 0:
                break
            if recognizer.AcceptWaveform(data):
                result = json.loads(recognizer.Result())
                if "text" in result and "result" in result:
                    transcription_data.append(result["result"])

        # Get the final result
        final_result = json.loads(recognizer.FinalResult())
        if "text" in final_result and "result" in final_result:
            transcription_data.append(final_result["result"])

    # Process transcription data to include sentence-level timestamps
    sentences = []
    for word_data in transcription_data:
        sentence = {"text": "", "startTime": None, "endTime": None}
        for word in word_data:
            if sentence["startTime"] is None:
                sentence["startTime"] = word["start"]
            sentence["endTime"] = word["end"]
            sentence["text"] += word["word"] + " "
        sentence["text"] = sentence["text"].strip()  # Remove extra space
        sentences.append(sentence)

    return sentences

def main():
    # Ensure temp directory exists
    os.makedirs("public/temp", exist_ok=True)

    # Input audio file
    if len(sys.argv) < 2:
        print("Usage: python audio_transcribe.py <input audio file>")
        sys.exit(1)

    audio_path = sys.argv[1]  # Temporary WAV file
    model_path = "./vosk-model-small-en-us-0.15"  # Path to the Vosk model

    # Step 2: Transcribe the audio
    transcription = transcribe_audio_with_timestamps(audio_path, model_path)

    # Output transcription as JSON
    transcription_json = json.dumps(transcription, indent=4)
    print("\nTranscription with timestamps:\n", transcription_json)

    # Save to a JSON file
    with open("public/temp/transcription_with_timestamps.json", "w") as json_file:
        json_file.write(transcription_json)

    # Optional: Clean up temporary files
    if os.path.exists(audio_path):
        os.remove(audio_path)

if __name__ == "__main__":
    main()
