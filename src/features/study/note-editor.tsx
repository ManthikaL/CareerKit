"use client"

import { useState } from "react"
import type { Note } from "../../types"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"

interface NoteEditorProps {
  note: Note
  onSave: (note: Note) => void
  onCancel: () => void
}

export default function NoteEditor({ note, onSave, onCancel }: NoteEditorProps) {
  const [editData, setEditData] = useState(note)
  const [tagInput, setTagInput] = useState("")

  const handleAddTag = () => {
    if (tagInput.trim() && !editData.tags.includes(tagInput.trim())) {
      setEditData({
        ...editData,
        tags: [...editData.tags, tagInput.trim()],
      })
      setTagInput("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button variant="outline" onClick={onCancel} className="bg-transparent">
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <Button onClick={() => onSave({ ...editData, updatedAt: new Date().toISOString() })}>
          <Save size={16} className="mr-2" />
          Save Note
        </Button>
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Note title..."
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          className="text-xl font-semibold"
        />

        <Textarea
          placeholder="Start typing your notes in Markdown..."
          value={editData.content}
          onChange={(e) => setEditData({ ...editData, content: e.target.value })}
          rows={15}
        />

        <div>
          <label className="text-sm font-medium mb-2 block">Tags</label>
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Add tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              className="flex-1"
            />
            <Button size="sm" onClick={handleAddTag}>
              Add
            </Button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {editData.tags.map((tag) => (
              <span
                key={tag}
                className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  onClick={() => setEditData({ ...editData, tags: editData.tags.filter((t) => t !== tag) })}
                  className="hover:opacity-70"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
