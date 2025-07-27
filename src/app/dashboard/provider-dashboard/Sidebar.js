"use client";
import {
  LayoutDashboard,
  ListTodo,
  Briefcase,
  HelpCircle,
  Menu,
  X,
  UserCircle,
} from "lucide-react";
import { useState, useEffect } from "react";

const Sidebar = ({ activeView, setActiveView, sidebarOpen, setSidebarOpen, isMobile }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const menuItems = [
    { key: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { key: "requests", icon: ListTodo, label: "Requests" },
    { key: "services", icon: Briefcase, label: "Services" },
    { key: "help", icon: HelpCircle, label: "Help" },
  ];

  return (
    <aside
      className={`
        fixed lg:sticky top-16 lg:top-20 left-0 h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)]
        ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-20"}
        bg-[rgba(60,50,100,0.95)] backdrop-blur-md text-white
        transition-all duration-300 ease-in-out z-40 lg:z-30
        flex flex-col border-r border-white/10
      `}
    >
      {/* Sidebar header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between lg:justify-center">
        <div className={`${sidebarOpen ? "opacity-100" : "opacity-0 lg:hidden"}`}>
          <span className="font-bold text-lg">Provider Menu</span>
        </div>
        {sidebarOpen && (
          <button
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" />
          </button>
        )}
        {!isMobile && (
          <button
            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map(({ key, icon: Icon, label }) => (
            <li key={key}>
              <button
                onClick={() => setActiveView(key)}
                className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all duration-200 group ${
                  activeView === key
                    ? "bg-white/20 text-white shadow-lg"
                    : "hover:bg-white/10 text-white/80 hover:text-white"
                } ${!sidebarOpen ? "lg:justify-center" : ""}`}
                title={!sidebarOpen ? label : ''}
              >
                <Icon className={`w-6 h-6 flex-shrink-0 ${
                  activeView === key ? "text-white" : "text-white/80 group-hover:text-white"
                }`} />
                <span
                  className={`font-medium transition-opacity duration-300 ${
                    sidebarOpen ? "opacity-100" : "lg:opacity-0 lg:sr-only"
                  }`}
                >
                  {label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User info */}
      <div className={`p-4 border-t border-white/10 ${sidebarOpen ? "" : "lg:hidden"}`}>
        <div className="flex items-center gap-3">
          <UserCircle className="w-8 h-8 text-white/80 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              Provider Account
            </p>
            <p className="text-xs text-white/60">Service Provider</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
