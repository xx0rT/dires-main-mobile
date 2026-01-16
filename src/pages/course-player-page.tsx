import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen,
} from "lucide-react";
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
import { getMockCourseById, getMockModulesByCourseId } from "@/data/mock-data";

export const CoursePlayerPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const course = courseId ? getMockCourseById(courseId) : null;
  const modules = courseId ? getMockModulesByCourseId(courseId) : [];
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  if (!course || modules.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Kurz nenalezen</h1>
          <p className="text-muted-foreground">
            Tento kurz neexistuje nebo neobsahuje žádné moduly.
          </p>
          <Link to="/courses">
            <Button className="mt-4">
              <Home className="h-4 w-4 mr-2" />
              Zpět na kurzy
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentModule = modules[currentModuleIndex];
  const isCurrentModuleCompleted = completedModules.has(currentModule.id);
  const progressPercentage = (completedModules.size / modules.length) * 100;

  const markModuleComplete = () => {
    if (completedModules.has(currentModule.id)) return;

    setCompletedModules(prev => new Set([...prev, currentModule.id]));
    toast.success("✅ Modul dokončen!");

    if (currentModuleIndex < modules.length - 1) {
      setTimeout(() => {
        goToNextModule();
      }, 1500);
    } else {
      toast.success("🏆 Kurz úspěšně dokončen!", {
        description: "Gratulujeme! Dokončili jste tento kurz!"
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

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/courses">
                      <Home className="h-4 w-4" />
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{course.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {completedModules.size} / {modules.length} modulů
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        Modul {currentModuleIndex + 1} / {modules.length}
                      </Badge>
                      {isCurrentModuleCompleted && (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Dokončeno
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl">{currentModule.title}</CardTitle>
                    <CardDescription>{currentModule.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentModule.video_url && (
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <iframe
                      src={currentModule.video_url.replace('watch?v=', 'embed/')}
                      title={currentModule.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                <div
                  className="prose prose-slate dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentModule.content }}
                />

                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    onClick={goToPreviousModule}
                    disabled={currentModuleIndex === 0}
                    variant="outline"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Předchozí modul
                  </Button>

                  {!isCurrentModuleCompleted ? (
                    <Button onClick={markModuleComplete} variant="default">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Označit jako dokončené
                    </Button>
                  ) : (
                    <Button
                      onClick={goToNextModule}
                      disabled={currentModuleIndex === modules.length - 1}
                      variant="default"
                    >
                      Další modul
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Obsah kurzu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {modules.map((module, index) => {
                  const isCompleted = completedModules.has(module.id);
                  const isCurrent = index === currentModuleIndex;

                  return (
                    <button
                      key={module.id}
                      onClick={() => setCurrentModuleIndex(index)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        isCurrent
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-current" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{module.title}</p>
                          <p className={`text-sm ${isCurrent ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                            {module.duration_minutes} minut
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
