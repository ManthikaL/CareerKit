"use client"

import { storage } from "../lib/storage"
import { formatDate } from "../lib/utils"

export default function TrackerCalendar() {
  const applications = storage.getApplications()

  const upcomingInterviews = applications
    .filter((app) => app.status === "interview" && app.nextReminderDate)
    .sort((a, b) => new Date(a.nextReminderDate).getTime() - new Date(b.nextReminderDate).getTime())

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Calendar</h1>
        <p className="text-muted-foreground">Upcoming interviews and reminders</p>
      </div>

      <div className="bg-card rounded-lg p-6">
        <h2 className="font-bold text-lg mb-4">Upcoming Interviews</h2>
        {upcomingInterviews.length === 0 ? (
          <p className="text-muted-foreground">No upcoming interviews scheduled</p>
        ) : (
          <div className="space-y-3">
            {upcomingInterviews.map((app) => (
              <div key={app.id} className="flex justify-between items-start p-4 bg-secondary rounded-lg">
                <div>
                  <h3 className="font-semibold">{app.companyName}</h3>
                  <p className="text-sm text-muted-foreground">{app.roleTitle}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatDate(app.nextReminderDate)}</p>
                  <p className="text-xs text-muted-foreground capitalize">{app.reminderType}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
