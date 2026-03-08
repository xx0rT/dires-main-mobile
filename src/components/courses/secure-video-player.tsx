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
  const [blobSrc, setBlobSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!videoUrl) return;

    let cancelled = false;
    setLoading(true);
    setError(false);

    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(videoUrl, { signal: controller.signal });
        if (cancelled) return;
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        const blob = await res.blob();
        if (cancelled) return;

        if (blobUrlRef.current) {
          URL.revokeObjectURL(blobUrlRef.current);
        }

        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;
        setBlobSrc(url);
      } catch (_e) {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [videoUrl]);

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  const handleLoadedMetadata = () => {
    setLoading(false);
    const vid = videoRef.current;
    if (!vid) return;
    const dur = Math.floor(vid.duration);
    onLoadedMetadata(dur);
    if (lastPosition > 0 && lastPosition < vid.duration - 10) {
      vid.currentTime = lastPosition;
    }
  };

  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid || vid.duration <= 0) return;
    onTimeUpdate(Math.floor(vid.currentTime), Math.floor(vid.duration));
  };

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <p className="text-white/60 text-sm">Nelze nacist video</p>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-white/60" />
            <span className="text-white/50 text-xs">Nacitani videa...</span>
          </div>
        </div>
      )}
      {blobSrc && (
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
          src={blobSrc}
          style={{ WebkitTouchCallout: "none", userSelect: "none" }}
        />
      )}
    </>
  );
}
