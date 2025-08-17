"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { User, LogOut, ChevronDown, Menu, X } from "lucide-react"
import { useAuth } from "@/app/context/Authcontext"
import { userAgentFromString } from "next/server"

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

  const {
    user,
    isAuthenticated,
    logout,
    loading,
    getCurrentUser,
    getUserRole,
    authInitialized,
  } = useAuth()

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
    console.log("current" , current)
    if (current?.name) return current.name.split(" ")[0]
    if (current?.fullName) return current.fullName
    if (current?.firstName) return current.lastName ? `${current.firstName} ${current.lastName}` : current.firstName
    if (current?.provider_name) return current.provider_name
    if (current?.providerName) return current.providerName
    if (current?.phone) {
      const phone = current.phone.toString()
      if (phone.length === 10) return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
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
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
              <span
                style={{
                  background: "linear-gradient(to right, #695aa6, #5a4d8a)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Apna Network
              </span>
            </div>
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-300 h-8 w-8"></div>
            </div>
          </div>
        </div>
        <div className=" w-full bg-gradient-to-r from-[#695aa6] to-[#5a4d8a] opacity-0"></div>
      </header>
    )
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-lg" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
            <span
              style={{
                background: "linear-gradient(to right, #695aa6, #5a4d8a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Apna Network
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 text-gray-800 font-medium">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`transition-colors duration-200 hover:text-indigo-600 ${
                  isActive(href) ? "text-indigo-600 font-semibold" : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right Side: Auth or Hamburger */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full"
                >
                  <User size={18} />
                  <span>{getUserDisplayName()}</span>
                  <ChevronDown size={16} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b text-sm font-medium text-gray-700">
                      {getRoleBadge()}
                    </div>
                    <button
                      onClick={handleDashboardClick}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                    >
                      <LogOut size={16} className="inline-block mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="text-white bg-gradient-to-r from-[#695aa6] to-[#5a4d8a] hover:from-[#5a4d8a] hover:to-[#695aa6] px-4 py-2 rounded-full text-sm font-medium transition duration-300"
              >
                Join now
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden focus:outline-none"
            >
              <HamburgerIcon open={isMobileMenuOpen} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <nav className="flex flex-col items-start space-y-2 px-4 py-4">
            {navLinks.map(({ href, label }) => (
              <button
                key={href}
                onClick={() => handleNavigate(href)}
                className={`w-full text-left text-gray-800 font-medium py-2 ${
                  isActive(href) ? "text-indigo-600 font-semibold" : ""
                }`}
              >
                {label}
              </button>
            ))}

            {isLoggedIn ? (
              <>
                <button
                  onClick={handleDashboardClick}
                  className="w-full text-left text-gray-800 font-medium py-2"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-gray-800 font-medium py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavigate("/login")}
                className="w-full text-left text-white bg-gradient-to-r from-[#695aa6] to-[#5a4d8a] hover:from-[#5a4d8a] hover:to-[#695aa6] px-4 py-2 rounded-full text-sm font-medium transition duration-300"
              >
                Join now
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

