"use client"

import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { storage } from "../../lib/storage"
import type { Deck } from "../../types"
import DeckModal from "./deck-modal"
import { Button } from "../../components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { generateId } from "../../lib/utils"

export default function DecksView() {
  const [decks, setDecks] = useState<Deck[]>(storage.getDecks())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null)

  const handleSaveDeck = (deck: Omit<Deck, "createdAt" | "updatedAt">) => {
    if (editingDeck) {
      const updated = decks.map((d) =>
        d.id === editingDeck.id ? { ...d, ...deck, updatedAt: new Date().toISOString() } : d,
      )
      setDecks(updated)
      storage.setDecks(updated)
    } else {
      const newDeck: Deck = {
        ...deck,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setDecks([newDeck, ...decks])
      storage.setDecks([newDeck, ...decks])
    }
    setIsModalOpen(false)
    setEditingDeck(null)
  }

  const handleDeleteDeck = (id: string) => {
    const updated = decks.filter((d) => d.id !== id)
    setDecks(updated)
    storage.setDecks(updated)
    // Also delete flashcards for this deck
    storage.setFlashcards(id, [])
  }

  return (
    <div className="space-y-6">
      <Button onClick={() => setIsModalOpen(true)}>
        <Plus size={16} className="mr-2" />
        Create Deck
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No decks yet. Create one to start studying!
          </div>
        ) : (
          decks.map((deck) => {
            const cards = storage.getFlashcards(deck.id)
            return (
              <div
                key={deck.id}
                className="bg-card rounded-lg p-6 border border-border group hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-1">{deck.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{deck.description}</p>

                <div className="mb-4">
                  <p className="text-2xl font-bold text-primary">{cards.length}</p>
                  <p className="text-xs text-muted-foreground">flashcards</p>
                </div>

                <div className="flex gap-2">
                  <Link to={`/study/decks/${deck.id}`} className="flex-1">
                    <Button size="sm" className="w-full">
                      Study
                    </Button>
                  </Link>
                  <button
                    onClick={() => handleDeleteDeck(deck.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-100 rounded"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      <DeckModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingDeck(null)
        }}
        onSubmit={handleSaveDeck}
        initialData={editingDeck || undefined}
      />
    </div>
  )
}
