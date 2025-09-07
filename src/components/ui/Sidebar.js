'use client';

import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";

export default function Sidebar({
  onNavigate,
  onAddServiceClick,
  collapsed,
  toggleCollapse,
  fixed = true,
  offsetTop = 0
}) {
  const [contentOpen, setContentOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && !collapsed) {
      toggleCollapse();
    }
  }, [isMobile]);

  const sections = [
    { name: "Dashboard", icon: "🏠" },
    { name: "Service Approvals", icon: "⏳" },
    { name: "Manage Users", icon: "👥" },
    { name: "Categories", icon: "📂" },
    { name: "Activity", icon: "📜" },
  ];

  const contentSections = [
    { name: "Blogs", icon: "📝" },
    { name: "Success Stories", icon: "🌟" },
    { name: "Newsletter", icon: "📧" },
  ];

  // width: fill wrapper when not fixed; use internal width only when fixed
  const widthClass = fixed ? (collapsed ? "w-20" : "w-64") : "w-full";

  return (
    <aside
      className={`${fixed ? "fixed left-0" : "relative"} ${widthClass} bg-[#695aa6] text-white shadow-lg transition-all duration-300 overflow-y-auto overflow-x-hidden flex flex-col`}
      style={
        fixed
          ? { top: offsetTop, height: `calc(100vh - ${offsetTop}px)`, zIndex: 40 }
          : { height: "100%" }
      }
    >
      {/* Header */}
      <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} px-4 py-4 border-b border-white/20`}>
        {!collapsed && <h2 className="text-lg font-bold">Admin Panel</h2>}
        <button
          onClick={toggleCollapse}
          className="text-white hover:opacity-75 transition"
          title="Toggle Sidebar"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-2 flex-1">
        <ul className="space-y-1">
          {/* Add Category inside the list, aligned like other items */}
          {onAddServiceClick && (
            <li>
              <button
                type="button"
                onClick={onAddServiceClick}
                className={`w-full flex items-center rounded-lg font-medium
                  ${collapsed
                    ? "justify-center px-0 py-3 hover:bg-white/10"
                    : "justify-start gap-3 px-3 py-2 bg-white text-[#695aa6] hover:bg-[#f3f0fa] border border-[#695aa6]"
                  } transition`}
                title={collapsed ? "Add Category" : undefined}
              >
                <span className="text-lg leading-none">➕</span>
                {!collapsed && <span>Add Category</span>}
              </button>
            </li>
          )}

          {sections.map((item) => (
            <li key={item.name}>
              <button
                type="button"
                onClick={() => onNavigate(item.name)}
                className={`w-full text-left flex items-center rounded-lg hover:bg-white/10 transition font-medium
                  ${collapsed ? "justify-center px-0 py-3" : "justify-start gap-3 px-3 py-2"}`}
                title={collapsed ? item.name : undefined}
              >
                <span className="text-lg leading-none">{item.icon}</span>
                {!collapsed && <span>{item.name}</span>}
              </button>
            </li>
          ))}

          {/* Content Management */}
          <li className="mt-2">
            <div className={`w-full flex items-center rounded-lg font-medium ${collapsed ? "justify-center px-0 py-2" : "justify-start gap-3 px-3 py-2"}`}>
              <span>📂</span>
              {!collapsed && <span>Content Management</span>}
            </div>

            {!collapsed && (
              <ul className="ml-3 mt-1 space-y-1">
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

            {collapsed && (
              <ul className="mt-1 space-y-1">
                {contentSections.map((item) => (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={() => onNavigate(item.name)}
                      className="w-full flex items-center justify-center px-0 py-2 rounded-lg hover:bg-white/10 transition font-medium"
                      title={item.name}
                    >
                      <span>{item.icon}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className={`px-4 py-4 border-t border-white/20 text-sm ${collapsed ? "text-center" : ""}`}>
        {!collapsed ? "Logged in as Admin" : "⚙️"}
      </div>
    </aside>
  );
}
