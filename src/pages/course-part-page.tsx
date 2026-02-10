import { useEffect, useState, useRef } from "react";
import { useParams, Navigate, Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Loader2,
  Clock,
  PlayCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  CalendarClock,
  Home,
  BookOpen,
  Trophy,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  price: number;
  order_index: number;
  package_id: string | null;
}

interface CourseLesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  video_url: string;
  order_index: number;
  duration: number;
}

export default function CoursePartPage() {
  const { courseId, partNumber } = useParams<{ courseId: string; partNumber: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const partIndex = (parseInt(partNumber || "1", 10) - 1);

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [completionDates, setCompletionDates] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [watchedTime, setWatchedTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [actualWatchTime, setActualWatchTime] = useState(0);
  const [lastPosition, setLastPosition] = useState(0);

  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);
  const isMountedRef = useRef(true);
  const watchTimeRef = useRef(0);
  const lastSavedTimeRef = useRef(0);
  const saveIntervalRef = useRef<any>(null);
  const lastUpdateTimeRef = useRef(Date.now());
  const hasInitializedRef = useRef(false);
  const completedLessonsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    completedLessonsRef.current = completedLessons;
  }, [completedLessons]);

  useEffect(() => {
    setLessons([]);
    setCourse(null);
    setLoading(true);
    setCompletedLessons(new Set());
    setCompletionDates(new Map());
    setVideoProgress(0);
    setWatchedTime(0);
    setVideoDuration(0);
    setActualWatchTime(0);
    setLastPosition(0);
  }, [courseId, partNumber]);

  useEffect(() => {
    if (user && courseId) loadCourseData();
  }, [user, courseId, partNumber]);

  useEffect(() => {
    if (!(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  const currentLesson = lessons[partIndex] || null;

  const saveWatchTime = async () => {
    if (!user || !currentLesson || !playerRef.current) return;
    const lessonId = currentLesson.id;
    const currentWatchTime = watchTimeRef.current;
    if (currentWatchTime <= lastSavedTimeRef.current) return;

    try {
      const currentVideoPosition = Math.floor(
        playerRef.current.getCurrentTime ? playerRef.current.getCurrentTime() : 0
      );
      const isCompleted = completedLessonsRef.current.has(lessonId);
      const progressPct =
        videoDuration > 0
          ? Math.min(Math.round((currentVideoPosition / videoDuration) * 100), 100)
          : 0;

      const { data: existing } = await supabase
        .from("user_course_progress")
        .select("id")
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("user_course_progress")
          .update({
            completed: isCompleted,
            progress_percent: progressPct,
            last_watched_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
      } else {
        await supabase.from("user_course_progress").insert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          completed: isCompleted,
          progress_percent: progressPct,
          last_watched_at: new Date().toISOString(),
        });
      }
      lastSavedTimeRef.current = currentWatchTime;
    } catch (error) {
      console.error("Error saving watch time:", error);
    }
  };

  const loadModuleProgress = async () => {
    if (!user || !currentLesson) return;
    try {
      const { data } = await supabase
        .from("user_course_progress")
        .select("progress_percent, completed")
        .eq("user_id", user.id)
        .eq("lesson_id", currentLesson.id)
        .maybeSingle();

      if (data) {
        const estimatedSeconds = Math.floor(
          (data.progress_percent / 100) * (currentLesson.duration * 60)
        );
        watchTimeRef.current = estimatedSeconds;
        lastSavedTimeRef.current = estimatedSeconds;
        setActualWatchTime(estimatedSeconds);
        setLastPosition(estimatedSeconds);
      } else {
        watchTimeRef.current = 0;
        lastSavedTimeRef.current = 0;
        setActualWatchTime(0);
        setLastPosition(0);
      }
    } catch (error) {
      console.error("Error loading module progress:", error);
    }
  };

  useEffect(() => {
    if (!currentLesson) return;

    isMountedRef.current = true;
    setVideoProgress(0);
    setWatchedTime(0);
    setVideoDuration(0);
    lastUpdateTimeRef.current = Date.now();
    hasInitializedRef.current = false;

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current);
      saveIntervalRef.current = null;
    }

    loadModuleProgress();

    const cleanupPlayer = async () => {
      if (playerRef.current) {
        try {
          const iframe = playerRef.current.getIframe();
          if (iframe && iframe.parentNode) playerRef.current.destroy();
        } catch (_e) {}
        playerRef.current = null;
      }
    };

    const initializePlayer = async () => {
      if (!isMountedRef.current) return;
      await cleanupPlayer();

      const videoUrl = currentLesson?.video_url;
      if (!videoUrl || !isMountedRef.current) return;

      const videoIdMatch = videoUrl.match(/embed\/([^?]+)/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;

      if (videoId && (window as any).YT?.Player && videoRef.current && isMountedRef.current) {
        const containerElement = videoRef.current;
        while (containerElement.firstChild) {
          containerElement.removeChild(containerElement.firstChild);
        }

        const playerDiv = document.createElement("div");
        containerElement.appendChild(playerDiv);

        try {
          playerRef.current = new (window as any).YT.Player(playerDiv, {
            videoId,
            width: "100%",
            height: "100%",
            playerVars: { enablejsapi: 1, origin: window.location.origin },
            events: {
              onReady: () => {
                if (!isMountedRef.current || !playerRef.current) return;
                try {
                  const duration = Math.floor(playerRef.current.getDuration());
                  if (isMountedRef.current) setVideoDuration(duration);

                  if (
                    !hasInitializedRef.current &&
                    lastPosition > 0 &&
                    lastPosition < duration - 10
                  ) {
                    playerRef.current.seekTo(lastPosition, true);
                    hasInitializedRef.current = true;
                  }

                  progressIntervalRef.current = setInterval(() => {
                    if (!isMountedRef.current || !playerRef.current?.getCurrentTime) {
                      if (progressIntervalRef.current) {
                        clearInterval(progressIntervalRef.current);
                        progressIntervalRef.current = null;
                      }
                      return;
                    }
                    try {
                      const currentTime = Math.floor(playerRef.current.getCurrentTime());
                      const dur = playerRef.current.getDuration();
                      const playerState = playerRef.current.getPlayerState();

                      if (isMountedRef.current) {
                        setWatchedTime(currentTime);
                        const now = Date.now();
                        const timeDiff = (now - lastUpdateTimeRef.current) / 1000;
                        if (playerState === 1 && timeDiff >= 0.9 && timeDiff <= 1.5) {
                          watchTimeRef.current += 1;
                          setActualWatchTime(watchTimeRef.current);
                        }
                        lastUpdateTimeRef.current = now;
                        if (dur > 0)
                          setVideoProgress(Math.min((currentTime / dur) * 100, 100));
                      }
                    } catch (_e) {}
                  }, 1000);

                  saveIntervalRef.current = setInterval(() => saveWatchTime(), 10000);
                } catch (_e) {}
              },
              onStateChange: (event: any) => {
                if (event.data === (window as any).YT.PlayerState.ENDED) {
                  saveWatchTime();
                  if (progressIntervalRef.current) {
                    clearInterval(progressIntervalRef.current);
                    progressIntervalRef.current = null;
                  }
                  if (saveIntervalRef.current) {
                    clearInterval(saveIntervalRef.current);
                    saveIntervalRef.current = null;
                  }
                }
              },
            },
          });
        } catch (e) {
          console.error("Error creating player:", e);
        }
      }
    };

    const timeoutId = setTimeout(() => {
      if ((window as any).YT?.Player) {
        initializePlayer();
      } else {
        (window as any).onYouTubeIframeAPIReady = initializePlayer;
      }
    }, 200);

    return () => {
      isMountedRef.current = false;
      clearTimeout(timeoutId);
      saveWatchTime();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
        saveIntervalRef.current = null;
      }
      if (playerRef.current) {
        try {
          const iframe = playerRef.current.getIframe();
          if (iframe && iframe.parentNode) playerRef.current.destroy();
        } catch (_e) {}
        playerRef.current = null;
      }
      if (videoRef.current) {
        while (videoRef.current.firstChild) {
          videoRef.current.removeChild(videoRef.current.firstChild);
        }
      }
    };
  }, [currentLesson, user, courseId]);

  const loadCourseData = async () => {
    try {
      const { data: courseData } = await supabase
        .from("courses")
        .select("id, title, description, thumbnail_url, price, order_index, package_id")
        .eq("id", courseId!)
        .maybeSingle();

      if (!courseData) {
        setLoading(false);
        return;
      }
      setCourse(courseData);

      const { data: lessonsData } = await supabase
        .from("course_lessons")
        .select("id, course_id, title, description, video_url, duration, order_index")
        .eq("course_id", courseId!)
        .order("order_index");

      if (lessonsData) setLessons(lessonsData);

      if (user) {
        const [{ data: enrollmentData }, { data: purchaseData }] = await Promise.all([
          supabase
            .from("course_enrollments")
            .select("id")
            .eq("user_id", user.id)
            .eq("course_id", courseId!)
            .maybeSingle(),
          supabase
            .from("course_purchases")
            .select("id")
            .eq("user_id", user.id)
            .eq("course_id", courseId!)
            .maybeSingle(),
        ]);
        setIsEnrolled(!!enrollmentData || !!purchaseData);

        const { data: progressData } = await supabase
          .from("user_course_progress")
          .select("lesson_id, completed, completed_at")
          .eq("user_id", user.id)
          .eq("course_id", courseId!);

        if (progressData) {
          setCompletedLessons(
            new Set(progressData.filter((p) => p.completed).map((p) => p.lesson_id))
          );
          const datesMap = new Map<string, string>();
          for (const p of progressData) {
            if (p.completed && p.completed_at) datesMap.set(p.lesson_id, p.completed_at);
          }
          setCompletionDates(datesMap);
        }
      }
    } catch (error) {
      console.error("Error loading course data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLessonLockStatus = (index: number): "available" | "locked" | "daily_locked" => {
    if (index === 0) return "available";
    if (!lessons[index]) return "locked";
    if (completedLessons.has(lessons[index].id)) return "available";

    const prevLesson = lessons[index - 1];
    if (!completedLessons.has(prevLesson.id)) return "locked";

    const prevCompletedAt = completionDates.get(prevLesson.id);
    if (!prevCompletedAt) return "available";

    const completedDate = new Date(prevCompletedAt);
    const now = new Date();
    const completedDay = new Date(
      completedDate.getFullYear(),
      completedDate.getMonth(),
      completedDate.getDate()
    );
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (completedDay.getTime() >= today.getTime()) return "daily_locked";
    return "available";
  };

  const markModuleComplete = async () => {
    if (!user || !currentLesson || completedLessons.has(currentLesson.id)) return;

    try {
      await saveWatchTime();
      const now = new Date().toISOString();

      const { data: existing } = await supabase
        .from("user_course_progress")
        .select("id")
        .eq("user_id", user.id)
        .eq("lesson_id", currentLesson.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("user_course_progress")
          .update({
            completed: true,
            completed_at: now,
            progress_percent: 100,
            last_watched_at: now,
            updated_at: now,
          })
          .eq("id", existing.id);
      } else {
        await supabase.from("user_course_progress").insert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: currentLesson.id,
          completed: true,
          completed_at: now,
          progress_percent: 100,
          last_watched_at: now,
        });
      }

      setCompletedLessons((prev) => new Set([...prev, currentLesson.id]));
      setCompletionDates((prev) => new Map(prev).set(currentLesson.id, now));

      const isLast = partIndex === lessons.length - 1;

      toast.success("Lekce dokoncena!", {
        description: isLast
          ? "Gratulujeme! Dokoncili jste cely kurz!"
          : "Dalsi lekce bude dostupna zitra.",
      });

      if (isLast) {
        setTimeout(async () => {
          await unlockNextCourse();
        }, 2000);
      }
    } catch (error) {
      console.error("Error marking module complete:", error);
      toast.error("Chyba pri dokoncovani lekce");
    }
  };

  const unlockNextCourse = async () => {
    if (!user || !course) return;
    try {
      await supabase
        .from("course_enrollments")
        .update({ completed: true, completion_date: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("course_id", courseId!);

      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#10b981", "#3b82f6", "#2563eb", "#f59e0b"],
      });

      toast.success("Kurz uspesne dokoncen!", {
        description: "Gratulujeme!",
        duration: 5000,
      });

      setTimeout(() => navigate(`/kurz/${courseId}`), 2000);
    } catch (error) {
      console.error("Error completing course:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!user) return <Navigate to="/prihlaseni" replace />;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course || !isEnrolled) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Kurz nenalezen</h1>
          <p className="text-muted-foreground">
            Tento kurz neexistuje nebo k nemu nemate pristup.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/kurzy">Zpet na kurzy</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!currentLesson) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Lekce nenalezena</h1>
          <p className="text-muted-foreground">Tato cast kurzu neexistuje.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to={`/kurz/${courseId}`}>Zpet na kurz</Link>
          </Button>
        </div>
      </div>
    );
  }

  const lockStatus = getLessonLockStatus(partIndex);
  if (lockStatus !== "available") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-3">
          {lockStatus === "daily_locked" ? (
            <>
              <CalendarClock className="h-12 w-12 text-amber-500 mx-auto" />
              <h1 className="text-2xl font-bold">Lekce bude dostupna zitra</h1>
              <p className="text-muted-foreground">Kazdy den se odemkne nova lekce.</p>
            </>
          ) : (
            <>
              <Lock className="h-12 w-12 text-muted-foreground mx-auto" />
              <h1 className="text-2xl font-bold">Lekce je zamcena</h1>
              <p className="text-muted-foreground">
                Nejdrive dokoncete predchozi lekce.
              </p>
            </>
          )}
          <Button asChild variant="outline" className="mt-4">
            <Link to={`/kurz/${courseId}`}>Zpet na kurz</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isCompleted = completedLessons.has(currentLesson.id);
  const courseProgress = (completedLessons.size / lessons.length) * 100;
  const totalSeconds =
    videoDuration > 0 ? videoDuration : currentLesson.duration * 60;
  const remainingSeconds = Math.max(0, totalSeconds - watchedTime);
  const isLastPart = partIndex === lessons.length - 1;
  const isFirstPart = partIndex === 0;

  const nextPartStatus =
    !isLastPart ? getLessonLockStatus(partIndex + 1) : null;
  const canGoNext = nextPartStatus === "available";

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container max-w-5xl mx-auto py-4 px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">
                    <Home className="size-4" />
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/kurzy">Kurzy</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/kurz/${courseId}`}>{course.title}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Cast {partIndex + 1}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto py-8 px-4 space-y-6">
        <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
          <div className="bg-black aspect-video">
            <div
              ref={videoRef}
              className="w-full h-full [&>div]:w-full [&>div]:h-full [&_iframe]:w-full [&_iframe]:h-full"
            />
          </div>

          <div className="px-5 pt-3 pb-2 bg-muted/30 border-t">
            <Progress value={videoProgress} className="h-1.5 mb-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(watchedTime)}</span>
              <span>-{formatTime(remainingSeconds)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="text-xs">
                  Cast {partIndex + 1} z {lessons.length}
                </Badge>
                <Badge variant="outline" className="text-xs gap-1">
                  <Clock className="h-3 w-3" />
                  {currentLesson.duration} min
                </Badge>
                {isCompleted && (
                  <Badge className="bg-green-500/15 text-green-600 border-green-500/30 text-xs gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Dokonceno
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
            </div>

            {currentLesson.description && (
              <div className="rounded-xl border bg-card p-5">
                <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h2 className="font-semibold mb-2">O teto lekci</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {currentLesson.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {course.description && (
              <div className="rounded-xl border bg-card p-5">
                <div className="flex items-start gap-3">
                  <Trophy className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h2 className="font-semibold mb-2">O kurzu</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!isCompleted && (
              <Button onClick={markModuleComplete} size="lg" className="w-full sm:w-auto">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Oznacit lekci jako dokoncene
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <PlayCircle className="h-4 w-4 text-primary" />
                Prehled
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Pokrok kurzu</p>
                  <div className="flex items-center gap-2">
                    <Progress value={courseProgress} className="h-2 flex-1" />
                    <span className="text-xs font-semibold tabular-nums">
                      {Math.round(courseProgress)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {completedLessons.size} z {lessons.length} lekci
                  </p>
                </div>
                <div className="border-t pt-3">
                  <p className="text-xs text-muted-foreground mb-1">Sledovano v teto lekci</p>
                  <p className="text-sm font-medium">{formatTime(actualWatchTime)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-3">Navigace</h3>
              <div className="space-y-2">
                {!isFirstPart && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate(`/kurz/${courseId}/cast/${partIndex}`)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Cast {partIndex}: {lessons[partIndex - 1]?.title}
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate(`/kurz/${courseId}`)}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Vsechny lekce
                </Button>

                {!isLastPart && (
                  <Button
                    variant={canGoNext ? "default" : "outline"}
                    className={cn(
                      "w-full justify-start",
                      !canGoNext && "opacity-60"
                    )}
                    disabled={!canGoNext}
                    onClick={() =>
                      canGoNext && navigate(`/kurz/${courseId}/cast/${partIndex + 2}`)
                    }
                  >
                    {nextPartStatus === "daily_locked" ? (
                      <>
                        <CalendarClock className="h-4 w-4 mr-2" />
                        Cast {partIndex + 2} - dostupna zitra
                      </>
                    ) : nextPartStatus === "locked" ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Cast {partIndex + 2} - zamceno
                      </>
                    ) : (
                      <>
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Cast {partIndex + 2}: {lessons[partIndex + 1]?.title}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-3">Vsechny casti</h3>
              <div className="space-y-1">
                {lessons.map((lesson, idx) => {
                  const status = getLessonLockStatus(idx);
                  const done = completedLessons.has(lesson.id);
                  const isCurrent = idx === partIndex;

                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() =>
                        status === "available" &&
                        navigate(`/kurz/${courseId}/cast/${idx + 1}`)
                      }
                      disabled={status !== "available"}
                      className={cn(
                        "w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-sm transition-colors",
                        isCurrent && "bg-primary/10 text-primary font-medium",
                        !isCurrent && status === "available" && "hover:bg-muted/50",
                        status !== "available" && "opacity-40 cursor-not-allowed"
                      )}
                    >
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0",
                          done
                            ? "bg-green-500 text-white"
                            : isCurrent
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                        )}
                      >
                        {done ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : status === "locked" ? (
                          <Lock className="h-3 w-3" />
                        ) : status === "daily_locked" ? (
                          <CalendarClock className="h-3 w-3" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <span className="truncate">{lesson.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
