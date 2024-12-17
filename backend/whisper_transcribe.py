import whisper
import sys
import json
import warnings
import os

# Suppress specific warnings if needed
warnings.filterwarnings("ignore")

# Load the Whisper model
model = whisper.load_model("base")  # You can choose 'small', 'medium', or 'large' for more accuracy

def transcribe_audio(file_path):
    try:
        # Transcribe the audio file
        result = model.transcribe(file_path)
        return result
    except Exception as e:
        print(f"Error during transcription: {e}")
        sys.exit(1)

def remove_tokens(data):
    """ Recursively remove specific keys from the JSON object. """
    if isinstance(data, dict):
        # List of keys to remove
        keys_to_remove = ['tokens', 'temperature', 'avg_logprob', 'compression_ratio', 'no_speech_prob', 'id', 'seek']
        
        # Remove each key in the list if it exists
        for key in keys_to_remove:
            if key in data:
                del data[key]
        
        # Recurse into each value in the dictionary
        for key in data:
            remove_tokens(data[key])  # Recurse into the nested objects
    elif isinstance(data, list):
        for item in data:
            remove_tokens(item)  # Recurse into each item of the list

def save_transcription_to_json(transcription, output_path):
    try:
        # Remove unwanted fields from the transcription data
        remove_tokens(transcription)
        
        # Save the transcription as JSON (with timestamps)
        with open(output_path, 'w') as f:
            json.dump(transcription, f, indent=4)
    except Exception as e:
        print(f"Error writing transcription to file: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python whisper_transcribe.py <path_to_audio_file>")
        sys.exit(1)

    # Get the path to the audio file from the command-line argument
    audio_file = sys.argv[1]
    
    # Check if the file exists
    if not os.path.exists(audio_file):
        print(f"Error: The file {audio_file} does not exist.")
        sys.exit(1)

    # Transcribe the audio
    transcription = transcribe_audio(audio_file)
    
    # Print the transcription as JSON (with timestamps)
    print(json.dumps(transcription, indent=4))

    # Save transcription to a JSON file
    output_path = "public/temp/output_transcription.json"  # Change this path if needed
    save_transcription_to_json(transcription, output_path)
    print(f"Transcription saved to {output_path}")
