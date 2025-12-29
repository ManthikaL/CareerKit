"use client"

import { useState } from "react"
import { storage } from "../../lib/storage"
import type { ATSHistoryItem, ATSResponse } from "../../types"
import { atsApi } from "../../lib/atsApi"
import ATSInput from "./ats-input"
import ATSResults from "./ats-results"
import ATSHistory from "./ats-history"
import { generateId } from "../../lib/utils"

type ATSMode = "about" | "improve" | "match" | "tailor" | "generate"

export default function ATSAnalyzer() {
  const [jobDescription, setJobDescription] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [results, setResults] = useState<ATSResponse | null>(null)
  const [activeMode, setActiveMode] = useState<ATSMode | null>(null)
  const [history, setHistory] = useState<ATSHistoryItem[]>(storage.getATSHistory())
  const [showHistory, setShowHistory] = useState(false)

  const handleAnalyze = async (mode: ATSMode) => {
    setError("")
    setResults(null)

    // Validation
    if (!jobDescription.trim() || jobDescription.length < 20) {
      setError("Job description must be at least 20 characters")
      return
    }

    if (mode !== "generate" && !resumeFile) {
      setError("Please upload a resume PDF for this analysis")
      return
    }

    if (resumeFile && resumeFile.size > 10 * 1024 * 1024) {
      setError("Resume file must be less than 10MB")
      return
    }

    if (resumeFile && resumeFile.type !== "application/pdf") {
      setError("Please upload a PDF file")
      return
    }

    setLoading(true)
    setActiveMode(mode)

    try {
      let response: ATSResponse

      if (mode === "about") {
        response = await atsApi.aboutATS(jobDescription, resumeFile!)
      } else if (mode === "improve") {
        response = await atsApi.improveATS(jobDescription, resumeFile!)
      } else if (mode === "match") {
        response = await atsApi.matchATS(jobDescription, resumeFile!)
      } else if (mode === "tailor") {
        response = await atsApi.tailorATS(jobDescription, resumeFile!)
      } else {
        // generate mode - no resume required
        response = await atsApi.generateATS(jobDescription)
      }

      setResults(response)

      // Save to history
      const historyItem: ATSHistoryItem = {
        id: generateId(),
        mode,
        jobDescription,
        resultText: response.resultText,
        matchPercentage: response.matchPercentage,
        missingKeywords: response.missingKeywords,
        createdAt: new Date().toISOString(),
      }
      const newHistory = [historyItem, ...history]
      setHistory(newHistory)
      storage.addATSHistory(historyItem)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Please check the API connection.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">ATS Resume Analyzer</h1>
        <p className="text-muted-foreground">Analyze your resume against job descriptions using AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Inputs */}
        <div className="lg:col-span-2">
          <ATSInput
            jobDescription={jobDescription}
            resumeFile={resumeFile}
            loading={loading}
            error={error}
            onJobDescriptionChange={setJobDescription}
            onResumeFileChange={setResumeFile}
            onAnalyze={handleAnalyze}
            results={results}
          />
        </div>

        {/* Right: Results & History */}
        <div className="lg:col-span-1">
          {results && activeMode ? (
            <ATSResults results={results} mode={activeMode} />
          ) : (
            <div className="bg-card rounded-lg p-6 border border-border h-full flex flex-col items-center justify-center text-center">
              <p className="text-muted-foreground text-sm">Run an analysis to see results here</p>
            </div>
          )}

          {/* History Toggle */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full mt-6 px-4 py-2 text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
          >
            {showHistory ? "Hide" : "Show"} History ({history.length})
          </button>

          {showHistory && history.length > 0 && <ATSHistory history={history} />}
        </div>
      </div>
    </div>
  )
}
