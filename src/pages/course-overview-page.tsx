import { useEffect, useState } from "react";
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
  BookOpen,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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

export default function CourseOverviewPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [completionDates, setCompletionDates] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [nextCourseId, setNextCourseId] = useState<string | null>(null);

  useEffect(() => {
    if (user && courseId) loadCourseData();
  }, [user, courseId]);

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

  const handleCardClick = (index: number) => {
    const status = getLessonLockStatus(index);
    if (status !== "available") return;
    navigate(`/kurz/${courseId}/cast/${index + 1}`);
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

  if (lessons.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Zadne lekce</h1>
          <p className="text-muted-foreground">Tento kurz zatim neobsahuje zadne lekce.</p>
        </div>
      </div>
    );
  }

  const courseProgress = (completedLessons.size / lessons.length) * 100;
  const isCourseDone = courseProgress === 100;
  const totalMinutes = lessons.reduce((acc, l) => acc + l.duration, 0);

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
                {completedLessons.size} z {lessons.length} lekci dokonceno
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

      <div className="container max-w-4xl mx-auto py-8 px-4 space-y-6">
        {course.description && (
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="font-semibold mb-1">O kurzu</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {course.description}
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {lessons.length} lekci
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {totalMinutes} min celkem
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {isCourseDone && (
          <div className="rounded-xl bg-green-500/10 border border-green-500/30 p-6 text-center">
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

        <div className="space-y-3">
          {lessons.map((lesson, index) => {
            const lockStatus = getLessonLockStatus(index);
            const isCompleted = completedLessons.has(lesson.id);
            const isDailyLocked = lockStatus === "daily_locked";
            const isLocked = lockStatus === "locked";
            const canOpen = lockStatus === "available";

            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => handleCardClick(index)}
                disabled={!canOpen}
                className={cn(
                  "w-full rounded-xl border bg-card overflow-hidden transition-all duration-200 text-left",
                  canOpen && "hover:shadow-md hover:border-primary/30 cursor-pointer",
                  isCompleted && "border-green-500/20",
                  isDailyLocked && "border-amber-500/20",
                  isLocked && "opacity-50",
                  !canOpen && "cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-4 p-4">
                  <div
                    className={cn(
                      "w-11 h-11 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 transition-colors",
                      isCompleted
                        ? "bg-green-500 text-white"
                        : canOpen
                          ? "bg-primary/10 text-primary"
                          : isDailyLocked
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            : "bg-muted text-muted-foreground"
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
                    <p className="font-medium truncate">{lesson.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      <span>{lesson.duration} min</span>
                      <span className="text-muted-foreground/50">|</span>
                      <span>
                        Cast {index + 1} z {lessons.length}
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-2">
                    {isCompleted && (
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
                    {canOpen && !isCompleted && (
                      <PlayCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                    {canOpen && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
