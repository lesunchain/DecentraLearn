"use client";

import { CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTransition, useState, useEffect } from "react";
import { DecentraLearn_backend } from "../../../declarations/DecentraLearn_backend";
import { AuthClient } from "@dfinity/auth-client";

function EnrollButton({
    slug,
    lessonId,
    isEnrolled: initialIsEnrolled = false,
}: {
    slug: string;
    lessonId: number;
    isEnrolled?: boolean;
}) {
    const navigate = useNavigate();
    const [isPending, startTransition] = useTransition();
    const [isEnrolled, setIsEnrolled] = useState(initialIsEnrolled);
    const [courseId, setCourseId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [principal, setPrincipal] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState<string | null>(null);

    console.log("EnrollButton render with states:", { isAuthenticated, isLoading, isEnrolled });

    // Check if user is authenticated with Internet Identity
    useEffect(() => {
        async function checkAuth() {
            try {
                // First check with Auth Client - this is the most reliable way
                const authClient = await AuthClient.create();
                const isLoggedIn = await authClient.isAuthenticated();
                
                console.log("Auth client says user is logged in:", isLoggedIn);
                
                if (isLoggedIn) {
                    // Get the identity from auth client
                    const identity = authClient.getIdentity();
                    const principal = identity.getPrincipal().toString();
                    
                    console.log("Auth client principal:", principal);
                    
                    // Double-check with the backend
                    try {
                        const backendPrincipal = await DecentraLearn_backend.whoami();
                        console.log("Backend principal:", backendPrincipal.toString());
                        
                        // Both checks passed, user is definitely authenticated
                        setPrincipal(backendPrincipal.toString());
                        setIsAuthenticated(true);
                        
                        // Now proceed with course lookup
                        await lookupCourseAndEnrollment(backendPrincipal.toString());
                    } catch (backendError) {
                        console.error("Backend principal check failed:", backendError);
                        // Still consider user authenticated based on AuthClient
                        setPrincipal(principal);
                        setIsAuthenticated(true);
                        
                        // Continue with course lookup
                        await lookupCourseAndEnrollment(principal);
                    }
                } else {
                    console.warn("User is not authenticated according to AuthClient");
                    setPrincipal(null);
                    setIsAuthenticated(false);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("Error in authentication check:", error);
                setError(`Authentication error: ${error instanceof Error ? error.message : String(error)}`);
                setPrincipal(null);
                setIsAuthenticated(false);
                setIsLoading(false);
            }
        }
        
        // Separated course lookup function for better organization
        async function lookupCourseAndEnrollment(principalStr: string) {
            try {
                const courseData = await DecentraLearn_backend.get_course_by_slug(slug);
                console.log("Course data for slug:", slug, courseData);
                
                if (courseData) {
                    // Find course ID from entries that match the slug
                    const allCourses = await DecentraLearn_backend.get_courses();
                    console.log("All courses:", allCourses);
                    
                    const foundCourse = allCourses.find(
                        entry => entry.course.course_slug === slug
                    );
                    
                    if (foundCourse) {
                        setCourseId(foundCourse.course_id);
                        console.log("Found course ID:", foundCourse.course_id);
                        
                        // Check if user is already enrolled in this course
                        const enrollments = await DecentraLearn_backend.get_enrollments();
                        console.log("All enrollments:", enrollments);
                        
                        const isAlreadyEnrolled = enrollments.some(
                            enrollment => 
                                enrollment.user_id.toString() === principalStr && 
                                enrollment.course_id === foundCourse.course_id
                        );
                        console.log("Is already enrolled:", isAlreadyEnrolled);
                        setIsEnrolled(isAlreadyEnrolled);
                    } else {
                        console.error("Course found but couldn't get the ID");
                        setError("Course found but couldn't get the ID");
                    }
                } else {
                    console.error("Course not found with slug:", slug);
                    setError(`Course not found with slug: ${slug}`);
                }
            } catch (courseError) {
                console.error("Error fetching course:", courseError);
                setError(`Error fetching course: ${courseError instanceof Error ? courseError.message : String(courseError)}`);
            } finally {
                setIsLoading(false);
            }
        }
        
        checkAuth();
    }, [slug]);

    const handleEnroll = async () => {
        try {
            if (!isAuthenticated) {
                console.error("User is not authenticated");
                setError("User is not authenticated");
                return;
            }
            
            if (!courseId) {
                console.error("Course ID not found");
                setError("Course ID not found");
                return;
            }
            
            setIsLoading(true);
            console.log("Enrolling user in course:", courseId);
            
            // Call the backend enrollment function
            const success = await DecentraLearn_backend.enroll_student(courseId);
            console.log("Enrollment result:", success);
            
            if (success) {
                console.log(`Successfully enrolled in course: ${slug}`);
                
                // Initialize course progress after enrollment
                try {
                    const progressInit = await DecentraLearn_backend.initialize_course_progress(courseId);
                    console.log("Progress initialization result:", progressInit);
                } catch (progressError) {
                    console.warn("Failed to initialize course progress:", progressError);
                    // Continue even if progress initialization fails
                }
                
                startTransition(() => {
                    setIsEnrolled(true);
                    // Redirect to the course page
                    navigate(`/learn/${slug}/${lessonId}`);
                });
            } else {
                console.log("Enrollment failed - you may already be enrolled");
                // Double-check enrollment status
                const enrollments = await DecentraLearn_backend.get_enrollments();
                const checkEnrolled = enrollments.some(
                    enrollment => 
                        enrollment.user_id.toString() === principal && 
                        enrollment.course_id === courseId
                );
                
                if (checkEnrolled) {
                    setIsEnrolled(true);
                }
            }
        } catch (error) {
            console.error("Error in handleEnroll:", error);
            setError("Error enrolling in course");
        } finally {
            setIsLoading(false);
        }
    };

    // Error state
    if (error) {
        return (
            <div className="w-full p-3 bg-red-100 border border-red-300 rounded-lg text-red-600 text-sm">
                {error}
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="w-full h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
            </div>
        );
    }

    // Enrolled state
    if (isEnrolled) {
        return (
            <Link
                to={`/learn/${slug}/${lessonId}`}
                className="w-full rounded-lg px-6 py-3 font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 h-12 flex items-center justify-center gap-2 group"
            >
                <span>Access Course</span>
                <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
        );
    }

    // Not enrolled state
    return (
        <button
            className={`w-full rounded-lg px-6 py-3 font-medium transition-all duration-300 ease-in-out relative h-12
                ${
                    isPending || !isAuthenticated
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed hover:scale-100"
                        : "bg-white text-black hover:scale-105 hover:shadow-lg hover:shadow-black/10"
                }
            `}
            disabled={!isAuthenticated || isPending}
            onClick={handleEnroll}
        >
            {!isAuthenticated ? (
                <span className={`${isPending ? "opacity-0" : "opacity-100"}`}>
                    Sign in to Enroll
                </span>
            ) : (
                <span className={`${isPending ? "opacity-0" : "opacity-100"}`}>
                    Enroll Now
                </span>
            )}
            {isPending && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
                </div>
            )}
        </button>
    );
}

export default EnrollButton;