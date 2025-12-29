"use client"

import type { Application } from "../../types"
import { getStatusColor } from "../../lib/utils"

interface TrackerColumnProps {
  status: string
  applications: Application[]
  onMoveCard: (appId: string, newStatus: string) => void
  onEditCard: (app: Application) => void
  onDeleteCard: (appId: string) => void
}

const statusLabels: Record<string, string> = {
  saved: "Saved",
  applied: "Applied",
  oa: "Online Assessment",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
}

export default function TrackerColumn({ status, applications, onEditCard, onDeleteCard }: TrackerColumnProps) {
  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-secondary rounded-lg p-4 h-full flex flex-col">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <span className="capitalize">{statusLabels[status]}</span>
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
            {applications.length}
          </span>
        </h2>

        <div className="space-y-3 overflow-y-auto flex-1">
          {applications.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">No applications</div>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="bg-card rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onEditCard(app)}
              >
                <div className="font-semibold text-sm mb-1">{app.companyName}</div>
                <div className="text-xs text-muted-foreground mb-2">{app.roleTitle}</div>
                {app.appliedDate && (
                  <div className="text-xs text-muted-foreground mb-3">
                    Applied: {new Date(app.appliedDate).toLocaleDateString()}
                  </div>
                )}

                {/* Tags */}
                {app.tags.length > 0 && (
                  <div className="flex gap-1 mb-3 flex-wrap">
                    {app.tags.map((tag) => (
                      <span key={tag} className={`text-xs px-2 py-1 rounded ${getStatusColor(tag)}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteCard(app.id)
                  }}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
