import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { CourseCard } from "../components/CourseCard";
import { Link } from "react-router-dom";

export default function MyCoursesPage() {
  const navigate = useNavigate();

  // Hardcoded user data
  const user = { id: "123", name: "John Doe" };

  // Hardcoded enrolled courses
  const enrolledCourses = [
    {
      course: {
        _id: 1, // Required for key prop
        slug: "blockchain-basics", // Required for URL
        image: "/images/blockchain.jpg",
        title: "Blockchain Basics",
        description: "Learn the fundamentals of blockchain technology",
        category: { name: "Technology" },
        instructor: {
          photo: "/images/instructor-john.jpg",
          name: "John Doe",
          bio: "Blockchain expert with 10+ years of experience",
        },
        modules: [
          {
            _id: 101,
            title: "Introduction to Blockchain",
            lessons: [
              { _id: 1001, title: "What is Blockchain?" },
              { _id: 1002, title: "Blockchain Architecture" },
              { _id: 1003, title: "Consensus Mechanisms" },
            ],
          },
          {
            _id: 102,
            title: "Cryptocurrencies",
            lessons: [
              { _id: 1004, title: "Bitcoin Fundamentals" },
              { _id: 1005, title: "Ethereum and Smart Contracts" },
              { _id: 1006, title: "Altcoins and Tokenomics" },
            ],
          },
        ],
      },
      progress: 30,
    },
    {
      course: {
        _id: 2,
        slug: "web3-development",
        image: "/images/web3.jpg",
        title: "Web3 Development",
        description: "Build decentralized apps with Ethereum",
        category: { name: "Development" },
        instructor: {
          photo: "/images/instructor-jane.jpg",
          name: "Jane Smith",
          bio: "Full-stack Web3 developer and educator",
        },
        modules: [
          {
            _id: 201,
            title: "Web3 Fundamentals",
            lessons: [
              { _id: 2001, title: "Introduction to Web3" },
              { _id: 2002, title: "Setting Up Your Environment" },
            ],
          },
          {
            _id: 202,
            title: "Smart Contract Development",
            lessons: [
              { _id: 2003, title: "Solidity Basics" },
              { _id: 2004, title: "Creating Your First Smart Contract" },
              { _id: 2005, title: "Testing and Deployment" },
            ],
          },
        ],
      },
      progress: 50,
    },
  ];

  useEffect(() => {
    if (!user?.id) {
      navigate("/");
    }
  }, [user, navigate]);

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
                key={course.slug}
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
