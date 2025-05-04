"use client"

import type React from "react"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { useState } from "react"

interface ModuleFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function ModuleForm({ onSubmit, onCancel }: ModuleFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: 1,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, you'd send this data to your API
      await new Promise((resolve) => setTimeout(resolve, 500))
      onSubmit(formData)
    } catch (error) {
      console.error("Error creating module:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-white">Module Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Introduction to the Course"
          value={formData.title}
          onChange={handleChange}
          required
          className="bg-background/50 border-border text-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-white">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Brief description of this module..."
          value={formData.description}
          onChange={handleChange}
          required
          className="min-h-20 bg-background/50 border-border text-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="order" className="text-white">Order</Label>
        <Input
          id="order"
          name="order"
          type="number"
          min="1"
          placeholder="1"
          value={formData.order}
          onChange={handleChange}
          required
          className="bg-background/50 border-border w-24 text-white"
        />
        <p className="text-xs text-muted-foreground">The order in which this module appears in the course</p>
      </div>

      <div className="flex justify-end gap-2 pt-2 text-white">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="outline" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Module"}
        </Button>
      </div>
    </form>
  )
}
