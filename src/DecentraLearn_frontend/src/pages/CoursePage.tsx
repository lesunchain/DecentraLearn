import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, UserIcon } from "lucide-react";
import EnrollButton from "../components/EnrollButton";
import { useEffect, useState } from "react";
import { DecentraLearn_backend } from "../../../declarations/DecentraLearn_backend";

// Types based on backend structures
interface BackendCourse {
    course_name: string;
    course_topics: { [key: string]: null }; // Variant type handling
    course_slug: string;
    course_desc: string;
    course_image_link: string;
}

interface BackendModule {
    title: string;
    description: string;
    order: number;
    course_id: number;
}

interface BackendLesson {
    title: string;
    description: string;
    pdf_file: string;
    module_id: number;
}

// Backend entry types
interface CourseEntry {
    course_id: number;
    course: BackendCourse;
}

interface ModuleEntry {
    module_id: number;
    module: BackendModule;
}

interface LessonEntry {
    lesson_id: number;
    lesson: BackendLesson;
}

// Frontend-friendly shapes
interface Course {
    _id: number;
    slug: string;
    image: string;
    title: string;
    description: string;
    category: { name: string };
    instructor?: {
        name: string;
        bio: string;
    };
    modules: Module[];
}

interface Module {
    _id: number;
    title: string;
    lessons: Lesson[];
}

interface Lesson {
    _id: number;
    title: string;
}

// Mock instructor data since it's not in the backend yet
const INSTRUCTORS: Record<string, { name: string; bio: string }> = {
    "blockchain-basics": {
        name: "John Doe",
        bio: "Blockchain expert with 10+ years of experience"
    },
    "web3-development": {
        name: "Jane Smith",
        bio: "Full-stack Web3 developer and educator"
    }
};

// Mock enrollment type
interface Enrollment {
    userId: string;
    courseId: number;
}

export default function CoursePage() {
    const { slug } = useParams<{ slug: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
    
    // User ID would normally come from authentication
    const userId = "2"; // Mock user ID

    useEffect(() => {
        async function fetchCourseData() {
            if (!slug) return;
            
            try {
                setIsLoading(true);
                setError(null);

                // 1. Fetch the course by slug
                const courseResponse = await DecentraLearn_backend.get_course_by_slug(slug);
                
                if (!courseResponse[0]) {
                    setError("Course not found");
                    setIsLoading(false);
                    return;
                }

                // 2. Get course ID (needed to fetch modules)
                const courses = await DecentraLearn_backend.get_courses();
                const courseEntry = courses.find((c: CourseEntry) => c.course.course_slug === slug);
                
                if (!courseEntry) {
                    setError("Course ID not found");
                    setIsLoading(false);
                    return;
                }

                const courseId = courseEntry.course_id;

                // 3. Get modules for this course
                const moduleEntries = await DecentraLearn_backend.get_course_modules(courseId);
                
                // 4. For each module, fetch its lessons
                const modulesWithLessons = await Promise.all(
                    moduleEntries.map(async (moduleEntry: ModuleEntry) => {
                        const lessonEntries = await DecentraLearn_backend.get_module_lessons(moduleEntry.module_id);
                        
                        // Transform lesson entries to match our UI format
                        const lessons = lessonEntries.map((lessonEntry: LessonEntry) => ({
                            _id: lessonEntry.lesson_id,
                            title: lessonEntry.lesson.title
                        }));
                        
                        return {
                            _id: moduleEntry.module_id,
                            title: moduleEntry.module.title,
                            lessons
                        };
                    })
                );

                // 5. Extract category name from course topics (variant type)
                const topicKey = Object.keys(courseEntry.course.course_topics)[0] || "Other";
                
                // 6. Construct the complete course object for our UI
                const transformedCourse: Course = {
                    _id: courseId,
                    slug: courseEntry.course.course_slug,
                    image: courseEntry.course.course_image_link,
                    title: courseEntry.course.course_name,
                    description: courseEntry.course.course_desc,
                    category: { name: topicKey },
                    instructor: INSTRUCTORS[slug] || {
                        name: "Course Instructor",
                        bio: "Expert in the field"
                    },
                    modules: modulesWithLessons.sort((a: Module, b: Module) => {
                        const moduleA = moduleEntries.find((m: ModuleEntry) => m.module_id === a._id)?.module;
                        const moduleB = moduleEntries.find((m: ModuleEntry) => m.module_id === b._id)?.module;
                        return (moduleA?.order || 0) - (moduleB?.order || 0);
                    })
                };

                setCourse(transformedCourse);

                // 7. Check enrollment (would come from backend in real implementation)
                // TODO: Replace with actual backend call when enrollment API is ready
                const mockEnrollments: Enrollment[] = [
                    { userId: "1", courseId: 1 },
                    { userId: "2", courseId: 2 },
                ];
                setIsEnrolled(mockEnrollments.some(
                    (enrollment: Enrollment) => enrollment.userId === userId && enrollment.courseId === courseId
                ));
                
            } catch (err) {
                console.error("Error fetching course data:", err);
                setError("Failed to load course. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchCourseData();
    }, [slug, userId]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 mt-16">
                <p className="text-xl">Loading course...</p>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="container mx-auto px-4 py-8 mt-16">
                <h1 className="text-4xl font-bold">Course not found</h1>
                {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full">
                {course.image && (
                    <img
                        src={course.image || ""}
                        alt={course.title || "Course Title"}
                        className="object-cover w-full h-full"
                        loading="eager"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-black/60" />
                <div className="absolute inset-0 container mx-auto px-4 flex flex-col justify-end pb-12">
                    <Link
                        to="/"
                        className="text-white mb-8 flex items-center hover:text-primary transition-colors w-fit"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Back to Courses
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-white/10 text-white rounded-full text-sm font-medium backdrop-blur-sm">
                                    {course.category?.name || "Uncategorized"}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                {course.title}
                            </h1>
                            <p className="text-lg text-white/90 max-w-2xl">
                                {course.description}
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 md:min-w-[300px]">
                            <EnrollButton 
                                slug={course.slug} 
                                lessonId={course.modules[0]?.lessons[0]?._id || 1} 
                                isEnrolled={isEnrolled} 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-12 text-black">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-card rounded-lg p-6 mb-8 border border-border">
                            <h2 className="text-2xl font-bold mb-4">Course Content</h2>
                            <div className="space-y-4">
                                {course.modules?.map((module, index) => (
                                    <div
                                        key={module._id}
                                        className="border border-border rounded-lg"
                                    >
                                        <div className="p-4 border-b border-border">
                                            <h3 className="font-medium">
                                                Module {index + 1}: {module.title}
                                            </h3>
                                        </div>
                                        <div className="divide-y divide-border">
                                            {module.lessons?.map((lesson, lessonIndex) => (
                                                <div
                                                    key={lesson._id}
                                                    className="p-4 hover:bg-muted/50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-background/10 text-black flex items-center justify-center font-medium">
                                                            {lessonIndex + 1}
                                                        </div>
                                                        <div className="flex items-center gap-3 text-black">
                                                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                            <span className="font-medium">
                                                                {lesson.title}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div>
                        <div className="bg-card rounded-lg p-6 sticky top-20 border border-border text-black">
                            <h2 className="text-xl font-bold mb-4">Instructor</h2>
                            {course.instructor && (
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="relative h-12 w-12 flex items-center justify-center">
                                            <UserIcon className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <div className="font-medium">
                                                {course.instructor.name}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                Instructor
                                            </div>
                                        </div>
                                    </div>
                                    {course.instructor.bio && (
                                        <p className="text-muted-foreground">
                                            {course.instructor.bio}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}