import { RootRoute, Router, Route } from "@tanstack/react-router"
import RootLayout from "./routes/__root"
import Dashboard from "./routes/dashboard"
import ResumePage from "./routes/resume"
import ResumeTemplates from "./routes/resume-templates"
import ResumeShare from "./routes/resume-share"
import TrackerPage from "./routes/tracker"
import TrackerCalendar from "./routes/tracker-calendar"
import TrackerAnalytics from "./routes/tracker-analytics"
import StudyPage from "./routes/study"
import StudyDeck from "./routes/study-deck"
import StudyReview from "./routes/study-review"
import ATSPage from "./routes/ats"
import SettingsPage from "./routes/settings"

const rootRoute = new RootRoute({
  component: RootLayout,
})

const routes = [
  new Route({
    getParentRoute: () => rootRoute,
    path: "/",
    component: Dashboard,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/resume",
    component: ResumePage,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/resume/templates",
    component: ResumeTemplates,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/resume/share/$id",
    component: ResumeShare,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/tracker",
    component: TrackerPage,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/tracker/calendar",
    component: TrackerCalendar,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/tracker/analytics",
    component: TrackerAnalytics,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/study",
    component: StudyPage,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/study/decks/$deckId",
    component: StudyDeck,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/study/review",
    component: StudyReview,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/ats",
    component: ATSPage,
  }),
  new Route({
    getParentRoute: () => rootRoute,
    path: "/settings",
    component: SettingsPage,
  }),
]

export const routeTree = rootRoute.addChildren(routes)

export const router = new Router({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
