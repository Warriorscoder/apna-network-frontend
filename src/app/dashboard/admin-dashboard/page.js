"use client";
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/ui/Sidebar";
// import Header from "@/components/ui/Header" // removed: use common Navbar instead
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
import Navbar from "@/app/Navbar"; // ✅ use the same Navbar as user/provider

export default function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedSection, setSelectedSection] = useState("Dashboard");
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [contentType, setContentType] = useState("");
  const [contentInitialData, setContentInitialData] = useState(null);
  const [authError, setAuthError] = useState(false);

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

        const result = await res.json();
        console.log("Fetched stats:", result);
      } catch (err) {
        console.error("Failed to fetch stats", err);
        setAuthError(true);
      }
    };

    fetchStats();
  }, []);

  const sectionRefs = {
    Dashboard: useRef(null),
    "Service Approvals": useRef(null),
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
    setTimeout(() => {
      sectionRefs[section]?.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebarCollapsed", newState);
      return newState;
    });
  };

  useEffect(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

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

  return (
    <ToastProvider>
      {/* ✅ Shared Navbar (fixed) */}
      <Navbar />

      {/* Spacer to offset fixed navbar height */}
      <div className="h-16 sm:h-20" />

      <div className="min-h-screen flex bg-gradient-to-tr from-white to-[#695aa6]/10">
        {/* Sidebar */}
        <div
          className={`fixed z-40 shadow-lg transition-all duration-300
            ${collapsed ? "w-20" : "w-64"}
            top-16 sm:top-20
            h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)]
          `}
        >
          <Sidebar
            onNavigate={handleNavigate}
            onAddServiceClick={() => setShowAddServiceModal(true)}
            collapsed={collapsed}
            toggleCollapse={toggleCollapse}
            fixed={false}               // ✅ render inside fixed wrapper (no own positioning)
          />
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            collapsed ? "pl-20" : "pl-64"
          }`}
        >
          {/* removed the old admin Header to avoid double bars */}
          {/* <Header onToggleSidebar={toggleCollapse} onNavigate={handleNavigate} /> */}

          <main className="p-4 md:p-8 overflow-y-auto space-y-8 max-w-7xl w-full mx-auto
                           max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-5rem)] /* ✅ respect navbar height */
                           pt-4">
            {selectedSection === "Dashboard" && (
              <section id="Dashboard" ref={sectionRefs["Dashboard"]}>
                <StatCard />
              </section>
            )}

            {selectedSection === "Service Approvals" && (
              <section id="Service Approvals" ref={sectionRefs["Service Approvals"]}>
                <h2 className="text-xl font-semibold mb-4">Pending Service Approvals</h2>
                <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
                  <ServicesApprovalTable />
                </div>
              </section>
            )}

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

            {selectedSection === "Activity" && (
              <section id="Activity" ref={sectionRefs["Activity"]}>
                <h2 className="text-xl font-semibold mb-4">Activity Log</h2>
                <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
                  <ActivityLog />
                </div>
              </section>
            )}

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
