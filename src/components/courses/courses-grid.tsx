import { useEffect, useState } from "react";
import { Play, CheckCircle2, BookOpen } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

interface DBCourse {
  id: string;
  title: string;
  description: string;
  price: number;
  order_index: number;
  lessons_count: number;
  duration: number;
}

interface CourseWithStatus extends DBCourse {
  status: "purchased" | "completed";
  progress: number;
}

export const CoursesGrid = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCoursesWithProgress();
    }
  }, [user]);

  const fetchCoursesWithProgress = async () => {
    if (!user) return;

    try {
      const [
        { data: purchasesData },
        { data: enrollmentsData },
        { data: progressData },
      ] = await Promise.all([
        supabase
          .from("course_purchases")
          .select("course_id")
          .eq("user_id", user.id),
        supabase
          .from("course_enrollments")
          .select("course_id, completed")
          .eq("user_id", user.id),
        supabase
          .from("user_course_progress")
          .select("course_id, completed")
          .eq("user_id", user.id),
      ]);

      const purchasedIds = new Set(
        (purchasesData || []).map((p) => p.course_id)
      );
      const enrolledIds = new Set(
        (enrollmentsData || []).map((e) => e.course_id)
      );
      const completedEnrollments = new Set(
        (enrollmentsData || [])
          .filter((e) => e.completed)
          .map((e) => e.course_id)
      );

      const progressByCourse = new Map<string, { total: number; completed: number }>();
      for (const p of progressData || []) {
        const existing = progressByCourse.get(p.course_id) || { total: 0, completed: 0 };
        existing.total++;
        if (p.completed) existing.completed++;
        progressByCourse.set(p.course_id, existing);
      }

      const ownedCourseIds = new Set([...purchasedIds, ...enrolledIds]);

      if (ownedCourseIds.size === 0) {
        setCourses([]);
        setLoading(false);
        return;
      }

      const { data: coursesData } = await supabase
        .from("courses")
        .select("id, title, description, price, order_index, lessons_count, duration")
        .in("id", Array.from(ownedCourseIds))
        .eq("published", true)
        .order("order_index");

      const coursesWithStatus: CourseWithStatus[] = (coursesData || []).map(
        (course) => {
          const isCompleted = completedEnrollments.has(course.id);
          const prog = progressByCourse.get(course.id);
          const progressPct =
            prog && prog.total > 0
              ? Math.round((prog.completed / prog.total) * 100)
              : 0;

          return {
            ...course,
            status: isCompleted ? "completed" : "purchased",
            progress: isCompleted ? 100 : progressPct,
          };
        }
      );

      setCourses(coursesWithStatus);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Vase Kurzy</h1>
        <p className="text-muted-foreground">
          Kurzy, ktere jste zakoupili. Kliknutim na kurz zacnete studovat.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Zatim zadne kurzy</h2>
          <p className="text-muted-foreground mb-6">
            Prozkoumejte nasi nabidku kurzu a zacnete se ucit.
          </p>
          <Button asChild size="lg">
            <Link to="/prehled/integrace">Prohlizet kurzy</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card
              key={course.id}
              className={`relative transition-all duration-300 ${
                course.status === "completed"
                  ? "border-green-500/50 shadow-green-500/10"
                  : "hover:shadow-lg hover:border-primary/30"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge
                    className={
                      course.status === "completed"
                        ? "bg-green-500/20 text-green-600 border-green-500/30"
                        : "bg-primary/20 text-primary border-primary/30"
                    }
                  >
                    {course.status === "completed" ? "Dokonceno" : "Zakoupeno"}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {course.progress > 0 && course.progress < 100 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Pokrok</span>
                      <span className="font-medium">
                        {Math.round(course.progress)}%
                      </span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                )}
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={course.status === "completed" ? "outline" : "default"}
                  asChild
                >
                  <Link to={`/kurz/${course.id}`}>
                    {course.status === "completed" ? (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" fill="currentColor" />
                    )}
                    {course.status === "completed"
                      ? "Zopakovat kurz"
                      : "Spustit kurz"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
