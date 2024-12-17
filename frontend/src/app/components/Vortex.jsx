"use client"
import React from "react";
import { Vortex } from "@/components/ui/vortex";
import Link from "next/link";

export default function VortexDemo() {
    return (
        (<div
            className=" mx-auto pb-12 h-[30rem] overflow-hidden">
            <div className="w-full mx-auto rounded-md  h-screen overflow-hidden">
                <Vortex
                    backgroundColor="black"
                    rangeY={800}
                    particleCount={500}
                    baseHue={120}
                    className=" px-2   py-4 w-full h-full items-center justify-center"
                >
                    <h2 className="text-white text-3xl mt-24  font-bold text-center">
                        Your Journey to Stunning Videos Starts Now
                        <p className="text-center text-base text-slate-300 font-light mt-4">
                            Experience the ultimate toolkit for effortless video transformation
                        </p>
                    </h2>
                    <div className="flex justify-center">
                        {/* <Link href="/central">
                            <button className="px-4 py-2 mt-5 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 hover:bg-slate-300">
                                Get Started
                            </button>
                        </Link> */}
                    </div>
                </Vortex>
            </div>
        </div>)
    );
}
