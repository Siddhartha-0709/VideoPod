'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { FileUpload } from '@/components/ui/file-upload'
import Header from '../components/Header'
import axios from 'axios';
import { Spotlight } from '@/components/ui/spotlight'
import { Dialog, DialogContent } from "@/components/ui/dialog";
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react'

export default function VideoProcessingPage() {
    const [selectedAction, setSelectedAction] = useState(null);
    const [compressionLevel, setCompressionLevel] = useState(1);
    const [newFormat, setNewFormat] = useState('mp4');
    const [newWidth, setNewWidth] = useState('');
    const [newHeight, setNewHeight] = useState('');
    const [splitTime, setSplitTime] = useState('');
    const [files, setFiles] = useState([]);
    const [hoveredVideo, setHoveredVideo] = useState(null);
    const [segments, setSegments] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loaderOpen, setLoaderOpen] = useState(false);



    const { status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') {
            window.open('/', "_self");
        }
    }, [status]);


    const handleFileUpload = (uploadedFiles) => {
        const file = uploadedFiles[0];
    
        // Check if the file is a video and the size is less than 500MB
        if (file.type.startsWith('video/') && file.size < 500 * 1024 * 1024) {
            // Create a video element to check the resolution
            const videoElement = document.createElement('video');
    
            // Event listener to check the resolution after video metadata is loaded
            videoElement.onloadedmetadata = () => {
                const width = videoElement.videoWidth;
                const height = videoElement.videoHeight;
                console.log('Video Dimensions', width, 'X', height);
    
                // Check if the resolution is 720p or higher (1280x720)
                if (width >= 1280 && height >= 720) {
                    const message = 'Please select a video with a resolution lower than 720p.';
                    console.log(message);
                    toast.error(message);
                    setFiles([]);  // Clear the selected files
                } else {
                    // If everything is valid, set the file
                    setFiles(uploadedFiles);
                    // toast.success('File uploaded successfully');
                }
            };
    
            // Load the video file to trigger the metadata loading
            const objectURL = URL.createObjectURL(file);
            videoElement.src = objectURL;
        } else {
            // Check if the file is too large or not a video
            const message = file.size >= 500 * 1024 * 1024
                ? 'Please select a file less than 500MB.'
                : 'Not a video file';
            console.log(message);
            toast.error(message);
            setFiles([]);  // Clear the selected files
        }
    };
    


    const actions = [
        { id: 'compression', title: 'Video Compression', description: 'Reduce file size with various quality options' },
        { id: 'stabilization', title: 'Video Stabilization', description: 'Smooth out shaky footage' },
        { id: 'keymoments', title: 'AI Key Moment Extraction', description: 'Automatically identify important scenes' },
        { id: 'conversion', title: 'Format Conversion', description: 'Change the video format' },
        { id: 'resizing', title: 'Resizing Video', description: 'Adjust video dimensions' },
        { id: 'split', title: 'Video Split', description: 'Divide video into multiple parts' },
    ];

    const handleActionSelect = (actionId) => {
        setSelectedAction(actionId);
    };

    const handleBack = () => {
        setSelectedAction(null);
    };

    const handleProcess = async () => {
        console.log('Processing video with action:', selectedAction);
        console.log('Files:', files);
        if (files.length === 0) {
            toast.error('No video file selected');
            return;
        }
        const date = new Date();
        const fileName = `VID_${date.toLocaleDateString('en-CA', { year: '2-digit', month: '2-digit', day: '2-digit' })}${date.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).replace(/:/g, '')}`;

        toast.success('Video file selected');
        const newFile = new File([files[0]], fileName, { type: files[0].type });
        console.log(newFile);

        setFiles([newFile]); // Ensure files state is an array

        const formData = new FormData();
        formData.append('media', newFile); // Append the newFile with new name

        try {
            setLoaderOpen(true);

            let response;
            try {
                if (selectedAction === 'stabilization') {
                    response = await axios.post('https://siddharthapro.in/app1/api/v1/video/stabilization', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                } else if (selectedAction === 'keymoments') {
                    response = await axios.post('https://siddharthapro.in/app1/api/v1/video/keymoments', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                } else if (selectedAction === 'compression') {
                    console.log('Compression Level:', compressionLevel);
                    formData.append('compressionLevel', compressionLevel);
                    response = await axios.post('https://siddharthapro.in/app1/api/v1/video/compression', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                } else if (selectedAction === 'conversion') {
                    console.log('New Format:', newFormat);
                    formData.append('newFormat', newFormat);
                    response = await axios.post('https://siddharthapro.in/app1/api/v1/video/conversion', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                }
                else if (selectedAction === 'resizing') {
                    console.log('New Width:', newWidth);
                    console.log('New Height:', newHeight);
                    formData.append('newWidth', newWidth);
                    formData.append('newHeight', newHeight);
                    response = await axios.post('https://siddharthapro.in/app1/api/v1/video/resizing', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                }
                else if (selectedAction === 'split') {
                    console.log('Split Time:', splitTime);
                    formData.append('splitTime', splitTime);
                    response = await axios.post('https://siddharthapro.in/app1/api/v1/video/split', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                }

                if (response) {
                    setSegments(response.data.segments);
                    setDialogOpen(true);
                    console.log(response.data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoaderOpen(false);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setSelectedAction(null);
        }
    };


    return (
        <>
            <Header />
            <div className="text-white bg-black/[0.96] p-4 dark pt-28">

                <Spotlight className='-top-40 left-0 md:left-60 md:-top-0 '
                    fill="white"
                />

                <Toaster
                    toastOptions={{
                        error: {
                            style: {
                                background: 'white',
                                color: 'black',
                            },
                            duration: 5000,
                            icon: '⚠️',
                            position: 'top-center',
                        }
                    }}
                />
                {
                    dialogOpen && (
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogContent className="bg-black/[0.96] border border-gray-700 text-white max-w-3xl mx-auto rounded-lg p-6">
                                <h1 className="text-xl font-semibold mb-4">Processed Video</h1>
                                <div className="max-h-[500px] overflow-y-auto">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {segments.map((segment, index) => (
                                            <div
                                                key={index}
                                                className="relative group flex flex-col items-center border border-gray-700 rounded-md p-3"
                                            >
                                                <video
                                                    src={segment.url}
                                                    className="w-full rounded-md mb-2 border-gray-600"
                                                    onMouseEnter={() => setHoveredVideo(segment.url)}
                                                    onMouseLeave={() => setHoveredVideo(null)}
                                                    autoPlay={hoveredVideo === segment.url}
                                                    muted
                                                    loop
                                                ></video>
                                                <a
                                                    href={segment.url}
                                                    download
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-white bg-black border-[1px] border-slate-400 hover:bg-blue-400 px-9 py-2 rounded-md text-center"
                                                >
                                                    Download
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                    )
                }
                {
                    loaderOpen ? (
                        <div className='h-screen'>
                            <div className='max-w-4xl mx-auto relative z-30 '>
                                <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-gray-800 dark:bg-black border-neutral-700 rounded-lg">
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white">
                                        </div>
                                        <p className="mt-4 text-slate-400 text-lg absolute -left-8 w-96">Processing Your Video . . . </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='max-w-4xl mx-auto relative z-10 '>
                            <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-gray-800 dark:bg-black border-neutral-700 rounded-lg">
                                <FileUpload onChange={handleFileUpload} maxFiles={1} />
                            </div>

                            {!selectedAction ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 mb-20">
                                    {actions.map((action) => (
                                        <Card key={action.id} className="cursor-pointer bg-black hover:border-[1px] hover:border-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" onClick={() => handleActionSelect(action.id)}>
                                            <CardHeader>
                                                <CardTitle>{action.title}</CardTitle>
                                                <CardDescription>{action.description}</CardDescription>
                                            </CardHeader>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="bg-black text-white mt-10 mb-20">
                                    <CardHeader>
                                        <CardTitle>{actions.find(a => a.id === selectedAction)?.title}</CardTitle>
                                        <CardDescription>{actions.find(a => a.id === selectedAction)?.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {selectedAction === 'compression' && (
                                            <div className="space-y-4">
                                                <RadioGroup value={compressionLevel.toString()} onValueChange={(value) => setCompressionLevel(Number(value))}>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="1" id="high-compression" />
                                                        <Label htmlFor="high-compression">High Compression | Low Quality</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="2" id="medium-compression" />
                                                        <Label htmlFor="medium-compression">Medium Compression | Medium Quality</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="3" id="low-compression" />
                                                        <Label htmlFor="low-compression">Low Compression | Indistinguishable Quality</Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                        )}
                                        {selectedAction === 'stabilization' && (
                                            <p></p>
                                        )}
                                        {selectedAction === 'keymoments' && (
                                            <p></p>
                                        )}
                                        {selectedAction === 'conversion' && (
                                            <div className="space-y-4">
                                                <Label htmlFor="format">Select new format:</Label>
                                                <select
                                                    id="format"
                                                    value={newFormat}
                                                    onChange={(e) => setNewFormat(e.target.value)}
                                                    className="w-full p-2 border border-neutral-700 bg-gray-900 text-white rounded"
                                                >
                                                    <option value="mp4">MP4</option>
                                                    <option value="mov">MOV</option>
                                                    <option value="avi">AVI</option>
                                                    <option value="webm">WebM</option>
                                                    <option value="mp3">MP3</option>
                                                </select>
                                            </div>
                                        )}
                                        {selectedAction === 'resizing' && (
                                            <div className="space-y-4">
                                                <div>
                                                    <Label htmlFor="width">New Width:</Label>
                                                    <Input
                                                        id="width"
                                                        type="number"
                                                        placeholder="Width in pixels"
                                                        value={newWidth}
                                                        onChange={(e) => setNewWidth(e.target.value)}
                                                        className="bg-black text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="height">New Height:</Label>
                                                    <Input
                                                        id="height"
                                                        type="number"
                                                        placeholder="Height in pixels"
                                                        value={newHeight}
                                                        onChange={(e) => setNewHeight(e.target.value)}
                                                        className="bg-black text-white"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {selectedAction === 'split' && (
                                            <div className="space-y-4">
                                                <Label htmlFor="split-time">Split at (in seconds):</Label>
                                                <Input
                                                    id="split-time"
                                                    type="number"
                                                    placeholder="Time in seconds"
                                                    value={splitTime}
                                                    onChange={(e) => setSplitTime(e.target.value)}
                                                    className="bg-gray-900 text-white"
                                                />
                                            </div>
                                        )}
                                        <div className="flex justify-between mt-6">
                                            <Button variant="outline" onClick={handleBack} className="text-white border-white hover:bg-slate-600">
                                                <ChevronLeft className="mr-2 h-4 w-4" /> Back
                                            </Button>
                                            <Button onClick={handleProcess} className="bg-white hover:bg-slate-300 text-black">
                                                Process <ChevronRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )
                }

            </div>
        </>
    )
}
