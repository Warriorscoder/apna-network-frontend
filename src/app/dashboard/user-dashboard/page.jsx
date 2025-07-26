"use client";
import React, { useEffect, useState } from "react";
import {
  Menu,
  X,
  UserCircle,
  Briefcase,
  ListTodo,
  HelpCircle,
  LayoutDashboard,
  Bell,
} from "lucide-react";
import ConditionalNavbar from "../../../components/ConditionalNavbar";
import DashboardPanel from "./DashboardPanel";
import ServicesPanel from "./ServicesPanel";
import RequestsPanel from "./RequestsPanel";
import HelpPanel from "./HelpPanel";
import { useDummyAPI } from "@/app/hooks/useDummyAPI";

const useClientGreeting = () => {
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return greeting;
};

export default function UserDashboard() {
  const { user } = useDummyAPI();
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showFloatingMenu, setShowFloatingMenu] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Auto-hide floating menu on scroll down, show on scroll up
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowFloatingMenu(false);
      } else {
        setShowFloatingMenu(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobile]);

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardPanel setActiveView={setActiveView} />;
      case "services":
        return <ServicesPanel />;
      case "requests":
        return <RequestsPanel />;
      case "help":
        return <HelpPanel />;
      default:
        return <DashboardPanel setActiveView={setActiveView} />;
    }
  };

  const greeting = useClientGreeting();

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavItemClick = (key) => {
    setActiveView(key);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#a395d4] via-[#b8a7e8] to-[#8b7cc8] flex flex-col">
      <ConditionalNavbar />
      
      {/* Simple floating menu button without effects */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={handleSidebarToggle}
          className="lg:hidden"
          style={{
            position: 'fixed',
            top: '80px',
            left: '12px',
            zIndex: 40,
            opacity: showFloatingMenu ? 0.8 : 0,
            pointerEvents: showFloatingMenu ? 'auto' : 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.2)', // Simple background
            color: 'white',
            padding: '10px',
            borderRadius: '8px', // Simple border radius
            border: 'none', // No border
            boxShadow: 'none', // No shadow
            backdropFilter: 'none', // No blur effect
            transition: 'opacity 0.3s ease', // Only opacity transition
          }}
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
      
      {/* Simple mobile overlay without blur */}
      {isMobile && sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Simple overlay
            zIndex: 35
          }}
        />
      )}
      
      <main className="flex flex-1 pt-16 lg:pt-20 relative">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-16 lg:top-20 left-0 h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)]
            ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-20"}
            bg-[rgba(60,50,100,0.95)] backdrop-blur-md text-white
            transition-all duration-300 ease-in-out z-40 lg:z-30
            flex flex-col border-r border-white/10
          `}
        >
          {/* Sidebar header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between lg:justify-center">
            <div className={`${sidebarOpen ? "opacity-100" : "opacity-0 lg:hidden"}`}>
              <span className="font-bold text-lg">Menu</span>
            </div>
            {sidebarOpen && (
              <button
                className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
                onClick={handleSidebarToggle}
                aria-label="Close sidebar"
              >
                <X className="w-6 h-6" />
              </button>
            )}
            {!isMobile && (
              <button
                className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors"
                onClick={handleSidebarToggle}
                aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {[
                { key: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
                { key: "services", icon: Briefcase, label: "Services" },
                { key: "requests", icon: ListTodo, label: "My Requests" },
                { key: "help", icon: HelpCircle, label: "Help & Support" },
              ].map(({ key, icon: Icon, label }) => (
                <li key={key}>
                  <button
                    onClick={() => handleNavItemClick(key)}
                    className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all duration-200 group ${
                      activeView === key
                        ? "bg-white/20 text-white shadow-lg"
                        : "hover:bg-white/10 text-white/80 hover:text-white"
                    } ${!sidebarOpen ? "lg:justify-center" : ""}`}
                    title={!sidebarOpen ? label : ''}
                  >
                    <Icon className={`w-6 h-6 flex-shrink-0 ${
                      activeView === key ? "text-white" : "text-white/80 group-hover:text-white"
                    }`} />
                    <span
                      className={`font-medium transition-opacity duration-300 ${
                        sidebarOpen ? "opacity-100" : "lg:opacity-0 lg:sr-only"
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* User info */}
          <div className={`p-4 border-t border-white/10 ${sidebarOpen ? "" : "lg:hidden"}`}>
            <div className="flex items-center gap-3">
              <UserCircle className="w-8 h-8 text-white/80 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || "Guest User"}
                </p>
                <p className="text-xs text-white/60">Customer Account</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <section className={`flex-1 transition-all duration-300 ${
          isMobile ? 'w-full' : ''
        }`}>
          {/* Hero section - only show on dashboard */}
          {activeView === "dashboard" && (
            <div className="relative px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
              <div className="max-w-7xl mx-auto text-center">
                <div className="mb-4">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto bg-gradient-to-br from-[#695aa6] to-[#b8a7e8] rounded-full flex items-center justify-center shadow-2xl border-4 border-white/50 backdrop-blur-sm">
                    <UserCircle className="w-12 h-12 lg:w-14 lg:h-14 text-white" />
                  </div>
                </div>

                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3"
                  style={{ textShadow: "0 4px 24px rgba(60,50,100,0.65), 0 2px 4px rgba(0,0,0,0.3)"}}
                  suppressHydrationWarning={true}
                >
                  {greeting}, {user?.name || "Guest"}! 👋
                </h1>
                
                <p
                  className="text-base sm:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed"
                  style={{ textShadow: "0 2px 12px rgba(60,50,100,0.45), 0 1px 2px rgba(0,0,0,0.3)" }}
                >
                  Connect with trusted local service providers in your community.
                  From home repairs to personal services, find reliable professionals near you.
                </p>
              </div>
            </div>
          )}

          {/* Notification Banner - only show on dashboard */}
          {activeView === "dashboard" && (
            <div className="px-4 sm:px-6 lg:px-8 mb-8">
              <div className="max-w-7xl mx-auto">
                <div className="bg-white/30 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg border border-white/30 flex items-center justify-center gap-3">
                  <Bell className="w-5 h-5 text-[#695aa6] flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-700 font-medium text-center">
                    🎉 Welcome to your dashboard! Explore services and manage your requests easily.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Main content */}
          <div className={`px-4 sm:px-6 lg:px-8 pb-8 ${activeView !== "dashboard" ? "pt-8" : ""}`}>
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}