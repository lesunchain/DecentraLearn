import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Layers, LayoutDashboard, Library, Users } from "lucide-react";
import { cn } from "../lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "./ui/tooltip";
import { DecentraLearn_backend } from "../../../declarations/DecentraLearn_backend";

// Updated interface to match the Rust backend structure
interface CourseEntry {
    course_id: number;
    course: {
        course_name: string;
        course_slug: string;
        course_desc: string;
        course_image_link: string;
        course_topics: string;
    };
}

export default function AdminSidebar() {
    const { pathname } = useLocation();
    const [courses, setCourses] = useState<{ slug: string; title: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setIsLoading(true);
                const coursesData = await DecentraLearn_backend.get_courses();
                const formattedCourses = coursesData.map((entry: any) => ({
                    slug: entry.course.course_slug,
                    title: entry.course.course_name
                }));
                
                setCourses(formattedCourses);
            } catch (err) {
                console.error("Failed to fetch courses:", err);
                setError("Failed to load courses");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const routes = [
        {
            icon: LayoutDashboard,
            href: "/admin",
            label: "Dashboard",
            active: pathname === "/admin",
        },
        {
            icon: Library,
            href: "/admin/courses",
            label: "Courses",
            active: pathname.includes("/admin/courses"),
        },
        {
            icon: Users,
            href: "/admin/users",
            label: "Users",
            active: pathname.includes("/admin/users"),
        },
    ];

    return (
        <div className="h-screen w-64 border-r border-border bg-secondary/10 flex flex-col">
            {/* Header section remains unchanged */}
            <div className="p-6">
                <Link to="/" className="flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                        DecentraLearn
                    </span>
                </Link>
            </div>

            <div className="flex-1 overflow-auto px-4">
                <div className="space-y-1 py-2">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            to={route.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                route.active
                                    ? "bg-background text-primary"
                                    : "text-muted-foreground hover:bg-secondary/50 hover:text-primary"
                            )}
                        >
                            <route.icon className="h-4 w-4" />
                            {route.label}
                        </Link>
                    ))}
                </div>

                <div className="py-4">
                    <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium">
                        <span className="text-muted-foreground">My Courses</span>
                    </div>

                    <div className="mt-2 space-y-1 pl-3">
                        {isLoading ? (
                            <div className="text-sm text-muted-foreground px-3 py-2">Loading courses...</div>
                        ) : error ? (
                            <div className="text-sm text-red-500 px-3 py-2">{error}</div>
                        ) : courses.length === 0 ? (
                            <div className="text-sm text-muted-foreground px-3 py-2">No courses found</div>
                        ) : (
                            courses.map((course) => (
                                <Link
                                    key={course.slug}
                                    to={`/admin/courses/${course.slug}`}
                                    className={cn(
                                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                        pathname.includes(`/admin/courses/${course.slug}`)
                                            ? "bg-background text-primary"
                                            : "text-muted-foreground hover:bg-secondary/50 hover:text-primary"
                                    )}
                                >
                                    <Layers className="h-4 w-4 flex-shrink-0" />
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="truncate">{course.title}</span>
                                            </TooltipTrigger>
                                            <TooltipContent side="top" align="start" className="bg-white text-black">
                                                {course.title}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}