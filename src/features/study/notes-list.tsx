"use client"

import { useState } from "react"
import { storage } from "../../lib/storage"
import type { Note } from "../../types"
import NoteEditor from "./note-editor"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Plus, Trash2 } from "lucide-react"
import { generateId } from "../../lib/utils"

export default function NotesList() {
  const [notes, setNotes] = useState<Note[]>(storage.getNotes())
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleCreateNote = () => {
    const newNote: Note = {
      id: generateId(),
      title: "Untitled Note",
      content: "",
      folder: "General",
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setEditingNote(newNote)
  }

  const handleSaveNote = (note: Note) => {
    const existingIndex = notes.findIndex((n) => n.id === note.id)
    const updated = existingIndex >= 0 ? notes.map((n) => (n.id === note.id ? note : n)) : [note, ...notes]
    setNotes(updated)
    storage.setNotes(updated)
    setEditingNote(null)
  }

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id)
    setNotes(updated)
    storage.setNotes(updated)
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (editingNote) {
    return <NoteEditor note={editingNote} onSave={handleSaveNote} onCancel={() => setEditingNote(null)} />
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleCreateNote}>
          <Plus size={16} className="mr-2" />
          New Note
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No notes found. Create one to get started!
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-card rounded-lg p-6 border border-border hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => setEditingNote(note)}
            >
              <h3 className="font-semibold mb-2 line-clamp-2">{note.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{note.content || "No content"}</p>

              {note.tags.length > 0 && (
                <div className="flex gap-1 mb-4 flex-wrap">
                  {note.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">{new Date(note.updatedAt).toLocaleDateString()}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteNote(note.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
