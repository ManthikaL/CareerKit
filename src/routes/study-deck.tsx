"use client"

import { useParams, Link } from "@tanstack/react-router"
import { storage } from "../lib/storage"
import type { Flashcard } from "../types"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Plus, ArrowLeft, Trash2 } from "lucide-react"
import { useState } from "react"
import { generateId } from "../lib/utils"

export default function StudyDeck() {
  const { deckId } = useParams({ from: "/study/decks/$deckId" })
  const deck = storage.getDecks().find((d) => d.id === deckId)
  const [cards, setCards] = useState<Flashcard[]>(storage.getFlashcards(deckId))
  const [addingCard, setAddingCard] = useState(false)
  const [front, setFront] = useState("")
  const [back, setBack] = useState("")

  if (!deck) {
    return <div className="p-8">Deck not found</div>
  }

  const handleAddCard = () => {
    if (!front.trim() || !back.trim()) {
      alert("Please fill in both sides")
      return
    }

    const newCard: Flashcard = {
      id: generateId(),
      deckId,
      front,
      back,
      nextReviewAt: new Date().toISOString(),
      intervalDays: 1,
      ease: 2.5,
      reviewCount: 0,
    }

    const updated = [...cards, newCard]
    setCards(updated)
    storage.setFlashcards(deckId, updated)
    setFront("")
    setBack("")
    setAddingCard(false)
  }

  const handleDeleteCard = (cardId: string) => {
    const updated = cards.filter((c) => c.id !== cardId)
    setCards(updated)
    storage.setFlashcards(deckId, updated)
  }

  return (
    <div className="p-8">
      <Link to="/study">
        <Button variant="outline" className="mb-6 bg-transparent">
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{deck.name}</h1>
        <p className="text-muted-foreground">{deck.description}</p>
        <p className="text-sm text-muted-foreground mt-2">{cards.length} flashcards</p>
      </div>

      <div className="flex gap-4 mb-6">
        <Link to="/study/review" className="flex-1">
          <Button className="w-full">Start Review</Button>
        </Link>
        <Button variant="outline" onClick={() => setAddingCard(!addingCard)} className="bg-transparent">
          <Plus size={16} className="mr-2" />
          Add Card
        </Button>
      </div>

      {/* Add Card Form */}
      {addingCard && (
        <div className="bg-card rounded-lg p-6 mb-6 border border-border">
          <h2 className="font-bold mb-4">Add Flashcard</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Front</label>
              <Input placeholder="Question or prompt" value={front} onChange={(e) => setFront(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Back</label>
              <Input placeholder="Answer or response" value={back} onChange={(e) => setBack(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddCard} className="flex-1">
                Add Card
              </Button>
              <Button variant="outline" onClick={() => setAddingCard(false)} className="flex-1 bg-transparent">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cards List */}
      <div className="space-y-3">
        {cards.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No flashcards yet</p>
        ) : (
          cards.map((card) => (
            <div key={card.id} className="bg-card rounded-lg p-4 border border-border group">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Front</p>
                  <p className="font-medium">{card.front}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Back</p>
                  <p className="font-medium">{card.back}</p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteCard(card.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} className="text-red-600" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
