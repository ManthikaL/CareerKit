"use client"

import type { ATSHistoryItem } from "../../types"
import { Trash2 } from "lucide-react"

interface ATSHistoryProps {
  history: ATSHistoryItem[]
}

export default function ATSHistory({ history }: ATSHistoryProps) {
  const handleDeleteHistoryItem = (id: string) => {
    // In a real app, we'd have a delete method in storage
    // For now, we'll just show a message
    alert("Delete history item feature coming soon")
  }

  return (
    <div className="bg-card rounded-lg p-4 border border-border mt-4 space-y-3 max-h-96 overflow-y-auto">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Analysis History</p>
      {history.slice(0, 10).map((item) => (
        <div key={item.id} className="bg-secondary rounded p-3 text-xs space-y-1 group">
          <div className="flex justify-between items-start">
            <p className="font-semibold capitalize">{item.mode}</p>
            <button
              onClick={() => handleDeleteHistoryItem(item.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={12} className="text-red-600" />
            </button>
          </div>
          <p className="text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</p>
          {item.matchPercentage !== null && <p className="font-semibold text-primary">{item.matchPercentage}% match</p>}
        </div>
      ))}
    </div>
  )
}
