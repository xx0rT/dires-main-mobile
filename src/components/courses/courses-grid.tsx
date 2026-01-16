import { useEffect, useState } from "react";
import { Lock, Play, CheckCircle2 } from "lucide-react";
import { mockCourses, mockDatabase } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface VideoCourse {
  id: string;
  title: string;
  description: string;
  video_url: string;
  order_number: number;
  prerequisite_course_id: string | null;
}

interface UserProgress {
  course_id: string;
  progress_percentage: number;
  is_completed: boolean;
}

interface CourseWithStatus extends VideoCourse {
  status: "locked" | "unlocked" | "in_progress" | "completed";
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
    try {
      const coursesData = mockCourses
        .sort((a, b) => a.order_index - b.order_index)
        .map((course, index) => ({
          ...course,
          order_number: index + 1,
          prerequisite_course_id: index > 0 ? mockCourses[index - 1].id : null,
          video_url: ''
        }));

      const enrollments = mockDatabase.getEnrollments(user?.id || '');

      const progressMap = new Map<string, UserProgress>();
      enrollments.forEach((e) => {
        progressMap.set(e.course_id, {
          course_id: e.course_id,
          progress_percentage: Number(e.progress_percentage),
          is_completed: !!e.completed_at,
        });
      });

      const coursesWithStatus: CourseWithStatus[] = [];

      for (const course of coursesData || []) {
        const userProgress = progressMap.get(course.id);
        let status: "locked" | "unlocked" | "in_progress" | "completed" = "locked";
        let progress = 0;

        if (userProgress?.is_completed) {
          status = "completed";
          progress = 100;
        } else if (userProgress && userProgress.progress_percentage > 0) {
          status = "in_progress";
          progress = userProgress.progress_percentage;
        } else if (!course.prerequisite_course_id) {
          status = "unlocked";
        } else {
          const prerequisiteProgress = progressMap.get(course.prerequisite_course_id);
          if (prerequisiteProgress?.is_completed) {
            status = "unlocked";
          }
        }

        coursesWithStatus.push({
          ...course,
          status,
          progress,
        });
      }

      setCourses(coursesWithStatus);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCourse = (courseId: string) => {
    window.open(`/course/${courseId}`, "_blank");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/30">Dokončeno</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">Probíhá</Badge>;
      case "unlocked":
        return <Badge className="bg-primary/20 text-primary border-primary/30">Dostupný</Badge>;
      case "locked":
        return <Badge variant="secondary" className="bg-muted text-muted-foreground">Uzamčeno</Badge>;
      default:
        return null;
    }
  };

  const getButtonText = (status: string) => {
    switch (status) {
      case "completed":
        return "Zopakovat kurz";
      case "in_progress":
        return "Pokračovat";
      case "unlocked":
        return "Začít kurz";
      case "locked":
        return "Uzamčeno";
      default:
        return "Začít kurz";
    }
  };

  const getButtonIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "in_progress":
      case "unlocked":
        return <Play className="h-4 w-4" />;
      case "locked":
        return <Lock className="h-4 w-4" />;
      default:
        return <Play className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Načítání kurzů...</div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Vaše Kurzy</h1>
        <p className="text-muted-foreground">
          Postupujte kurzy v pořadí. Každý kurz se odemkne po dokončení předchozího.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card
            key={course.id}
            className={`relative transition-all duration-300 ${
              course.status === "locked"
                ? "opacity-60 blur-[2px]"
                : course.status === "completed"
                  ? "border-green-500/50 shadow-green-500/10"
                  : course.status === "in_progress"
                    ? "border-blue-500/50 shadow-blue-500/10"
                    : "hover:shadow-lg"
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  Kurz {course.order_number}
                </Badge>
                {getStatusBadge(course.status)}
              </div>
              <CardTitle className="text-xl">{course.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {course.description}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {course.status === "in_progress" && course.progress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pokrok</span>
                    <span className="font-medium">{Math.round(course.progress)}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              )}
            </CardContent>

            <CardFooter>
              <Button
                onClick={() => openCourse(course.id)}
                disabled={course.status === "locked"}
                className="w-full"
                variant={
                  course.status === "completed"
                    ? "outline"
                    : course.status === "locked"
                      ? "secondary"
                      : "default"
                }
              >
                {getButtonIcon(course.status)}
                <span className="ml-2">{getButtonText(course.status)}</span>
              </Button>
            </CardFooter>

            {course.status === "locked" && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Lock className="h-12 w-12 text-muted-foreground/30" />
              </div>
            )}
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Žádné kurzy nejsou k dispozici.</p>
        </div>
      )}
    </div>
  );
};
