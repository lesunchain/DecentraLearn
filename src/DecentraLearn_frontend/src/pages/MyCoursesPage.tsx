import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { CourseCard } from "../components/CourseCard";
import { Link } from "react-router-dom";
import { DecentraLearn_backend } from "../../../declarations/DecentraLearn_backend";
import { AuthClient } from "@dfinity/auth-client";

// Type for enrolled course with progress
interface EnrolledCourse {
  course: {
    _id: number;
    slug: string;
    image: string;
    title: string;
    description: string;
    category: { name: string };
    instructor: {
      photo: string;
      name: string;
      bio: string;
    };
  };
  progress: number;
}

// Instructor mapping (temporary until you implement instructor data in backend)
const INSTRUCTORS: Record<string, { photo: string; name: string; bio: string }> = {
  "blockchain-basics": {
    photo: "/images/instructor-john.jpg",
    name: "John Doe",
    bio: "Blockchain expert with 10+ years of experience",
  },
  "web3-development": {
    photo: "/images/instructor-jane.jpg",
    name: "Jane Smith",
    bio: "Full-stack Web3 developer and educator",
  },
};

// Default instructor when no mapping is found
const DEFAULT_INSTRUCTOR = {
  photo: "/images/default-instructor.jpg",
  name: "Course Instructor",
  bio: "Expert educator in this subject area",
};

export default function MyCoursesPage() {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [principal, setPrincipal] = useState<string | null>(null);
  
  // Hardcoded user ID for testing
  // In a real app, you'd get this from your authentication system
  const userId = "123";

  // Helper to extract topic name
  function getTopicName(topicVariant: any): string {
    if (!topicVariant) return "Other";
    const key = Object.keys(topicVariant)[0];
    return key || "Other";
  }

  // Calculate progress for a course based on completed modules
  function calculateProgress(enrollment: any, moduleCount: number): number {
    if (!moduleCount) return 0;
    
    // If there are no modules_progress entries, return 0
    if (!enrollment.modules_progress || enrollment.modules_progress.length === 0) {
      return 0;
    }
    
    // Count completed modules
    const completedModules = enrollment.modules_progress.filter(
      (mp: any) => mp.completed
    ).length;
    
    return Math.round((completedModules / moduleCount) * 100);
  }

  useEffect(() => {
    async function checkAuth() {
      try {
        // Check with Auth Client first
        const authClient = await AuthClient.create();
        const isLoggedIn = await authClient.isAuthenticated();
        
        if (isLoggedIn) {
          // Get from auth client
          const identity = authClient.getIdentity();
          const principalFromAuth = identity.getPrincipal().toString();
          
          try {
            // Double-check with backend
            const backendPrincipal = await DecentraLearn_backend.whoami();
            setPrincipal(backendPrincipal.toString());
            console.log("Using principal from backend:", backendPrincipal.toString());
          } catch (backendError) {
            // Fall back to auth client principal
            setPrincipal(principalFromAuth);
            console.log("Using principal from auth client:", principalFromAuth);
          }
        } else {
          console.warn("User is not authenticated, redirecting to login");
          // Optionally redirect to login
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setError("Authentication error. Please try logging in again.");
      }
    }
    
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (!principal) return; // Don't fetch until we have a principal
    
    async function fetchEnrolledCourses() {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Fetching enrollments for principal:", principal);
  
        // 1. Fetch all user enrollments
        const enrollments = await DecentraLearn_backend.get_enrollments();
        console.log("All enrollments:", enrollments);
        
        // 2. Filter enrollments for the current user using actual principal
        const userEnrollments = enrollments.filter(
          enrollment => enrollment.user_id.toString() === principal
        );
        console.log("User enrollments:", userEnrollments);
  
        // Log an example course to understand structure
        if (userEnrollments.length > 0) {
          try {
            const exampleCourse = await DecentraLearn_backend.get_course(userEnrollments[0].course_id);
            console.log("EXAMPLE COURSE STRUCTURE:", exampleCourse);
          } catch (e) {
            console.error("Failed to get example course:", e);
          }
        }
  
        // 3. Fetch course details for each enrollment
        const enrolledCoursesData: EnrolledCourse[] = [];
        
        for (const enrollment of userEnrollments) {
          try {
            console.log(`Fetching course ${enrollment.course_id}...`);
            const courseDataResponse = await DecentraLearn_backend.get_course(enrollment.course_id);
            console.log(`Course ${enrollment.course_id} raw data:`, courseDataResponse);
            
            // Skip if course not found
            if (!courseDataResponse) {
              console.warn(`No course data found for ID: ${enrollment.course_id}`);
              continue;
            }
            
            // Handle array or single object response
            const courseData = Array.isArray(courseDataResponse) 
              ? (courseDataResponse.length > 0 ? courseDataResponse[0] : null)
              : courseDataResponse;
            
            if (!courseData) {
              console.warn(`Empty course data for ID: ${enrollment.course_id}`);
              continue;
            }
            
            // Type assertion to access properties
            const typedCourse = courseData as any;
            
            // Now correctly extract the course fields with fallbacks
            const course_slug = typedCourse.course_slug || "undefined-course";
            const course_name = typedCourse.course_name || "Unnamed Course";
            const course_desc = typedCourse.course_desc || "No description available";
            const course_image_link = typedCourse.course_image_link || "/images/default-course.jpg";
            const course_topics = typedCourse.course_topics || null;
            
            console.log("Processed course data:", {
              id: enrollment.course_id,
              slug: course_slug,
              name: course_name
            });
            
            // Rest of your code remains the same...
            const modules = await DecentraLearn_backend.get_course_modules(enrollment.course_id);
            const moduleCount = modules.length;
            
            const progress = calculateProgress(enrollment, moduleCount);
            
            const instructorInfo = INSTRUCTORS[course_slug] || DEFAULT_INSTRUCTOR;
            
            enrolledCoursesData.push({
              course: {
                _id: enrollment.course_id,
                slug: course_slug,
                image: course_image_link,
                title: course_name,
                description: course_desc,
                category: { name: getTopicName(course_topics) },
                instructor: instructorInfo
              },
              progress
            });
          } catch (courseError) {
            console.error(`Error processing course ${enrollment.course_id}:`, courseError);
          }
        }
        
        console.log("Final enrolled courses data:", enrolledCoursesData);
        setEnrolledCourses(enrolledCoursesData);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        setError("Failed to load your courses. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
  
    fetchEnrolledCourses();
  }, [principal]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl">Loading your courses...</h2>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 text-red-500">
          <h2 className="text-xl font-semibold">{error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full pt-4">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">My Courses</h1>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No courses yet</h2>
            <p className="text-muted-foreground mb-8">
              You haven&apos;t enrolled in any courses yet. Browse our courses to get started!
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrolledCourses.map(({ course, progress }) => (
              <CourseCard
                key={course._id}
                course={course}
                progress={progress}
                href={`/learn/${course.slug}/1`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}