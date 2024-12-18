"use client"
import { SessionProvider } from "next-auth/react";
import "./globals.css";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>VideoPod</title>

        <meta property="og:title" content="Your Journey to Stunning Videos Starts Now" />
        <meta property="og:description" content="Experience the ultimate toolkit for effortless video transformation" />
        <meta property="og:image" content="/VideoPod.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://video-pod.vercel.app/" />


        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Your Journey to Stunning Videos Starts Now" />
        <meta name="twitter:description" content="Experience the ultimate toolkit for effortless video transformation" />
        <meta name="twitter:image" content="/VideoPod.png" />
      </head>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

