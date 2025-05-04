import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import CourseForm from "../components/CourseForm"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"

export default function NewCoursePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/courses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Create New Course</h1>
      </div>

      <Card className="bg-secondary border-border">
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>Fill in the details to create a new course</CardDescription>
        </CardHeader>
        <CardContent>
          <CourseForm />
        </CardContent>
      </Card>
    </div>
  )
}

