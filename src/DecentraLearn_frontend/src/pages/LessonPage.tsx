import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LessonCompleteButton } from "../components/LessonCompleteButton";
import { Sparkles, X } from "lucide-react";
import { Button } from "../components/ui/button";
import Chatbot from "../components/Chatbot"; // adjust the path as needed

export default function LessonPage() {
  const { slug, lessonId } = useParams(); // Extract params
  const navigate = useNavigate();
  const [showChatbot, setShowChatbot] = useState(false);

  // Hardcoded User Data (Simulating Authentication)
  const user = {
    id: "12345",
    name: "John Doe",
  };

  // Hardcoded Lesson Data (Simulating a Lesson from Backend)
  const lesson = {
    _id: Number(lessonId),
    title: "Introduction to Blockchain",
    description:
      "Learn the basics of blockchain technology, including decentralization and cryptographic security.",
    pdf: "/documents/blockchain_intro.pdf", // Path to the PDF
  };

  // Redirect if lesson is not found
  if (!lesson) {
    navigate(`/courses/${slug}`);
    return null;
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto pt-12 pb-20 px-4">
          <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>

          {lesson.description && (
            <p className="text-muted-foreground mb-8">{lesson.description}</p>
          )}

          {/* PDF Embed Section */}
          {lesson.pdf && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Lesson Material</h2>
                <Button
                  onClick={() => setShowChatbot(true)}
                  className="text-black flex items-center gap-1"
                >
                  <Sparkles className="h-4 w-4" />
                  Ask AI
                </Button>
              </div>
              <div className="border overflow-hidden shadow-lg">
                <iframe
                  src={lesson.pdf}
                  width="100%"
                  height="500px"
                  className="border-none"
                  title="Lesson PDF"
                ></iframe>
              </div>
            </div>
          )}

          {/* Lesson Completion Button */}
          <div className="flex justify-end relative">
            <LessonCompleteButton lessonId={String(lesson._id)} />
          </div>
        </div>
      </div>

      {/* Chatbot Popup */}
      {showChatbot && (
        <div className="fixed top-4 right-4 z-50 w-100 bg-white shadow-lg border rounded-lg">
          <div className="flex justify-end items-center p-2 border-b">
            <button
              onClick={() => setShowChatbot(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <Chatbot />
        </div>
      )}
    </div>
  );
}
