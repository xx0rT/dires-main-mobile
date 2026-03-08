import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface SecureVideoPlayerProps {
  videoUrl: string;
  lastPosition: number;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onLoadedMetadata: (duration: number) => void;
}

export function SecureVideoPlayer({
  videoUrl,
  lastPosition,
  onTimeUpdate,
  onLoadedMetadata,
}: SecureVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const hasRestoredRef = useRef(false);

  useEffect(() => {
    hasRestoredRef.current = false;
    setLoading(true);
    setError(false);

    const vid = videoRef.current;
    if (!vid || !videoUrl) return;

    vid.removeAttribute("src");
    vid.load();

    vid.src = videoUrl;
    vid.load();
  }, [videoUrl]);

  const handleLoadedMetadata = () => {
    setLoading(false);
    const vid = videoRef.current;
    if (!vid) return;
    const dur = Math.floor(vid.duration);
    onLoadedMetadata(dur);
    if (!hasRestoredRef.current && lastPosition > 0 && lastPosition < vid.duration - 10) {
      vid.currentTime = lastPosition;
      hasRestoredRef.current = true;
    }
  };

  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid || vid.duration <= 0) return;
    onTimeUpdate(Math.floor(vid.currentTime), Math.floor(vid.duration));
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <>
      {loading && !error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-white/60" />
            <span className="text-white/50 text-xs">Nacitani videa...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black">
          <p className="text-white/60 text-sm">Nelze nacist video</p>
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        playsInline
        controlsList="nodownload noremoteplayback noplaybackrate"
        disablePictureInPicture
        disableRemotePlayback
        onContextMenu={(e) => e.preventDefault()}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onError={handleError}
        onCanPlay={() => setLoading(false)}
        style={{ WebkitTouchCallout: "none", userSelect: "none" }}
      />
    </>
  );
}
