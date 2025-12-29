"use client"

import { storage } from "../lib/storage"

export default function TrackerAnalytics() {
  const applications = storage.getApplications()

  const statusCounts = {
    saved: applications.filter((a) => a.status === "saved").length,
    applied: applications.filter((a) => a.status === "applied").length,
    oa: applications.filter((a) => a.status === "oa").length,
    interview: applications.filter((a) => a.status === "interview").length,
    offer: applications.filter((a) => a.status === "offer").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  }

  const totalApplications = applications.length
  const responseRate =
    totalApplications > 0 ? ((statusCounts.offer + statusCounts.interview) / totalApplications) * 100 : 0

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">Pipeline statistics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Applications</p>
          <p className="text-3xl font-bold">{totalApplications}</p>
        </div>
        <div className="bg-card rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Response Rate</p>
          <p className="text-3xl font-bold">{responseRate.toFixed(1)}%</p>
        </div>
        <div className="bg-card rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Active Offers</p>
          <p className="text-3xl font-bold">{statusCounts.offer}</p>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6">
        <h2 className="font-bold text-lg mb-4">Pipeline Status</h2>
        <div className="space-y-3">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="flex justify-between items-center">
              <span className="capitalize font-medium">{status}</span>
              <div className="flex items-center gap-4">
                <div className="w-40 bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${totalApplications > 0 ? (count / totalApplications) * 100 : 0}%` }}
                  />
                </div>
                <span className="font-bold text-lg w-8 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
