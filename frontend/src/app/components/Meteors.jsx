import React from "react";
import { Meteors } from "@/components/ui/meteors";

// Destructure the props in the function parameter
export default function MeteorsDemo({ title, description }) {
    return (
        <div className="">
            <div className="w-full relative max-w-xs">
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl " />
                <div className="relative shadow-xl bg-black/[0.96] border border-gray-800 px-4 py-8 h-80 w-80 overflow-hidden rounded-2xl flex flex-col justify-end items-start">
                    <div>
                        <h1 className="font-bold text-xl text-white mb-4 relative z-30">
                            {title}
                        </h1>
                        <p className="font-normal text-base text-slate-500 mb-4 relative z-20">
                            {description}
                        </p>
                    </div>
                    {/* Meaty part - Meteor effect */}
                    <Meteors number={30} />
                </div>
            </div>
        </div>
    );
}
