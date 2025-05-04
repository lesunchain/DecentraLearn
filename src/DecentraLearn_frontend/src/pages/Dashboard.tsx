import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { PlusCircle } from "lucide-react"
import { Link } from "react-router-dom"
import EnrollmentChart from "../components/EnrollmentChart"
import { DecentraLearn_backend } from "../../../declarations/DecentraLearn_backend"

export default function Dashboard() {
  const [courseCount, setCourseCount] = useState<number>(0)
  const [moduleCount, setModuleCount] = useState<number>(0)
  const [studentCount, setStudentCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch courses
        const coursesData = await DecentraLearn_backend.get_courses()
        setCourseCount(coursesData.length)
        
        // Fetch modules
        const modulesData = await DecentraLearn_backend.get_modules()
        setModuleCount(modulesData.length)
        
        const studentCount = await DecentraLearn_backend.get_enrollment_count()
        setStudentCount(studentCount)
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-secondary border-border">
          <CardHeader>
            <CardTitle>Courses</CardTitle>
            <CardDescription>Manage your learning courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? "Loading..." : courseCount}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Total courses created</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary border-border">
          <CardHeader>
            <CardTitle>Modules</CardTitle>
            <CardDescription>Manage your course modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? "Loading..." : moduleCount}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Total modules created</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary border-border">
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>View enrolled students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? "Loading..." : studentCount}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Total enrolled students</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="bg-secondary border-border">
          <CardHeader>
            <CardTitle>Enrollment Trends</CardTitle>
            <CardDescription>Student enrollment over time</CardDescription>
          </CardHeader>
          <CardContent>
            <EnrollmentChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}