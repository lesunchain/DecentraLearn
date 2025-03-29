import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { PlusCircle } from "lucide-react"
import { Link } from "react-router-dom"
import EnrollmentChart from "../components/EnrollmentChart"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-secondary border-border">
          <CardHeader>
            <CardTitle>Courses</CardTitle>
            <CardDescription>Manage your learning courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-sm text-muted-foreground mt-2">Total courses created</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary border-border">
          <CardHeader>
            <CardTitle>Modules</CardTitle>
            <CardDescription>Manage your course modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">48</div>
            <p className="text-sm text-muted-foreground mt-2">Total modules created</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary border-border">
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>View enrolled students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,234</div>
            <p className="text-sm text-muted-foreground mt-2">Total enrolled students</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="bg-secondary border-border">
          <CardHeader>
            <CardTitle>Student Enrollment</CardTitle>
            <CardDescription>Track student enrollment over time</CardDescription>
          </CardHeader>
          <CardContent>
            <EnrollmentChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

