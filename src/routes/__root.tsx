"use client"

import { Outlet } from "@tanstack/react-router"
import Sidebar from "../components/sidebar"
import TopBar from "../components/top-bar"
import { ThemeProvider, useTheme } from "../hooks/use-theme"
import { useLayoutEffect } from "react"

function RootLayoutContent() {
  const { theme } = useTheme()

  useLayoutEffect(() => {
    const html = document.documentElement
    if (theme === "dark") {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }
  }, [theme])

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  )
}
