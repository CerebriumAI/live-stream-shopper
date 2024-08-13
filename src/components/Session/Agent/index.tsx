import React, { memo, useEffect, useState, useRef } from "react";
import { useActiveSpeakerId, useParticipantIds, useAppMessage } from "@daily-co/daily-react";

import Latency from "@/components/Latency";
import styles from "./styles.module.css";

type AgentState = "connecting" | "loading" | "connected";

export const Agent: React.FC<{
  hasStarted: boolean;
  statsAggregator: StatsAggregator;
  onToggleMute: () => void; 
}> = memo(
  ({ hasStarted = false, statsAggregator, onToggleMute }) => {
    const participantIds = useParticipantIds({ filter: "remote" });
    const activeSpeakerId = useActiveSpeakerId({ ignoreLocal: true });
    const [agentState, setAgentState] = useState<AgentState>("connecting");
    const [player, setPlayer] = useState<any>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);


    useEffect(() => {
      if (participantIds.length > 0) {
        setAgentState("connected");
      } else {
        setAgentState("connecting");
      }
    }, [activeSpeakerId, participantIds.length]);

    // Cleanup
    useEffect(() => () => setAgentState("connecting"), []);

    useAppMessage({
      onAppMessage: (e) => {
        // Aggregate metrics from pipecat
      if (e.data.user_id == "" && e.data?.text) {
        player?.pauseVideo();
      }

      if (e.data?.speech_final && e.data.user_id == "" && e.data?.text) {
        const transcriptText = e.data.text.toLowerCase();
        const targetPhrases = [
          "you can continue with the lecture",
          "continue with the lecture",
          "you can continue with lecture",
          "continue with lecture",
          "play the video",
          "continue with the video"
        ]

        // Simple fuzzy matching by checking if the target phrase is included in the transcript text
        const matchFound = targetPhrases.some(phrase => transcriptText.includes(phrase));
          if (matchFound) {
          console.log("Fuzzy match found for the phrase: 'You can continue with the lecture'");
          player?.playVideo();
          onToggleMute()
        }
      }
      }
    });

    useEffect(() => {
      // Load YouTube IFrame API
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

      // Initialize YouTube Player
      (window as any).onYouTubeIframeAPIReady = () => {
        //@ts-ignore
        const newPlayer = new (window as any).YT.Player(iframeRef.current, {
          events: {
            onReady: (event: any) => {
              setPlayer(event.target);
              event.target.playVideo();
            },
          },
        });
      };

      // Check if player is already initialized and play the video
      if (player) {
        player.playVideo();
      }
    }, [player]);

    return (
      <div className={styles.agent}>
        <iframe
          ref={iframeRef}
          id="youtube-player"
          width="100%"
          height="315"
          src="https://www.youtube.com/embed/l8pRSuU81PU?enablejsapi=1"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ position: "relative", zIndex: 999 }}
        ></iframe>
          {/* <Transcript /> */}
        <footer className={styles.agentFooter}>
          <Latency
            started={agentState === "connected" && hasStarted}
            botStatus={agentState}
            statsAggregator={statsAggregator}
          />
        </footer>
      </div>
    );
  },
  (p, n) => p.hasStarted === n.hasStarted
);

export default Agent;
