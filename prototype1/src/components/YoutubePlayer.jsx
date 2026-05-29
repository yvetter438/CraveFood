import { useCallback, useEffect, useRef } from "react";
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
  onShieldTap,
  className = "p1-youtube-player",
}) {
  const isShort = variant === "short";
  const playerRef = useRef(null);
  const watchUrl = shortsToWatchUrl(youtubeUrl);

  const getYoutubePlayer = useCallback(() => {
    try {
      return playerRef.current?.getInternalPlayer?.() ?? null;
    } catch {
      return null;
    }
  }, []);

  const resumePlay = useCallback(() => {
    const yt = getYoutubePlayer();
    if (yt && typeof yt.playVideo === "function") {
      try {
        yt.playVideo();
      } catch {
        /* ignore */
      }
    }
  }, [getYoutubePlayer]);

  useEffect(() => {
    if (playing) resumePlay();
  }, [playing, resumePlay]);

  const handleShieldClick = () => {
    resumePlay();
    onShieldTap?.();
  };

  return (
    <>
      <ReactPlayer
        ref={playerRef}
        className={`${className}${isShort ? " p1-youtube-player--shielded" : ""}`}
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
        onPause={() => {
          if (isShort && playing) resumePlay();
        }}
        config={{
          youtube: {
            playerVars: {
              playsinline: 1,
              modestbranding: 1,
              rel: 0,
              fs: 0,
              iv_load_policy: 3,
              ...(isShort
                ? {
                    controls: 0,
                    disablekb: 1,
                    autoplay: 1,
                    autohide: 1,
                  }
                : {}),
            },
          },
        }}
      />
      {isShort ? (
        <button
          type="button"
          className="p1-yt-shield"
          aria-label="Video playing — use Unmute in the header for sound"
          onClick={handleShieldClick}
        />
      ) : null}
    </>
  );
}
