"use client"

import { useTheme } from "../hooks/use-theme"
import { storage } from "../lib/storage"
import { atsApi } from "../lib/atsApi"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const [atsHealth, setATSHealth] = useState<boolean | null>(null)
  const [atsUrl, setAtsUrl] = useState<string>("http://localhost:8000")
  const [loading, setLoading] = useState(false)
  const [resetConfirm, setResetConfirm] = useState(false)

  useEffect(() => {
    const url = atsApi.getBaseUrl()
    setAtsUrl(url)
    checkATSHealth()
  }, [])

  const checkATSHealth = async () => {
    setLoading(true)
    try {
      const isHealthy = await atsApi.checkHealth()
      setATSHealth(isHealthy)
    } catch {
      setATSHealth(false)
    } finally {
      setLoading(false)
    }
  }

  const handleResetData = () => {
    if (!resetConfirm) {
      setResetConfirm(true)
      return
    }

    storage.reset()
    setResetConfirm(false)
    alert("All demo data has been reset!")
    window.location.reload()
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure your CareerKit experience</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Theme Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Theme</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium capitalize mb-1">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                theme === "dark" ? "bg-primary" : "bg-secondary"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  theme === "dark" ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </Card>

        {/* ATS Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">ATS Analyzer</h2>
          <div className="space-y-4">
            <div>
              <p className="font-medium mb-2">API Configuration</p>
              <div className="bg-secondary rounded-lg p-4 mb-4">
                <p className="text-sm font-mono text-muted-foreground break-all">{atsUrl}</p>
              </div>

              <div className="flex items-center gap-3">
                <div>
                  {atsHealth === null ? (
                    <span className="text-sm text-muted-foreground">Status unknown</span>
                  ) : atsHealth ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-sm text-green-600 font-medium">Connected</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="text-red-600" />
                      <span className="text-sm text-red-600 font-medium">Disconnected</span>
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={checkATSHealth}
                  disabled={loading}
                  className="bg-transparent"
                >
                  {loading ? "Checking..." : "Check Connection"}
                </Button>
              </div>

              {atsHealth === false && (
                <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                  <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-700">
                    <p className="font-semibold">Connection Error</p>
                    <p>Make sure your Python FastAPI backend is running at the configured URL.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Data Management */}
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Data Management</h2>
          <div className="space-y-4">
            <div>
              <p className="font-medium mb-2">Reset All Data</p>
              <p className="text-sm text-muted-foreground mb-4">
                Clear all resumes, applications, notes, flashcards, and ATS history. This action cannot be undone.
              </p>

              {resetConfirm && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-red-900 mb-3">Are you sure?</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="destructive" onClick={handleResetData} className="flex-1">
                      Yes, Delete Everything
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setResetConfirm(false)}
                      className="flex-1 bg-transparent"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {!resetConfirm && (
                <Button size="sm" variant="destructive" onClick={handleResetData}>
                  Reset Demo Data
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* About */}
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">About CareerKit</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>CareerKit</strong> is an all-in-one career management platform for Computer Science and Business
              Analyst students.
            </p>
            <p>Built with React, TypeScript, TailwindCSS, and TanStack Router.</p>
            <p className="text-xs">Version 1.0 • Local-first storage with dark/light mode support</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
