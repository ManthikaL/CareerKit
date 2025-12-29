"use client"

import { useState, useEffect } from "react"
import { storage } from "../../lib/storage"
import type { ResumeData } from "../../types"
import ResumeCanvas from "./resume-canvas"
import ResumePanel from "./resume-panel"
import { Button } from "../../components/ui/button"
import { Download, Share2 } from "lucide-react"
import { generateId } from "../../lib/utils"

export default function ResumeBuilder({ resumeId }: { resumeId?: string }) {
  const [resume, setResume] = useState<ResumeData | null>(null)
  const [editingSection, setEditingSection] = useState<string | null>(null)

  useEffect(() => {
    if (resumeId) {
      const data = storage.getResume(resumeId)
      setResume(data)
    } else {
      // Create new resume
      const newId = generateId()
      const newResume: ResumeData = {
        id: newId,
        header: { fullName: "", email: "", phone: "", location: "", links: [] },
        summary: "",
        skills: [],
        experience: [],
        projects: [],
        education: [],
        certifications: [],
        template: "modern",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      storage.setResume(newId, newResume)
      setResume(newResume)
    }
  }, [resumeId])

  const updateResume = (updates: Partial<ResumeData>) => {
    if (!resume) return
    const updated = {
      ...resume,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    storage.setResume(resume.id, updated)
    setResume(updated)
  }

  const handleExportPDF = () => {
    // Stub for PDF export - implement with jsPDF + html2canvas if needed
    alert("PDF export coming soon")
  }

  const handleShare = () => {
    // Generate share link
    const shareUrl = `${window.location.origin}/resume/share/${resume?.id}`
    navigator.clipboard.writeText(shareUrl)
    alert("Share link copied to clipboard!")
  }

  if (!resume) return <div className="p-8">Loading...</div>

  return (
    <div className="flex h-full gap-6 p-8">
      {/* Left Panel - Library */}
      <div className="w-80 border-r border-border pr-6 overflow-y-auto space-y-6">
        <div>
          <h2 className="font-bold mb-4">Sections</h2>
          <div className="space-y-2 text-sm">
            {["header", "summary", "skills", "experience", "projects", "education", "certifications"].map((section) => (
              <button
                key={section}
                onClick={() => setEditingSection(editingSection === section ? null : section)}
                className={`w-full text-left px-4 py-2 rounded-lg capitalize font-medium transition-colors ${
                  editingSection === section
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary text-foreground"
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-bold mb-4">Template</h2>
          <div className="space-y-2">
            {(["modern", "minimal", "compact"] as const).map((tmpl) => (
              <button
                key={tmpl}
                onClick={() => updateResume({ template: tmpl })}
                className={`w-full px-4 py-2 rounded-lg capitalize font-medium transition-colors ${
                  resume.template === tmpl ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-foreground"
                }`}
              >
                {tmpl}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Button onClick={handleExportPDF} variant="outline" className="w-full bg-transparent">
            <Download size={16} className="mr-2" />
            Export PDF
          </Button>
          <Button onClick={handleShare} variant="outline" className="w-full bg-transparent">
            <Share2 size={16} className="mr-2" />
            Share Link
          </Button>
        </div>
      </div>

      {/* Middle - Canvas */}
      <div className="flex-1 flex justify-center overflow-y-auto">
        <div className="w-full max-w-2xl">
          <ResumeCanvas resume={resume} />
        </div>
      </div>

      {/* Right Panel - Editor */}
      <div className="w-80 border-l border-border pl-6 overflow-y-auto">
        {editingSection && <ResumePanel resume={resume} section={editingSection} onUpdate={updateResume} />}
      </div>
    </div>
  )
}
