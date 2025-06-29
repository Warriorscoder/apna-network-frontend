'use client';
import React, { useState } from "react";

export default function Sidebar({ onNavigate, onAddServiceClick }) {
  const [contentOpen, setContentOpen] = useState(false);

  const sections = [
    { name: "Dashboard", icon: "🏠" },
    { name: "Service Approvals", icon: "⏳" },
    { name: "Manage Users", icon: "👥" },
    { name: "Manage Services", icon: "🧾" },
    { name: "Categories", icon: "📂" },
    { name: "Complaints", icon: "⚠️" },
    { name: "Testimonials", icon: "💬" },
    { name: "Activity", icon: "📜" },
  ];

  const contentSections = [
    { name: "Blogs", icon: "📝" },
    { name: "Success Stories", icon: "🌟" },
    { name: "Newsletter", icon: "📧" },
  ];

  return (
    <aside className="w-64 bg-[#695aa6] text-white flex flex-col min-h-screen shadow-lg">
      <div className="p-6 text-2xl font-extrabold tracking-wide">Admin Panel</div>
      {/* Add Service Button */}
      {onAddServiceClick && (
        <div className="px-4 mb-2">
          <button
            onClick={onAddServiceClick}
            className="w-full bg-white text-[#695aa6] font-semibold px-4 py-2 rounded mb-2 hover:bg-[#f3f0fa] border border-[#695aa6]"
          >
            + Add Service
          </button>
        </div>
      )}
      <nav className="flex-1">
        <ul className="space-y-1 px-4">
          {sections.map((item) => (
            <li key={item.name}>
              <button
                type="button"
                onClick={() => onNavigate(item.name)}
                className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition font-medium focus:outline-none"
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            </li>
          ))}
          {/* Content Management Group */}
          <li>
            <button
              type="button"
              onClick={() => setContentOpen((prev) => !prev)}
              className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition font-medium focus:outline-none"
              aria-expanded={contentOpen}
            >
              <span>📂</span>
              <span>Content Management</span>
              <span className="ml-auto">{contentOpen ? "▲" : "▼"}</span>
            </button>
            {contentOpen && (
              <ul className="ml-6 mt-1 space-y-1">
                {contentSections.map((item) => (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={() => onNavigate(item.name)}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition font-medium focus:outline-none"
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>
      <div className="px-6 py-4 border-t border-white/20 font-semibold">Logged in as Admin</div>
    </aside>
  );
}
