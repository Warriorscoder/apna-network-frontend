'use client';
import React, { useState, useEffect } from 'react';
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

export default function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedSection, setSelectedSection] = useState("Dashboard");
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [contentType, setContentType] = useState("");
  const [contentInitialData, setContentInitialData] = useState(null);

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
  <div className="min-h-screen flex bg-gradient-to-tr from-white to-[#695aa6]/10">
    {/* Sidebar - Fixed and occupies left space */}
    <div className={`fixed z-40 h-full shadow-lg transition-all duration-300 ${
       collapsed ? 'w-20' : 'w-64'}`}>

      <Sidebar
        onNavigate={(section) => setSelectedSection(section)}
        onAddServiceClick={() => setShowAddServiceModal(true)}
        collapsed={collapsed}
        toggleCollapse={toggleCollapse}
      />
    </div>

    {/* Main Content - Starts after sidebar using padding */}
     <div className={`flex-1 flex flex-col transition-all duration-300 ${
      collapsed ? 'pl-20' : 'pl-64'}`}>


      <Header onToggleSidebar={toggleCollapse} />

      <main className="p-4 md:p-8 overflow-y-auto space-y-8 max-w-7xl w-full mx-auto max-h-[calc(100vh-64px)]">
        {selectedSection === "Dashboard" && <StatCard />}

        {selectedSection === "Service Approvals" && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Pending Service Approvals</h2>
            <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
              <ServicesApprovalTable />
            </div>
          </section>
        )}

        {selectedSection === "Manage Users" && (
          <section className="space-y-8">
            <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 gap-2">
                <h3 className="text-lg font-semibold text-blue-600">Service Takers (Users)</h3>
                <button
                  onClick={() => window.open('/register', '_blank')}
                  className="bg-blue-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-blue-700 transition"
                >
                  + Add User
                </button>
              </div>
              <UsersTable />
            </div>

            <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 gap-2">
                <h3 className="text-lg font-semibold text-[#695aa6]">Service Providers</h3>
                <button
                  onClick={() => window.open('/provider-signup', '_blank')}
                  className="bg-[#695aa6] text-white px-4 py-2 rounded font-semibold shadow hover:bg-[#57468b] transition"
                >
                  + Add Provider
                </button>
              </div>
              <ServiceProvidersTable />
            </div>
          </section>
        )}

        {selectedSection === "Manage Services" && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Manage Services</h2>
            <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
              <ServicesTable />
            </div>
          </section>
        )}

        {selectedSection === "Categories" && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
              <CategoriesTable />
            </div>
          </section>
        )}

        {selectedSection === "Complaints" && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Complaints</h2>
            <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
              <ComplaintsTable />
            </div>
          </section>
        )}

        {selectedSection === "Testimonials" && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Testimonials</h2>
            <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
              <TestimonialsTable />
            </div>
          </section>
        )}

        {selectedSection === "Activity" && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Activity Log</h2>
            <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
              <ActivityLog />
            </div>
          </section>
        )}

        {selectedSection === "Blogs" && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Blogs</h2>
            <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
              <BlogsManager />
            </div>
          </section>
        )}

        {selectedSection === "Success Stories" && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Success Stories</h2>
            <div className="bg-white rounded-xl p-4 shadow overflow-x-auto">
              <SuccessStoriesManager />
            </div>
          </section>
        )}

        {selectedSection === "Newsletter" && (
          <section>
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
            console.log("✅ Submitted content:", data);
            setContentModalOpen(false);
          }}
        />
      )}
    </div>
  </div>
);

  
}
