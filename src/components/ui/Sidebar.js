'use client';

import React, { useState } from "react";
import { Menu } from "lucide-react"; // Optional icons

export default function Sidebar({ onNavigate, onAddServiceClick, collapsed, toggleCollapse }) {
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
    <aside
      className={`fixed top-0 left-0 h-screen z-50 bg-[#695aa6] text-white shadow-lg transition-all duration-300 overflow-y-auto${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Sidebar Header with Toggle Button */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/20">
        {!collapsed && <h2 className="text-lg font-bold">Admin Panel</h2>}
        <button
           onClick={toggleCollapse}
           className="text-white hover:opacity-75 transition"
           title="Toggle Sidebar"
        >
           <Menu size={22} />
        </button>
      </div>

      {/* Add Service Button */}
      {onAddServiceClick && (
        <div className="px-4 mt-4">
          <button
            onClick={onAddServiceClick}
            className="w-full bg-white text-[#695aa6] font-semibold px-4 py-2 rounded hover:bg-[#f3f0fa] border border-[#695aa6] transition text-sm"
          >
            {!collapsed ? "+ Add Category" : "+"}
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="mt-6 px-2 flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {sections.map((item) => (
            <li key={item.name}>
              <button
                type="button"
                onClick={() => onNavigate(item.name)}
                className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition font-medium"
              >
                <span>{item.icon}</span>
                {!collapsed && <span>{item.name}</span>}
              </button>
            </li>
          ))}

          {/* Content Management Dropdown */}
          <li>
            <button
              type="button"
              onClick={() => setContentOpen((prev) => !prev)}
              className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition font-medium"
            >
              <span>📂</span>
              {!collapsed && <span>Content Management</span>}
              {!collapsed && (
                <span className="ml-auto">
                  {contentOpen ? "▲" : "▼"}
                </span>
              )}
            </button>

            {contentOpen && !collapsed && (
              <ul className="ml-6 mt-1 space-y-1">
                {contentSections.map((item) => (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={() => onNavigate(item.name)}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition font-medium"
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

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/20 text-sm">
        {!collapsed ? "Logged in as Admin" : "⚙️"}
      </div>
    </aside>
  );
}
