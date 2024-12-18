import { exec } from 'child_process';
import path from 'path';
import { spawn } from 'child_process';
import fs from 'fs';
import { analyzeText } from './ai.controller.js';


const safeSendResponse = (res, responseSent, statusCode, data) => {
    if (!responseSent.sent) {
        responseSent.sent = true;
        res.status(statusCode).json(data);
    }
};

const handleTemporaryCleanup = (directory) => {
    setTimeout(() => {
        fs.rmSync(directory, { recursive: true, force: true });
        console.log(`Temporary files in '${directory}' deleted`);
    }, 300000); // Cleanup after 5 minutes
};


const keyMoments = async (req, res) => {
    const responseSent = { sent: false };
    try {
        const file = req.file;
        if (!file) return safeSendResponse(res, responseSent, 400, { error: 'File not provided' });

        console.log('Processing file for key moments:', file.originalname);

        const modelPath = './vosk-model-small-en-us-0.15';
        const tempDir = 'public/temp';
        const audioFilePath = path.join(tempDir, 'audio_transcribed.wav');
        const transcriptionFilePath = path.join(tempDir, 'transcription_with_timestamps.json');
        const outputDir = path.join(tempDir, 'segments');

        // Validate Vosk model path
        if (!fs.existsSync(modelPath)) {
            console.error('Vosk model path not found:', modelPath);
            return safeSendResponse(res, responseSent, 500, { error: 'Vosk model missing' });
        }

        // Ensure temp directory exists
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

        // Extract audio from the uploaded video
        const ffmpegExtractCommand = `ffmpeg -i public/temp/${file.originalname} -vn -ar 16000 -ac 1 -f wav ${audioFilePath}`;
        exec(ffmpegExtractCommand, (extractError) => {
            if (extractError) {
                console.error('Error converting video to audio:', extractError);
                return safeSendResponse(res, responseSent, 500, { error: 'Failed to extract audio from video' });
            }

            console.log('Audio extraction complete. File saved at:', audioFilePath);

            // Spawn the Python process
            const pythonProcess = spawn(
                '/env/bin/python3',
                ['audio_transcribe.py', audioFilePath]
            );

            pythonProcess.stdout.on('data', (data) => {
                console.log('Python Process:', data.toString());
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error('Python Process Error:', data.toString());
            });

            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error('Python process exited with code:', code);
                    return safeSendResponse(res, responseSent, 500, { error: 'Failed to transcribe audio' });
                }

                // Ensure the transcription file exists
                if (!fs.existsSync(transcriptionFilePath)) {
                    console.error('Transcription file not found:', transcriptionFilePath);
                    return safeSendResponse(res, responseSent, 500, { error: 'Transcription file missing' });
                }

                // Analyze transcription to extract key moments
                analyzeText(transcriptionFilePath)
                    .then(async (analysisResponse) => {
                        console.log('Text analysis complete. Key moments count:', analysisResponse.length);

                        const inputVideoPath = `public/temp/${file.originalname}`;
                        const segmentPromises = analysisResponse.map(({ keyMoment, start, end }) => {
                            if (!keyMoment || isNaN(start) || isNaN(end) || start >= end) {
                                console.warn('Skipping invalid moment:', { keyMoment, start, end });
                                return null;
                            }
                            const formattedMoment = keyMoment.replace(/\s+/g, '_');
                            const outputPath = path.join(outputDir, `${formattedMoment}.mp4`);
                            return createSegment(inputVideoPath, start, end, outputPath);
                        });

                        try {
                            const segmentPaths = await Promise.all(segmentPromises.filter(Boolean));
                            const segmentLinks = segmentPaths.map(path => ({
                                path,
                                url: `${req.protocol}://${req.get('host')}/app1/${path.replace('public/', '')}`,
                            }));

                            // Clean up temporary files
                            handleTemporaryCleanup(tempDir);

                            return safeSendResponse(res, responseSent, 200, {
                                message: 'Video uploaded successfully',
                                segments: segmentLinks,
                            });
                        } catch (segmentError) {
                            console.error('Error during segment generation:', segmentError);
                            return safeSendResponse(res, responseSent, 500, { error: 'Failed to generate video segments' });
                        }
                    })
                    .catch(transcriptionError => {
                        console.error('Error during transcription or analysis:', transcriptionError);
                        return safeSendResponse(res, responseSent, 500, { error: 'Failed to process audio' });
                    });
            });
        });
    } catch (unexpectedError) {
        console.error('Unexpected Error:', unexpectedError);
        return safeSendResponse(res, responseSent, 500, { error: 'Internal server error' });
    }
};
const createSegment = (inputVideoPath, start, end, outputPath) => {
    return new Promise((resolve, reject) => {
        const segmentCommand = `ffmpeg -i "${inputVideoPath}" -ss ${start} -to ${end} -c:v libx264 -c:a aac "${outputPath}"`;
        exec(segmentCommand, (err) => {
            if (err) return reject(err);
            console.log('Segment created:', outputPath);
            resolve(outputPath);
        });
    });
};

const stabilization = async (req, res) => {
    const responseSent = { sent: false };
    try {
        const file = req.file;
        if (!file) return safeSendResponse(res, responseSent, 400, { error: 'File not provided' });

        console.log('Stabilizing video:', file.originalname);

        const inputFilePath = path.join('public', 'temp', file.originalname);
        if (!fs.existsSync(inputFilePath)) {
            console.error('Input file not found:', inputFilePath);
            return safeSendResponse(res, responseSent, 400, { error: 'Input video file not found' });
        }

        const transformsPath = path.join('public', 'temp', 'transforms.trf');
        const outputFilePath = path.join('public', 'temp', `${file.originalname}_stabilized.mp4`);

        const detectCommand = `ffmpeg -i "${inputFilePath}" -vf vidstabdetect=shakiness=10:accuracy=15:result="${transformsPath}" -f null -`;
        const transformCommand = `ffmpeg -i "${inputFilePath}" -vf vidstabtransform=input="${transformsPath}":zoom=0.5:smoothing=30 -c:v libx264 -crf 18 -preset slow "${outputFilePath}"`;

        exec(detectCommand, (detectError) => {
            if (detectError) {
                console.error('Error during stabilization detection:', detectError);
                return safeSendResponse(res, responseSent, 500, { error: 'Failed to perform video stabilization detection' });
            }

            console.log('Stabilization detection completed successfully');

            exec(transformCommand, (transformError) => {
                if (transformError) {
                    console.error('Error during stabilization transformation:', transformError);
                    return safeSendResponse(res, responseSent, 500, { error: 'Failed to perform video stabilization transformation' });
                }

                console.log('Video stabilization completed successfully');
                const stabilizedVideoUrl = `${req.protocol}://${req.get('host')}/app1/temp/${file.originalname}_stabilized.mp4`;

                safeSendResponse(res, responseSent, 200, {
                    message: 'Video successfully stabilized',
                    segments: [{ url: stabilizedVideoUrl, path: stabilizedVideoUrl }],
                });

                handleTemporaryCleanup('public/temp');
            });
        });
    } catch (unexpectedError) {
        console.error('Unexpected Error:', unexpectedError);
        safeSendResponse(res, responseSent, 500, { error: 'Internal server error' });
    }
};

const compression = async (req, res) => {
    const responseSent = { sent: false };
    try {
        const file = req.file;
        const compressionLevel = parseInt(req.body.compressionLevel, 10);
        if (!file || isNaN(compressionLevel)) return safeSendResponse(res, responseSent, 400, { error: 'Invalid inputs provided' });

        console.log('Compressing video:', file.originalname, 'at level:', compressionLevel);

        const outputFilePath = path.join('public', 'temp', `${file.originalname}_compressed.mp4`);
        let ffmpegCommand;

        switch (compressionLevel) {
            case 1:
                ffmpegCommand = `ffmpeg -i "${file.path}" -vcodec libx264 -crf 30 -preset veryslow -b:a 128k "${outputFilePath}"`;
                break;
            case 2:
                ffmpegCommand = `ffmpeg -i "${file.path}" -vcodec libx264 -crf 23 -preset slow -b:a 192k "${outputFilePath}"`;
                break;
            case 3:
                ffmpegCommand = `ffmpeg -i "${file.path}" -vcodec libx264 -crf 18 -preset medium -b:a 256k "${outputFilePath}"`;
                break;
            default:
                return safeSendResponse(res, responseSent, 400, { error: 'Invalid compression level' });
        }

        exec(ffmpegCommand, (error) => {
            if (error) {
                console.error('Error during compression:', error);
                return safeSendResponse(res, responseSent, 500, { error: 'Failed to compress video' });
            }

            console.log('Compression completed successfully');
            const compressedVideoUrl = `${req.protocol}://${req.get('host')}/app1/temp/${file.originalname}_compressed.mp4`;

            safeSendResponse(res, responseSent, 200, {
                message: 'Video successfully compressed',
                segments: [{ url: compressedVideoUrl, path: compressedVideoUrl }],
            });

            handleTemporaryCleanup('public/temp');
        });
    } catch (unexpectedError) {
        console.error('Unexpected Error:', unexpectedError);
        safeSendResponse(res, responseSent, 500, { error: 'Internal server error' });
    }
};

const conversion = async (req, res) => {
    const responseSent = { sent: false };
    try {
        const file = req.file;
        const newFormat = req.body.newFormat?.toLowerCase();
        if (!file || !newFormat) return safeSendResponse(res, responseSent, 400, { error: 'Invalid inputs provided' });

        console.log('Converting video format:', file.originalname, 'to format:', newFormat);

        const supportedFormats = ['mp3', 'mp4', 'mov', 'avi', 'webm'];
        if (!supportedFormats.includes(newFormat)) return safeSendResponse(res, responseSent, 400, { error: 'Unsupported format' });

        const outputFilePath = path.join('public', 'temp', `${path.basename(file.originalname, path.extname(file.originalname))}.${newFormat}`);
        const ffmpegCommand = `ffmpeg -i "${file.path}" "${outputFilePath}"`;

        exec(ffmpegCommand, (error) => {
            if (error) {
                console.error('Error during conversion:', error);
                return safeSendResponse(res, responseSent, 500, { error: 'Failed to convert video' });
            }

            console.log('Conversion completed successfully');
            const convertedVideoUrl = `${req.protocol}://${req.get('host')}/app1/temp/${path.basename(outputFilePath)}`;

            safeSendResponse(res, responseSent, 200, {
                message: 'Video successfully converted',
                segments: [{ url: convertedVideoUrl, path: convertedVideoUrl }],
            });

            handleTemporaryCleanup('public/temp');
        });
    } catch (unexpectedError) {
        console.error('Unexpected Error:', unexpectedError);
        safeSendResponse(res, responseSent, 500, { error: 'Internal server error' });
    }
};

const resizeVideoDimensions = async (req, res) => {
    const responseSent = { sent: false };
    try {
        const file = req.file;
        const { newWidth, newHeight } = req.body;
        if (!file || isNaN(newWidth) || isNaN(newHeight)) return safeSendResponse(res, responseSent, 400, { error: 'Invalid dimensions provided' });

        console.log('Resizing video:', file.originalname, 'to dimensions:', { newWidth, newHeight });
        const outputFilePath = path.join('public', 'temp', `${path.basename(file.originalname, path.extname(file.originalname))}_resized.mp4`);
        const ffmpegCommand = `ffmpeg -i "${file.path}" -vf "scale=${newWidth}:${newHeight}" "${outputFilePath}"`;

        exec(ffmpegCommand, (error) => {
            if (error) {
                console.error('Error during resizing:', error);
                return safeSendResponse(res, responseSent, 500, { error: 'Failed to resize video' });
            }

            console.log('Resizing completed successfully');
            const resizedVideoUrl = `${req.protocol}://${req.get('host')}/app1/temp/${path.basename(outputFilePath)}`;

            safeSendResponse(res, responseSent, 200, {
                message: 'Video successfully resized',
                segments: [{ url: resizedVideoUrl, path: resizedVideoUrl }],
            });

            handleTemporaryCleanup('public/temp');
        });
    } catch (unexpectedError) {
        console.error('Unexpected Error:', unexpectedError);
        safeSendResponse(res, responseSent, 500, { error: 'Internal server error' });
    }
};

const splitVideos = async (req, res) => {
    const responseSent = { sent: false };
    try {
        const file = req.file;
        const splitTime = parseInt(req.body.splitTime, 10);
        if (!file || isNaN(splitTime) || splitTime <= 0) return safeSendResponse(res, responseSent, 400, { error: 'Invalid split time provided' });

        console.log('Splitting video:', file.originalname, 'with split time:', splitTime);

        const outputDir = path.join('public', 'temp', 'splits');
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

        const outputTemplate = path.join(outputDir, `${path.basename(file.originalname, path.extname(file.originalname))}_%03d.mp4`);
        const ffmpegCommand = `ffmpeg -i "${file.path}" -c copy -map 0 -segment_time ${splitTime} -f segment -reset_timestamps 1 "${outputTemplate}"`;

        exec(ffmpegCommand, (error) => {
            if (error) {
                console.error('Error during video splitting:', error);
                return safeSendResponse(res, responseSent, 500, { error: 'Failed to split video' });
            }

            console.log('Splitting completed successfully');
            const splitFiles = fs.readdirSync(outputDir).map((file) => ({
                path: path.join(outputDir, file),
                url: `${req.protocol}://${req.get('host')}/app1/temp/splits/${file}`,
            }));

            safeSendResponse(res, responseSent, 200, {
                message: 'Video successfully split',
                segments: splitFiles,
            });

            handleTemporaryCleanup(outputDir);
        });
    } catch (unexpectedError) {
        console.error('Unexpected Error:', unexpectedError);
        safeSendResponse(res, responseSent, 500, { error: 'Internal server error' });
    }
};

export { keyMoments, stabilization, compression, conversion, resizeVideoDimensions, splitVideos };