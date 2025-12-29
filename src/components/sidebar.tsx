"use client"

import { Link } from "@tanstack/react-router"
import { FileText, Briefcase, BookOpen, Zap, Settings, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "../lib/utils"

const navItems = [
  { icon: FileText, label: "Dashboard", to: "/" },
  { icon: FileText, label: "Resume", to: "/resume" },
  { icon: Briefcase, label: "Tracker", to: "/tracker" },
  { icon: BookOpen, label: "Study", to: "/study" },
  { icon: Zap, label: "ATS Analyzer", to: "/ats" },
  { icon: Settings, label: "Settings", to: "/settings" },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-primary-foreground"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed md:relative w-64 h-screen bg-sidebar border-r border-border flex flex-col transition-all duration-300 z-40",
          open ? "left-0" : "-left-64 md:left-0",
        )}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">CareerKit</h1>
        </div>

        <nav className="flex-1 px-3 space-y-2">
          {navItems.map(({ icon: Icon, label, to }) => (
            <Link
              key={to}
              to={to}
              activeProps={{
                className: "bg-primary text-primary-foreground",
              }}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-medium"
              onClick={() => setOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile overlay */}
      {open && <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setOpen(false)} />}
    </>
  )
}
