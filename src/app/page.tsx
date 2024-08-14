'use client'

import { LiveView } from "@/components/LiveView";
import Splash from "./Splash";
import { useState } from "react";
import Header from "../components/ui/header";
import { Analytics } from "@vercel/analytics/react"
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
        <p>
          <ul>This demo works best when your camera is high quality</ul>
          <br/>
          <ul>We only trained the object detection model only recognises shoes, cups, books and watches</ul>
          <br/>
          <ul>It won't show a type of item (ie: cup) again if its already been detected</ul>
        </p>
      </div>
      {streamUrl && <LiveView url={streamUrl} />}
    </main>
  );
}
