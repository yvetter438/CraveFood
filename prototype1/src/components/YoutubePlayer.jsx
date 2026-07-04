import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player/youtube";
import { shortsToWatchUrl, youtubeThumbUrl, youtubeIdFromUrl } from "../data/youtube.js";

function disableYoutubeCaptions(playerRef) {
  const yt = playerRef.current?.getInternalPlayer?.();
  if (!yt || typeof yt.setOption !== "function") return;

  try {
    yt.setOption("captions", "track", {});
  } catch {
    // Player API may not expose captions module yet.
  }
}

export default function YoutubePlayer({
  youtubeUrl,
  playing = true,
  muted = true,
  variant = "default",
  posterUrl,
  onProgress,
  onDuration,
  onSeek,
  onReady,
  className = "p1-youtube-player",
}) {
  const isShort = variant === "short";
  const watchUrl = shortsToWatchUrl(youtubeUrl);
  const videoId = youtubeIdFromUrl(youtubeUrl);
  const thumb = posterUrl || (videoId ? youtubeThumbUrl(videoId) : null);
  const [frameReady, setFrameReady] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    setFrameReady(false);
  }, [watchUrl]);

  const handleReady = () => {
    disableYoutubeCaptions(playerRef);
    setFrameReady(true);
    onReady?.();
    window.setTimeout(() => disableYoutubeCaptions(playerRef), 400);
  };

  return (
    <>
      {thumb ? (
        <img
          className={`p1-yt-poster${frameReady ? " p1-yt-poster--hidden" : ""}`}
          src={thumb}
          alt=""
          decoding="async"
        />
      ) : null}
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
        onReady={handleReady}
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
              cc_load_policy: 0,
              ...(isShort ? { controls: 0, disablekb: 1 } : {}),
            },
          },
        }}
      />
    </>
  );
}
