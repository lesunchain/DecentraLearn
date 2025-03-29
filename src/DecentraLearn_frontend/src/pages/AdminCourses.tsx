"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowUpDown, Edit, MoreHorizontal, CheckCheck, Trash, PlusCircle } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

// Mock courses data
const mockCourses = [
  {
    id: "1",
    title: "Introduction to Blockchain",
    slug: "intro-to-blockchain",
    category: "Technology",
    students: 245,
    status: "Published",
    createdAt: "2023-05-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Web Development Fundamentals",
    slug: "web-dev",
    category: "Development",
    students: 189,
    status: "Published",
    createdAt: "2023-06-22T14:30:00Z",
  },
  {
    id: "3",
    title: "Decentralized Finance",
    slug: "decentralized-fin",
    category: "Finance",
    students: 112,
    status: "Draft",
    createdAt: "2023-07-10T09:15:00Z",
  },
]

export default function AdminCourses() {
  const [courses, setCourses] = useState(mockCourses)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null)
  const [editingCourse, setEditingCourse] = useState<any>(null)

  const handleDeleteCourse = () => {
    if (courseToDelete) {
      setCourses(courses.filter((course) => course.id !== courseToDelete))
      setCourseToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleEditCourse = (formData: any) => {
    setCourses(courses.map((course) => (course.id === editingCourse.id ? { ...course, ...formData } : course)))
    setIsEditDialogOpen(false)
    setEditingCourse(null)
  }

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
        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
        <Link to="/admin/courses/new">
          <Button className="flex items-center gap-2 text-white" variant="outline">
            <PlusCircle className="h-4 w-4" />
            <span>New Course</span>
          </Button>
        </Link>
      </div>

      <Card className="bg-secondary border-border">
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
          <CardDescription>Manage your learning courses</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <div className="flex items-center space-x-1">
                    <span>Title</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>{course.students}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        course.status === "Published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {course.status}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(course.createdAt)}</TableCell>
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
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingCourse(course)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link to={`/admin/courses/${course.slug}`} className="flex items-center">
                            <CheckCheck className="mr-4 h-4 w-4" />
                            Manage
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setCourseToDelete(course.id)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-background border-border text-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this course? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCourse}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      {editingCourse && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-background border-border text-white">
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
              <DialogDescription>Update the course details below.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const data = {
                  title: formData.get("title") as string,
                  category: formData.get("category") as string,
                  status: formData.get("status") as string,
                }
                handleEditCourse(data)
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingCourse.title}
                    className="bg-background border-border text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue={editingCourse.category}>
                    <SelectTrigger className="bg-background border-border text-white">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Development">Development</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={editingCourse.status}>
                    <SelectTrigger className="bg-background border-border text-white">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="text-black">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

