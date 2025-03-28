import Hero from "../components/Hero";
import { CourseCard } from "../components/CourseCard";

export default function Explore() {
  // In your Explore component
  const courses = [
    {
      _id: 1, // Required for key prop
      slug: "blockchain-basics", // Required for URL
      image: "/images/blockchain.jpg",
      title: "Blockchain Basics",
      description: "Learn the fundamentals of blockchain technology",
      category: { name: "Technology" },
      price: 100,
      instructor: {
        photo: "/images/instructor-john.jpg",
        name: "John Doe",
      },
    },
    {
      _id: 2,
      slug: "web3-development",
      image: "/images/web3.jpg",
      title: "Web3 Development",
      description: "Build decentralized apps with Ethereum",
      category: { name: "Development" },
      price: 150,
      instructor: {
        photo: "/images/instructor-jane.jpg",
        name: "Jane Smith",
      },
    },
  ];

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
