"use client"

import { Link } from "@tanstack/react-router"
import { Calendar, BarChart3 } from "lucide-react"
import { Button } from "../components/ui/button"
import TrackerBoard from "../features/tracker/tracker-board"

export default function TrackerPage() {
  return (
    <div>
      <div className="bg-gradient-to-b from-primary/10 to-transparent p-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Application Tracker</h1>
          <p className="text-muted-foreground mt-2">Manage your job and internship applications</p>
        </div>
        <div className="flex gap-2">
          <Link to="/tracker/calendar">
            <Button variant="outline" className="bg-transparent">
              <Calendar size={16} className="mr-2" />
              Calendar
            </Button>
          </Link>
          <Link to="/tracker/analytics">
            <Button variant="outline" className="bg-transparent">
              <BarChart3 size={16} className="mr-2" />
              Analytics
            </Button>
          </Link>
        </div>
      </div>
      <TrackerBoard />
    </div>
  )
}
