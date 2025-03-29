import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Fixed import
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { ScrollArea } from "../components/ui/scroll-area";
import { Button } from "../components/ui/button";
import {
  ArrowLeft,
  Library,
  ChevronRight,
  PlayCircle,
  X,
  Check,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useSidebar } from "./SidebarProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { CourseProgress } from "../components/CourseProgress";

// Define proper types for course and completed lessons
interface Module {
  _id: string;
  title: string;
  lessons?: { _id: string; title: string }[];
}

interface Course {
  _id: string;
  title: string;
  slug: string;
  modules: Module[];
}

interface CompletedLesson {
  lesson: { _id: string };
}

interface SidebarProps {
  course: Course;
  completedLessons?: CompletedLesson[];
}

export function Sidebar({ course, completedLessons = [] }: SidebarProps) {
  const location = useLocation(); // Fixed usePathname()
  const { isOpen, toggle, close } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);
  const [openModules, setOpenModules] = useState<string[]>([]);

  useEffect(() => {
    if (location.pathname && course?.modules) {
      const currentModuleId = course.modules.find((module) =>
        module.lessons?.some(
          (lesson) => location.pathname === `/learn/${course.slug}/${lesson._id}`
        )
      )?._id;

      if (currentModuleId && !openModules.includes(currentModuleId)) {
        setOpenModules((prev) => [...prev, currentModuleId]);
      }
    }
  }, [location.pathname, course, openModules]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!course || !isMounted) {
    return null;
  }

  // Mocked function for course progress calculation (implement your own logic)
  const calculateCourseProgress = (modules: Module[], completed: CompletedLesson[]) => {
    const totalLessons = modules.reduce((acc, module) => acc + (module.lessons?.length || 0), 0);
    const completedLessonsCount = completed.length;
    return totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;
  };

  const progress = calculateCourseProgress(course.modules, completedLessons);

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <aside className="fixed inset-y-0 left-0 z-50 flex flex-col items-center w-[60px] border-r bg-background lg:hidden py-4 gap-y-4">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/my-courses">
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Library className="h-5 w-5" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Course Library</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={toggle}
                variant="ghost"
                size="icon"
                className="h-10 w-10"
              >
                <ChevronRight className={cn("h-5 w-5 transition-transform", isOpen && "rotate-180")} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Toggle Sidebar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </aside>

      {/* Main Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-background transition-all duration-300 ease-in-out",
          "lg:z-50 lg:block lg:w-96 lg:border-r",
          isOpen
            ? "w-[calc(100%-60px)] translate-x-[60px] lg:translate-x-0 lg:w-96"
            : "translate-x-[-100%] lg:translate-x-0"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 lg:p-6 border-b flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
              <Link to="/my-courses" className="flex items-center gap-x-2 text-sm hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <div className="flex items-center gap-x-2">
                  <Library className="h-4 w-4" />
                  <span>Course Library</span>
                </div>
              </Link>
              <Button onClick={close} variant="ghost" className="lg:hidden -mr-2" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <h1 className="font-semibold text-2xl">{course.title}</h1>
              <CourseProgress progress={progress} variant="success" label="Course Progress" />
            </div>
          </div>

          {/* Sidebar Content */}
          <ScrollArea className="flex-1 p-2 lg:p-4">
            <Accordion type="multiple" className="w-full space-y-4" value={openModules} onValueChange={setOpenModules}>
              {course.modules?.map((module, moduleIndex) => (
                <AccordionItem key={module._id} value={module._id} className={cn("border-none")}>
                  <AccordionTrigger className="px-2 py-2 hover:no-underline transition-colors">
                    <div className="flex items-center gap-x-2 lg:gap-x-4 w-full">
                      <span className="text-sm font-medium text-muted-foreground min-w-[28px]">
                        {String(moduleIndex + 1).padStart(2, "0")}
                      </span>
                      <div className="flex flex-col gap-y-1 text-left flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{module.title}</p>
                        <p className="text-xs text-muted-foreground">{module.lessons?.length || 0} lessons</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <div className="flex flex-col space-y-1">
                      {module.lessons?.map((lesson, lessonIndex) => {
                        const isActive = location.pathname === `/learn/${course.slug}/${lesson._id}`;
                        const isCompleted = completedLessons.some(completion => completion.lesson._id === lesson._id);

                        return (
                          <Link key={lesson._id} to={`/learn/${course.slug}/${lesson._id}`} onClick={close} className={cn("flex items-center pl-8 lg:pl-10 pr-2 lg:pr-4 py-2 group hover:bg-white/10 transition-colors relative", isActive && "bg-white/20")}>
                            <span className="text-xs font-medium text-muted-foreground min-w-[28px]">{String(lessonIndex + 1).padStart(2, "0")}</span>
                            {isCompleted ? <Check className="h-4 w-4 text-green-500" /> : <PlayCircle className="h-4 w-4 text-muted-foreground group-hover:text-primary/80" />}
                            <span className="text-sm truncate ml-2">{lesson.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </div>
      </aside>
    </>
  );
}
