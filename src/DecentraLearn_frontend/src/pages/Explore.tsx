import Hero from "../components/Hero";
import { useState, useEffect } from "react";
import { CourseCard } from "../components/CourseCard";
import { DecentraLearn_backend } from "../../../declarations/DecentraLearn_backend";

interface Course {
  _id: number;
  slug: string;
  image: string;
  title: string;
  description: string;
  category: { name: string };
  price: number;
  instructor: { photo: string; name: string };
}

export default function Explore() {

  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    async function fetchCourses() {
      try {

        const fetchedCourses = await DecentraLearn_backend.get_courses();
        console.log("Fetched Courses:", fetchedCourses);
        
        // Transform backend data to match the frontend structure
        const formattedCourses = fetchedCourses.map((entry) => ({
          _id: entry.course_id,
          slug: entry.course.course_slug, // Use course_slug from backend
          image: entry.course.course_image_link || "/images/default-course.jpg",
          title: entry.course.course_name,
          description: entry.course.course_desc,
          category: { name: entry.course.course_topics.toString() }, // Convert enum to string
          price: 100, // Placeholder price (update based on your backend)
          instructor: {
            photo: "/images/default-instructor.jpg", // Placeholder
            name: "Instructor Name", // Placeholder, update if backend provides this
          },
        }));

        setCourses(formattedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }

    fetchCourses();
  }, []);

  return (
    <div className="text-white min-h-screen">
      < Hero />
      {/* Courses Grid */}
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 py-8">
          <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
          <span className="text-sm font-medium text-muted-foreground">
            Featured Courses
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-border/0 via-border to-border/0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              href={`/course/${course.slug}`}
            />
          ))}
        </div>
      </div>
    </div>
  );

}