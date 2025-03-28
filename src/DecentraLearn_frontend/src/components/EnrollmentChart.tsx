"use client"

import { useState } from "react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Generate mock data for the chart
const generateMockData = (days: number, startValue: number, trend: "up" | "down" | "stable") => {
  const data = []
  let currentValue = startValue

  const today = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(today.getDate() - i)

    // Generate a random change based on the trend
    let change = 0
    if (trend === "up") {
      change = Math.floor(Math.random() * 15) + 5 // 5-20 increase
    } else if (trend === "down") {
      change = -Math.floor(Math.random() * 10) - 1 // 1-10 decrease
    } else {
      change = Math.floor(Math.random() * 10) - 5 // -5 to 5 change
    }

    currentValue = Math.max(0, currentValue + change)

    data.push({
      date: date.toISOString().split("T")[0],
      students: currentValue,
    })
  }

  return data
}

// Generate different datasets for different time periods
const mockData = {
  "7d": generateMockData(7, 1180, "up"),
  "30d": generateMockData(30, 1000, "up"),
  "90d": generateMockData(90, 800, "up"),
  "1y": generateMockData(365, 500, "up"),
}

export default function EnrollmentChart() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d")

  const data = mockData[timeRange]

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date)
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
          <Select defaultValue="all">
            <SelectTrigger className="h-8 w-[150px] bg-background border-border">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="blockchain">Blockchain</SelectItem>
              <SelectItem value="development">Development</SelectItem>
              <SelectItem value="design">Design</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
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
              +{timeRange === "7d" ? "54" : timeRange === "30d" ? "234" : timeRange === "90d" ? "512" : "734"}
            </div>
            <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
              <span>↑</span>{" "}
              {timeRange === "7d" ? "12%" : timeRange === "30d" ? "18%" : timeRange === "90d" ? "24%" : "32%"}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background border-border">
          <CardContent className="p-4">
            <div className="text-sm font-medium text-white">Completion Rate</div>
            <div className="text-2xl font-bold text-white">
              {timeRange === "7d" ? "68%" : timeRange === "30d" ? "72%" : timeRange === "90d" ? "65%" : "70%"}
            </div>
            <div
              className={`text-xs flex items-center gap-1 mt-1 ${timeRange === "90d" ? "text-red-500" : "text-green-500"}`}
            >
              <span>{timeRange === "90d" ? "↓" : "↑"}</span>{" "}
              {timeRange === "7d" ? "3%" : timeRange === "30d" ? "5%" : timeRange === "90d" ? "2%" : "8%"}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background border-border">
          <CardContent className="p-4">
            <div className="text-sm font-medium text-white">Avg. Session</div>
            <div className="text-2xl font-bold text-white">
              {timeRange === "7d" ? "24m" : timeRange === "30d" ? "28m" : timeRange === "90d" ? "32m" : "30m"}
            </div>
            <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
              <span>↑</span>{" "}
              {timeRange === "7d" ? "4%" : timeRange === "30d" ? "8%" : timeRange === "90d" ? "12%" : "10%"}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background border-border">
          <CardContent className="p-4">
            <div className="text-sm font-medium text-white">Active Students</div>
            <div className="text-2xl font-bold text-white">
              {timeRange === "7d" ? "842" : timeRange === "30d" ? "968" : timeRange === "90d" ? "1,024" : "1,156"}
            </div>
            <div className="text-xs text-green-500 flex items-center gap-1 mt-1">
              <span>↑</span>{" "}
              {timeRange === "7d" ? "6%" : timeRange === "30d" ? "9%" : timeRange === "90d" ? "15%" : "22%"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

