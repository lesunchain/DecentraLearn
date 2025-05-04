"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowLeft, Edit, FileText, MoreHorizontal, PlusCircle, Trash } from "lucide-react"
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
import { DecentraLearn_backend } from "../../../declarations/DecentraLearn_backend"

type Course = {
  course_name: string;
  course_slug: string;
  course_desc: string;
  course_image_link: string;
  course_topics: Record<string, any>;
  // Add any other properties your Course type has
};

type CourseEntry = {
  course_id: number;
  course: Course;
};

export default function CourseModulesPage() {
  const { slug } = useParams()
  const [courseInfo, setCourseInfo] = useState<any>(null)
  const [modules, setModules] = useState<any[]>([])
  const [allLessons, setAllLessons] = useState<any[]>([])
  
  const [isAddingModule, setIsAddingModule] = useState(false)
  const [isEditingModule, setIsEditingModule] = useState(false)
  const [currentModule, setCurrentModule] = useState<any>(null)
  const [isAddingLesson, setIsAddingLesson] = useState(false)
  const [isEditingLesson, setIsEditingLesson] = useState(false)
  const [currentLesson, setCurrentLesson] = useState<any>(null)
  const [isDeleteModuleDialogOpen, setIsDeleteModuleDialogOpen] = useState(false)
  const [isDeleteLessonDialogOpen, setIsDeleteLessonDialogOpen] = useState(false)
  const [moduleToDelete, setModuleToDelete] = useState<number | null>(null)
  const [lessonToDelete, setLessonToDelete] = useState<{ moduleId: number; lessonId: number } | null>(null)
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null)
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch course data and modules
  useEffect(() => {
    async function fetchCourseData() {
      if (!slug) {
        setError("No course slug provided");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        console.log("Fetching course data for slug:", slug);
        
        // Get course by slug
        const courseDataResponse = await DecentraLearn_backend.get_course_by_slug(slug);
        console.log("Course data:", courseDataResponse);
        
        if (!courseDataResponse) {
          setError(`Course with slug "${slug}" not found`);
          setIsLoading(false);
          return;
        }
        
        // Extract the course object correctly from the response
        // If it's an array, take the first item, otherwise use it directly
        const courseData = Array.isArray(courseDataResponse) 
          ? (courseDataResponse.length > 0 ? courseDataResponse[0] as Course : null) 
          : courseDataResponse as Course;
        
        if (!courseData) {
          setError(`Course data not found for slug "${slug}"`);
          setIsLoading(false);
          return;
        }
        
        // Find the course ID
        const allCoursesResponse = await DecentraLearn_backend.get_courses();
        const courseEntry = allCoursesResponse.find(
          entry => entry.course.course_slug === slug
        ) as CourseEntry | undefined;
        
        if (!courseEntry) {
          setError(`Could not find course ID for slug "${slug}"`);
          setIsLoading(false);
          return;
        }
        
        // Extract topic name with proper type safety
        const topicName = courseData.course_topics 
          ? Object.keys(courseData.course_topics)[0] || "Other"
          : "Other";
        
        setCourseInfo({
          id: courseEntry.course_id,
          title: courseData.course_name,
          slug: courseData.course_slug,
          description: courseData.course_desc,
          category: topicName,
          image: courseData.course_image_link
        });
        
        // Fetch modules for this course
        console.log("Fetching modules for course ID:", courseEntry.course_id)
        const courseModules = await DecentraLearn_backend.get_course_modules(courseEntry.course_id)
        console.log("Modules data:", courseModules)
        
        // Sort modules by order
        const sortedModules = [...courseModules].sort((a, b) => a.module.order - b.module.order)
        setModules(sortedModules)
        
        // Fetch all lessons for each module
        const fetchedLessons = []
        for (const moduleEntry of courseModules) {
          console.log("Fetching lessons for module:", moduleEntry.module_id)
          const moduleLessons = await DecentraLearn_backend.get_module_lessons(moduleEntry.module_id)
          fetchedLessons.push(...moduleLessons)
        }
        console.log("All lessons:", fetchedLessons)
        setAllLessons(fetchedLessons)
        
      } catch (err) {
        console.error("Error fetching course data:", err)
        setError(`Failed to load course information: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchCourseData()
  }, [slug])

  // Convert PDF file to base64 string
  const convertPdfToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const handleAddModule = async (moduleData: any) => {
    if (!courseInfo) {
      console.error("No course info available")
      return
    }
    
    try {
      setIsLoading(true)
      
      // Create module object for backend
      const newModule = {
        title: moduleData.title,
        description: moduleData.description,
        order: Number(moduleData.order),
        course_id: courseInfo.id,
      }
      
      console.log("Adding new module:", newModule)
      
      // Add module to backend
      const moduleId = await DecentraLearn_backend.add_module(newModule)
      console.log("Added module with ID:", moduleId)
      
      // Refresh modules list
      const updatedModules = await DecentraLearn_backend.get_course_modules(courseInfo.id)
      const sortedModules = [...updatedModules].sort((a, b) => a.module.order - b.module.order)
      setModules(sortedModules)
      
      setIsAddingModule(false)
    } catch (err) {
      console.error("Error adding module:", err)
      setError(`Failed to add module: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditModule = async (moduleData: any) => {
    if (!currentModule || !courseInfo) {
      console.error("No module selected for editing or no course info")
      return
    }
    
    try {
      setIsLoading(true)
      
      // Create updated module object
      const updatedModule = {
        title: moduleData.title,
        description: moduleData.description,
        order: Number(moduleData.order),
        course_id: courseInfo.id,
      }
      
      console.log("Updating module:", currentModule.module_id, updatedModule)
      
      // Update module in backend
      const success = await DecentraLearn_backend.edit_module(currentModule.module_id, updatedModule)
      console.log("Module update result:", success)
      
      if (success) {
        // Refresh modules list
        const updatedModules = await DecentraLearn_backend.get_course_modules(courseInfo.id)
        const sortedModules = [...updatedModules].sort((a, b) => a.module.order - b.module.order)
        setModules(sortedModules)
      }
      
      setIsEditingModule(false)
      setCurrentModule(null)
    } catch (err) {
      console.error("Error updating module:", err)
      setError(`Failed to update module: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteModule = async () => {
    if (!moduleToDelete) {
      console.error("No module selected for deletion")
      return
    }
    
    try {
      setIsLoading(true)
      
      console.log("Deleting module:", moduleToDelete)
      
      // Delete module from backend
      const success = await DecentraLearn_backend.remove_module(moduleToDelete)
      console.log("Module deletion result:", success)
      
      if (success) {
        // Refresh modules list
        const updatedModules = await DecentraLearn_backend.get_course_modules(courseInfo.id)
        const sortedModules = [...updatedModules].sort((a, b) => a.module.order - b.module.order)
        setModules(sortedModules)
        
        // Also refresh lessons (some may have been deleted)
        const fetchedLessons = []
        for (const moduleEntry of updatedModules) {
          const moduleLessons = await DecentraLearn_backend.get_module_lessons(moduleEntry.module_id)
          fetchedLessons.push(...moduleLessons)
        }
        setAllLessons(fetchedLessons)
      }
      
      setIsDeleteModuleDialogOpen(false)
      setModuleToDelete(null)
    } catch (err) {
      console.error("Error deleting module:", err)
      setError(`Failed to delete module: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddLesson = async (lessonData: any) => {
    if (!currentModule || !selectedPdf) {
      console.error("No module selected or no PDF file provided")
      return
    }
    
    try {
      setIsLoading(true)
      
      // Convert PDF to base64 string
      const pdfBase64 = await convertPdfToBase64(selectedPdf)
      
      // Create lesson object for backend
      const newLesson = {
        title: lessonData.title,
        description: lessonData.description,
        pdf_file: pdfBase64,
        module_id: currentModule.module_id,
      }
      
      console.log("Adding new lesson:", {
        ...newLesson,
        pdf_file: pdfBase64 ? `${pdfBase64.substring(0, 30)}...` : null
      })
      
      // Add lesson to backend
      const lessonId = await DecentraLearn_backend.add_lesson(newLesson)
      console.log("Added lesson with ID:", lessonId)
      
      // Refresh lessons list
      const updatedLessons = await DecentraLearn_backend.get_module_lessons(currentModule.module_id)
      
      // Update lessons state
      setAllLessons(prevLessons => {
        const filteredPrev = prevLessons.filter(l => l.lesson.module_id !== currentModule.module_id)
        return [...filteredPrev, ...updatedLessons]
      })
      
      setIsAddingLesson(false)
      setSelectedPdf(null)
      setPdfPreviewUrl(null)
    } catch (err) {
      console.error("Error adding lesson:", err)
      setError(`Failed to add lesson: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditLesson = async (lessonData: any) => {
    if (!currentModule || !currentLesson) {
      console.error("No module or lesson selected for editing")
      return
    }
    
    try {
      setIsLoading(true)
      
      // Handle PDF update if needed
      let pdfUrl = currentLesson.lesson.pdf_file
      if (selectedPdf) {
        pdfUrl = await convertPdfToBase64(selectedPdf)
      }
      
      // Create updated lesson object
      const updatedLesson = {
        title: lessonData.title,
        description: lessonData.description,
        pdf_file: pdfUrl,
        module_id: currentModule.module_id,
      }
      
      console.log("Updating lesson:", currentLesson.lesson_id, {
        ...updatedLesson,
        pdf_file: pdfUrl ? `${pdfUrl.substring(0, 30)}...` : null
      })
      
      // Update lesson in backend
      const success = await DecentraLearn_backend.edit_lesson(currentLesson.lesson_id, updatedLesson)
      console.log("Lesson update result:", success)
      
      if (success) {
        // Refresh lessons list
        const updatedModuleLessons = await DecentraLearn_backend.get_module_lessons(currentModule.module_id)
        
        // Update lessons state
        setAllLessons(prevLessons => {
          const filteredPrev = prevLessons.filter(l => l.lesson.module_id !== currentModule.module_id)
          return [...filteredPrev, ...updatedModuleLessons]
        })
      }
      
      setIsEditingLesson(false)
      setCurrentLesson(null)
      setCurrentModule(null)
      setSelectedPdf(null)
      setPdfPreviewUrl(null)
    } catch (err) {
      console.error("Error updating lesson:", err)
      setError(`Failed to update lesson: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteLesson = async () => {
    if (!lessonToDelete) {
      console.error("No lesson selected for deletion")
      return
    }
    
    try {
      setIsLoading(true)
      
      console.log("Deleting lesson:", lessonToDelete.lessonId)
      
      // Delete lesson from backend
      const success = await DecentraLearn_backend.remove_lesson(lessonToDelete.lessonId)
      console.log("Lesson deletion result:", success)
      
      if (success) {
        // Refresh lessons for the affected module
        const updatedModuleLessons = await DecentraLearn_backend.get_module_lessons(lessonToDelete.moduleId)
        
        // Update lessons state
        setAllLessons(prevLessons => {
          const filteredPrev = prevLessons.filter(l => l.lesson.module_id !== lessonToDelete.moduleId)
          return [...filteredPrev, ...updatedModuleLessons]
        })
      }
      
      setIsDeleteLessonDialogOpen(false)
      setLessonToDelete(null)
    } catch (err) {
      console.error("Error deleting lesson:", err)
      setError(`Failed to delete lesson: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle PDF file selection
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedPdf(file)
      setPdfPreviewUrl(URL.createObjectURL(file))
    }
  }

  // Show loading state
  if (isLoading && !courseInfo) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    )
  }

  // Show error state
  if (error && !courseInfo) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800">Error</h3>
        <p className="text-red-600">{error}</p>
        <Button className="mt-4" variant="outline" asChild>
          <Link to="/admin/courses">Back to Courses</Link>
        </Button>
      </div>
    )
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
          <h1 className="text-3xl font-bold tracking-tight">{courseInfo?.title}</h1>
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
                <p>{courseInfo?.title}</p>
              </div>
              <div>
                <h3 className="font-medium">Slug</h3>
                <p>{courseInfo?.slug}</p>
              </div>
              <div>
                <h3 className="font-medium">Category</h3>
                <p>{courseInfo?.category}</p>
              </div>
              <div>
                <h3 className="font-medium">Description</h3>
                <p className="text-sm text-muted-foreground">{courseInfo?.description}</p>
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
                      {modules.map((moduleEntry) => (
                        <TableRow key={moduleEntry.module_id}>
                          <TableCell>{moduleEntry.module.order}</TableCell>
                          <TableCell className="font-medium">{moduleEntry.module.title}</TableCell>
                          <TableCell>
                            {allLessons.filter(l => l.lesson.module_id === moduleEntry.module_id).length}
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
                                    setCurrentModule(moduleEntry)
                                    setIsEditingModule(true)
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Module
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setCurrentModule(moduleEntry)
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
                                    setModuleToDelete(moduleEntry.module_id)
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
                {allLessons.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No lessons yet. Select a module and click "Add Lesson" to create your first lesson.
                  </div>
                ) : (
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
                      {allLessons.map((lessonEntry) => {
                        // Find the module this lesson belongs to
                        const module = modules.find(m => m.module_id === lessonEntry.lesson.module_id)
                        
                        return (
                          <TableRow key={lessonEntry.lesson_id}>
                            <TableCell>{module?.module.title || "Unknown Module"}</TableCell>
                            <TableCell className="font-medium">{lessonEntry.lesson.title}</TableCell>
                            <TableCell>
                              {lessonEntry.lesson.pdf_file ? (
                                <a
                                  href={lessonEntry.lesson.pdf_file}
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
                                      setCurrentLesson(lessonEntry)
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
                                        moduleId: lessonEntry.lesson.module_id,
                                        lessonId: lessonEntry.lesson_id,
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
                        )
                      })}
                    </TableBody>
                  </Table>
                )}
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
                    defaultValue={currentModule.module.title}
                    className="bg-background/50 border-border text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={currentModule.module.description}
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
                    defaultValue={currentModule.module.order}
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
              <DialogTitle>Add Lesson to {currentModule.module.title}</DialogTitle>
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
                    defaultValue={currentLesson.lesson.title}
                    className="bg-background/50 border-border text-white"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={currentLesson.lesson.description}
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
                {(pdfPreviewUrl || currentLesson.lesson.pdf_file) && (
                  <div className="mt-2">
                    <Label>PDF Preview</Label>
                    <div className="mt-1 border border-border rounded-md overflow-hidden">
                      <iframe
                        src={pdfPreviewUrl || currentLesson.lesson.pdf_file}
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