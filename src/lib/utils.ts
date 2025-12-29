import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function calculateResumeCompletion(resume: any): number {
  let completed = 0
  const fields = [
    resume.header?.fullName,
    resume.header?.email,
    resume.summary,
    resume.skills.length > 0,
    resume.experience.length > 0,
    resume.education.length > 0,
  ]
  completed = fields.filter(Boolean).length
  return Math.round((completed / fields.length) * 100)
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    saved: "bg-slate-100 text-slate-800",
    applied: "bg-blue-100 text-blue-800",
    oa: "bg-purple-100 text-purple-800",
    interview: "bg-orange-100 text-orange-800",
    offer: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  }
  return colors[status] || colors.saved
}
