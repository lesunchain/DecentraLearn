"use client";

import { Link } from "react-router-dom";
import { BookOpen, UserIcon } from "lucide-react";
import { Loader } from "./Loader";
import { CourseProgress } from "./CourseProgress";

interface Course {
    _id: number;
    slug: string;
    image: string;
    title: string;
    description: string;
    category: {
        name: string;
    };
    instructor: {
        name: string;
    };
}

interface CourseCardProps {
    course: Course;
    progress?: number;
    href: string;
}

export function CourseCard({ course, progress, href }: CourseCardProps) {
    return (
        <Link
            to={href}
            className="group hover:no-underline flex"
        >
            <div className="bg-card rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:translate-y-[-4px] border border-border flex flex-col flex-1">
                <div className="relative h-52 w-full overflow-hidden">
                    {course.image ? (
                        <img
                            src={course.image || ""}
                            alt={course.title || "Course Image"}
                            className="object-cover transition-transform duration-300 group-hover:scale-110 w-full h-full"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-muted">
                            <Loader size="lg" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <span className="text-sm font-medium px-3 py-1 bg-black/50 text-white rounded-full backdrop-blur-sm">
                            {course.category?.name || "Uncategorized"}
                        </span>

                    </div>
                </div>
                <div className="p-6 flex flex-col flex-1 bg-background">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                        {course.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2 flex-1">
                        {course.description}
                    </p>
                    <div className="space-y-4 mt-auto">
                        {course.instructor && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 mr-2 rounded-full bg-black flex items-center justify-center">
                                        <UserIcon className="h-5 w-5" />
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        by {course.instructor.name}
                                    </span>
                                </div>
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </div>
                        )}
                        {typeof progress === "number" && (
                            <CourseProgress
                                progress={progress}
                                variant="default"
                                size="sm"
                                label="Course Progress"
                            />
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}