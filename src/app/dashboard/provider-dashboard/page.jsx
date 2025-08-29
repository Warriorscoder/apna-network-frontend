"use client";
import { useState, useEffect } from "react";
import { Menu, Star } from "lucide-react";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import NotificationsBar from "./NotificationsBar";
import RequestsPanel from "./RequestsPanel";
import ServicesPanel from "./ServicesPanel";
import HelpPanel from "./HelpPanel";
import DashboardOverview from "./DashboardOverview";
import { useAuthenticatedAPI } from "@/app/hooks/useAuthenticatedAPI";
import { useAuth } from "@/app/context/Authcontext";
import FeedbackModal from "@/components/ui/FeedbackModal"; // Make sure path is correct
import { useRouter } from "next/navigation";

export default function ProviderDashboardPage() {
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showFloatingMenu, setShowFloatingMenu] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const { provider } = useAuthenticatedAPI();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
      if(user?.role === 'not logged in'){
        router.push('/login');
      }
      if(user?.role === 'user'){
        router.push('/');
      }
    }, [user?.role]);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Auto-hide floating menu on scroll
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

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isMobile]);

  const renderContent = () => {
    switch (activeView) {
      case "requests":
        return <RequestsPanel />;
      case "services":
        return <ServicesPanel />;
      case "help":
        return <HelpPanel />;
      default:
        return <DashboardOverview setActiveView={setActiveView} />;
    }
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavItemClick = (key) => {
    setActiveView(key);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleFeedbackSubmit = (data) => {
    console.log("Feedback submitted:", data);
    // TODO: send data to backend when available
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#a395d4] via-[#b8a7e8] to-[#8b7cc8] flex flex-col">
      <ConditionalNavbar />

      {/* Floating menu button for mobile */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={handleSidebarToggle}
          className="lg:hidden"
          style={{
            position: "fixed",
            top: "80px",
            left: "12px",
            zIndex: 40,
            opacity: showFloatingMenu ? 0.8 : 0,
            pointerEvents: showFloatingMenu ? "auto" : "none",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            color: "white",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            boxShadow: "none",
            backdropFilter: "none",
            transition: "opacity 0.3s ease",
          }}
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 35,
          }}
        />
      )}

      <main className="flex flex-1 pt-16 lg:pt-20">
        <Sidebar
          activeView={activeView}
          setActiveView={handleNavItemClick}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
        />
        <section
          className={`relative min-h-screen flex flex-col items-center justify-start overflow-hidden w-full transition-all duration-300 ${
            isMobile ? "w-full" : ""
          }`}
        >
          {/* Dashboard Header - only show on dashboard */}
          {activeView === "dashboard" && <DashboardHeader provider={user} />}

          {/* Notifications Bar - only show on dashboard */}
          {activeView === "dashboard" && (
            <NotificationsBar pendingRequests={2} />
          )}

          <div
            className={`w-full z-10 px-4 sm:px-6 lg:px-10 pb-10 ${
              activeView !== "dashboard" ? "pt-8" : ""
            }`}
          >
            {renderContent()}
          </div>
        </section>
      </main>

      {/* Floating Feedback Button */}
      {activeView === "dashboard" && (
        <button
          onClick={() => setFeedbackOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#695aa6] text-white px-4 py-2 rounded-full shadow-lg hover:bg-[#5a4d8a] transition flex items-center gap-2"
        >
          <Star className="w-4 h-4" />
          Give Feedback
        </button>
      )}

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
}
