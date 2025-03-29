"use client"

import type React from "react"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Upload } from "lucide-react"
import { DecentraLearn_backend } from "./../../../declarations/DecentraLearn_backend"

export default function CourseForm() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    image: null as File | null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Auto-generate slug from title
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")

      setFormData({
        ...formData,
        title: value,
        slug,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    if (file) {
      setFormData({
        ...formData,
        image: file,
      })

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {

      // Convert category string into CourseTopic variant (ICP uses variants)
      const courseTopic = (() => {
        switch (formData.category.toLowerCase()) {
          case "technology": return { Technology: null };
          case "business": return { Business: null };
          case "design": return { Design: null };
          case "marketing": return { Marketing: null };
          case "development": return { Development: null };
          default: return { Other: null };
        }
      })();

      // Prepare course data for backend
      const courseData = {
        course_name: formData.title,
        course_topics: courseTopic,
        course_desc: formData.description,
        course_image_link: formData.image ? URL.createObjectURL(formData.image) : "",
        course_slug: formData.slug,
      };

      // Call the backend function
      const resp = await DecentraLearn_backend.add_course(courseData);

      console.log("Backend response (new course ID):", resp);

      // In a real app, you'd send this data to your API
      console.log("Submitting course:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Navigate to the modules page for this course
      // In a real app, you'd get the ID from the API response
      const mockId = Date.now().toString()
      navigate(`/admin/courses/${mockId}/modules`)
    } catch (error) {
      console.error("Error creating course:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Introduction to Blockchain"
              value={formData.title}
              onChange={handleChange}
              required
              className="bg-background border-border text-white"
            />
          </div>

          <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={handleSelectChange} required>
            <SelectTrigger className="bg-background border-border text-white">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="development">Development</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe your course..."
            value={formData.description}
            onChange={handleChange}
            required
            className="min-h-32 bg-background border-border text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Course Image</Label>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-md cursor-pointer bg-background border-border hover:bg-secondary/20 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 2MB)</p>
                </div>
                <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </Label>
            </div>

            <div className="flex items-center justify-center">
              {imagePreview ? (
                <div className="relative w-full h-40 rounded-md overflow-hidden">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Course preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-40 bg-secondary/20 rounded-md border border-border">
                  <p className="text-sm text-muted-foreground">Image preview will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 text-white">
        <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="outline" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Course"}
        </Button>
      </div>
    </form>
  )
}

