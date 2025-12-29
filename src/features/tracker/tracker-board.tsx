"use client"

import { useState } from "react"
import { storage } from "../../lib/storage"
import type { Application } from "../../types"
import TrackerColumn from "./tracker-column"
import ApplicationModal from "./application-modal"
import { Button } from "../../components/ui/button"
import { Plus } from "lucide-react"

const statuses = ["saved", "applied", "oa", "interview", "offer", "rejected"] as const

export default function TrackerBoard() {
  const [applications, setApplications] = useState<Application[]>(storage.getApplications())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingApp, setEditingApp] = useState<Application | null>(null)

  const handleAddApplication = (app: Omit<Application, "id" | "createdAt">) => {
    const newApp: Application = {
      ...app,
      id: Math.random().toString(36).slice(2, 9),
      createdAt: new Date().toISOString(),
    }
    const updated = [...applications, newApp]
    setApplications(updated)
    storage.setApplications(updated)
    setIsModalOpen(false)
    setEditingApp(null)
  }

  const handleUpdateApplication = (id: string, updates: Partial<Application>) => {
    const updated = applications.map((app) => (app.id === id ? { ...app, ...updates } : app))
    setApplications(updated)
    storage.setApplications(updated)
    setEditingApp(null)
  }

  const handleDeleteApplication = (id: string) => {
    const updated = applications.filter((app) => app.id !== id)
    setApplications(updated)
    storage.setApplications(updated)
  }

  const handleMoveCard = (appId: string, newStatus: (typeof statuses)[number]) => {
    handleUpdateApplication(appId, { status: newStatus })
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Application Pipeline</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={16} className="mr-2" />
          Add Application
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto">
        <div className="flex gap-6 min-w-min pb-8">
          {statuses.map((status) => (
            <TrackerColumn
              key={status}
              status={status}
              applications={applications.filter((app) => app.status === status)}
              onMoveCard={handleMoveCard}
              onEditCard={(app) => {
                setEditingApp(app)
                setIsModalOpen(true)
              }}
              onDeleteCard={handleDeleteApplication}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingApp(null)
        }}
        onSubmit={editingApp ? (data) => handleUpdateApplication(editingApp.id, data) : handleAddApplication}
        initialData={editingApp || undefined}
      />
    </div>
  )
}
