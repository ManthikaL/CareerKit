"use client"

import type { ResumeData } from "../../types"

export default function ResumeCanvas({ resume }: { resume: ResumeData }) {
  const templateStyles = {
    modern: { fontSize: "base", spacing: "spacious", color: "text-blue-600" },
    minimal: { fontSize: "sm", spacing: "compact", color: "text-gray-600" },
    compact: { fontSize: "xs", spacing: "tight", color: "text-gray-700" },
  }

  const style = templateStyles[resume.template]

  return (
    <div className="bg-white text-black p-12 shadow-lg rounded-lg my-8 font-serif" style={{ aspectRatio: "8.5/11" }}>
      {/* Header */}
      <div className="mb-6 text-center border-b-2 pb-4">
        <h1 className={`text-3xl font-bold ${style.color}`}>{resume.header.fullName}</h1>
        <div className="text-xs mt-2 space-x-2">
          {resume.header.email && <span>{resume.header.email}</span>}
          {resume.header.phone && <span>•</span>}
          {resume.header.phone && <span>{resume.header.phone}</span>}
          {resume.header.location && <span>•</span>}
          {resume.header.location && <span>{resume.header.location}</span>}
        </div>
        {resume.header.links.length > 0 && (
          <div className="text-xs mt-1 space-x-1">
            {resume.header.links.map((link, i) => (
              <span key={i}>
                {i > 0 && <span>•</span>} {link.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {resume.summary && (
        <div className="mb-4">
          <h2 className={`text-sm font-bold ${style.color} mb-2`}>PROFESSIONAL SUMMARY</h2>
          <p className="text-xs leading-tight">{resume.summary}</p>
        </div>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <div className="mb-4">
          <h2 className={`text-sm font-bold ${style.color} mb-1`}>SKILLS</h2>
          <div className="text-xs flex flex-wrap gap-1">
            {resume.skills.map((skill, i) => (
              <span key={i}>
                {i > 0 && <span className="mx-0.5">•</span>}
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <div className="mb-4">
          <h2 className={`text-sm font-bold ${style.color} mb-2`}>EXPERIENCE</h2>
          <div className="space-y-2">
            {resume.experience.map((exp) => (
              <div key={exp.id} className="text-xs">
                <div className="flex justify-between font-semibold">
                  <span>{exp.role}</span>
                  <span>{exp.startDate}</span>
                </div>
                <div className="font-medium text-gray-600">{exp.company}</div>
                <p className="text-gray-700 mt-0.5">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <div className="mb-4">
          <h2 className={`text-sm font-bold ${style.color} mb-2`}>PROJECTS</h2>
          <div className="space-y-2">
            {resume.projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="font-semibold">{proj.name}</div>
                <p className="text-gray-700">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-4">
          <h2 className={`text-sm font-bold ${style.color} mb-2`}>EDUCATION</h2>
          <div className="space-y-1">
            {resume.education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="font-semibold">
                  {edu.degree} in {edu.field}
                </div>
                <div className="text-gray-600">{edu.school}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
