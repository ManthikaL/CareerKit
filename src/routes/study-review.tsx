"use client"

import { useState, useEffect } from "react"
import { Link } from "@tanstack/react-router"
import { storage } from "../lib/storage"
import type { Flashcard } from "../types"
import { Button } from "../components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function StudyReview() {
  const decks = storage.getDecks()
  const [allCards, setAllCards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [statsData, setStatsData] = useState({ dueCards: 0, completedToday: 0, streak: 0 })

  useEffect(() => {
    // Gather all due cards
    const now = new Date()
    const cardPool: Flashcard[] = []

    decks.forEach((deck) => {
      const cards = storage.getFlashcards(deck.id)
      cards.forEach((card) => {
        if (new Date(card.nextReviewAt) <= now) {
          cardPool.push(card)
        }
      })
    })

    setAllCards(cardPool)
    setStatsData({
      dueCards: cardPool.length,
      completedToday: 0,
      streak: 0,
    })
  }, [])

  const handleResponse = (difficulty: "again" | "hard" | "good" | "easy") => {
    const card = allCards[currentIndex]
    let newIntervalDays = card.intervalDays
    let newEase = card.ease

    // SM-2 algorithm
    if (difficulty === "again") {
      newIntervalDays = 1
      newEase = Math.max(1.3, newEase - 0.2)
    } else if (difficulty === "hard") {
      newIntervalDays = Math.ceil(card.intervalDays * 1.2)
      newEase = Math.max(1.3, newEase - 0.15)
    } else if (difficulty === "good") {
      newIntervalDays = Math.ceil(card.intervalDays * newEase)
    } else if (difficulty === "easy") {
      newIntervalDays = Math.ceil(card.intervalDays * newEase * 1.3)
      newEase = newEase + 0.1
    }

    const nextReviewDate = new Date()
    nextReviewDate.setDate(nextReviewDate.getDate() + newIntervalDays)

    const updatedCard: Flashcard = {
      ...card,
      nextReviewAt: nextReviewDate.toISOString(),
      intervalDays: newIntervalDays,
      ease: newEase,
      reviewCount: card.reviewCount + 1,
    }

    // Update in storage
    const deckId = card.deckId
    const cards = storage.getFlashcards(deckId)
    const updated = cards.map((c) => (c.id === card.id ? updatedCard : c))
    storage.setFlashcards(deckId, updated)

    // Move to next card
    const newIndex = currentIndex + 1
    if (newIndex >= allCards.length) {
      // Session complete
      alert("Great work! All due cards completed.")
      setCurrentIndex(0)
    } else {
      setCurrentIndex(newIndex)
      setIsFlipped(false)
    }
  }

  if (allCards.length === 0) {
    return (
      <div className="p-8">
        <Link to="/study">
          <Button variant="outline" className="mb-6 bg-transparent">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </Link>

        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">All caught up!</h1>
          <p className="text-muted-foreground mb-6">No flashcards due for review right now.</p>
          <Link to="/study">
            <Button>Return to Study Hub</Button>
          </Link>
        </div>
      </div>
    )
  }

  const card = allCards[currentIndex]
  const progress = ((currentIndex + 1) / allCards.length) * 100

  return (
    <div className="p-8">
      <Link to="/study">
        <Button variant="outline" className="mb-6 bg-transparent">
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
      </Link>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <h1 className="text-2xl font-bold">Review Session</h1>
          <p className="text-muted-foreground">
            {currentIndex + 1} / {allCards.length}
          </p>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Card */}
      <div className="max-w-2xl mx-auto">
        <div
          className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-lg p-12 mb-8 cursor-pointer min-h-80 flex flex-col items-center justify-center transition-all duration-300"
          onClick={() => setIsFlipped(!isFlipped)}
          style={{
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <p className="text-xs text-primary-foreground/70 mb-4 uppercase tracking-widest">
            {isFlipped ? "Answer" : "Question"}
          </p>
          <p className="text-3xl font-bold text-center mb-8">{isFlipped ? card.back : card.front}</p>
          <p className="text-sm text-primary-foreground/70">
            Click to {isFlipped ? "reveal question" : "reveal answer"}
          </p>
        </div>

        {/* Response Buttons */}
        {isFlipped && (
          <div className="grid grid-cols-4 gap-3">
            <Button variant="destructive" onClick={() => handleResponse("again")}>
              Again
            </Button>
            <Button variant="outline" className="bg-transparent" onClick={() => handleResponse("hard")}>
              Hard
            </Button>
            <Button onClick={() => handleResponse("good")}>Good</Button>
            <Button variant="secondary" onClick={() => handleResponse("easy")}>
              Easy
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
