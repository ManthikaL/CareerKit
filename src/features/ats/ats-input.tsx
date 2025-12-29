"use client"

import { Textarea } from "../../components/ui/textarea"
import { Button } from "../../components/ui/button"
import { Upload, AlertCircle } from "lucide-react"

interface ATSInputProps {
  jobDescription: string
  resumeFile: File | null
  loading: boolean
  error: string
  onJobDescriptionChange: (value: string) => void
  onResumeFileChange: (file: File | null) => void
  onAnalyze: (mode: "about" | "improve" | "match" | "tailor" | "generate") => void
  results: any | null
}

export default function ATSInput({
  jobDescription,
  resumeFile,
  loading,
  error,
  onJobDescriptionChange,
  onResumeFileChange,
  onAnalyze,
}: ATSInputProps) {
  return (
    <div className="space-y-6">
      {/* Job Description */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <label className="text-sm font-semibold mb-3 block">Job Description</label>
        <Textarea
          placeholder="Paste the job description here (minimum 20 characters)..."
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          rows={8}
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground mt-2">{jobDescription.length} characters</p>
      </div>

      {/* Resume Upload */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <label className="text-sm font-semibold mb-3 block">Resume (PDF)</label>
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => onResumeFileChange(e.target.files?.[0] || null)}
            disabled={loading}
            className="hidden"
            id="resume-upload"
          />
          <label htmlFor="resume-upload" className="cursor-pointer">
            <Upload size={32} className="mx-auto mb-3 text-muted-foreground" />
            <p className="font-medium">{resumeFile ? resumeFile.name : "Click or drag PDF here"}</p>
            <p className="text-xs text-muted-foreground mt-1">Maximum 10MB</p>
          </label>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Analysis Buttons */}
      <div className="space-y-2">
        <p className="text-sm font-semibold">Select Analysis Type</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => onAnalyze("about")}
            disabled={loading || !jobDescription.trim() || !resumeFile}
            variant="outline"
            className="bg-transparent text-xs"
          >
            {loading ? "Analyzing..." : "About Resume"}
          </Button>
          <Button
            onClick={() => onAnalyze("improve")}
            disabled={loading || !jobDescription.trim() || !resumeFile}
            variant="outline"
            className="bg-transparent text-xs"
          >
            {loading ? "Analyzing..." : "Improve Skills"}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => onAnalyze("match")}
            disabled={loading || !jobDescription.trim() || !resumeFile}
            variant="outline"
            className="bg-transparent text-xs"
          >
            {loading ? "Analyzing..." : "% Match"}
          </Button>
          <Button
            onClick={() => onAnalyze("tailor")}
            disabled={loading || !jobDescription.trim() || !resumeFile}
            variant="outline"
            className="bg-transparent text-xs"
          >
            {loading ? "Analyzing..." : "Tailor Resume"}
          </Button>
        </div>
        <Button
          onClick={() => onAnalyze("generate")}
          disabled={loading || !jobDescription.trim()}
          variant="outline"
          className="bg-transparent w-full text-xs"
        >
          {loading ? "Generating..." : "Generate Resume"}
        </Button>
      </div>
    </div>
  )
}
