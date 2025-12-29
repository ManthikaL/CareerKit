"use client"

import { useState } from "react"
import { storage } from "../../lib/storage"
import type { Deck } from "../../types"
import NotesList from "./notes-list"
import DecksView from "./decks-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"

export default function StudyHub() {
  const [activeTab, setActiveTab] = useState("notes")
  const [decks] = useState<Deck[]>(storage.getDecks())

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Study Hub</h1>
        <p className="text-muted-foreground">Manage notes and flashcards for spaced repetition learning</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="decks">Flashcards</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="mt-6">
          <NotesList />
        </TabsContent>

        <TabsContent value="decks" className="mt-6">
          <DecksView />
        </TabsContent>
      </Tabs>
    </div>
  )
}
