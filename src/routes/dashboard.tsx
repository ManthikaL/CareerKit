import { Link } from "@tanstack/react-router"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { ArrowRight } from "lucide-react"
import { storage } from "../lib/storage"
import { calculateResumeCompletion } from "../lib/utils"

export default function Dashboard() {
  const resumes = storage.getResumes()
  const applications = storage.getApplications()
  const decks = storage.getDecks()

  let resumeCompletion = 0
  if (resumes.length > 0) {
    const resume = storage.getResume(resumes[0])
    resumeCompletion = calculateResumeCompletion(resume)
  }

  const pipelineCount = applications.length
  const todayReviews = 3

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">Track your career journey</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-2">Resume Completion</div>
          <div className="text-3xl font-bold mb-2">{resumeCompletion}%</div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${resumeCompletion}%` }} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-2">Pipeline</div>
          <div className="text-3xl font-bold">{pipelineCount}</div>
          <p className="text-sm text-muted-foreground mt-2">applications</p>
        </Card>

        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-2">Today's Reviews</div>
          <div className="text-3xl font-bold">{todayReviews}</div>
          <p className="text-sm text-muted-foreground mt-2">flashcards</p>
        </Card>

        <Card className="p-6">
          <div className="text-sm text-muted-foreground mb-2">ATS Score</div>
          <div className="text-3xl font-bold">-</div>
          <p className="text-sm text-muted-foreground mt-2">run analyzer</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/resume">
            <Button className="w-full bg-transparent" variant="outline">
              Create Resume <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
          <Link to="/tracker">
            <Button className="w-full bg-transparent" variant="outline">
              Add Application <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
          <Link to="/study/review">
            <Button className="w-full bg-transparent" variant="outline">
              Start Review <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
          <Link to="/ats">
            <Button className="w-full bg-transparent" variant="outline">
              Run ATS Match <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
