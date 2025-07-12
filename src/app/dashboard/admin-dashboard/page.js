'use client';
import React, { useRef, useState } from 'react';
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
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [contentType, setContentType] = useState("");
  const [contentInitialData, setContentInitialData] = useState(null);

  const handleOpenModal = (type, data = null) => {
    setContentType(type);
    setContentInitialData(data);
    setContentModalOpen(true);
  };

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
    const ref = sectionRefs[section];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-tr from-white to-[#695aa6]/10">
      <Sidebar onNavigate={handleNavigate} onAddServiceClick={() => setShowAddServiceModal(true)} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8 overflow-y-auto space-y-12">
          {/* Dashboard */}
          <section ref={sectionRefs["Dashboard"]} className="scroll-mt-20">
            <StatCard />
          </section>

          {/* Service Approvals */}
          <section ref={sectionRefs["Service Approvals"]} className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">Pending Service Approvals</h2>
            <div className="bg-white rounded-xl p-4 shadow max-h-[500px] overflow-y-auto">
              <ServicesApprovalTable />
            </div>
          </section>

          {/* Manage Users */}
          <section ref={sectionRefs["Manage Users"]} className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">Manage Users & Providers</h2>
            <div className="space-y-8">
              {/* Users */}
              <div className="bg-white rounded-xl p-4 shadow max-h-[300px] overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
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

              {/* Providers */}
              <div className="bg-white rounded-xl p-4 shadow max-h-[300px] overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
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
            </div>
          </section>

          {/* Manage Services */}
          <section ref={sectionRefs["Manage Services"]} className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">Manage Services</h2>
            <div className="bg-white rounded-xl p-4 shadow max-h-[500px] overflow-y-auto">
              <ServicesTable />
            </div>
          </section>

          {/* Categories */}
          <section ref={sectionRefs["Categories"]} className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <div className="bg-white rounded-xl p-4 shadow max-h-[500px] overflow-y-auto">
              <CategoriesTable />
            </div>
          </section>

          {/* Complaints */}
          <section ref={sectionRefs["Complaints"]} className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">Complaints</h2>
            <div className="bg-white rounded-xl p-4 shadow max-h-[500px] overflow-y-auto">
              <ComplaintsTable />
            </div>
          </section>

          {/* Testimonials */}
          <section ref={sectionRefs["Testimonials"]} className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">Testimonials</h2>
            <div className="bg-white rounded-xl p-4 shadow max-h-[500px] overflow-y-auto">
              <TestimonialsTable />
            </div>
          </section>

          {/* Activity Log */}
          <section ref={sectionRefs["Activity"]} className="scroll-mt-20">
            <h2 className="text-xl font-semibold mb-4">Activity Log</h2>
            <div className="bg-white rounded-xl p-4 shadow max-h-[500px] overflow-y-auto">
              <ActivityLog />
            </div>
          </section>

          {/* Blogs */}
          <section ref={sectionRefs["Blogs"]} className="scroll-mt-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Blogs</h2>
            </div>
            <div className="bg-white rounded-xl p-4 shadow max-h-[500px] overflow-y-auto">
              <BlogsManager />
            </div>
          </section>

          {/* Success Stories */}
          <section ref={sectionRefs["Success Stories"]} className="scroll-mt-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Success Stories</h2>
            </div>
            <div className="bg-white rounded-xl p-4 shadow max-h-[500px] overflow-y-auto">
              <SuccessStoriesManager />
            </div>
          </section>

          {/* Newsletter */}
          <section ref={sectionRefs["Newsletter"]} className="scroll-mt-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Newsletter</h2>
            </div>
            <div className="bg-white rounded-xl p-4 shadow max-h-[500px] overflow-y-auto">
              <NewletterManager />
            </div>
          </section>
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
