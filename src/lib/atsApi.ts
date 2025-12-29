import type { ATSResponse } from "../types"

const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_ATS_API_BASE_URL || "http://localhost:8000"
}

async function makeATSRequest(
  mode: "about" | "improve" | "match" | "tailor" | "generate",
  jobDescription: string,
  resumeFile?: File,
): Promise<ATSResponse> {
  const formData = new FormData()
  formData.append("job_description", jobDescription)
  if (resumeFile) {
    formData.append("resume", resumeFile)
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 90000)

  try {
    const API_BASE_URL = getApiBaseUrl()
    const response = await fetch(`${API_BASE_URL}/ats/${mode}`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout. Please try again.")
    }
    throw error
  }
}

export const atsApi = {
  getBaseUrl: (): string => {
    return getApiBaseUrl()
  },

  checkHealth: async (): Promise<boolean> => {
    try {
      const API_BASE_URL = getApiBaseUrl()
      const response = await fetch(`${API_BASE_URL}/health`, {
        signal: AbortSignal.timeout(5000),
      })
      return response.ok
    } catch {
      return false
    }
  },

  aboutATS: (jobDescription: string, resumeFile: File) => makeATSRequest("about", jobDescription, resumeFile),

  improveATS: (jobDescription: string, resumeFile: File) => makeATSRequest("improve", jobDescription, resumeFile),

  matchATS: (jobDescription: string, resumeFile: File) => makeATSRequest("match", jobDescription, resumeFile),

  tailorATS: (jobDescription: string, resumeFile: File) => makeATSRequest("tailor", jobDescription, resumeFile),

  generateATS: (jobDescription: string) => makeATSRequest("generate", jobDescription),
}
