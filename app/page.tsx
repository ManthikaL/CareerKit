"use client"

import { RouterProvider } from "@tanstack/react-router"
import { router } from "../src/router"

export default function Page() {
  return <RouterProvider router={router} />
}
