"use client"

import { usePathname } from "next/navigation"
import Navbar from "@/app/Navbar"

// Accept user and userName as props
export default function ConditionalNavbar({ user, userName }) {
  const pathname = usePathname()

  // Check if the current path matches the service pattern
  const isServicePage = pathname.startsWith("/service/")

  // Don't render navbar on service pages
  if (isServicePage) {
    return null
  }

  // Show profile only if user is logged in
  return <Navbar showProfile={!!user} userName={userName || ""} />
}
