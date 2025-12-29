const VERSION = "v1"

function getKey(key: string): string {
  return `careerkit.${VERSION}.${key}`
}

export const storage = {
  // Resume
  getResumes: (): string[] => {
    const data = localStorage.getItem(getKey("resumes"))
    return data ? JSON.parse(data) : []
  },
  setResume: (id: string, resume: any) => {
    localStorage.setItem(getKey(`resume.${id}`), JSON.stringify(resume))
    const ids = storage.getResumes()
    if (!ids.includes(id)) {
      localStorage.setItem(getKey("resumes"), JSON.stringify([...ids, id]))
    }
  },
  getResume: (id: string): any => {
    const data = localStorage.getItem(getKey(`resume.${id}`))
    return data ? JSON.parse(data) : null
  },

  // Applications
  getApplications: (): any[] => {
    const data = localStorage.getItem(getKey("applications"))
    return data ? JSON.parse(data) : []
  },
  setApplications: (apps: any[]) => {
    localStorage.setItem(getKey("applications"), JSON.stringify(apps))
  },

  // Notes
  getNotes: (): any[] => {
    const data = localStorage.getItem(getKey("notes"))
    return data ? JSON.parse(data) : []
  },
  setNotes: (notes: any[]) => {
    localStorage.setItem(getKey("notes"), JSON.stringify(notes))
  },

  // Decks
  getDecks: (): any[] => {
    const data = localStorage.getItem(getKey("decks"))
    return data ? JSON.parse(data) : []
  },
  setDecks: (decks: any[]) => {
    localStorage.setItem(getKey("decks"), JSON.stringify(decks))
  },
  getFlashcards: (deckId: string): any[] => {
    const data = localStorage.getItem(getKey(`flashcards.${deckId}`))
    return data ? JSON.parse(data) : []
  },
  setFlashcards: (deckId: string, cards: any[]) => {
    localStorage.setItem(getKey(`flashcards.${deckId}`), JSON.stringify(cards))
  },

  // ATS History
  getATSHistory: (): any[] => {
    const data = localStorage.getItem(getKey("ats.history"))
    return data ? JSON.parse(data) : []
  },
  addATSHistory: (item: any) => {
    const history = storage.getATSHistory()
    localStorage.setItem(getKey("ats.history"), JSON.stringify([item, ...history]))
  },

  // Theme
  getTheme: (): "light" | "dark" => {
    return (localStorage.getItem(getKey("theme")) as any) || "light"
  },
  setTheme: (theme: "light" | "dark") => {
    localStorage.setItem(getKey("theme"), theme)
  },

  // Clear all
  reset: () => {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith("careerkit.")) {
        localStorage.removeItem(key)
      }
    })
  },
}
