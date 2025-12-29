"use client"

import { useState, useEffect } from "react"
import type { Application } from "../../types"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { X } from "lucide-react"

interface ApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Application>) => void
  initialData?: Application
}

export default function ApplicationModal({ isOpen, onClose, onSubmit, initialData }: ApplicationModalProps) {
  const [formData, setFormData] = useState<Partial<Application>>({
    companyName: "",
    roleTitle: "",
    location: "",
    status: "saved",
    appliedDate: new Date().toISOString().split("T")[0],
    link: "",
    salaryRange: "",
    notes: "",
    contacts: [],
    nextReminderDate: "",
    reminderType: "email",
    tags: [],
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        companyName: "",
        roleTitle: "",
        location: "",
        status: "saved",
        appliedDate: new Date().toISOString().split("T")[0],
        link: "",
        salaryRange: "",
        notes: "",
        contacts: [],
        nextReminderDate: "",
        reminderType: "email",
        tags: [],
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = () => {
    if (!formData.companyName || !formData.roleTitle) {
      alert("Company name and role title are required")
      return
    }
    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-xl font-bold">{initialData ? "Edit Application" : "Add Application"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Company Name *"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />
            <Input
              placeholder="Role Title *"
              value={formData.roleTitle}
              onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="saved">Saved</option>
              <option value="applied">Applied</option>
              <option value="oa">Online Assessment</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              value={formData.appliedDate?.split("T")[0]}
              onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
            />
            <Input
              placeholder="Salary Range"
              value={formData.salaryRange}
              onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
            />
          </div>

          <Input
            placeholder="Job Posting Link"
            type="url"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          />

          <Textarea
            placeholder="Notes (max 1000 chars)"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value.slice(0, 1000) })}
            rows={4}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              placeholder="Next Reminder"
              value={formData.nextReminderDate?.split("T")[0]}
              onChange={(e) => setFormData({ ...formData, nextReminderDate: e.target.value })}
            />
            <select
              value={formData.reminderType}
              onChange={(e) => setFormData({ ...formData, reminderType: e.target.value as any })}
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="call">Call</option>
              <option value="email">Email</option>
              <option value="linkedin">LinkedIn</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Tags</label>
            <div className="flex flex-wrap gap-2">
              {(["remote", "onsite", "internship", "fulltime"] as const).map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    const newTags = formData.tags?.includes(tag)
                      ? formData.tags.filter((t) => t !== tag)
                      : [...(formData.tags || []), tag]
                    setFormData({ ...formData, tags: newTags })
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors capitalize ${
                    formData.tags?.includes(tag)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground hover:bg-accent"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border sticky bottom-0 bg-card">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            {initialData ? "Update" : "Add"} Application
          </Button>
        </div>
      </div>
    </div>
  )
}
