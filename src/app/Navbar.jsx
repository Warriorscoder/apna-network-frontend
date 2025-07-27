"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Edit,
  Calendar,
  LogOut,
  ChevronDown,
  Settings,
} from "lucide-react";
import { useAuth } from "@/app/context/Authcontext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/AboutPage", label: "About" },
  { href: "/all-services", label: "Services" },
  { href: "/Contact", label: "Contact" },
];

const HamburgerIcon = ({ open }) => (
  <svg
    className="w-7 h-7 text-gray-800 transition-transform duration-200 ease-in-out"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    {open ? (
      <path d="M6 18L18 6M6 6l12 12" />
    ) : (
      <path d="M4 6h16M4 12h16m-7 6h7" />
    )}
  </svg>
);

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const {
    isAuthenticated,
    logout,
    loading,
    getCurrentUser,
    getUserRole,
    authInitialized,
  } = useAuth();

  const currentUser = getCurrentUser();
  const userRole = getUserRole();
  const isLoggedIn = isAuthenticated();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const handleNavigate = (href) => {
    setIsMobileMenuOpen(false);
    router.push(href);
  };

  const isActive = (href) => pathname === href;

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    router.push("/");
    window.location.reload();
  };

  const getDashboardLink = () => {
    if (!authInitialized) {
      return "/dashboard/user-dashboard";
    }

    const role = getUserRole();

    switch (role) {
      case "user":
        return "/dashboard/user-dashboard";
      case "provider":
        return "/dashboard/provider-dashboard";
      case "admin":
        return "/dashboard/admin-dashboard";
      default:
        if (localStorage.getItem("user")) return "/dashboard/user-dashboard";
        if (localStorage.getItem("provider"))
          return "/dashboard/provider-dashboard";
        if (localStorage.getItem("admin")) return "/dashboard/admin-dashboard";

        return "/dashboard/user-dashboard";
    }
  };

  const getUserDisplayName = () => {
    const current = getCurrentUser();

    // Try different name fields that might be available
    if (current?.name) return current.name;
    if (current?.fullName) return current.fullName;
    if (current?.firstName) {
      return current.lastName
        ? `${current.firstName} ${current.lastName}`
        : current.firstName;
    }

    // For providers, they might have different field names
    if (current?.provider_name) return current.provider_name;
    if (current?.providerName) return current.providerName;

    // Last resort - use phone but format it nicely
    if (current?.phone) {
      // Format phone number nicely (e.g., +91 98765 43210)
      const phone = current.phone.toString();
      if (phone.length === 10) {
        return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
      }
      return phone;
    }

    return "User";
  };

  const getRoleBadge = () => {
    const role = getUserRole();
    if (!role) return null;

    const roleColors = {
      user: "bg-blue-100 text-blue-800",
      provider: "bg-green-100 text-green-800",
      admin: "bg-purple-100 text-purple-800",
    };

    const roleLabels = {
      user: "Customer",
      provider: "Provider",
      admin: "Admin",
    };

    return (
      <span
        className={`px-2 py-1 text-xs rounded-full font-medium ${
          roleColors[role] || "bg-gray-100 text-gray-800"
        }`}
      >
        {roleLabels[role] || role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const handleDashboardClick = () => {
    const dashboardLink = getDashboardLink();
    handleNavigate(dashboardLink);
    setProfileOpen(false);
  };

  if (loading || !authInitialized) {
    return (
      <header className="border-b-1 fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-lg shadow border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="text-4xl font-bold">
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
      </header>
    );
  }

  return (
    <header
      className={`border-b-1 fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ease-in-out 
      ${
        scrolled || isMobileMenuOpen
          ? "bg-white backdrop-blur-lg shadow border-b border-gray-200"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button
            onClick={() => handleNavigate("/")}
            className="text-4xl font-bold transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(to right, #695aa6, #5a4d8a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Apna Network
          </button>

          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-base font-semibold transition-all px-3 py-2 rounded-md 
                  ${
                    isActive(href)
                      ? "border-transparent"
                      : "text-gray-700 border-transparent hover:text-gray-900"
                  }`}
                style={
                  isActive(href)
                    ? {
                        color: "#695aa6",
                        backgroundColor: "rgba(105, 90, 166, 0.1)",
                        borderColor: "#695aa6",
                      }
                    : {}
                }
                onMouseEnter={(e) => {
                  if (!isActive(href)) {
                    e.target.style.color = "#695aa6";
                    e.target.style.backgroundColor = "rgba(105, 90, 166, 0.05)";
                    e.target.style.borderColor = "#695aa6";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(href)) {
                    e.target.style.color = "#374151";
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.borderColor = "transparent";
                  }
                }}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="group flex items-center gap-3 px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-md"
                  style={{
                    background: "rgba(105, 90, 166, 0.1)",
                    border: "1px solid rgba(105, 90, 166, 0.2)",
                    color: "#695aa6",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(105, 90, 166, 0.2)";
                    e.target.style.borderColor = "rgba(105, 90, 166, 0.4)";
                    e.target.style.color = "#5a4d8a";
                    e.target.style.boxShadow =
                      "0 4px 20px rgba(105, 90, 166, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(105, 90, 166, 0.1)";
                    e.target.style.borderColor = "rgba(105, 90, 166, 0.2)";
                    e.target.style.color = "#695aa6";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: "linear-gradient(135deg, #695aa6, #5a4d8a)",
                      boxShadow: "0 2px 8px rgba(105, 90, 166, 0.3)",
                    }}
                  >
                    <span className="text-white text-sm font-semibold">
                      {getUserDisplayName().charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden lg:block font-semibold">
                    {getUserDisplayName()}
                  </span>
                  <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                </button>

                {profileOpen && (
                  <div
                    className="absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl border backdrop-blur-lg overflow-hidden z-50"
                    style={{
                      background: "rgba(255, 255, 255, 0.95)",
                      borderColor: "rgba(105, 90, 166, 0.2)",
                      boxShadow: "0 20px 40px rgba(105, 90, 166, 0.15)",
                    }}
                  >
                    {/* User Info Section */}
                    <div
                      className="px-6 py-4"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(105, 90, 166, 0.1), rgba(105, 90, 166, 0.05))",
                        borderBottom: "1px solid rgba(105, 90, 166, 0.1)",
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{
                            background:
                              "linear-gradient(135deg, #695aa6, #5a4d8a)",
                            boxShadow: "0 4px 12px rgba(105, 90, 166, 0.3)",
                          }}
                        >
                          <span className="text-white text-lg font-bold">
                            {getUserDisplayName().charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-xl font-semibold text-gray-900">
                            {getUserDisplayName()}
                          </p>
                          <div className="mt-1">{getRoleBadge()}</div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={handleDashboardClick}
                        className="flex items-center w-full px-6 py-3 text-sm font-medium text-gray-700 transition-all duration-200"
                        onMouseEnter={(e) => {
                          e.target.style.background = "rgba(105, 90, 166, 0.1)";
                          e.target.style.color = "#695aa6";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "transparent";
                          e.target.style.color = "#374151";
                        }}
                      >
                        <User className="w-5 h-5 mr-3" />
                        Dashboard
                      </button>
                    </div>

                    {/* Logout Section */}
                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-6 py-3 text-sm font-medium text-red-600 transition-all duration-200"
                        onMouseEnter={(e) => {
                          e.target.style.background = "rgba(239, 68, 68, 0.1)";
                          e.target.style.color = "#dc2626";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "transparent";
                          e.target.style.color = "#dc2626";
                        }}
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-base px-5 py-2 rounded-md font-semibold border transition-all hover:text-white"
                  style={{ borderColor: "#695aa6", color: "#695aa6" }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#695aa6";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#695aa6";
                  }}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-base px-5 py-2 rounded-md font-semibold text-white transition-all transform hover:scale-105"
                  style={{
                    background: "linear-gradient(to right, #695aa6, #5a4d8a)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background =
                      "linear-gradient(to right, #5a4d8a, #4a3f73)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background =
                      "linear-gradient(to right, #695aa6, #5a4d8a)";
                  }}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-md transition"
              aria-label="Toggle menu"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "rgba(105, 90, 166, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              <HamburgerIcon open={isMobileMenuOpen} />
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-200">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map(({ href, label }) => (
              <button
                key={href}
                onClick={() => handleNavigate(href)}
                className={`block w-full text-left px-4 py-2 rounded-md text-lg font-semibold border-b-2 transition
                  ${
                    isActive(href)
                      ? "text-gray-700 border-transparent"
                      : "text-gray-700 border-transparent"
                  }`}
                style={
                  isActive(href)
                    ? {
                        backgroundColor: "rgba(105, 90, 166, 0.1)",
                        color: "#695aa6",
                        borderColor: "#695aa6",
                      }
                    : {}
                }
                onMouseEnter={(e) => {
                  if (!isActive(href)) {
                    e.target.style.color = "#695aa6";
                    e.target.style.backgroundColor = "rgba(105, 90, 166, 0.05)";
                    e.target.style.borderColor = "#695aa6";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(href)) {
                    e.target.style.color = "#374151";
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.borderColor = "transparent";
                  }
                }}
              >
                {label}
              </button>
            ))}

            <div className="border-t pt-3 space-y-2">
              {isLoggedIn ? (
                <>
                  <div
                    className="px-4 py-4 rounded-xl mb-3"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(105, 90, 166, 0.1), rgba(105, 90, 166, 0.05))",
                      border: "1px solid rgba(105, 90, 166, 0.2)",
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg, #695aa6, #5a4d8a)",
                          boxShadow: "0 4px 12px rgba(105, 90, 166, 0.3)",
                        }}
                      >
                        <span className="text-white text-lg font-bold">
                          {getUserDisplayName().charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {getUserDisplayName()}
                        </p>
                        <div className="mt-1">{getRoleBadge()}</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleDashboardClick}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 rounded-md font-semibold text-lg transition"
                  >
                    <User className="w-6 h-6 text-[#695aa6]" />
                    <span className="font-semibold text-[#695aa6] text-base">
                      Dashboard
                    </span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 rounded-md font-semibold text-lg transition"
                  >
                    <LogOut className="w-6 h-6 text-red-600" />
                    <span className="font-semibold text-red-600 text-base">
                      Logout
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigate("/login")}
                    className="w-full text-left px-4 py-2 rounded-md font-semibold text-lg transition"
                    style={{ color: "#695aa6" }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor =
                        "rgba(105, 90, 166, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                    }}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavigate("/register")}
                    className="w-full text-left px-4 py-2 rounded-md font-semibold text-lg text-white"
                    style={{
                      background: "linear-gradient(to right, #695aa6, #5a4d8a)",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background =
                        "linear-gradient(to right, #5a4d8a, #4a3f73)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background =
                        "linear-gradient(to right, #695aa6, #5a4d8a)";
                    }}
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
