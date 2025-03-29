import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, UserIcon } from "lucide-react";
import EnrollButton from "../components/EnrollButton";
import { useParams } from "react-router-dom";

export default function CoursePage() {
    const courses = [
        {
            _id: 1, // Required for key prop
            slug: "blockchain-basics", // Required for URL
            image: "/images/blockchain.jpg",
            title: "Blockchain Basics",
            description: "Learn the fundamentals of blockchain technology",
            category: { name: "Technology" },
            instructor: {
                name: "John Doe",
                bio: "Blockchain expert with 10+ years of experience"
            },
            modules: [
                {
                    _id: 101,
                    title: "Introduction to Blockchain",
                    lessons: [
                        { _id: 1001, title: "What is Blockchain?" },
                        { _id: 1002, title: "Blockchain Architecture" },
                        { _id: 1003, title: "Consensus Mechanisms" }
                    ]
                },
                {
                    _id: 102,
                    title: "Cryptocurrencies",
                    lessons: [
                        { _id: 1004, title: "Bitcoin Fundamentals" },
                        { _id: 1005, title: "Ethereum and Smart Contracts" },
                        { _id: 1006, title: "Altcoins and Tokenomics" }
                    ]
                }
            ]
        },
        {
            _id: 2,
            slug: "web3-development",
            image: "/images/web3.jpg",
            title: "Web3 Development",
            description: "Build decentralized apps with Ethereum",
            category: { name: "Development" },
            instructor: {
                name: "Jane Smith",
                bio: "Full-stack Web3 developer and educator"
            },
            modules: [
                {
                    _id: 201,
                    title: "Web3 Fundamentals",
                    lessons: [
                        { _id: 2001, title: "Introduction to Web3" },
                        { _id: 2002, title: "Setting Up Your Environment" }
                    ]
                },
                {
                    _id: 202,
                    title: "Smart Contract Development",
                    lessons: [
                        { _id: 2003, title: "Solidity Basics" },
                        { _id: 2004, title: "Creating Your First Smart Contract" },
                        { _id: 2005, title: "Testing and Deployment" }
                    ]
                }
            ]
        },
    ];

    const { slug } = useParams();
    const userId = "2"; // Mock user ID

    const course = courses.find((course) => course.slug === slug);

    // Mock enrollment data structure
    const enrollments = [
        { userId: "1", courseId: 1 },
        { userId: "2", courseId: 2 },
    ];

    // Check if user is enrolled in this course
    const isEnrolled = enrollments.some(
        enrollment => enrollment.userId === userId &&
            enrollment.courseId === course?._id
    );

    if (!course) {
        return (
            <div className="container mx-auto px-4 py-8 mt-16">
                <h1 className="text-4xl font-bold">Course not found</h1>
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
                            <EnrollButton slug={course.slug} lessonId={1} isEnrolled={isEnrolled} />
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