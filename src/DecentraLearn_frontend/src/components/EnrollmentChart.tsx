"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { DecentraLearn_backend } from "../../../declarations/DecentraLearn_backend"

// Type definitions for our data structures
interface EnrollmentData {
  date: string;
  students: number;
}

interface EnrollmentStats {
  newStudents: number;
  completionRate: number;
  averageSessionMinutes: number;
  activeStudents: number;
  growthRates: {
    newStudents: number;
    completionRate: number;
    averageSession: number;
    activeStudents: number;
  }
}

export default function EnrollmentChart() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d")
  const [courseFilter, setCourseFilter] = useState<string>("all")
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData[]>([])
  const [stats, setStats] = useState<EnrollmentStats | null>(null)
  const [courses, setCourses] = useState<{id: number, name: string}[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch enrollment data based on the selected time range and course filter
  useEffect(() => {
    async function fetchEnrollmentData() {
      try {
        setLoading(true)
        setError(null)

        // 1. Fetch all enrollments
        const enrollments = await DecentraLearn_backend.get_enrollments()
        
        // 2. Fetch courses for the filter dropdown
        const coursesData = await DecentraLearn_backend.get_courses()
        setCourses(coursesData.map(course => ({
          id: course.course_id,
          name: course.course.course_name
        })))

        // 3. Process enrollments to create time-series data
        const today = new Date()
        const startDate = new Date()
        
        // Set the start date based on the selected time range
        if (timeRange === "7d") startDate.setDate(today.getDate() - 7)
        else if (timeRange === "30d") startDate.setDate(today.getDate() - 30)
        else if (timeRange === "90d") startDate.setDate(today.getDate() - 90)
        else if (timeRange === "1y") startDate.setDate(today.getDate() - 365)
        
        // Create a map to track enrollments by date
        const enrollmentsByDate = new Map<string, number>()
        
        // Initialize the map with all dates in the selected range
        for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0]
          enrollmentsByDate.set(dateStr, 0)
        }
        
        // Count enrollments by date, filtering by course if needed
        enrollments.forEach(enrollment => {
          // Convert enrollment date from nanoseconds to milliseconds and create Date
          const enrollmentDate = new Date(Number(enrollment.enrolled_date) / 1000000)
          
          // Skip if outside the selected time range
          if (enrollmentDate < startDate) return
          
          // Skip if filtering by course and this enrollment is for a different course
          if (courseFilter !== "all" && enrollment.course_id.toString() !== courseFilter) return
          
          const dateStr = enrollmentDate.toISOString().split('T')[0]
          const currentCount = enrollmentsByDate.get(dateStr) || 0
          enrollmentsByDate.set(dateStr, currentCount + 1)
        })
        
        // Convert the map to an array of data points for the chart
        const chartData: EnrollmentData[] = []
        let cumulativeCount = 0
        
        // Sort dates and create cumulative enrollment count
        Array.from(enrollmentsByDate.entries())
          .sort((a, b) => a[0].localeCompare(b[0]))
          .forEach(([date, count]) => {
            cumulativeCount += count
            chartData.push({
              date,
              students: cumulativeCount
            })
          })
        
        setEnrollmentData(chartData)
        
        // 4. Calculate statistics
        const completedEnrollments = enrollments.filter(e => e.completed)
        const newStudents = enrollments.filter(e => {
          const enrollmentDate = new Date(Number(e.enrolled_date) / 1000000)
          return enrollmentDate >= startDate
        }).length
        
        // Active students (had activity in the last 7 days)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(today.getDate() - 7)
        const activeStudents = enrollments.filter(e => {
          const lastAccessDate = new Date(Number(e.last_accessed_date) / 1000000)
          return lastAccessDate >= sevenDaysAgo
        }).length
        
        // Calculate completion rate
        const completionRate = enrollments.length > 0 
          ? (completedEnrollments.length / enrollments.length) * 100 
          : 0
        
        // For now, use a placeholder for average session time
        // In a real app, you'd track session durations in your backend
        const averageSessionMinutes = 25
        
        // Growth rates - placeholders that would be calculated by comparing to previous periods
        setStats({
          newStudents,
          completionRate,
          averageSessionMinutes,
          activeStudents,
          growthRates: {
            newStudents: 12,
            completionRate: 5,
            averageSession: 8,
            activeStudents: 15
          }
        })
        
      } catch (error) {
        console.error("Error fetching enrollment data:", error)
        setError("Failed to load enrollment data")
      } finally {
        setLoading(false)
      }
    }

    fetchEnrollmentData()
  }, [timeRange, courseFilter])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-[300px]">Loading enrollment data...</div>
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2 text-white">
          <Button
            variant={timeRange === "7d" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setTimeRange("7d")}
            className="h-8"
          >
            7D
          </Button>
          <Button
            variant={timeRange === "30d" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setTimeRange("30d")}
            className="h-8"
          >
            30D
          </Button>
          <Button
            variant={timeRange === "90d" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setTimeRange("90d")}
            className="h-8"
          >
            90D
          </Button>
          <Button
            variant={timeRange === "1y" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setTimeRange("1y")}
            className="h-8"
          >
            1Y
          </Button>
        </div>

        <div className="flex items-center gap-2 text-white">
          <Select 
            value={courseFilter} 
            onValueChange={(value) => setCourseFilter(value)}
          >
            <SelectTrigger className="h-8 w-[150px] bg-background border-border">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map(course => (
                <SelectItem key={course.id} value={course.id.toString()}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={enrollmentData}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatDate}
              tickMargin={10}
              minTickGap={10}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString()}
              tickMargin={10}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                          <span className="font-bold text-foreground">{formatDate(label)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Students</span>
                          <span className="font-bold text-foreground">{payload[0].value?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="students"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorStudents)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="bg-background border-border">
          <CardContent className="p-4">
            <div className="text-sm font-medium text-white">New Students</div>
            <div className="text-2xl font-bold text-white">
              +{stats?.newStudents || 0}
            </div>
            <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
              <span>↑</span> {stats?.growthRates.newStudents || 0}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background border-border">
          <CardContent className="p-4">
            <div className="text-sm font-medium text-white">Completion Rate</div>
            <div className="text-2xl font-bold text-white">
              {stats ? stats.completionRate.toFixed(0) : 0}%
            </div>
            <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
              <span>↑</span> {stats?.growthRates.completionRate || 0}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background border-border">
          <CardContent className="p-4">
            <div className="text-sm font-medium text-white">Avg. Session</div>
            <div className="text-2xl font-bold text-white">
              {stats?.averageSessionMinutes || 0}m
            </div>
            <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
              <span>↑</span> {stats?.growthRates.averageSession || 0}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background border-border">
          <CardContent className="p-4">
            <div className="text-sm font-medium text-white">Active Students</div>
            <div className="text-2xl font-bold text-white">
              {stats?.activeStudents || 0}
            </div>
            <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
              <span>↑</span> {stats?.growthRates.activeStudents || 0}%
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}