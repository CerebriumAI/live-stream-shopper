import React, { useState} from "react";
import { Book, Rocket, Loader2 } from "lucide-react";

import CerebriumLogo from "@/app/assets/logos/cerebrium.png";
import DailyLogo from "@/app/assets/logos/daily.png";
import TursoLogo from "@/app/assets/logos/turso.svg";
import SupabaseLogo from "@/app/assets/logos/supabase.png"

import { Button } from "@/components/ui/button";

type SplashProps = {
  handleReady: (url: string) => void;
};

const Splash: React.FC<SplashProps> = ({ handleReady }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const fetchStreamUrl = () => {
    setIsLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_CEREBRIUM_URL}/create_room`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CEREBRIUM_AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })
      .then(async response => {
        if (response.status === 200) {
          const data = await response.json();
          handleReady(data.result.url);
        } else {
          throw new Error('Failed to fetch stream URL');
        }
      })
      .catch(error => {
        console.error('Error fetching stream URL:', error);
        setError("We are at capacity at the moment. Please try again later!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <main className="w-full h-full flex items-center justify-center bg-primary-200 p-4 bg-[length:auto_50%] lg:bg-auto bg-colorWash bg-no-repeat bg-right-top">
      <div className="flex flex-col gap-8 lg:gap-12 items-center max-w-full lg:max-w-3xl">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-balance">
          Shop a Video Stream Live 
        </h1>

        <div className="flex flex-col gap-2">
          <span className="text-sm text-primary-400">Brought to you by:</span>
          <div className="flex flex-row gap-6 bg-white rounded-full py-4 px-8 items-center">
            <a href="https://www.daily.co/" target="_blank">
              <img src={DailyLogo.src} alt="Daily.co" className="max-h-[22px]" />
            </a>
            <a href="https://www.cerebrium.ai/" target="_blank">
              <img
                src={CerebriumLogo.src}
                alt="Cerebrium.ai"
                className="max-h-[22px]"
              />
            </a>
            <a href="https://deepgram.com/" target="_blank">
              <img src={TursoLogo.src} alt="Turso" className="max-h-[22px]" />
            </a>
            <a href="https://llama.meta.com/llama3/" target="_blank">
              <img src={SupabaseLogo.src} alt="Supabase" className="max-h-[22px]" />
            </a>
          </div>
        </div>

        <div className="max-w-full lg:max-w-2xl flex flex-col gap-6 text-center">
          <p className="lg:text-lg text-primary-600">
            More and more content is getting released in video format and often users see items in a video that they would
            like to buy. Well what if you could? This is a example of being a able to shop items in a live stream...<b>in real-time.</b>

          </p>
          <p className="lg:text-lg text-primary-600">
          In this demo, show basic items in the live stream, like a phone or a book and we will recognize it and list a link for you to find/buy it straight away!
          </p>
          <p className="lg:text-lg text-primary-600">
            This demo is build using <u><a href="https://www.cerebrium.ai">Cerebrium</a></u>, a serverless infrastructure platform that makes it easy to
            build and deploy AI applications
          </p>
        </div>

        {isLoading ? (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </Button>
        ) : (
          <Button onClick={fetchStreamUrl}>Start Demo</Button>
        )}
        {error && (
          <div className="text-red-500 mb-4">
            Error: {error}
          </div>
        )}

        <div className="h-[1px] bg-primary-300 w-full" />

        <footer className="flex flex-col lg:flex-row lg:gap-2">
          <Button asChild className="text-purple-600 hover:text-purple-700 bg-transparent">
        <a
              href="https://github.com/CerebriumAI/examples/tree/master/27-ecommerce-live-stream"
            >
              <Book className="size-6" />
              View source code
            </a>
          </Button>
          <Button asChild className="text-purple-600 hover:text-purple-700 bg-transparent">
            <a
              href="www.cerebrium.ai/blog/building-a-real-time-shopping-assistant-turn-live-video-into-instant-purchases"
            >
              <Rocket className="size-6" />
              Deploy your own
            </a>
          </Button>
        </footer>
      </div>
    </main>
  );
};

export default Splash;
