// "use client"

// import Header from "../components/Header"

// function page() {
//   return (
//     <>
//         <Header/>

//     </>
//   )
// }

// export default page

import { cn } from "@/lib/utils";
import {
    Icon3dCubeSphere,
    IconAdjustmentsBolt,
    IconAi,
    IconCloud,
    IconCurrencyDollar,
    IconCut,
    IconEaseInOut,
    IconFileAi,
    IconHeart,
    IconHelp,
    IconResize,
    IconRouteAltLeft,
    IconTerminal2,
    IconVideo,
} from "@tabler/icons-react";
import Header from "../components/Header";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";

export default function FeaturesSectionDemo() {
    const words = [
        {
            text: "Features",
        },
        {
            text: "that",
        },
        {
            text: "makes",
        },
        {
            text: "us",
        },
        {
            text: "Excellent.",
            className: "dark:text-orange-600 ",
        },
    ];

    const features = [
        {
            title: "AI Key Moment Extraction",
            description:
                "Leverage the power of AI to transcribe videos and automatically identify key moments. Perfect for creating engaging shorts or Instagram reels from longer videos without the hassle of manual editing.",
            icon: <IconAi />,
        },
        {
            title: "Format Conversion",
            description:
                "Convert videos into various formats with just a few clicks. Whether you're optimizing for different platforms or devices, VideoPod ensures your videos are always in the right format for any use case.",
            icon: <IconFileAi />,
        },
        {
            title: "Resizing",
            description:
                "Resize videos to fit any screen size or resolution requirements. Whether you need to optimize videos for social media, presentations, or websites, VideoPod makes resizing fast and seamless without sacrificing quality.",
            icon: <IconResize />,
        },
        {
            title: "Video Stabilization",
            description:
                "Automatically stabilize shaky footage to ensure smooth, professional-looking videos. VideoPod's stabilization tool corrects minor camera movements and vibrations, making your videos look steady and polished.",
            icon: <IconVideo />,
        },
        {
            title: "Video Size Compression",
            description:
                "Compress large video files without compromising quality. VideoPod reduces video sizes, making them easier to share, upload, or store, ensuring optimal performance on any platform or device.",
            icon: <Icon3dCubeSphere />,
        },
        {
            title: "Video Split",
            description:
                "Split videos into equal parts, by timecode, or by file size. Perfect for creating highlight reels, breaking up instructional videos, or simply organizing your video content.",
            icon: <IconCut />,
        },
    ];

    return (
        (
            <>
                <Header />
                <div className="md:min-h-screen bg-black items-center justify-center flex pt-20 md:pt-20">
                    <div>
                        <TypewriterEffect className="dark md:text-2xl text-xl mt-10 mb-4" words={words} />
                        <p className="text-center text-sm md:text-base text-zinc-400 dark:text-zinc-500">
                            Find out what makes us an all-in-one web-based video processing solution
                        </p>
                        <div
                            className="bg-black dark grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  relative z-10 py-10 max-w-7xl mx-auto">
                            {features.map((feature, index) => (
                                <Feature key={feature.title} {...feature} index={index} />
                            ))}
                        </div>
                    </div>
                </div>
            </>
        )
    );
}

const Feature = ({
    title,
    description,
    icon,
    index
}) => {
    return (
        (<div
            className={cn(
                "dark flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
                (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
                index < 4 && "lg:border-b dark:border-neutral-800"
            )}>
            {index < 4 && (
                <div
                    className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
            )}
            {index >= 4 && (
                <div
                    className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
            )}
            <div
                className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
                {icon}
            </div>
            <div className="text-lg font-bold mb-2 relative z-10 px-10">
                <div
                    className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
                <span
                    className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
                    {title}
                </span>
            </div>
            <p
                className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
                {description}
            </p>
        </div>)
    );
};
