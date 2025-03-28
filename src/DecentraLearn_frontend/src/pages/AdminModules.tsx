"use client"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowLeft, PlusCircle } from "lucide-react"
import { useState } from "react"
import ModuleForm from "../components/ModuleForm"
import { Link, useParams } from "react-router-dom";

export default function CourseModulesPage() {
    const { courseId } = useParams()
    const [modules, setModules] = useState<any[]>([])
    const [isAddingModule, setIsAddingModule] = useState(false)

    // Mock course data - in a real app, you'd fetch this from an API
    const mockCourse = {
        id: courseId,
        title: "Introduction to Blockchain",
        slug: "intro-to-blockchain",
        description: "Learn the fundamentals of blockchain technology",
        category: "Technology",
    }

    const handleAddModule = (moduleData: any) => {
        setModules([...modules, { id: Date.now().toString(), ...moduleData }])
        setIsAddingModule(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/admin">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{mockCourse.title}</h1>
                    <p className="text-muted-foreground">Manage course modules</p>
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
                        <Button onClick={() => setIsAddingModule(true)} className="flex items-center gap-2 text-white" variant="outline">
                            <PlusCircle className="h-4 w-4" />
                            <span>Add Module</span>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {modules.length === 0 && !isAddingModule ? (
                            <div className="text-center py-6 text-muted-foreground">
                                No modules yet. Click "Add Module" to create your first module.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {modules.map((module) => (
                                    <Card key={module.id} className="bg-background border-border">
                                        <CardHeader className="p-4">
                                            <CardTitle className="text-base text-white">{module.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0">
                                            <p className="text-sm text-muted-foreground">{module.description}</p>
                                            <p className="text-sm text-muted-foreground">{module.pdf}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

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
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

