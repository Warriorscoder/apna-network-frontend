"use client"

import { usePathname } from "next/navigation"
import Navbar from "@/app/Navbar"

export default function ConditionalNavbar() {
  const pathname = usePathname()

  // Check if the current path matches the service pattern
  const isServicePage = pathname.startsWith("/service/")

  // Don't render navbar on service pages
  if (isServicePage) {
    return null
  }

  return <Navbar />
}
