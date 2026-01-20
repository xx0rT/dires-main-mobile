import { useEffect, useState, useRef } from "react";
import { useParams, Navigate, Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Home,
  Clock,
  PlayCircle,
  BookOpen,
  ArrowRight,
  Trophy,
  Target
} from "lucide-react";
import { mockCourses, mockModules, mockDatabase } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import { useSubscription } from "@/lib/use-subscription";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import confetti from "canvas-confetti";
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
  image_url: string;
  price: number;
  order_index: number;
}

interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string;
  content: string;
  video_url: string | null;
  order_index: number;
  duration_minutes: number;
}

export const CoursePlayerPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { hasActiveSubscription, loading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [nextCourseId, setNextCourseId] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [watchedTime, setWatchedTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isHeaderMinimized, setIsHeaderMinimized] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
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
  const isPlayingRef = useRef(false);
  const hasInitializedRef = useRef(false);
  const completedModulesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    completedModulesRef.current = completedModules;
  }, [completedModules]);

  useEffect(() => {
    setCurrentModuleIndex(0);
    setModules([]);
    setCourse(null);
    setLoading(true);
    setCompletedModules(new Set());
    setNextCourseId(null);
    setVideoProgress(0);
    setWatchedTime(0);
    setVideoDuration(0);
    setActualWatchTime(0);
    setLastPosition(0);
  }, [courseId]);

  useEffect(() => {
    if (user && courseId) {
      loadCourseData();
    }
  }, [user, courseId]);

  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (!(window as any).YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }
    };

    loadYouTubeAPI();
  }, []);

  const saveWatchTime = async () => {
    if (!user || !modules[currentModuleIndex] || !playerRef.current) return;

    const moduleId = modules[currentModuleIndex].id;
    const currentWatchTime = watchTimeRef.current;

    if (currentWatchTime > lastSavedTimeRef.current) {
      try {
        const currentVideoPosition = Math.floor(playerRef.current.getCurrentTime ? playerRef.current.getCurrentTime() : 0);

        mockDatabase.upsertModuleProgress({
          user_id: user.id,
          module_id: moduleId,
          course_id: courseId || '',
          watch_time_seconds: Math.floor(currentWatchTime),
          last_watched_position: currentVideoPosition,
          is_completed: completedModulesRef.current.has(moduleId),
          completed_at: completedModulesRef.current.has(moduleId) ? new Date().toISOString() : null
        });

        lastSavedTimeRef.current = currentWatchTime;
      } catch (error) {
        console.error("Error saving watch time:", error);
      }
    }
  };

  const loadModuleProgress = async () => {
    if (!user || !modules[currentModuleIndex]) return;

    const moduleId = modules[currentModuleIndex].id;

    try {
      const data = mockDatabase.getModuleProgressSingle(user.id, moduleId);

      if (data) {
        watchTimeRef.current = data.watch_time_seconds || 0;
        lastSavedTimeRef.current = data.watch_time_seconds || 0;
        setActualWatchTime(data.watch_time_seconds || 0);
        setLastPosition(data.last_watched_position || 0);
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
    isMountedRef.current = true;
    setVideoProgress(0);
    setWatchedTime(0);
    setVideoDuration(0);
    lastUpdateTimeRef.current = Date.now();
    isPlayingRef.current = false;
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
          if (iframe && iframe.parentNode) {
            playerRef.current.destroy();
          }
        } catch (e) {

        }
        playerRef.current = null;
      }
    };

    const initializePlayer = async () => {
      if (!isMountedRef.current) return;

      await cleanupPlayer();

      const currentVideoUrl = modules[currentModuleIndex]?.video_url;
      if (!currentVideoUrl || !isMountedRef.current) return;

      const videoIdMatch = currentVideoUrl.match(/embed\/([^?]+)/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;

      if (videoId && (window as any).YT && (window as any).YT.Player && videoRef.current && isMountedRef.current) {
        const containerElement = videoRef.current;

        while (containerElement.firstChild) {
          containerElement.removeChild(containerElement.firstChild);
        }

        const playerDiv = document.createElement('div');
        containerElement.appendChild(playerDiv);

        try {
          playerRef.current = new (window as any).YT.Player(playerDiv, {
            videoId: videoId,
            width: '100%',
            height: '100%',
            playerVars: {
              enablejsapi: 1,
              origin: window.location.origin
            },
            events: {
              onReady: () => {
                if (!isMountedRef.current || !playerRef.current) return;

                try {
                  const duration = Math.floor(playerRef.current.getDuration());
                  if (isMountedRef.current) {
                    setVideoDuration(duration);
                  }

                  if (!hasInitializedRef.current && lastPosition > 0 && lastPosition < duration - 10) {
                    playerRef.current.seekTo(lastPosition, true);
                    hasInitializedRef.current = true;
                  }

                  progressIntervalRef.current = setInterval(() => {
                    if (!isMountedRef.current || !playerRef.current || !playerRef.current.getCurrentTime) {
                      if (progressIntervalRef.current) {
                        clearInterval(progressIntervalRef.current);
                        progressIntervalRef.current = null;
                      }
                      return;
                    }

                    try {
                      const currentTime = Math.floor(playerRef.current.getCurrentTime());
                      const duration = playerRef.current.getDuration();
                      const playerState = playerRef.current.getPlayerState();

                      if (isMountedRef.current) {
                        setWatchedTime(currentTime);

                        const now = Date.now();
                        const timeDiff = (now - lastUpdateTimeRef.current) / 1000;

                        if (playerState === 1 && timeDiff >= 0.9 && timeDiff <= 1.5) {
                          watchTimeRef.current += 1;
                          setActualWatchTime(watchTimeRef.current);
                          isPlayingRef.current = true;
                        } else if (playerState !== 1) {
                          isPlayingRef.current = false;
                        }

                        lastUpdateTimeRef.current = now;

                        if (duration > 0) {
                          const progress = Math.min((currentTime / duration) * 100, 100);
                          setVideoProgress(progress);
                        }
                      }
                    } catch (e) {
                      console.error("Error in progress interval:", e);
                    }
                  }, 1000);

                  saveIntervalRef.current = setInterval(() => {
                    saveWatchTime();
                  }, 10000);
                } catch (e) {

                }
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
              }
            }
          });
        } catch (e) {
          console.error('Error creating player:', e);
        }
      }
    };

    const timeoutId = setTimeout(() => {
      if ((window as any).YT && (window as any).YT.Player) {
        initializePlayer();
      } else {
        (window as any).onYouTubeIframeAPIReady = initializePlayer;
      }
    }, 150);

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
          if (iframe && iframe.parentNode) {
            playerRef.current.destroy();
          }
        } catch (e) {

        }
        playerRef.current = null;
      }

      if (videoRef.current) {
        while (videoRef.current.firstChild) {
          videoRef.current.removeChild(videoRef.current.firstChild);
        }
      }
    };
  }, [currentModuleIndex, modules, user, courseId]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 100) {
        setIsHeaderMinimized(false);
      } else if (currentScrollY > lastScrollY) {
        setIsHeaderMinimized(true);
      } else if (currentScrollY < lastScrollY - 30) {
        setIsHeaderMinimized(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const loadCourseData = async () => {
    try {
      const courseData = mockCourses.find(c => c.id === courseId);

      if (!courseData) {
        setLoading(false);
        return;
      }

      setCourse(courseData);

      const modulesData = mockModules
        .filter(m => m.course_id === courseId)
        .sort((a, b) => a.order_index - b.order_index);

      if (modulesData) setModules(modulesData);

      const enrollmentData = mockDatabase.getEnrollments(user?.id || '').find(e => e.course_id === courseId);

      setIsEnrolled(!!enrollmentData);

      const progressData = mockDatabase.getModuleProgress(user?.id || '', courseId);

      if (progressData && user) {
        const completed = new Set(
          progressData
            .filter(p => p.is_completed)
            .map(p => p.module_id)
        );
        setCompletedModules(completed);

        if (modulesData && completed.size === modulesData.length && completed.size > 0) {
          const progressPercentage = 100;

          mockDatabase.updateEnrollment(user.id, courseId || '', {
            progress_percentage: progressPercentage,
            completed_at: new Date().toISOString(),
          });
        } else if (modulesData && modulesData.length > 0) {
          const progressPercentage = (completed.size / modulesData.length) * 100;

          mockDatabase.updateEnrollment(user.id, courseId || '', {
            progress_percentage: progressPercentage,
          });
        }
      }

      const nextCourseCheck = mockCourses
        .filter(c => c.is_published && c.order_index > courseData.order_index)
        .sort((a, b) => a.order_index - b.order_index)[0];

      if (nextCourseCheck) {
        setNextCourseId(nextCourseCheck.id);
      }
    } catch (error) {
      console.error("Error loading course data:", error);
    } finally {
      setLoading(false);
    }
  };

  const markModuleComplete = async (moduleId: string) => {
    if (!user || completedModules.has(moduleId)) return;

    const currentModule = modules.find(m => m.id === moduleId);
    if (!currentModule) return;

    const currentWatchTime = watchTimeRef.current;

    try {
      await saveWatchTime();

      mockDatabase.upsertModuleProgress({
        user_id: user.id,
        module_id: moduleId,
        course_id: courseId || '',
        is_completed: true,
        completed_at: new Date().toISOString(),
        watch_time_seconds: Math.floor(currentWatchTime),
        last_watched_position: Math.floor(watchedTime),
      });

      setCompletedModules(prev => new Set([...prev, moduleId]));

      const totalModules = modules.length;
      const completedCount = completedModules.size + 1;
      const progressPercentage = (completedCount / totalModules) * 100;

      mockDatabase.updateEnrollment(user.id, courseId || '', {
        progress_percentage: progressPercentage,
      });

      toast.success("✅ Modul dokončen!", {
        description: currentModuleIndex < modules.length - 1
          ? "Přechod na další modul..."
          : "🎉 Gratulujeme! Dokončili jste kurz!"
      });

      if (currentModuleIndex < modules.length - 1) {
        setTimeout(() => {
          goToNextModule();
        }, 1500);
      } else {
        setTimeout(async () => {
          await unlockNextCourse();
        }, 2000);
      }
    } catch (error) {
      console.error("Error marking module complete:", error);
      toast.error("❌ Chyba při dokončování modulu", {
        description: "Zkuste to prosím znovu."
      });
    }
  };

  const unlockNextCourse = async () => {
    if (!user || !course) return;

    try {
      mockDatabase.updateEnrollment(user.id, courseId || '', {
        completed_at: new Date().toISOString(),
      });

      const nextCourse = mockCourses
        .filter(c => c.is_published && c.order_index > course.order_index)
        .sort((a, b) => a.order_index - b.order_index)[0];

      if (nextCourse) {
        setNextCourseId(nextCourse.id);

        const existingEnrollment = mockDatabase.getEnrollments(user.id).find(e => e.course_id === nextCourse.id);

        const isNewCourse = !existingEnrollment;

        if (isNewCourse) {
          mockDatabase.addEnrollment({
            user_id: user.id,
            course_id: nextCourse.id,
            progress_percentage: 0,
            completed_at: null
          });

          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
          });

          toast.success("🎉 Kurz úspěšně dokončen!", {
            description: `Odemkli jste další kurz: ${nextCourse.title}`,
            duration: 5000,
          });
        } else {
          toast.success("🎉 Kurz úspěšně dokončen!", {
            description: `Přechod na další kurz: ${nextCourse.title}`,
            duration: 3000,
          });
        }

        setTimeout(() => {
          navigate(`/course/${nextCourse.id}`);
        }, 2000);
      } else {
        setNextCourseId(null);

        toast.success("🏆 Kurz úspěšně dokončen!", {
          description: "Gratulujeme! Dokončili jste všechny dostupné kurzy!",
          duration: 5000,
        });

        setTimeout(() => {
          navigate("/courses");
        }, 2000);
      }
    } catch (error) {
      console.error("Error unlocking next course:", error);
      toast.error("❌ Chyba při odemykání dalšího kurzu", {
        description: "Zkuste to prosím znovu."
      });
    }
  };

  const goToNextModule = () => {
    if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
    }
  };

  const goToPreviousModule = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
    }
  };

  const continueToNextCourse = async () => {
    if (!nextCourseId || !user || !course) return;

    try {
      const nextCourseData = mockCourses.find(c => c.id === nextCourseId && c.is_published);

      if (!nextCourseData) {
        toast.error("Další kurz nebyl nalezen");
        navigate("/courses");
        return;
      }

      const existingEnrollment = mockDatabase.getEnrollments(user.id).find(e => e.course_id === nextCourseData.id);

      const isNewCourse = !existingEnrollment;

      if (isNewCourse) {
        mockDatabase.addEnrollment({
          user_id: user.id,
          course_id: nextCourseData.id,
          progress_percentage: 0,
          completed_at: null
        });

        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
        });

        toast.success("🎉 Odemknut další kurz!", {
          description: nextCourseData.title,
        });
      }

      navigate(`/course/${nextCourseData.id}`);
    } catch (error) {
      console.error("Error continuing to next course:", error);
      toast.error("Chyba při přechodu na další kurz");
      navigate("/courses");
    }
  };

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (!hasActiveSubscription && !subscriptionLoading) {
    return <Navigate to="/courses" replace />;
  }

  if (loading || subscriptionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course || !isEnrolled) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Kurz nenalezen</h1>
          <p className="text-muted-foreground">
            Tento kurz neexistuje nebo k němu nemáte přístup.
          </p>
        </div>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Žádné moduly</h1>
          <p className="text-muted-foreground">
            Tento kurz zatím neobsahuje žádné vzdělávací moduly.
          </p>
        </div>
      </div>
    );
  }

  const currentModule = modules[currentModuleIndex];

  if (!currentModule) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Načítání modulu...</p>
        </div>
      </div>
    );
  }

  const isCurrentModuleCompleted = completedModules.has(currentModule.id);
  const courseProgress = (completedModules.size / modules.length) * 100;
  const isLastModule = currentModuleIndex === modules.length - 1;
  const nextModule = !isLastModule ? modules[currentModuleIndex + 1] : null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalSeconds = videoDuration > 0 ? videoDuration : currentModule.duration_minutes * 60;
  const remainingSeconds = Math.max(0, totalSeconds - watchedTime);

  const totalCourseMinutes = modules.reduce((acc, m) => acc + m.duration_minutes, 0);
  const completedMinutes = modules
    .filter(m => completedModules.has(m.id))
    .reduce((acc, m) => acc + m.duration_minutes, 0);
  const currentModuleWatchedMinutes = Math.floor(watchedTime / 60);
  const remainingCourseMinutes = Math.max(0, totalCourseMinutes - completedMinutes - currentModuleWatchedMinutes);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto py-4 px-4">
          <div className="flex items-center justify-between mb-3">
            <Breadcrumb className="w-fit rounded-lg border px-3 py-2">
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
                    <Link to="/courses">Kurzy</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{course.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Celkový pokrok</p>
              <div className="flex items-center gap-2">
                <Progress value={courseProgress} className="h-2 w-32" />
                <span className="text-sm font-medium">{Math.round(courseProgress)}%</span>
              </div>
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isHeaderMinimized ? 'max-h-0 opacity-0' : 'max-h-20 opacity-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="gap-1">
                    <Target className="h-3 w-3" />
                    Kurz {course.order_index + 1}
                  </Badge>
                  <Badge variant="outline">
                    Modul {currentModuleIndex + 1} z {modules.length}
                  </Badge>
                  {courseProgress === 100 && (
                    <Badge className="bg-green-500/20 text-green-600 border-green-500/30 gap-1">
                      <Trophy className="h-3 w-3" />
                      Kurz dokončen
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl font-bold">{currentModule.title}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-[1800px] mx-auto py-6 px-4">

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
          <div className="space-y-6">
            {currentModule.video_url && (
              <Card className="overflow-hidden">
                <div className="relative w-full bg-muted" style={{ height: '75vh', minHeight: '600px' }}>
                  <div
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full [&>div]:w-full [&>div]:h-full [&_iframe]:w-full [&_iframe]:h-full"
                  />
                </div>
                <div className="p-4 border-t bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm">
                      <PlayCircle className="h-4 w-4 text-primary" />
                      <span className="font-medium">Průběh videa</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground">
                        Pozice: {formatTime(watchedTime)}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        Zbývá: {formatTime(remainingSeconds)}
                      </span>
                    </div>
                  </div>
                  <Progress value={videoProgress} className="h-2 mb-3" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Sledováno: {formatTime(actualWatchTime)} / {formatTime(totalSeconds)}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <CardTitle>O tomto modulu</CardTitle>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Délka modulu: {Math.ceil(totalSeconds / 60)} minut
                    </CardDescription>
                  </div>
                  {!isCurrentModuleCompleted ? (
                    <Button
                      onClick={() => markModuleComplete(currentModule.id)}
                      variant="default"
                      className="shrink-0"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Označit jako dokončené
                    </Button>
                  ) : (
                    <Badge className="bg-green-500/20 text-green-600 border-green-500/30 shrink-0">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Dokončeno
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <p className="text-sm font-medium mb-2">Popis modulu</p>
                  <p className="text-muted-foreground leading-relaxed">{currentModule.description}</p>
                </div>
                {currentModule.content && (
                  <div>
                    <p className="text-sm font-medium mb-3">Detailní obsah</p>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: currentModule.content }} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {nextModule && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <ArrowRight className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-primary uppercase tracking-wider">
                          Další modul
                        </span>
                      </div>
                      <CardTitle className="text-lg">{nextModule.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {nextModule.duration_minutes} min
                      </CardDescription>
                    </div>
                    <Button
                      onClick={goToNextModule}
                      size="sm"
                      className="shrink-0"
                    >
                      Přehrát
                      <PlayCircle className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {nextModule.description}
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="flex items-center justify-between">
              <Button
                onClick={goToPreviousModule}
                disabled={currentModuleIndex === 0}
                variant="outline"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Předchozí modul
              </Button>
              {isLastModule && courseProgress === 100 && nextCourseId ? (
                <Button
                  onClick={continueToNextCourse}
                  className="bg-gradient-to-r from-primary to-primary/80"
                >
                  Přejít na další kurz
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={goToNextModule}
                  disabled={currentModuleIndex === modules.length - 1}
                >
                  Další modul
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-6 sticky top-24 self-start">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Pokrok kurzu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Dokončeno</span>
                    <span className="text-2xl font-bold">
                      {completedModules.size}<span className="text-sm text-muted-foreground">/{modules.length}</span>
                    </span>
                  </div>
                  <Progress value={courseProgress} className="h-3 mb-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    {Math.round(courseProgress)}% kurzu dokončeno
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Celkový čas</p>
                    <p className="text-lg font-semibold">
                      {totalCourseMinutes} min
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Zbývá</p>
                    <p className="text-lg font-semibold">
                      {remainingCourseMinutes} min
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Moduly kurzu
                </CardTitle>
                <CardDescription>
                  {modules.length} modulů • {modules.reduce((acc, m) => acc + m.duration_minutes, 0)} minut celkem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {modules.map((module, index) => {
                    const isPreviousCompleted = index === 0 || completedModules.has(modules[index - 1].id);
                    const isLocked = !isPreviousCompleted && !completedModules.has(module.id);
                    const isCompleted = completedModules.has(module.id);
                    const isCurrent = index === currentModuleIndex;

                    return (
                      <button
                        key={module.id}
                        onClick={() => !isLocked && setCurrentModuleIndex(index)}
                        disabled={isLocked}
                        className={`w-full text-left p-3 rounded-lg border transition-all hover:shadow-md ${
                          isCurrent
                            ? "border-primary bg-primary/10 shadow-sm"
                            : isLocked
                            ? "border-border opacity-50 cursor-not-allowed"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              isCompleted
                                ? "bg-green-500 text-white"
                                : isCurrent
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium mb-1 ${isCurrent ? 'text-primary' : ''}`}>
                              {module.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{module.duration_minutes} min</span>
                              {isLocked && (
                                <>
                                  <span>•</span>
                                  <span className="text-yellow-600 dark:text-yellow-500">Zamčeno</span>
                                </>
                              )}
                              {isCompleted && (
                                <>
                                  <span>•</span>
                                  <span className="text-green-600 dark:text-green-500">Dokončeno</span>
                                </>
                              )}
                            </div>
                          </div>
                          {isCurrent && (
                            <PlayCircle className="h-5 w-5 text-primary flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
