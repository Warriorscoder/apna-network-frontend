"use client";
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/ui/Sidebar";
import StatCard from "@/components/ui/StatCard";
import UsersTable from "@/components/ui/UsersTable";
import ServiceProvidersTable from "@/components/ui/ServiceProvidersTable";
import ServicesApprovalTable from "@/components/ui/ServicesApprovalTable";
import ServicesTable from "@/components/ui/ServicesTable";
import CategoriesTable from "@/components/ui/CategoriesTable";
import ComplaintsTable from "@/components/ui/ComplaintsTable";
import TestimonialsTable from "@/components/ui/TestimonialsTable";
import ActivityLog from "@/components/ui/ActivityLog";
import BlogsManager from "@/components/ui/BlogsManager";
import SuccessStoriesManager from "@/components/ui/SuccessStoriesManager";
import NewletterManager from "@/components/ui/NewletterManager";
import AddServiceModal from "@/components/ui/AddServiceModal";
import ContentModal from "@/components/ui/ContentModal";
import { ToastProvider } from "@/components/ui/ToastProvider";
import Navbar from "@/app/Navbar";

export default function AdminDashboard() {
  // Desktop (persistent) collapse
  const [collapsed, setCollapsed] = useState(false);

  // Active content section
  const [selectedSection, setSelectedSection] = useState("Dashboard");

  // Modals
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [contentType, setContentType] = useState("");
  const [contentInitialData, setContentInitialData] = useState(null);

  const [authError, setAuthError] = useState(false);

  // Mobile layout states (match user/provider dashboards)
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);   // mobile drawer open
  const [showFloatingMenu, setShowFloatingMenu] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Fetch quick stats (auth check)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stats`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.status === 401 || res.status === 403) {
          setAuthError(true);
          return;
        }
        await res.json();
      } catch {
        setAuthError(true);
      }
    };
    fetchStats();
  }, []);

  // Section refs (smooth scroll)
  const sectionRefs = {
    Dashboard: useRef(null),
    // "Service Approvals": useRef(null),
    "Manage Users": useRef(null),
    "Manage Services": useRef(null),
    Categories: useRef(null),
    Complaints: useRef(null),
    Testimonials: useRef(null),
    Activity: useRef(null),
    Blogs: useRef(null),
    "Success Stories": useRef(null),
    Newsletter: useRef(null),
  };

  const handleNavigate = (section) => {
    setSelectedSection(section);
    if (isMobile) setSidebarOpen(false);
    setTimeout(() => {
      sectionRefs[section]?.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  // Persist desktop collapse only
  useEffect(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  const toggleCollapse = () => {
    if (isMobile) {
      setSidebarOpen((o) => !o);
      return;
    }
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebarCollapsed", next);
      return next;
    });
  };

  // Responsive breakpoint (align with provider/user layout @ 1024px)
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true); // show on desktop
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Hide floating button on downward scroll (mobile)
  useEffect(() => {
    if (!isMobile) return;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastScrollY && y > 100) {
        setShowFloatingMenu(false);
      } else {
        setShowFloatingMenu(true);
      }
      setLastScrollY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile, lastScrollY]);

  const handleOpenModal = (type, data = null) => {
    setContentType(type);
    setContentInitialData(data);
    setContentModalOpen(true);
  };

  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center p-8 bg-white shadow-lg rounded-xl">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
          <p className="text-gray-600">You are not allowed to view this page.</p>
        </div>
      </div>
    );
  }

  // Sidebar width logic desktop
  const desktopSidebarWidth = collapsed ? "w-20" : "w-64";

  return (
    <ToastProvider>
      <Navbar />
      <div className="h-16 sm:h-20" />

      {/* Floating open button (mobile) */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          style={{
            position: "fixed",
            top: "78px",
            left: "12px",
            zIndex: 40,
            opacity: showFloatingMenu ? 0.85 : 0,
            pointerEvents: showFloatingMenu ? "auto" : "none",
            backgroundColor: "rgba(60,50,100,0.85)",
            color: "white",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow: "0 4px 18px rgba(60,50,100,0.35)",
            backdropFilter: "blur(6px)",
            transition: "opacity 0.3s ease"
          }}
          aria-label="Open admin menu"
        >
          ☰
        </button>
      )}

      {/* Overlay (mobile) */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
        />
      )}

      <div className="min-h-screen flex bg-gradient-to-br from-white to-[#695aa6]/10">
        {/* Sidebar wrapper */}
        <div
          className={`
            fixed top-16 sm:top-20 z-40 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)]
             transition-all duration-300 shadow-lg
             ${isMobile
               ? `bg-[#695aa6] text-white w-64 ${
                   sidebarOpen ? "translate-x-0" : "-translate-x-full"
                 }`
               : `${desktopSidebarWidth}`
             }
          `}
        >
          <Sidebar
            onNavigate={handleNavigate}
            onAddServiceClick={() => setShowAddServiceModal(true)}
            collapsed={isMobile ? false : collapsed}
            toggleCollapse={toggleCollapse}
            fixed={false}
            activeSection={selectedSection}          />
        </div>
        {/* Content */}
        <div
          className={`
            flex-1 flex flex-col transition-all duration-300
            ${isMobile ? "" : (collapsed ? "pl-20" : "pl-64")}
          `}
        >
          <main
            className={`
              p-3 sm:p-5 md:p-8 space-y-8 max-w-7xl w-full mx-auto
               ${isMobile ? "" : "overflow-y-auto"}
               max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-5rem)]
            `}
          >
            {selectedSection === "Dashboard" && (
              <section id="Dashboard" ref={sectionRefs["Dashboard"]}>
                <StatCard />
              </section>
            )}

            {/* {selectedSection === "Service Approvals" && (
              <section id="Service Approvals" ref={sectionRefs["Service Approvals"]}>
                <h2 className="text-xl font-semibold mb-4">Pending Service Approvals</h2>
                <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
                  <ServicesApprovalTable />
                </div>
              </section>
            )} */}

            {selectedSection === "Manage Users" && (
              <section id="Manage Users" ref={sectionRefs["Manage Users"]} className="space-y-8">
                <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
                  <h3 className="text-lg font-semibold text-[#695aa6]">Users</h3>
                  <UsersTable />
                </div>
                <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
                  <h3 className="text-lg font-semibold text-[#695aa6]">Service Providers</h3>
                  <ServiceProvidersTable />
                </div>
              </section>
            )}

            {selectedSection === "Manage Services" && (
              <section id="Manage Services" ref={sectionRefs["Manage Services"]}>
                <h2 className="text-xl font-semibold mb-4">Manage Services</h2>
                <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
                  <ServicesTable />
                </div>
              </section>
            )}

            {selectedSection === "Categories" && (
              <section id="Categories" ref={sectionRefs["Categories"]}>
                <h2 className="text-xl font-semibold mb-4">Categories</h2>
                <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
                  <CategoriesTable />
                </div>
              </section>
            )}

            {selectedSection === "Complaints" && (
              <section id="Complaints" ref={sectionRefs["Complaints"]}>
                <h2 className="text-xl font-semibold mb-4">Complaints</h2>
                <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
                  <ComplaintsTable />
                </div>
              </section>
            )}

            {selectedSection === "Testimonials" && (
              <section id="Testimonials" ref={sectionRefs["Testimonials"]}>
                <h2 className="text-xl font-semibold mb-4">Testimonials</h2>
                <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
                  <TestimonialsTable />
                </div>
              </section>
            )}

            {/* {selectedSection === "Activity" && (
              <section id="Activity" ref={sectionRefs["Activity"]}>
                <h2 className="text-xl font-semibold mb-4">Activity Log</h2>
                <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
                  <ActivityLog />
                </div>
              </section>
            )} */}

            {selectedSection === "Blogs" && (
              <section id="Blogs" ref={sectionRefs["Blogs"]}>
                <h2 className="text-xl font-semibold mb-4">Blogs</h2>
                <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
                  <BlogsManager />
                </div>
              </section>
            )}

            {selectedSection === "Success Stories" && (
              <section id="Success Stories" ref={sectionRefs["Success Stories"]}>
                <h2 className="text-xl font-semibold mb-4">Success Stories</h2>
                <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
                  <SuccessStoriesManager />
                </div>
              </section>
            )}

            {selectedSection === "Newsletter" && (
              <section id="Newsletter" ref={sectionRefs["Newsletter"]}>
                <h2 className="text-xl font-semibold mb-4">Newsletter</h2>
                <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
                  <NewletterManager />
                </div>
              </section>
            )}
          </main>

          {showAddServiceModal && (
            <AddServiceModal
              open={showAddServiceModal}
              onClose={() => setShowAddServiceModal(false)}
              onAdd={(newService) => {
                console.log("New service added:", newService);
                setShowAddServiceModal(false);
              }}
            />
          )}

          {contentModalOpen && (
            <ContentModal
              open={contentModalOpen}
              type={contentType}
              initialData={contentInitialData}
              onClose={() => setContentModalOpen(false)}
              onSubmit={(data) => {
                console.log("Submitted content:", data);
                setContentModalOpen(false);
              }}
            />
          )}
        </div>
      </div>
    </ToastProvider>
  );
}
