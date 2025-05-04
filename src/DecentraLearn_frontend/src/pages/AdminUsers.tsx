"use client"

import { useEffect, useState } from "react"
import { ArrowUpDown, ExternalLink, MoreHorizontal, Search, UserIcon } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { DecentraLearn_backend } from "../../../declarations/DecentraLearn_backend"

// Type for user data derived from enrollments
interface UserInfo {
  id: string;  // Principal ID as string
  shortId: string; // Shortened Principal ID for display
  enrolledCourses: number;
  totalCourses: number[];
  lastActive: string;
  completedCourses: number;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserInfo[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUsersData() {
      try {
        setIsLoading(true)
        setError(null)
        
        // Step 1: Get all enrollments
        const enrollments = await DecentraLearn_backend.get_enrollments()
        console.log("Raw enrollments:", enrollments)
        
        // Step 2: Get all courses for reference
        const courses = await DecentraLearn_backend.get_courses()
        console.log("Available courses:", courses.length)
        
        // Step 3: Group enrollments by user
        const userMap = new Map<string, UserInfo>()
        
        for (const enrollment of enrollments) {
          const userId = enrollment.user_id.toString()
          
          // Create or update user information
          if (!userMap.has(userId)) {
            userMap.set(userId, {
              id: userId,
              shortId: shortenPrincipal(userId),
              enrolledCourses: 1,
              totalCourses: [enrollment.course_id],
              lastActive: new Date(Number(enrollment.last_accessed_date) / 1_000_000).toISOString(),
              completedCourses: enrollment.completed ? 1 : 0
            })
          } else {
            const userInfo = userMap.get(userId)!
            
            // Only increment enrolled count if this is a new course
            if (!userInfo.totalCourses.includes(enrollment.course_id)) {
              userInfo.enrolledCourses += 1
              userInfo.totalCourses.push(enrollment.course_id)
            }
            
            // Update last active time if this enrollment is more recent
            const enrollmentDate = new Date(Number(enrollment.last_accessed_date) / 1_000_000)
            const currentLastActive = new Date(userInfo.lastActive)
            
            if (enrollmentDate > currentLastActive) {
              userInfo.lastActive = enrollmentDate.toISOString()
            }
            
            // Update completed courses count
            if (enrollment.completed && !userInfo.totalCourses.includes(enrollment.course_id)) {
              userInfo.completedCourses += 1
            }
            
            userMap.set(userId, userInfo)
          }
        }
        
        // Convert the map to an array and sort by enrollment count
        const usersArray = Array.from(userMap.values())
          .sort((a, b) => b.enrolledCourses - a.enrolledCourses)
        
        console.log("Processed users:", usersArray)
        setUsers(usersArray)
        
      } catch (err) {
        console.error("Error fetching users data:", err)
        setError(`Failed to load users: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUsersData()
  }, [])

  // Helper to create a shorter version of the principal for display
  function shortenPrincipal(principal: string): string {
    if (principal.length <= 12) return principal;
    return `${principal.substring(0, 6)}...${principal.substring(principal.length - 6)}`;
  }

  const filteredUsers = users.filter(
    (user) =>
      user.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800">Error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by Principal ID..."
            className="pl-8 bg-background border-border text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card className="bg-secondary border-border">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Platform users based on enrollment data</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No users have enrolled in any courses yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">
                    <div className="flex items-center space-x-1">
                      <span>Principal ID</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Enrolled Courses</TableHead>
                  <TableHead>Completed Courses</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserIcon className="h-4 w-4" />
                        </div>
                        <span title={user.id}>{user.shortId}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.enrolledCourses}</TableCell>
                    <TableCell>{user.completedCourses}</TableCell>
                    <TableCell>{formatDate(user.lastActive)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => window.navigator.clipboard.writeText(user.id)}>
                            Copy Principal ID
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <a 
                              href={`https://dashboard.internetcomputer.org/principal/${user.id}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center w-full"
                            >
                              View on IC Dashboard
                              <ExternalLink className="ml-2 h-3 w-3" />
                            </a>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}