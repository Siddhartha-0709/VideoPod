"use client"
import Pricing from './components/Pricing'
import MeteorsDemo from './components/Meteors'
import VortexDemo from './components/Vortex'
import React, { useState } from "react";
import { FlipWords } from "@/components/ui/flip-words";
import { Spotlight } from "@/components/ui/spotlight";
import Header from './components/Header';
import { useSession, signIn } from 'next-auth/react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function Home() {
  const words = ["Seamless Video Transcription", "Effortless Video Cropping", "Precise Key Moment Extraction", "Instant MP3 Conversion"];
  const words2 = ["The Power Behind Innovation", "Key Features That Redefine Video Transformation"];
  const [openDialog, setOpenDialog] = useState(false); // state to control dialog visibility
  const session = useSession();
  console.log(session);

  const authenticateUser = () => {
    if (session.status != 'authenticated') {
      setOpenDialog(true); // Open the dialog
    }
    else {
      window.open("/central-free", "_self");
    }
  };

  return (
    <>
      <Header />
      <div className="pb-36 w-full flex md:justify-center bg-black antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Spotlight className='-top-40 left-0 md:left-60 md:-top-20'
          fill="white"
        />
        <div className="text-5xl w-screen font-bold text-white mt-20 md:mt-44 md:px-10 px-4 ">
          <p className=' ml:4 md:ml-1'>Reimagine</p>
          <FlipWords className='inline-block mb-2 md:ml-1' words={words} />
          <p className='text-xl text-slate-200 font-light'>Your all-in-one platform for smarter, faster, and seamless video transformations.</p>
          <p className='text-base text-slate-300 font-light mt-3 md:w-6/12'>Combines cutting-edge AI with intuitive tools to simplify your video workflows. Extract key moments, generate accurate transcripts, convert to MP3, or customize edits—all in one seamless platform designed to save you time and effort.</p>
          <div>
            <button className="px-4 py-2 mt-5 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 hover:bg-slate-300 font-light"
              onClick={authenticateUser}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Conditional rendering of the AlertDialog */}
      {openDialog && (
        <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You have to authenticate to get started.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={signIn}>Continue</AlertDialogAction>
              <AlertDialogCancel onClick={() => setOpenDialog(false)}>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <div className='bg-black py-12 justify-center px-10'>
        <center className='px-5 md:px-10'>
          <FlipWords className='h-14 text-lg md:text-4xl font-bold text-white text-center' words={words2} />
        </center>
        <p className='text-lg text-slate-200 font-light text-center mt-2 mb-20'>Discover What Makes Our Platform Stand Out and Set the Standard in Video Transformation</p>
        <div className='flex flex-wrap justify-center gap-5 mt-6 w-[80%] mx-auto'>
          <MeteorsDemo title="AI Key Moment Extraction" description="Leverage the power of AI to transcribe videos and automatically identify key moments. Perfect for creating engaging shorts or Instagram reels from longer videos without the hassle of manual editing." />
          <MeteorsDemo title="Format Conversion" description="Convert videos into various formats with just a few clicks. Whether you're optimizing for different platforms or devices, VideoPod ensures your videos are always in the right format for any use case." />
          <MeteorsDemo title="Resizing" description="Resize videos to fit any screen size or resolution requirements. Whether you need to optimize videos for social media, presentations, or websites, VideoPod makes resizing fast and seamless without sacrificing quality." />
          <MeteorsDemo title="Video Stabilization" description="Automatically stabilize shaky footage to ensure smooth, professional-looking videos. VideoPod's stabilization tool corrects minor camera movements and vibrations, making your videos look steady and polished." />
          <MeteorsDemo title="Video Size Compression" description="Compress large video files without compromising quality. VideoPod reduces video sizes, making them easier to share, upload, or store, ensuring optimal performance on any platform or device." />
          <MeteorsDemo title="Video Split" description="The video splitting tool allows you to split videos into equal parts, by timecode, or by file size. Perfect for creating highlight reels, breaking up instructional videos, or simply organizing your video content." />
        </div>
      </div>
      <div className='bg-black'>
        <Pricing />
      </div>
      <div className='bg-black'>
        <VortexDemo />
      </div>
    </>
  );
}
