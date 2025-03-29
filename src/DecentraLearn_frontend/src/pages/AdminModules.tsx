"use client"

import type React from "react"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowLeft, Edit, FileText, MoreHorizontal, PlusCircle, Trash } from "lucide-react"
import { useState } from "react"
import ModuleForm from "../components/ModuleForm"
import { Link, useParams } from "react-router-dom"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

export default function CourseModulesPage() {
  const { slug } = useParams()
  const [modules, setModules] = useState<any[]>([
    {
      id: "1",
      title: "Introduction to Blockchain",
      description: "Learn the basics of blockchain technology",
      order: 1,
      lessons: [
        {
          id: "101",
          title: "What is Blockchain?",
          description: "An overview of blockchain technology",
          pdfUrl: "/documents/blockchain_intro.pdf",
        },
        {
          id: "102",
          title: "Blockchain Architecture",
          description: "Understanding the structure of blockchain",
          pdfUrl: "/documents/blockchain_architecture.pdf",
        },
      ],
    },
    {
      id: "2",
      title: "Cryptocurrencies",
      description: "Explore different types of cryptocurrencies",
      order: 2,
      lessons: [
        {
          id: "201",
          title: "Bitcoin Fundamentals",
          description: "Learn about the first cryptocurrency",
          pdfUrl: "/documents/bitcoin_basics.pdf",
        },
      ],
    },
  ])

  const [isAddingModule, setIsAddingModule] = useState(false)
  const [isEditingModule, setIsEditingModule] = useState(false)
  const [currentModule, setCurrentModule] = useState<any>(null)
  const [isAddingLesson, setIsAddingLesson] = useState(false)
  const [isEditingLesson, setIsEditingLesson] = useState(false)
  const [currentLesson, setCurrentLesson] = useState<any>(null)
  const [isDeleteModuleDialogOpen, setIsDeleteModuleDialogOpen] = useState(false)
  const [isDeleteLessonDialogOpen, setIsDeleteLessonDialogOpen] = useState(false)
  const [moduleToDelete, setModuleToDelete] = useState<string | null>(null)
  const [lessonToDelete, setLessonToDelete] = useState<{ moduleId: string; lessonId: string } | null>(null)
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null)
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null)

  // Mock course data - in a real app, you'd fetch this from an API
  const mockCourse = {
    id: "1",
    title: "Introduction to Blockchain",
    slug: "intro-to-blockchain",
    description: "Learn the fundamentals of blockchain technology",
    category: "Technology",
  }

  const handleAddModule = (moduleData: any) => {
    const newModule = {
      id: Date.now().toString(),
      ...moduleData,
      lessons: [],
    }
    setModules([...modules, newModule])
    setIsAddingModule(false)
  }

  const handleEditModule = (moduleData: any) => {
    if (!currentModule) return

    setModules(modules.map((module) => (module.id === currentModule.id ? { ...module, ...moduleData } : module)))
    setIsEditingModule(false)
    setCurrentModule(null)
  }

  const handleDeleteModule = () => {
    if (!moduleToDelete) return

    setModules(modules.filter((module) => module.id !== moduleToDelete))
    setIsDeleteModuleDialogOpen(false)
    setModuleToDelete(null)
  }

  const handleAddLesson = (lessonData: any) => {
    if (!currentModule) return

    const newLesson = {
      id: Date.now().toString(),
      ...lessonData,
      pdfUrl: selectedPdf ? URL.createObjectURL(selectedPdf) : null,
    }

    setModules(
      modules.map((module) =>
        module.id === currentModule.id
          ? {
              ...module,
              lessons: [...module.lessons, newLesson],
            }
          : module,
      ),
    )

    setIsAddingLesson(false)
    setSelectedPdf(null)
    setPdfPreviewUrl(null)
  }

  const handleEditLesson = (lessonData: any) => {
    if (!currentModule || !currentLesson) return

    const updatedLesson = {
      ...currentLesson,
      ...lessonData,
      pdfUrl: selectedPdf ? URL.createObjectURL(selectedPdf) : currentLesson.pdfUrl,
    }

    setModules(
      modules.map((module) =>
        module.id === currentModule.id
          ? {
              ...module,
              lessons: module.lessons.map((lesson: any) => (lesson.id === currentLesson.id ? updatedLesson : lesson)),
            }
          : module,
      ),
    )

    setIsEditingLesson(false)
    setCurrentLesson(null)
    setCurrentModule(null)
    setSelectedPdf(null)
    setPdfPreviewUrl(null)
  }

  const handleDeleteLesson = () => {
    if (!lessonToDelete) return

    const { moduleId, lessonId } = lessonToDelete

    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.filter((lesson: any) => lesson.id !== lessonId),
            }
          : module,
      ),
    )

    setIsDeleteLessonDialogOpen(false)
    setLessonToDelete(null)
  }

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedPdf(file)
      setPdfPreviewUrl(URL.createObjectURL(file))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/courses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{mockCourse.title}</h1>
          <p className="text-muted-foreground">Manage course modules and lessons</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-secondary border-border">
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
            <CardDescription>Details about this course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Title</h3>
                <p>{mockCourse.title}</p>
              </div>
              <div>
                <h3 className="font-medium">Slug</h3>
                <p>{mockCourse.slug}</p>
              </div>
              <div>
                <h3 className="font-medium">Category</h3>
                <p>{mockCourse.category}</p>
              </div>
              <div>
                <h3 className="font-medium">Description</h3>
                <p className="text-sm text-muted-foreground">{mockCourse.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Modules</CardTitle>
              <CardDescription>Course modules and lessons</CardDescription>
            </div>
            <Button
              onClick={() => setIsAddingModule(true)}
              className="flex items-center gap-2 text-white"
              variant="outline"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Module</span>
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="modules">
              <TabsList className="mb-4">
                <TabsTrigger value="modules">Modules</TabsTrigger>
                <TabsTrigger value="lessons">Lessons</TabsTrigger>
              </TabsList>

              <TabsContent value="modules">
                {modules.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No modules yet. Click "Add Module" to create your first module.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Lessons</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {modules.map((module) => (
                        <TableRow key={module.id}>
                          <TableCell>{module.order}</TableCell>
                          <TableCell className="font-medium">{module.title}</TableCell>
                          <TableCell>{module.lessons?.length || 0}</TableCell>
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
                                    setCurrentModule(module)
                                    setIsEditingModule(true)
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Module
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setCurrentModule(module)
                                    setIsAddingLesson(true)
                                  }}
                                >
                                  <PlusCircle className="mr-2 h-4 w-4" />
                                  Add Lesson
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setModuleToDelete(module.id)
                                    setIsDeleteModuleDialogOpen(true)
                                  }}
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete Module
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>

              <TabsContent value="lessons">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>PDF</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modules.flatMap((module) =>
                      module.lessons.map((lesson: any) => (
                        <TableRow key={`${module.id}-${lesson.id}`}>
                          <TableCell>{module.title}</TableCell>
                          <TableCell className="font-medium">{lesson.title}</TableCell>
                          <TableCell>
                            {lesson.pdfUrl ? (
                              <a
                                href={lesson.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center text-black hover:text-black/50"
                              >
                                <FileText className="h-4 w-4" />
                              </a>
                            ) : (
                              <span className="text-muted-foreground">No PDF</span>
                            )}
                          </TableCell>
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
                                    setCurrentModule(module)
                                    setCurrentLesson(lesson)
                                    setIsEditingLesson(true)
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Lesson
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setLessonToDelete({
                                      moduleId: module.id,
                                      lessonId: lesson.id,
                                    })
                                    setIsDeleteLessonDialogOpen(true)
                                  }}
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete Lesson
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )),
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Add Module Dialog */}
      {isAddingModule && (
        <div className="mt-4">
          <Card className="bg-background border-border">
            <CardHeader className="p-4">
              <CardTitle className="text-base text-white">New Module</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ModuleForm onSubmit={handleAddModule} onCancel={() => setIsAddingModule(false)} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Module Dialog */}
      {isEditingModule && currentModule && (
        <Dialog open={isEditingModule} onOpenChange={setIsEditingModule}>
          <DialogContent className="bg-background border-border text-white">
            <DialogHeader>
              <DialogTitle>Edit Module</DialogTitle>
              <DialogDescription>Update the module details below.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const data = {
                  title: formData.get("title") as string,
                  description: formData.get("description") as string,
                  order: Number(formData.get("order")),
                }
                handleEditModule(data)
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Module Title</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={currentModule.title}
                    className="bg-background/50 border-border text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={currentModule.description}
                    className="min-h-20 bg-background/50 border-border text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    name="order"
                    type="number"
                    min="1"
                    defaultValue={currentModule.order}
                    className="bg-background/50 border-border w-24 text-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditingModule(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="text-black">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Lesson Dialog */}
      {isAddingLesson && currentModule && (
        <Dialog open={isAddingLesson} onOpenChange={setIsAddingLesson}>
          <DialogContent className="bg-background border-border text-white">
            <DialogHeader>
              <DialogTitle>Add Lesson to {currentModule.title}</DialogTitle>
              <DialogDescription>Create a new lesson for this module.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const data = {
                  title: formData.get("title") as string,
                  description: formData.get("description") as string,
                }
                handleAddLesson(data)
              }}
            >
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Lesson Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g. Introduction to the Topic"
                    className="bg-background/50 border-border text-white"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Brief description of this lesson..."
                    className="min-h-20 bg-background/50 border-border text-white"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pdf">PDF File</Label>
                  <Input
                    id="pdf"
                    name="pdf"
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfChange}
                    className="bg-background/50 border-border text-white"
                    required
                  />
                </div>
                {pdfPreviewUrl && (
                  <div className="mt-2">
                    <Label>PDF Preview</Label>
                    <div className="mt-1 border border-border rounded-md overflow-hidden">
                      <iframe src={pdfPreviewUrl} className="w-full h-64" title="PDF Preview"></iframe>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingLesson(false)
                    setCurrentModule(null)
                    setSelectedPdf(null)
                    setPdfPreviewUrl(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="text-black">Add Lesson</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Lesson Dialog */}
      {isEditingLesson && currentModule && currentLesson && (
        <Dialog open={isEditingLesson} onOpenChange={setIsEditingLesson}>
          <DialogContent className="bg-background border-border text-white">
            <DialogHeader>
              <DialogTitle>Edit Lesson</DialogTitle>
              <DialogDescription>Update the lesson details below.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const data = {
                  title: formData.get("title") as string,
                  description: formData.get("description") as string,
                }
                handleEditLesson(data)
              }}
            >
              <div className="grid gap-4 py-4 h-90 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                <div className="grid gap-2">
                  <Label htmlFor="title">Lesson Title</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={currentLesson.title}
                    className="bg-background/50 border-border text-white"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={currentLesson.description}
                    className="min-h-20 bg-background/50 border-border text-white"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pdf">PDF File (Leave empty to keep current)</Label>
                  <Input
                    id="pdf"
                    name="pdf"
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfChange}
                    className="bg-background/50 border-border text-white"
                  />
                </div>
                {(pdfPreviewUrl || currentLesson.pdfUrl) && (
                  <div className="mt-2">
                    <Label>PDF Preview</Label>
                    <div className="mt-1 border border-border rounded-md overflow-hidden">
                      <iframe
                        src={pdfPreviewUrl || currentLesson.pdfUrl}
                        className="w-full h-64"
                        title="PDF Preview"
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditingLesson(false)
                    setCurrentModule(null)
                    setCurrentLesson(null)
                    setSelectedPdf(null)
                    setPdfPreviewUrl(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="text-black">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Module Confirmation Dialog */}
      <Dialog open={isDeleteModuleDialogOpen} onOpenChange={setIsDeleteModuleDialogOpen}>
        <DialogContent className="bg-background border-border text-white">
          <DialogHeader>
            <DialogTitle>Delete Module</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this module? This will also delete all lessons within this module. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModuleDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteModule}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Lesson Confirmation Dialog */}
      <Dialog open={isDeleteLessonDialogOpen} onOpenChange={setIsDeleteLessonDialogOpen}>
        <DialogContent className="bg-background border-border text-white">
          <DialogHeader>
            <DialogTitle>Delete Lesson</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this lesson? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteLessonDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteLesson}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

