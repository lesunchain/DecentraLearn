import { Navigate, Outlet, useParams } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

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

interface CourseLayoutProps {
  isAuthenticated: boolean;
  login: () => void;
}

export default function CourseLayout({ isAuthenticated, login }: CourseLayoutProps): JSX.Element {
  const { slug } = useParams();

  // Hardcoded User Data
  const user = {
    id: "12345",
    name: "John Doe",
  };

  // Simulating a function that checks course access
  const checkCourseAccess = (userId: string | null, courseSlug: string | undefined) => {
    if (!userId || !courseSlug) return { isAuthorized: false };
    return { isAuthorized: true }; // Assume user has access
  };

  // Hardcoded Course Data following the Course interface
  const course: Course = {
    _id: "course-1",
    title: "Blockchain Basics",
    slug: "blockchain-basics",
    modules: [
      {
        _id: "module-1",
        title: "Introduction to Blockchain",
        lessons: [
          { _id: "lesson-101", title: "What is Blockchain?" },
          { _id: "lesson-102", title: "History of Blockchain" },
        ],
      },
      {
        _id: "module-2",
        title: "How Blockchain Works",
        lessons: [
          { _id: "lesson-201", title: "Blocks & Hashes" },
          { _id: "lesson-202", title: "Consensus Mechanisms" },
        ],
      },
    ],
  };

  // Hardcoded Course Progress following CompletedLesson interface
  const progress: CompletedLesson[] = [
    { lesson: { _id: "lesson-101" } }, // User completed "What is Blockchain?"
    { lesson: { _id: "lesson-102" } }, // User completed "History of Blockchain"
  ];

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check if user has access to the course
  const authResult = checkCourseAccess(user.id, slug);
  if (!authResult.isAuthorized) {
    login();
    return <Navigate to="/" replace />;
  }

  // If course doesn't exist, redirect to "My Courses" page
  if (!course) {
    return <Navigate to="/my-courses" replace />;
  }

  return (
    <div className="h-full">
      <Sidebar course={course} completedLessons={progress} />
      <main className="h-full lg:pt-[64px] pl-20 lg:pl-96">
        <Outlet />
      </main>
    </div>
  );
}
