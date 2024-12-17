import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const apiKey = 'AIzaSyCAk4j2LoMu2-igBx9iH6hvash08pwvQyw';

const analyzeText = async (path) => {
    try {
        // Get the JSON from the file
        const textData = fs.readFileSync('public/temp/transcription_with_timestamps.json', 'utf8');
        // console.log('textData:', textData);
        console.log('Connecting to Google AI...');
        const googleAI = new GoogleGenerativeAI(apiKey);
        console.log('Connected to Google AI', googleAI);

        // Create a Gemini model instance
        const geminiModel = googleAI.getGenerativeModel({ model: 'gemini-pro' });
        // console.log('Gemini Model:', geminiModel);

        // Send the text data to the model and request key moments
        const response = await geminiModel.generateContent([
            textData,
            `
                You are analyzing a transcription of a video. Please identify the key moments in the video, providing a brief description of each key moment along with its start and end time. Ensure that the duration of each key moment is at least 30 seconds. 

                Return the result in a structured table format with columns for 'Key Moment', 'Start', and 'End'. The key moments should be listed in sequential order based on their appearance in the video.

                If there are multiple short key moments (less than 30 seconds), combine them into a single segment. Only return up to 8 key moments, prioritizing the most important events in the video.

                The result should look like this:

                | Key Moment | Start | End |
                |------------|-------|-----|
                | Key Moment 1 | 0.0 | 30.0 |
                | Key Moment 2 | 30.0 | 60.0 |
                | Key Moment 3 | 60.0 | 90.0 |

                Never create more than 8 segments, and each segment should be at least 30 seconds long and at max 60 seconds long skip any key moments that are shorter than 30 seconds.

            `
        ]);
        // console.log('Response from Google AI:',response);

        // Extracting the content and parse the key moments
        const content = response.response.candidates[0].content.parts[0].text;

        // Parse the content into a structured format
        const keyPoints = parseKeyPoints(content);

        // Define output path and write the parsed key points to the JSON file
        const outputPath = 'public/temp/key_points.json';
        fs.writeFileSync(outputPath, JSON.stringify(keyPoints, null, 4));
        return keyPoints;
    } catch (error) {
        console.log(error);
        return error;
    }
}

function parseKeyPoints(content) {
    const keyPoints = [];

    // Clean up the content and split the rows by newlines
    const rows = content.split('\n').filter(line => line.trim() !== '');

    // Loop through each row to extract the key points and their timestamps
    rows.forEach(row => {
        // Regex to capture the key point, start, and end times from each row
        const match = row.match(/\| (.*?) \| (.*?) \| (.*?) \|/);
        if (match) {
            const keyMoment = match[1].trim(); // Extract key moment
            const start = parseFloat(match[2].trim()); // Extract start time and convert to float
            const end = parseFloat(match[3].trim()); // Extract end time and convert to float

            // Push the parsed key point object to the array
            keyPoints.push({ keyMoment, start, end });
        }
    });

    return keyPoints;
}

export { analyzeText };
