'use client'
import { Button } from "@/components/ui/button"
import { Check } from 'lucide-react'
import { useSession, signIn } from "next-auth/react";
import Header from "../components/Header";
import { useState } from "react";

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
export default function PricingPage() {
    const session = useSession();
    console.log(session);
    const [openDialog, setOpenDialog] = useState(false); // state to control dialog visibility

    const authenticateUser = () => {
        if (session.status != 'authenticated') {
            setOpenDialog(true); // Open the dialog
        }
        else {
            window.open("/central-free", "_self");
        }
    };
    const plans = [
        {
            name: "Free",
            price: "$0",
            description: "For videos less than 10 minutes",
            features: [
                "Text Transcription Generation of Voice in Video",
                "AI Based Key Moment Extraction",
                "Video Format Conversion from any format to any format",
                "Video Splitting Function",
                "Video Size Compression",
                "Video Stabilization",
            ],
            limitations: [
                "Video Size Compression",
                "Video Stabilization",
            ],
            buttonText: "Get Started",
            buttonLink: '/central',
        },
        {
            name: "Paid",
            price: "$10",
            description: "For videos more than 10 minutes",
            features: [
                "Text Transcription Generation of Voice in Video",
                "AI Based Key Moment Extraction",
                "Video Format Conversion from any format to any format",
                "Video Splitting Function",
                "Video Size Compression",
                "Video Stabilization",
            ],
            buttonText: "Coming Soon",
            buttonLink: '/subscribe'
        },
    ]

    return (
        <>
            <Header />
            <div className="h-0"></div>
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
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
                <div className="w-full max-w-6xl px-4 py-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold">Simple Plans for Every Creator</h1>
                        <p className="text-lg text-slate-300 font-light mt-4">
                            Flexible plans tailored for every creator—start free, Upgrade as you Grow
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5 ">
                        {plans.map((plan) => (
                            <div key={plan.name} className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.90] bg-red-500 rounded-full blur-3xl" />
                                <div className="relative bg-black h-[57vh] border border-gray-800 rounded-2xl shadow-lg p-8 flex flex-col justify-between items-start">
                                    <div>
                                        <h2 className="text-3xl font-semibold">{plan.name}</h2>
                                        <h2 className="text-2xl font-semibold mb-4">{plan.price}<span className="text-sm font-light text-slate-300">/mo</span></h2>
                                        <p className="text-slate-400 mb-4">{plan.description}</p>
                                        <div className="space-y-2">
                                            {plan.features.map((feature, index) => (
                                                <div key={index} className="flex items-center">
                                                    <Check className="mr-2 text-green-400" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                        {/* {plan.limitations?.length > 0 && (
                    <p className="mt-4 text-sm text-red-400">
                      Note: {plan.limitations.length} Videos less than 10 mins.
                    </p>
                  )} */}
                                    </div>
                                    <div className="mt-6 flex justify-between items-center">
                                        <Button className="px-4 py-3 rounded-md bg-white text-black border hover:bg-slate-300"
                                            onClick={plan.buttonText == 'Get Started' ? authenticateUser : null}
                                        >
                                            {plan.buttonText}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
