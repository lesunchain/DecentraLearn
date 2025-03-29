import { useState, useEffect } from "react";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "./ui/button";

interface LessonCompleteButtonProps {
    lessonId: string;
}

export function LessonCompleteButton({ lessonId }: LessonCompleteButtonProps) {
    const [isCompleted, setIsCompleted] = useState<boolean | null>(null);
    const [isPending, setIsPending] = useState(false);

    // Load lesson completion status from localStorage
    useEffect(() => {
        const savedStatus = localStorage.getItem(`lesson_${lessonId}`);
        setIsCompleted(savedStatus === "true");
    }, [lessonId]);

    // Toggle lesson completion status
    const handleToggle = () => {
        setIsPending(true);

        setTimeout(() => {
            const newStatus = !isCompleted;
            setIsCompleted(newStatus);
            localStorage.setItem(`lesson_${lessonId}`, String(newStatus)); // Persist status
            setIsPending(false);
        }, 500);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t z-50">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                <div className="flex-1">
                    <p className="text-sm font-medium">
                        {isCompleted
                            ? "Lesson completed!"
                            : "Ready to complete this lesson?"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {isCompleted
                            ? "You can mark it as incomplete if you need to revisit it."
                            : "Mark it as complete when you're done."}
                    </p>
                </div>
                <Button
                    onClick={handleToggle}
                    disabled={isPending}
                    size="lg"
                    variant="default"
                    className={`min-w-[200px] transition-all duration-200 ease-in-out ${isCompleted
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {isCompleted ? "Uncompleting..." : "Completing..."}
                        </>
                    ) : isCompleted ? (
                        <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Mark as Not Complete
                        </>
                    ) : (
                        <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Complete
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
