'use client'

import { LiveView } from "@/components/LiveView";
import Splash from "./Splash.tsx";
import { useState } from "react";
import Header from "../components/ui/header.tsx";

const showSplashPage = process.env.NEXT_PUBLIC_SHOW_SPLASH;


export default function Home() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  
  

  if (showSplash && streamUrl === null) {
    return <Splash handleReady={(url) => setStreamUrl(url)} />;
  }


  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header />
      <div className="text-center mb-8">
        <p className="text-xl text-gray-600">
          Show items in the image like a phone or a book and we will recognize it and list a link for you to find straight away
        </p>
        <br/>
        <p>
          <ul>This demo works best when your camera is high quality</ul>
          <br/>
          <ul>The object detection model is very generic and only recognizes 30 items mentioned <a href="https://huggingface.co/ultralyticsplus/yolov8s">here</a></ul>
        </p>
      </div>
      {streamUrl && <LiveView url={streamUrl} />}
    </main>
  );
}
