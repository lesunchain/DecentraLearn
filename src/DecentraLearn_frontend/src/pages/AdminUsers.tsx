"use client"

import { useState } from "react"
import { ArrowUpDown, MoreHorizontal, Search, UserIcon } from "lucide-react"
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

// Mock users data
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Student",
    enrolledCourses: 3,
    lastActive: "2023-09-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Instructor",
    enrolledCourses: 0,
    lastActive: "2023-09-14T14:45:00Z",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "Student",
    enrolledCourses: 2,
    lastActive: "2023-09-10T09:15:00Z",
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice.williams@example.com",
    role: "Admin",
    enrolledCourses: 0,
    lastActive: "2023-09-16T11:20:00Z",
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    role: "Student",
    enrolledCourses: 5,
    lastActive: "2023-09-12T16:40:00Z",
  },
]

export default function AdminUsers() {
  const [users, setUsers] = useState(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8 bg-background border-border text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card className="bg-secondary border-border">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage platform users</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <div className="flex items-center space-x-1">
                    <span>Name</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Enrolled Courses</TableHead>
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
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.role === "Admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "Instructor"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>{user.enrolledCourses}</TableCell>
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
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>View Enrolled Courses</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

