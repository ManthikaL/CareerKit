import { generateId } from "./utils"
import { storage } from "./storage"
import type { ResumeData, Application, Deck, Flashcard } from "../types"

export function seedDemoData() {
  // Check if already seeded
  if (storage.getResumes().length > 0) return

  // Seed resume
  const resumeId = generateId()
  const defaultResume: ResumeData = {
    id: resumeId,
    header: {
      fullName: "Alex Johnson",
      email: "alex.johnson@email.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      links: [
        { label: "GitHub", url: "https://github.com/alexjohnson" },
        { label: "LinkedIn", url: "https://linkedin.com/in/alexjohnson" },
      ],
    },
    summary:
      "Computer Science student passionate about full-stack development and scalable systems. Seeking internships in SWE or data engineering.",
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "PostgreSQL", "AWS"],
    experience: [
      {
        id: generateId(),
        company: "TechStartup Inc.",
        role: "Frontend Engineering Intern",
        startDate: "2024-06",
        endDate: "2024-08",
        current: false,
        description:
          "Built responsive React components and improved page load times by 30%. Collaborated with design team on UI improvements.",
      },
    ],
    projects: [
      {
        id: generateId(),
        name: "CareerKit",
        description: "All-in-one career management platform for students",
        technologies: ["React", "TypeScript", "TailwindCSS"],
        link: "https://github.com/alexjohnson/careerkit",
      },
    ],
    education: [
      {
        id: generateId(),
        school: "State University",
        degree: "Bachelor of Science",
        field: "Computer Science",
        graduationDate: "2025-05",
        gpa: "3.8",
      },
    ],
    certifications: ["AWS Certified Cloud Practitioner"],
    template: "modern",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  storage.setResume(resumeId, defaultResume)

  // Seed applications
  const applications: Application[] = [
    {
      id: generateId(),
      companyName: "Google",
      roleTitle: "Software Engineer Intern",
      location: "Mountain View, CA",
      status: "interview",
      appliedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      link: "https://google.com/careers",
      salaryRange: "$25/hour",
      notes: "Focus on algorithms and system design",
      contacts: [{ name: "Sarah Chen", email: "sarah.chen@google.com" }],
      nextReminderDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      reminderType: "email",
      tags: ["internship"],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      companyName: "Meta",
      roleTitle: "Data Engineer Intern",
      location: "Menlo Park, CA",
      status: "applied",
      appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      link: "https://meta.com/careers",
      salaryRange: "$28/hour",
      notes: "Waiting for phone screen",
      contacts: [],
      nextReminderDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      reminderType: "email",
      tags: ["internship", "remote"],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  storage.setApplications(applications)

  // Seed decks
  const deckId = generateId()
  const deck: Deck = {
    id: deckId,
    name: "System Design Basics",
    description: "Fundamental concepts for system design interviews",
    cardCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  storage.setDecks([deck])

  const flashcards: Flashcard[] = [
    {
      id: generateId(),
      deckId,
      front: "What is a load balancer?",
      back: "A load balancer distributes incoming network traffic across multiple servers to optimize resource usage and maximize throughput.",
      nextReviewAt: new Date().toISOString(),
      intervalDays: 1,
      ease: 2.5,
      reviewCount: 0,
    },
    {
      id: generateId(),
      deckId,
      front: "Explain caching strategies",
      back: "LRU, FIFO, LFU are common caching strategies. LRU evicts least recently used items. FIFO is simpler but less optimal. LFU tracks frequency of access.",
      nextReviewAt: new Date().toISOString(),
      intervalDays: 1,
      ease: 2.5,
      reviewCount: 0,
    },
  ]

  storage.setFlashcards(deckId, flashcards)
}
