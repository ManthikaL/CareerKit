export interface ResumeData {
  id: string
  header: {
    fullName: string
    email: string
    phone: string
    location: string
    links: Array<{ label: string; url: string }>
  }
  summary: string
  skills: string[]
  experience: Array<{
    id: string
    company: string
    role: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>
  projects: Array<{
    id: string
    name: string
    description: string
    technologies: string[]
    link: string
  }>
  education: Array<{
    id: string
    school: string
    degree: string
    field: string
    graduationDate: string
    gpa: string
  }>
  certifications: string[]
  template: "modern" | "minimal" | "compact"
  createdAt: string
  updatedAt: string
}

export interface Application {
  id: string
  companyName: string
  roleTitle: string
  location: string
  status: "saved" | "applied" | "oa" | "interview" | "offer" | "rejected"
  appliedDate: string
  link: string
  salaryRange: string
  notes: string
  contacts: Array<{ name: string; email: string }>
  nextReminderDate: string
  reminderType: "call" | "email" | "linkedin" | "other"
  tags: Array<"remote" | "onsite" | "internship" | "fulltime">
  createdAt: string
}

export interface Note {
  id: string
  title: string
  content: string
  folder: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Flashcard {
  id: string
  deckId: string
  front: string
  back: string
  nextReviewAt: string
  intervalDays: number
  ease: number
  reviewCount: number
}

export interface Deck {
  id: string
  name: string
  description: string
  cardCount: number
  createdAt: string
  updatedAt: string
}

export interface ATSHistoryItem {
  id: string
  mode: "about" | "improve" | "match" | "tailor" | "generate"
  jobDescription: string
  resultText: string
  matchPercentage: number | null
  missingKeywords: string[] | null
  role?: string
  company?: string
  createdAt: string
}

export interface ATSResponse {
  mode: "about" | "improve" | "match" | "tailor" | "generate"
  resultText: string
  matchPercentage: number | null
  missingKeywords: string[] | null
}
