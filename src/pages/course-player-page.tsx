import { useEffect, useState, useRef } from "react";
import { useParams, Navigate, Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Loader2,
  Clock,
  PlayCircle,
  ArrowRight,
  Trophy,
  Lock,
  CalendarClock,
  Home,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

export const CoursePlayerPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseLesson[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [completionDates, setCompletionDates] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [nextCourseId, setNextCourseId] = useState<string | null>(null);
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
  const completedModulesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    completedModulesRef.current = completedModules;
  }, [completedModules]);

  useEffect(() => {
    setActiveIndex(-1);
    setModules([]);
    setCourse(null);
    setLoading(true);
    setCompletedModules(new Set());
    setCompletionDates(new Map());
    setNextCourseId(null);
    setVideoProgress(0);
    setWatchedTime(0);
    setVideoDuration(0);
    setActualWatchTime(0);
    setLastPosition(0);
  }, [courseId]);

  useEffect(() => {
    if (user && courseId) loadCourseData();
  }, [user, courseId]);

  useEffect(() => {
    if (!(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  const saveWatchTime = async () => {
    if (!user || !modules[activeIndex] || !playerRef.current) return;
    const lessonId = modules[activeIndex].id;
    const currentWatchTime = watchTimeRef.current;
    if (currentWatchTime <= lastSavedTimeRef.current) return;

    try {
      const currentVideoPosition = Math.floor(
        playerRef.current.getCurrentTime ? playerRef.current.getCurrentTime() : 0
      );
      const isCompleted = completedModulesRef.current.has(lessonId);
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
    if (!user || !modules[activeIndex]) return;
    const lessonId = modules[activeIndex].id;

    try {
      const { data } = await supabase
        .from("user_course_progress")
        .select("progress_percent, completed")
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId)
        .maybeSingle();

      if (data) {
        const estimatedSeconds = Math.floor(
          (data.progress_percent / 100) * (modules[activeIndex].duration * 60)
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
    if (activeIndex < 0 || !modules[activeIndex]) return;

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

      const currentVideoUrl = modules[activeIndex]?.video_url;
      if (!currentVideoUrl || !isMountedRef.current) return;

      const videoIdMatch = currentVideoUrl.match(/embed\/([^?]+)/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;

      if (
        videoId &&
        (window as any).YT?.Player &&
        videoRef.current &&
        isMountedRef.current
      ) {
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

                  if (!hasInitializedRef.current && lastPosition > 0 && lastPosition < duration - 10) {
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
                        if (dur > 0) setVideoProgress(Math.min((currentTime / dur) * 100, 100));
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
  }, [activeIndex, modules, user, courseId]);

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

      if (lessonsData) setModules(lessonsData);

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
          const completedSet = new Set(
            progressData.filter((p) => p.completed).map((p) => p.lesson_id)
          );
          setCompletedModules(completedSet);

          const datesMap = new Map<string, string>();
          for (const p of progressData) {
            if (p.completed && p.completed_at) datesMap.set(p.lesson_id, p.completed_at);
          }
          setCompletionDates(datesMap);

          if (lessonsData) {
            const firstIncomplete = lessonsData.findIndex((l) => !completedSet.has(l.id));
            setActiveIndex(firstIncomplete >= 0 ? firstIncomplete : lessonsData.length - 1);
          }
        } else if (lessonsData?.length) {
          setActiveIndex(0);
        }
      } else {
        setIsEnrolled(false);
      }

      const { data: nextCourseData } = await supabase
        .from("courses")
        .select("id")
        .eq("published", true)
        .eq("package_id", courseData.package_id)
        .gt("order_index", courseData.order_index)
        .order("order_index")
        .limit(1)
        .maybeSingle();

      if (nextCourseData) setNextCourseId(nextCourseData.id);
    } catch (error) {
      console.error("Error loading course data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLessonLockStatus = (index: number): "available" | "locked" | "daily_locked" => {
    if (index === 0) return "available";
    if (completedModules.has(modules[index].id)) return "available";

    const prevLesson = modules[index - 1];
    if (!completedModules.has(prevLesson.id)) return "locked";

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

  const markModuleComplete = async (moduleId: string) => {
    if (!user || completedModules.has(moduleId)) return;
    const currentLesson = modules.find((m) => m.id === moduleId);
    if (!currentLesson) return;

    try {
      await saveWatchTime();
      const now = new Date().toISOString();

      const { data: existing } = await supabase
        .from("user_course_progress")
        .select("id")
        .eq("user_id", user.id)
        .eq("lesson_id", moduleId)
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
          lesson_id: moduleId,
          completed: true,
          completed_at: now,
          progress_percent: 100,
          last_watched_at: now,
        });
      }

      setCompletedModules((prev) => new Set([...prev, moduleId]));
      setCompletionDates((prev) => new Map(prev).set(moduleId, now));

      const currentIdx = modules.findIndex((m) => m.id === moduleId);
      const isLast = currentIdx === modules.length - 1;

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

      setTimeout(() => navigate("/prehled/integrace"), 2000);
    } catch (error) {
      console.error("Error completing course:", error);
    }
  };

  const handleCardClick = (index: number) => {
    const status = getLessonLockStatus(index);
    if (status !== "available") return;
    if (index === activeIndex) return;
    setActiveIndex(index);
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

  if (modules.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Zadne lekce</h1>
          <p className="text-muted-foreground">Tento kurz zatim neobsahuje zadne lekce.</p>
        </div>
      </div>
    );
  }

  const courseProgress = (completedModules.size / modules.length) * 100;
  const isCourseDone = courseProgress === 100;
  const activeModule = activeIndex >= 0 ? modules[activeIndex] : null;
  const totalSeconds =
    activeModule
      ? videoDuration > 0
        ? videoDuration
        : activeModule.duration * 60
      : 0;
  const remainingSeconds = Math.max(0, totalSeconds - watchedTime);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container max-w-4xl mx-auto py-4 px-4">
          <Breadcrumb className="mb-3">
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
                <BreadcrumbPage>{course.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl font-bold truncate">{course.title}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {completedModules.size} z {modules.length} lekci dokonceno
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Progress value={courseProgress} className="h-2 w-24" />
              <span className="text-sm font-semibold tabular-nums">
                {Math.round(courseProgress)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto py-8 px-4 space-y-4">
        {isCourseDone && (
          <div className="rounded-xl bg-green-500/10 border border-green-500/30 p-6 text-center mb-6">
            <Trophy className="h-10 w-10 text-green-500 mx-auto mb-2" />
            <h2 className="text-xl font-bold">Kurz dokoncen!</h2>
            <p className="text-muted-foreground mt-1">
              Gratulujeme k dokonceni vsech lekci.
            </p>
            {nextCourseId && (
              <Button
                onClick={() => navigate(`/kurz/${nextCourseId}`)}
                className="mt-4"
              >
                Pokracovat na dalsi kurz
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {modules.map((lesson, index) => {
          const lockStatus = getLessonLockStatus(index);
          const isActive = index === activeIndex;
          const isCompleted = completedModules.has(lesson.id);
          const isDailyLocked = lockStatus === "daily_locked";
          const isLocked = lockStatus === "locked";
          const canOpen = lockStatus === "available";

          return (
            <div
              key={lesson.id}
              className={cn(
                "rounded-xl border bg-card overflow-hidden transition-all duration-200",
                isActive && canOpen && "ring-2 ring-primary/40 shadow-lg",
                isActive && isDailyLocked && "ring-2 ring-amber-500/40 shadow-md",
                !isActive && isCompleted && "border-green-500/20",
                !isActive && isDailyLocked && "border-amber-500/20",
                isLocked && "opacity-50"
              )}
            >
              <button
                type="button"
                onClick={() => handleCardClick(index)}
                disabled={!canOpen}
                className={cn(
                  "w-full flex items-center gap-4 p-4 text-left transition-colors",
                  canOpen && !isActive && "hover:bg-muted/50 cursor-pointer",
                  !canOpen && "cursor-not-allowed"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 transition-colors",
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isActive && canOpen
                        ? "bg-primary text-primary-foreground"
                        : isDailyLocked
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          : isLocked
                            ? "bg-muted text-muted-foreground"
                            : "bg-muted text-foreground"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : isDailyLocked ? (
                    <CalendarClock className="h-4 w-4" />
                  ) : isLocked ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "font-medium truncate",
                      isActive && canOpen && "text-primary"
                    )}
                  >
                    {lesson.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <Clock className="h-3 w-3 flex-shrink-0" />
                    <span>{lesson.duration} min</span>
                    <span className="text-muted-foreground/50">|</span>
                    <span>Cast {index + 1} z {modules.length}</span>
                  </div>
                </div>

                <div className="flex-shrink-0 flex items-center gap-2">
                  {isCompleted && !isActive && (
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-500/30 text-xs"
                    >
                      Dokonceno
                    </Badge>
                  )}
                  {isDailyLocked && (
                    <Badge
                      variant="outline"
                      className="text-amber-600 border-amber-500/30 text-xs gap-1"
                    >
                      <CalendarClock className="h-3 w-3" />
                      Zitra
                    </Badge>
                  )}
                  {canOpen && !isActive && !isCompleted && (
                    <PlayCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  {isActive && canOpen && (
                    <ChevronDown className="h-5 w-5 text-primary" />
                  )}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isActive && canOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t">
                      <div className="bg-black aspect-video">
                        <div
                          ref={videoRef}
                          className="w-full h-full [&>div]:w-full [&>div]:h-full [&_iframe]:w-full [&_iframe]:h-full"
                        />
                      </div>

                      <div className="px-4 pt-3 pb-2 bg-muted/30 border-t">
                        <Progress value={videoProgress} className="h-1.5 mb-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{formatTime(watchedTime)}</span>
                          <span>-{formatTime(remainingSeconds)}</span>
                        </div>
                      </div>

                      <div className="p-4 border-t space-y-3">
                        {lesson.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {lesson.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          {!isCompleted ? (
                            <Button
                              onClick={() => markModuleComplete(lesson.id)}
                              size="sm"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Oznacit jako dokoncene
                            </Button>
                          ) : (
                            <Badge className="bg-green-500/15 text-green-600 border-green-500/30">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Dokonceno
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            Sledovano: {formatTime(actualWatchTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {isActive && isDailyLocked && (
                <div className="border-t p-8 text-center bg-amber-500/5">
                  <CalendarClock className="h-12 w-12 text-amber-500 mx-auto mb-3" />
                  <p className="font-medium">Tato lekce bude dostupna zitra</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Kazdy den se odemkne nova lekce
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
