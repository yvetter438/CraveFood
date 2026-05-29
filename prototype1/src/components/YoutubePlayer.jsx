import { useRef } from "react";
import ReactPlayer from "react-player/youtube";
import { shortsToWatchUrl } from "../data/youtube.js";

export default function YoutubePlayer({
  youtubeUrl,
  playing = true,
  muted = true,
  variant = "default",
  onProgress,
  onDuration,
  onSeek,
  className = "p1-youtube-player",
}) {
  const isShort = variant === "short";
  const playerRef = useRef(null);
  const watchUrl = shortsToWatchUrl(youtubeUrl);

  return (
    <ReactPlayer
      ref={playerRef}
      className={className}
      url={watchUrl}
      width="100%"
      height="100%"
      playing={playing}
      muted={muted}
      loop
      playsinline
      controls={false}
      progressInterval={250}
      onProgress={({ playedSeconds }) => onProgress?.(playedSeconds)}
      onDuration={(d) => onDuration?.(d)}
      onSeek={(s) => onSeek?.(s)}
      config={{
        youtube: {
          playerVars: {
            playsinline: 1,
            modestbranding: 1,
            rel: 0,
            fs: 0,
            iv_load_policy: 3,
            ...(isShort ? { controls: 0, disablekb: 1 } : {}),
          },
        },
      }}
    />
  );
}
