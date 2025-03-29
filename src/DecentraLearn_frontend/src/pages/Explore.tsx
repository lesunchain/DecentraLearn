import Hero from "../components/Hero";
import { CourseCard } from "../components/CourseCard";

export default function Explore() {
  // In your Explore component
  const courses = [
    {
      _id: 1, // Required for key prop
      slug: "blockchain-basics", // Required for URL
      image: "/logo2.svg",
      title: "Blockchain Basics",
      description: "Learn the fundamentals of blockchain technology",
      category: { name: "Technology" },
      instructor: {
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
        name: "Jane Smith",
      },
    },
    {
      _id: 3,
      slug: "smart-contracts",
      image: "/images/smart-contracts.jpg",
      title: "Smart Contracts",
      description: "Master the art of writing smart contracts",
      category: { name: "Blockchain" },
      instructor: {
        name: "Alice Johnson",
      },
    },
    {
      _id: 4,
      slug: "crypto-trading",
      image: "/images/crypto-trading.jpg",
      title: "Crypto Trading",
      description: "Learn how to trade cryptocurrencies effectively",
      category: { name: "Finance" },
      instructor: {
        name: "Bob Brown",
      },
    },
    {
      _id: 5,
      slug: "nft-essentials",
      image: "/nft.jpg",
      title: "NFT Essentials",
      description: "Dive into the world of non-fungible tokens",
      category: { name: "Art" },
      instructor: {
        name: "Charlie Davis",
      },
    },
    {
      _id: 6,
      slug: "defi-introduction",
      image: "/images/defi.jpg",
      title: "DeFi Introduction",
      description: "Explore decentralized finance and its applications",
      category: { name: "Finance" },
      instructor: {
        name: "Diana Evans",
      },
    },
    {
      _id: 7,
      slug: "metaverse-guide",
      image: "/images/metaverse.jpg",
      title: "Metaverse Guide",
      description: "Understand the metaverse and its potential",
      category: { name: "Technology" },
      instructor: {
        name: "Eve Foster",
      },
    },
    {
      _id: 8,
      slug: "solidity-programming",
      image: "/images/solidity.jpg",
      title: "Solidity Programming",
      description: "Learn to code in Solidity for Ethereum",
      category: { name: "Development" },
      instructor: {
        name: "Frank Green",
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
