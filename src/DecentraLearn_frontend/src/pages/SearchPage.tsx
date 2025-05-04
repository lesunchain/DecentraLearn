import { useParams } from "react-router-dom";
import { Search } from "lucide-react";
import { CourseCard } from "../components/CourseCard";
import { useState, useEffect } from "react";
import { DecentraLearn_backend } from "../../../declarations/DecentraLearn_backend";
import { CourseEntry, CourseTopic } from "../../../declarations/DecentraLearn_backend/DecentraLearn_backend.did";

// Frontend-friendly course format that matches what CourseCard expects
interface Course {
  _id: number;
  slug: string;
  image: string;
  title: string;
  description: string;
  category: { name: string };
  instructor: { // Note: not optional
    name: string;
    photo: string;
  };
}

// Instructor mapping (temporary until you implement instructor data in backend)
const INSTRUCTORS: Record<string, { photo: string; name: string }> = {
  "blockchain-basics": {
    photo: "/images/instructor-john.jpg",
    name: "John Doe",
  },
  "web3-development": {
    photo: "/images/instructor-jane.jpg",
    name: "Jane Smith",
  },
  // Add more as needed, or remove if you implement instructors in the backend
};

// Default instructor when no mapping is found
const DEFAULT_INSTRUCTOR = {
  photo: "/images/default-instructor.jpg",
  name: "Course Instructor"
};

function SearchPage() {
  const { term } = useParams();
  const decodedTerm = decodeURIComponent(term || "").toLowerCase();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to extract the topic name from the variant
  function getTopicName(topicVariant: CourseTopic): string {
    // The backend sends a variant as an object with a single key
    const key = Object.keys(topicVariant)[0];
    return key || "Other";
  }

  useEffect(() => {
    async function fetchCourses() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch all courses from the backend
        const backendCourses = await DecentraLearn_backend.get_courses();
        
        // Transform backend courses to frontend format
        const transformedCourses: Course[] = backendCourses.map((entry) => {
          // Find instructor by course slug or use default
          const instructor = INSTRUCTORS[entry.course.course_slug] || DEFAULT_INSTRUCTOR;
          
          return {
            _id: entry.course_id,
            slug: entry.course.course_slug,
            image: entry.course.course_image_link,
            title: entry.course.course_name,
            description: entry.course.course_desc,
            category: { name: getTopicName(entry.course.course_topics) },
            instructor: instructor
          };
        });
        
        setCourses(transformedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourses();
  }, []);

  // Filter courses based on the search term
  const filteredCourses = courses.filter((course) =>
    [course.title, course.description, course.category.name, course.instructor.name]
      .some((field) => field?.toLowerCase().includes(decodedTerm))
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-xl">Loading courses...</h2>
        </div>
      </div>
    );
  }

  // Show error state
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
          <Search className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Search Results</h1>
            <p className="text-muted-foreground">
              Found {filteredCourses.length} result{filteredCourses.length === 1 ? "" : "s"} for
              &quot;{decodedTerm}&quot;
            </p>
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No courses found</h2>
            <p className="text-muted-foreground mb-8">
              Try searching with different keywords
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                href={`/course/${course.slug}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;