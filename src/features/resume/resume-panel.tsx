"use client"

import { useState } from "react"
import type { ResumeData } from "../../types"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Plus, X } from "lucide-react"
import { generateId } from "../../lib/utils"

interface ResumePanelProps {
  resume: ResumeData
  section: string
  onUpdate: (updates: Partial<ResumeData>) => void
}

export default function ResumePanel({ resume, section, onUpdate }: ResumePanelProps) {
  const [localData, setLocalData] = useState(resume)

  const handleSave = () => {
    onUpdate(localData)
  }

  const renderEditor = () => {
    switch (section) {
      case "header":
        return (
          <div className="space-y-4">
            <Input
              placeholder="Full Name"
              value={localData.header.fullName}
              onChange={(e) =>
                setLocalData({
                  ...localData,
                  header: { ...localData.header, fullName: e.target.value },
                })
              }
            />
            <Input
              placeholder="Email"
              type="email"
              value={localData.header.email}
              onChange={(e) =>
                setLocalData({
                  ...localData,
                  header: { ...localData.header, email: e.target.value },
                })
              }
            />
            <Input
              placeholder="Phone"
              value={localData.header.phone}
              onChange={(e) =>
                setLocalData({
                  ...localData,
                  header: { ...localData.header, phone: e.target.value },
                })
              }
            />
            <Input
              placeholder="Location"
              value={localData.header.location}
              onChange={(e) =>
                setLocalData({
                  ...localData,
                  header: { ...localData.header, location: e.target.value },
                })
              }
            />
          </div>
        )

      case "summary":
        return (
          <Textarea
            placeholder="Professional summary..."
            value={localData.summary}
            onChange={(e) => setLocalData({ ...localData, summary: e.target.value })}
            rows={6}
          />
        )

      case "skills":
        return (
          <div className="space-y-3">
            {localData.skills.map((skill, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={skill}
                  onChange={(e) => {
                    const newSkills = [...localData.skills]
                    newSkills[i] = e.target.value
                    setLocalData({ ...localData, skills: newSkills })
                  }}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const newSkills = localData.skills.filter((_, idx) => idx !== i)
                    setLocalData({ ...localData, skills: newSkills })
                  }}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setLocalData({ ...localData, skills: [...localData.skills, ""] })}
            >
              <Plus size={14} className="mr-1" /> Add Skill
            </Button>
          </div>
        )

      case "experience":
        return (
          <div className="space-y-4">
            {localData.experience.map((exp, i) => (
              <div key={exp.id} className="border border-border rounded-lg p-4 space-y-2">
                <Input
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => {
                    const newExp = [...localData.experience]
                    newExp[i].company = e.target.value
                    setLocalData({ ...localData, experience: newExp })
                  }}
                />
                <Input
                  placeholder="Role"
                  value={exp.role}
                  onChange={(e) => {
                    const newExp = [...localData.experience]
                    newExp[i].role = e.target.value
                    setLocalData({ ...localData, experience: newExp })
                  }}
                />
                <Textarea
                  placeholder="Description"
                  value={exp.description}
                  onChange={(e) => {
                    const newExp = [...localData.experience]
                    newExp[i].description = e.target.value
                    setLocalData({ ...localData, experience: newExp })
                  }}
                  rows={3}
                />
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setLocalData({
                  ...localData,
                  experience: [
                    ...localData.experience,
                    {
                      id: generateId(),
                      company: "",
                      role: "",
                      startDate: "",
                      endDate: "",
                      current: false,
                      description: "",
                    },
                  ],
                })
              }}
            >
              <Plus size={14} className="mr-1" /> Add Experience
            </Button>
          </div>
        )

      case "education":
        return (
          <div className="space-y-4">
            {localData.education.map((edu, i) => (
              <div key={edu.id} className="border border-border rounded-lg p-4 space-y-2">
                <Input
                  placeholder="School"
                  value={edu.school}
                  onChange={(e) => {
                    const newEdu = [...localData.education]
                    newEdu[i].school = e.target.value
                    setLocalData({ ...localData, education: newEdu })
                  }}
                />
                <Input
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => {
                    const newEdu = [...localData.education]
                    newEdu[i].degree = e.target.value
                    setLocalData({ ...localData, education: newEdu })
                  }}
                />
                <Input
                  placeholder="Field"
                  value={edu.field}
                  onChange={(e) => {
                    const newEdu = [...localData.education]
                    newEdu[i].field = e.target.value
                    setLocalData({ ...localData, education: newEdu })
                  }}
                />
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setLocalData({
                  ...localData,
                  education: [
                    ...localData.education,
                    {
                      id: generateId(),
                      school: "",
                      degree: "",
                      field: "",
                      graduationDate: "",
                      gpa: "",
                    },
                  ],
                })
              }}
            >
              <Plus size={14} className="mr-1" /> Add Education
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-lg capitalize">{section}</h2>
      <div className="space-y-4">{renderEditor()}</div>
      <Button onClick={handleSave} className="w-full">
        Save Changes
      </Button>
    </div>
  )
}
