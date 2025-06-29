'use client';
import React, { useState, useRef } from "react";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import StatCard from "@/components/ui/StatCard";
import UsersManager from "@/components/ui/UsersManager";
import ServicesTable from "@/components/ui/ServicesTable";
import ServicesApprovalTable from "@/components/ui/ServicesApprovalTable";
import CategoriesTable from "@/components/ui/CategoriesTable";
import ComplaintsTable from "@/components/ui/ComplaintsTable";
import TestimonialsTable from "@/components/ui/TestimonialsTable";
import ActivityLog from "@/components/ui/ActivityLog";
import AddServiceModal from "@/components/ui/AddServiceModal";
import BlogsManager from "@/components/ui/BlogsManager";
import SuccessStoriesManager from "@/components/ui/SuccessStoriesManager";
import NewsletterManager from "@/components/ui/NewsletterManager";

// Example stat cards data
const initialStats = [
  { label: "Total Users", value: 120, icon: "👥" },
  { label: "Providers", value: 45, icon: "🛠️" },
  { label: "Takers", value: 75, icon: "🧑💼" },
  { label: "Services", value: 32, icon: "🧾" },
  { label: "Pending Services", value: 8, icon: "⏳" },
  { label: "Categories", value: 6, icon: "📂" },
  { label: "Complaints", value: 4, icon: "⚠️" },
  { label: "Newsletter Subs", value: 200, icon: "📧" },
];

// Example data for other sections
const initialServices = [
  { id: 1, title: "Plumbing", provider: "Ravi Kumar", category: "Plumbing", status: "Active" },
  { id: 2, title: "Tailoring", provider: "Sita Devi", category: "Tailoring", status: "Pending" },
];

const initialPendingServices = [
  { id: 3, title: "Roof Repair", provider: "Ravi Kumar", category: "Other", description: "Fixing leaks in tiled roofs." },
  { id: 4, title: "Handicraft Workshop", provider: "Sita Devi", category: "Other", description: "Handmade baskets and mats." },
];

const initialCategories = [
  { id: 1, name: "Plumbing", description: "All plumbing related work." },
  { id: 2, name: "Carpentry", description: "Woodwork and repairs." },
];

const initialComplaints = [
  { id: 1, title: "Late Arrival", user: "Sita Devi", provider: "Ravi Kumar", status: "Pending" },
  { id: 2, title: "Overcharged", user: "Ravi Kumar", provider: "Sita Devi", status: "Resolved" },
];

const initialTestimonials = [
  { id: 1, user: "Ravi Kumar", message: "Great service!", status: "Pending" },
  { id: 2, user: "Sita Devi", message: "Very helpful.", status: "Pending" },
];

const initialActivity = [
  { message: "New provider registered: Ravi Kumar", date: "2025-06-24 10:00" },
  { message: "Complaint resolved: Overcharged", date: "2025-06-23 15:30" },
];

export default function AdminDashboard() {
  // State for each section
  const [services, setServices] = useState(initialServices);
  const [pendingServices, setPendingServices] = useState(initialPendingServices);
  const [categories] = useState(initialCategories);
  const [complaints] = useState(initialComplaints);
  const [testimonials] = useState(initialTestimonials);
  const [activity] = useState(initialActivity);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);

  // Section refs for scrolling
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

  // Sidebar navigation handler
  const handleNavigate = (section) => {
    const ref = sectionRefs[section];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Add Service modal handlers
  const handleOpenAddService = () => setShowAddServiceModal(true);
  const handleCloseAddService = () => setShowAddServiceModal(false);

  // Add a new service (only title required, others blank/default)
  const handleAddService = (title) => {
    setServices([
      ...services,
      {
        id: Date.now(),
        title,
        provider: "",
        category: "",
        status: "Active",
      },
    ]);
  };

  // Approve a pending service
  const handleApprove = (service) => {
    setPendingServices(prev => prev.filter(s => s.id !== service.id));
    setServices(prev => [
      ...prev,
      {
        id: Date.now(),
        title: service.title,
        provider: service.provider,
        category: service.category,
        status: "Active",
      },
    ]);
  };

  // Reject a pending service
  const handleReject = (serviceId) => {
    setPendingServices(prev => prev.filter(s => s.id !== serviceId));
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-tr from-white to-[#695aa6]/10">
      <Sidebar
        onNavigate={handleNavigate}
        onAddServiceClick={handleOpenAddService}
      />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-white to-[#695aa6]/10">
          {/* Stat Cards */}
          <section ref={sectionRefs["Dashboard"]} id="Dashboard" className="mb-12 scroll-mt-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
              {initialStats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          </section>

          {/* Pending Service Approvals */}
          <section ref={sectionRefs["Service Approvals"]} id="Service-Approvals" className="mb-12 scroll-mt-20">
            <h3 className="text-lg font-bold text-[#695aa6] mb-4">Pending Service Approvals</h3>
            <ServicesApprovalTable
              services={pendingServices}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </section>

          {/* Manage Users & Providers */}
          <section ref={sectionRefs["Manage Users"]} id="Manage-Users" className="mb-12 scroll-mt-20">
            <h3 className="text-lg font-bold text-[#695aa6] mb-4">Manage Users & Providers</h3>
            <UsersManager />
          </section>

          {/* Recent Services */}
          <section ref={sectionRefs["Manage Services"]} id="Manage-Services" className="mb-12 scroll-mt-20">
            <h3 className="text-lg font-bold text-[#695aa6] mb-4">Recent Services</h3>
            <ServicesTable services={services} />
          </section>

          {/* Categories */}
          <section ref={sectionRefs["Categories"]} id="Categories" className="mb-12 scroll-mt-20">
            <h3 className="text-lg font-bold text-[#695aa6] mb-4">Categories</h3>
            <CategoriesTable categories={categories} />
          </section>

          {/* Complaints */}
          <section ref={sectionRefs["Complaints"]} id="Complaints" className="mb-12 scroll-mt-20">
            <h3 className="text-lg font-bold text-[#695aa6] mb-4">Recent Complaints</h3>
            <ComplaintsTable complaints={complaints} />
          </section>

          {/* Testimonials */}
          <section ref={sectionRefs["Testimonials"]} id="Testimonials" className="mb-12 scroll-mt-20">
            <h3 className="text-lg font-bold text-[#695aa6] mb-4">Pending Testimonials</h3>
            <TestimonialsTable testimonials={testimonials} />
          </section>

          {/* Activity */}
          <section ref={sectionRefs["Activity"]} id="Activity" className="mb-12 scroll-mt-20">
            <h3 className="text-lg font-bold text-[#695aa6] mb-4">Recent Activity</h3>
            <ActivityLog activity={activity} />
          </section>

          {/* Blogs */}
          <section ref={sectionRefs["Blogs"]} id="Blogs" className="mb-12 scroll-mt-20">
            <h3 className="text-lg font-bold text-[#695aa6] mb-4">Blogs</h3>
            <BlogsManager />
          </section>

          {/* Success Stories */}
          <section ref={sectionRefs["Success Stories"]} id="Success-Stories" className="mb-12 scroll-mt-20">
            <h3 className="text-lg font-bold text-[#695aa6] mb-4">Success Stories</h3>
            <SuccessStoriesManager />
          </section>

          {/* Newsletter */}
          <section ref={sectionRefs["Newsletter"]} id="Newsletter" className="mb-12 scroll-mt-20">
            <h3 className="text-lg font-bold text-[#695aa6] mb-4">Newsletter Issues</h3>
            <NewsletterManager />
          </section>
        </main>
      </div>
      <AddServiceModal
        open={showAddServiceModal}
        onClose={handleCloseAddService}
        onAdd={handleAddService}
      />
    </div>
  );
}
