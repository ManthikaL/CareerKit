"use client"

import type { ATSResponse } from "../../types"
import { Button } from "../../components/ui/button"
import { Copy, Download } from "lucide-react"
import { useState } from "react"

interface ATSResultsProps {
  results: ATSResponse
  mode: string
}

export default function ATSResults({ results, mode }: ATSResultsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(results.resultText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([results.resultText], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `ats-results-${mode}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="bg-card rounded-lg p-6 border border-border space-y-4">
      <div>
        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">Analysis Type</p>
        <p className="font-bold capitalize">{mode} Analysis</p>
      </div>

      {/* Match Percentage */}
      {results.matchPercentage !== null && (
        <div>
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">Match Percentage</p>
          <div className="flex items-end gap-3">
            <div className="text-4xl font-bold text-primary">{results.matchPercentage}%</div>
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${results.matchPercentage}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Missing Keywords */}
      {results.missingKeywords && results.missingKeywords.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">Missing Keywords</p>
          <div className="flex flex-wrap gap-2">
            {results.missingKeywords.map((keyword, i) => (
              <span key={i} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Results Text */}
      <div>
        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">Results</p>
        <div className="bg-secondary rounded-lg p-4 max-h-60 overflow-y-auto">
          <p className="text-sm whitespace-pre-wrap">{results.resultText}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={handleCopy}
          className="flex-1 bg-transparent"
          variant="outline"
          className="bg-transparent"
        >
          <Copy size={14} className="mr-1" />
          {copied ? "Copied!" : "Copy"}
        </Button>
        <Button
          size="sm"
          onClick={handleDownload}
          className="flex-1 bg-transparent"
          variant="outline"
          className="bg-transparent"
        >
          <Download size={14} className="mr-1" />
          Download
        </Button>
      </div>
    </div>
  )
}
