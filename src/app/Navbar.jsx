"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { User, LogOut, ChevronDown, Menu, X } from "lucide-react"
import { useAuth } from "@/app/context/Authcontext"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/AboutPage", label: "About" },
  { href: "/all-services", label: "Services" },
  { href: "/Contact", label: "Contact" },
]

const HamburgerIcon = ({ open }) => (
  <div className="w-6 h-6 flex items-center justify-center">
    {open ? (
      <X className="w-6 h-6 text-gray-800 transition-transform duration-200" />
    ) : (
      <Menu className="w-6 h-6 text-gray-800 transition-transform duration-200" />
    )}
  </div>
)

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  const { isAuthenticated, logout, loading, getCurrentUser, getUserRole, authInitialized } = useAuth()

  const isLoggedIn = authInitialized && isAuthenticated()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [profileOpen])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleNavigate = (href) => {
    setIsMobileMenuOpen(false)
    setProfileOpen(false)
    router.push(href)
  }

  const isActive = (href) => pathname === href

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
    setIsMobileMenuOpen(false)
    router.push("/")  
  }

  const getDashboardLink = () => {
    if (!authInitialized) return "/dashboard/user-dashboard"
    const role = getUserRole()
    switch (role) {
      case "user":
        return "/dashboard/user-dashboard"
      case "provider":
        return "/dashboard/provider-dashboard"
      case "admin":
        return "/dashboard/admin-dashboard"
      default:
        return "/dashboard/user-dashboard"
    }
  }

  const getUserDisplayName = () => {
    const current = getCurrentUser()
    if (current?.name) return current.name
    if (current?.fullName) return current.fullName
    if (current?.firstName) {
      return current.lastName ? `${current.firstName} ${current.lastName}` : current.firstName
    }
    if (current?.provider_name) return current.provider_name
    if (current?.providerName) return current.providerName
    if (current?.phone) {
      const phone = current.phone.toString()
      if (phone.length === 10) {
        return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
      }
      return phone
    }
    return "User"
  }

  const getRoleBadge = () => {
    const role = getUserRole()
    if (!role) return null

    const roleColors = {
      user: "bg-blue-100 text-blue-800",
      provider: "bg-green-100 text-green-800",
      admin: "bg-purple-100 text-purple-800",
    }

    const roleLabels = {
      user: "User",
      provider: "Provider",
      admin: "Admin",
    }

    return (
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${roleColors[role] || "bg-gray-100 text-gray-800"}`}>
        {roleLabels[role] || role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    )
  }

  const handleDashboardClick = () => {
    const dashboardLink = getDashboardLink()
    handleNavigate(dashboardLink)
  }

  if (!authInitialized) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-lg shadow border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div 
              className="text-2xl sm:text-3xl md:text-4xl font-bold"
              style={{
                background: "linear-gradient(to right, #695aa6, #5a4d8a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Apna Network
            </div>
          </div>
        </div>
        {/* Bottom line for loading state - only when not scrolled */}
        <div className="h-0.5 w-full bg-gradient-to-r from-[#695aa6] to-[#5a4d8a] opacity-0"></div>
      </header>
    )
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          scrolled || isMobileMenuOpen
            ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <button
              onClick={() => handleNavigate("/")}
              className="text-2xl sm:text-3xl md:text-4xl font-bold transition-transform hover:scale-105 focus:outline-none"
              style={{
                background: "linear-gradient(to right, #695aa6, #5a4d8a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Apna Network
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`text-base font-semibold transition-all px-3 py-2 rounded-md ${
                    isActive(href)
                      ? "text-[#695aa6] bg-[#695aa6]/10 border border-[#695aa6]/20"
                      : "text-gray-700 hover:text-[#695aa6] hover:bg-[#695aa6]/5"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center space-x-3">
              {isLoggedIn ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="group flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-md bg-[#695aa6]/10 border border-[#695aa6]/20 text-[#695aa6] hover:bg-[#695aa6]/20 hover:border-[#695aa6]/40 hover:text-[#5a4d8a] hover:shadow-lg"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#695aa6] to-[#5a4d8a] shadow-md">
                      <span className="text-white text-sm font-semibold">
                        {getUserDisplayName().charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden xl:block font-semibold text-sm">{getUserDisplayName()}</span>
                    <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl border backdrop-blur-lg overflow-hidden z-50 bg-white/95 border-[#695aa6]/20">
                      {/* User Info Section */}
                      <div className="px-6 py-4 bg-gradient-to-br from-[#695aa6]/10 to-[#695aa6]/5 border-b border-[#695aa6]/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#695aa6] to-[#5a4d8a] shadow-lg">
                            <span className="text-white text-lg font-bold">
                              {getUserDisplayName().charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-gray-900 truncate">{getUserDisplayName()}</p>
                            <div className="mt-1">{getRoleBadge()}</div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={handleDashboardClick}
                          className="flex items-center w-full px-6 py-3 text-sm font-medium text-gray-700 hover:bg-[#695aa6]/10 hover:text-[#695aa6] transition-all duration-200"
                        >
                          <User className="w-5 h-5 mr-3" />
                          Dashboard
                        </button>
                      </div>

                      {/* Logout Section */}
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-6 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                        >
                          <LogOut className="w-5 h-5 mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-sm sm:text-base px-4 sm:px-5 py-2 rounded-md font-semibold text-white transition-all transform hover:scale-105 bg-gradient-to-r from-[#695aa6] to-[#5a4d8a] hover:from-[#5a4d8a] hover:to-[#4a3f73] shadow-md hover:shadow-lg"
                >
                  Join Now
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md transition-colors hover:bg-[#695aa6]/10 focus:outline-none focus:ring-2 focus:ring-[#695aa6]/20"
                aria-label="Toggle menu"
              >
                <HamburgerIcon open={isMobileMenuOpen} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom gradient line - only visible when not scrolled and mobile menu is closed */}
        <div
          className={`h-0.5 w-full bg-gradient-to-r from-[#ffffff] to-[#ffffff] transition-opacity duration-300 ${
            scrolled || isMobileMenuOpen ? "opacity-0" : "opacity-40"
          }`}
        ></div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-16 sm:top-20 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-2xl border-b border-gray-200 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-4 py-6 space-y-4">
              {/* Navigation Links */}
              <div className="space-y-2">
                {navLinks.map(({ href, label }) => (
                  <button
                    key={href}
                    onClick={() => handleNavigate(href)}
                    className={`block w-full text-left px-4 py-3 rounded-lg text-base font-semibold transition-all ${
                      isActive(href)
                        ? "bg-[#695aa6]/10 text-[#695aa6] border border-[#695aa6]/20"
                        : "text-gray-700 hover:bg-[#695aa6]/5 hover:text-[#695aa6]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Auth Section */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                {isLoggedIn ? (
                  <>
                    {/* User Info Card */}
                    <div className="px-4 py-4 rounded-xl bg-gradient-to-br from-[#695aa6]/10 to-[#695aa6]/5 border border-[#695aa6]/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#695aa6] to-[#5a4d8a] shadow-lg">
                          <span className="text-white text-lg font-bold">
                            {getUserDisplayName().charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-gray-900 truncate">{getUserDisplayName()}</p>
                          <div className="mt-1">{getRoleBadge()}</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <button
                      onClick={handleDashboardClick}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-base transition-all hover:bg-[#695aa6]/10 text-[#695aa6]"
                    >
                      <User className="w-5 h-5" />
                      Dashboard
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-base transition-all hover:bg-red-50 text-red-600"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="block w-full text-center px-5 py-3 rounded-lg font-semibold text-base text-white transition-all bg-gradient-to-r from-[#695aa6] to-[#5a4d8a] hover:from-[#5a4d8a] hover:to-[#4a3f73] shadow-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Join Now
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}