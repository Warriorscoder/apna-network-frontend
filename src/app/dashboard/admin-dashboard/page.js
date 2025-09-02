"use client";
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
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

export default function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedSection, setSelectedSection] = useState("Dashboard");
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [contentType, setContentType] = useState("");
  const [contentInitialData, setContentInitialData] = useState(null);

  // Refs for sections (so Navbar can scroll smoothly)
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

  // Handle navigation (works for Sidebar + Header)
  const handleNavigate = (section) => {
    setSelectedSection(section); // keep multi-page style
    // smooth scroll when section exists in DOM
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
    if (saved === "true") {
      setCollapsed(true);
    }
  }, []);

  const handleOpenModal = (type, data = null) => {
    setContentType(type);
    setContentInitialData(data);
    setContentModalOpen(true);
  };

  return (
    <ToastProvider>
      <div className="min-h-screen flex bg-gradient-to-tr from-white to-[#695aa6]/10">
        {/* Sidebar */}
        <div
          className={`fixed z-40 h-full shadow-lg transition-all duration-300 ${
            collapsed ? "w-20" : "w-64"
          }`}
        >
          <Sidebar
            onNavigate={handleNavigate}
            onAddServiceClick={() => setShowAddServiceModal(true)}
            collapsed={collapsed}
            toggleCollapse={toggleCollapse}
          />
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            collapsed ? "pl-20" : "pl-64"
          }`}
        >
          {/* Header also uses same navigation */}
          <Header onToggleSidebar={toggleCollapse} onNavigate={handleNavigate} />

          <main className="p-4 md:p-8 overflow-y-auto space-y-8 max-w-7xl w-full mx-auto max-h-[calc(100vh-64px)] pt-4">
            {/* Dashboard */}
            {selectedSection === "Dashboard" && (
              <section id="Dashboard" ref={sectionRefs["Dashboard"]}>
                <StatCard />
              </section>
            )}

            {/* Service Approvals */}
            {selectedSection === "Service Approvals" && (
              <section id="Service Approvals" ref={sectionRefs["Service Approvals"]}>
                <h2 className="text-xl font-semibold mb-4">
                  Pending Service Approvals
                </h2>
                <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
                  <ServicesApprovalTable />
                </div>
              </section>
            )}

            {/* Manage Users */}
            {selectedSection === "Manage Users" && (
              <section
                id="Manage Users"
                ref={sectionRefs["Manage Users"]}
                className="space-y-8"
              >
                <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
                  <h3 className="text-lg font-semibold text-[#695aa6]">Users</h3>
                  <UsersTable />
                </div>
                <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
                  <h3 className="text-lg font-semibold text-[#695aa6]">
                    Service Providers
                  </h3>
                  <ServiceProvidersTable />
                </div>
              </section>
            )}

            {/* Manage Services */}
            {selectedSection === "Manage Services" && (
              <section id="Manage Services" ref={sectionRefs["Manage Services"]}>
                <h2 className="text-xl font-semibold mb-4">Manage Services</h2>
                <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
                  <ServicesTable />
                </div>
              </section>
            )}

            {/* Categories */}
            {selectedSection === "Categories" && (
              <section id="Categories" ref={sectionRefs["Categories"]}>
                <h2 className="text-xl font-semibold mb-4">Categories</h2>
                <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
                  <CategoriesTable />
                </div>
              </section>
            )}

            {/* Complaints */}
            {selectedSection === "Complaints" && (
              <section id="Complaints" ref={sectionRefs["Complaints"]}>
                <h2 className="text-xl font-semibold mb-4">Complaints</h2>
                <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
                  <ComplaintsTable />
                </div>
              </section>
            )}

            {/* Testimonials */}
            {selectedSection === "Testimonials" && (
              <section id="Testimonials" ref={sectionRefs["Testimonials"]}>
                <h2 className="text-xl font-semibold mb-4">Testimonials</h2>
                <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
                  <TestimonialsTable />
                </div>
              </section>
            )}

            {/* Activity */}
            {selectedSection === "Activity" && (
              <section id="Activity" ref={sectionRefs["Activity"]}>
                <h2 className="text-xl font-semibold mb-4">Activity Log</h2>
                <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
                  <ActivityLog />
                </div>
              </section>
            )}

            {/* Blogs */}
            {selectedSection === "Blogs" && (
              <section id="Blogs" ref={sectionRefs["Blogs"]}>
                <h2 className="text-xl font-semibold mb-4">Blogs</h2>
                <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
                  <BlogsManager />
                </div>
              </section>
            )}

            {/* Success Stories */}
            {selectedSection === "Success Stories" && (
              <section
                id="Success Stories"
                ref={sectionRefs["Success Stories"]}
              >
                <h2 className="text-xl font-semibold mb-4">Success Stories</h2>
                <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
                  <SuccessStoriesManager />
                </div>
              </section>
            )}

            {/* Newsletter */}
            {selectedSection === "Newsletter" && (
              <section id="Newsletter" ref={sectionRefs["Newsletter"]}>
                <h2 className="text-xl font-semibold mb-4">Newsletter</h2>
                <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
                  <NewletterManager />
                </div>
              </section>
            )}
          </main>

          {/* Modals */}
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
