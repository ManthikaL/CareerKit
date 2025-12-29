"use client"

import { useState, useEffect } from "react"
import type { Deck } from "../../types"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { X } from "lucide-react"

interface DeckModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Deck, "createdAt" | "updatedAt">) => void
  initialData?: Deck
}

export default function DeckModal({ isOpen, onClose, onSubmit, initialData }: DeckModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cardCount: 0,
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        cardCount: initialData.cardCount,
      })
    } else {
      setFormData({ name: "", description: "", cardCount: 0 })
    }
  }, [initialData, isOpen])

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("Deck name is required")
      return
    }
    onSubmit({
      id: initialData?.id || "",
      name: formData.name,
      description: formData.description,
      cardCount: 0,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold">{initialData ? "Edit Deck" : "Create Deck"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <Input
            placeholder="Deck name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>

        <div className="flex gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            {initialData ? "Update" : "Create"} Deck
          </Button>
        </div>
      </div>
    </div>
  )
}
