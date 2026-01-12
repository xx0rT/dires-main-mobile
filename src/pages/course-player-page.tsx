import { useEffect, useState, useRef } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
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
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
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
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [watchedTime, setWatchedTime] = useState(0);
  const [isHeaderMinimized, setIsHeaderMinimized] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const videoRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (user && courseId) {
      loadCourseData();
    }
  }, [user, courseId]);

  useEffect(() => {
    setVideoProgress(0);
    setWatchedTime(0);

    const interval = setInterval(() => {
      setWatchedTime(prev => {
        const newTime = prev + 1;
        if (modules[currentModuleIndex]) {
          const totalSeconds = modules[currentModuleIndex].duration_minutes * 60;
          const progress = Math.min((newTime / totalSeconds) * 100, 100);
          setVideoProgress(progress);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentModuleIndex, modules]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 100) {
        setIsHeaderMinimized(false);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderMinimized(true);
      } else if (currentScrollY < lastScrollY) {
        setIsHeaderMinimized(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const loadCourseData = async () => {
    try {
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .maybeSingle();

      if (courseError) throw courseError;
      if (!courseData) {
        setLoading(false);
        return;
      }

      setCourse(courseData);

      const { data: modulesData, error: modulesError } = await supabase
        .from("course_modules")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true });

      if (modulesError) throw modulesError;
      if (modulesData) setModules(modulesData);

      const { data: enrollmentData } = await supabase
        .from("user_course_enrollments")
        .select("*")
        .eq("user_id", user?.id)
        .eq("course_id", courseId)
        .maybeSingle();

      setIsEnrolled(!!enrollmentData);

      const { data: progressData } = await supabase
        .from("user_module_progress")
        .select("*")
        .eq("user_id", user?.id)
        .eq("course_id", courseId);

      if (progressData) {
        const completed = new Set(
          progressData
            .filter(p => p.is_completed)
            .map(p => p.module_id)
        );
        setCompletedModules(completed);
      }
    } catch (error) {
      console.error("Error loading course data:", error);
    } finally {
      setLoading(false);
    }
  };

  const markModuleComplete = async (moduleId: string) => {
    if (!user || completedModules.has(moduleId)) return;

    try {
      await supabase.from("user_module_progress").upsert({
        user_id: user.id,
        module_id: moduleId,
        course_id: courseId,
        is_completed: true,
        completed_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,module_id'
      });

      setCompletedModules(prev => new Set([...prev, moduleId]));

      const totalModules = modules.length;
      const completedCount = completedModules.size + 1;
      const progressPercentage = (completedCount / totalModules) * 100;

      await supabase
        .from("user_course_enrollments")
        .update({
          progress_percentage: progressPercentage,
        })
        .eq("user_id", user.id)
        .eq("course_id", courseId);

      toast.success("✅ Modul dokončen!", {
        description: currentModuleIndex < modules.length - 1
          ? "Přechod na další modul..."
          : "🎯 Nyní můžete odemknout další kurz!"
      });

      if (currentModuleIndex < modules.length - 1) {
        setTimeout(() => {
          goToNextModule();
        }, 1500);
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
      await supabase
        .from("user_course_enrollments")
        .update({
          completed_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("course_id", courseId);

      const { data: nextCourse } = await supabase
        .from("courses")
        .select("id, title, order_index")
        .eq("is_published", true)
        .gt("order_index", course.order_index)
        .order("order_index", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (nextCourse) {
        const { data: existingEnrollment } = await supabase
          .from("user_course_enrollments")
          .select("id")
          .eq("user_id", user.id)
          .eq("course_id", nextCourse.id)
          .maybeSingle();

        if (!existingEnrollment) {
          await supabase
            .from("user_course_enrollments")
            .insert({
              user_id: user.id,
              course_id: nextCourse.id,
              progress_percentage: 0,
            });
        }

        toast.success("🎉 Kurz úspěšně dokončen!", {
          description: `Odemkli jste další kurz: ${nextCourse.title}`,
          duration: 5000,
        });
      } else {
        toast.success("🏆 Kurz úspěšně dokončen!", {
          description: "Gratulujeme! Dokončili jste všechny dostupné kurzy!",
          duration: 5000,
        });
      }

      setTimeout(() => {
        window.location.href = "/courses";
      }, 2000);
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

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

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
  const isCurrentModuleCompleted = completedModules.has(currentModule.id);
  const courseProgress = (completedModules.size / modules.length) * 100;
  const isLastModule = currentModuleIndex === modules.length - 1;
  const allModulesCompleted = completedModules.size === modules.length;
  const nextModule = !isLastModule ? modules[currentModuleIndex + 1] : null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalSeconds = currentModule.duration_minutes * 60;
  const remainingSeconds = Math.max(0, totalSeconds - watchedTime);

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

      <div className="container max-w-7xl mx-auto py-8 px-4">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {currentModule.video_url && (
              <Card className="overflow-hidden">
                <div className="relative aspect-video w-full bg-muted">
                  <iframe
                    key={currentModule.id}
                    ref={videoRef}
                    src={currentModule.video_url}
                    title={currentModule.title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
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
                        Sledováno: {formatTime(watchedTime)}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        Zbývá: {formatTime(remainingSeconds)}
                      </span>
                    </div>
                  </div>
                  <Progress value={videoProgress} className="h-2" />
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
                      Délka modulu: {currentModule.duration_minutes} minut
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
              {isLastModule && allModulesCompleted ? (
                <Button
                  onClick={unlockNextCourse}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Odemknout další kurz
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

          <div className="space-y-6">
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
                      {modules.reduce((acc, m) => acc + m.duration_minutes, 0)} min
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Zbývá</p>
                    <p className="text-lg font-semibold">
                      {modules
                        .filter(m => !completedModules.has(m.id))
                        .reduce((acc, m) => acc + m.duration_minutes, 0)} min
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
