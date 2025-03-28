import { useParams } from "react-router-dom";
import { Search } from "lucide-react";
import { CourseCard } from "../components/CourseCard";

function SearchPage() {
    const { term } = useParams(); // Get search term from URL
    const decodedTerm = decodeURIComponent(term || "").toLowerCase(); // Handle potential undefined case

    const courses = [
        {
            _id: 1,
            slug: "blockchain-basics",
            image: "/images/blockchain.jpg",
            title: "Blockchain Basics",
            description: "Learn the fundamentals of blockchain technology",
            category: { name: "Technology" },
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
            instructor: {
                photo: "/images/instructor-jane.jpg",
                name: "Jane Smith",
            },
        },
    ];

    // Filter courses based on the search term
    const filteredCourses = courses.filter((course) =>
        [course.title, course.description, course.category.name, course.instructor.name]
            .some((field) => field.toLowerCase().includes(decodedTerm))
    );

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