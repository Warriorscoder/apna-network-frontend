"use client";

import {
  LayoutDashboard,
  ListTodo,
  Briefcase,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

const Sidebar = ({ activeView, setActiveView }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
      className={`${
        sidebarOpen ? "w-64" : "w-16"
      } min-h-screen p-2 flex flex-col text-white sticky top-20 transition-all duration-300 bg-[rgba(60,50,100,0.92)] z-20 backdrop-blur-sm`}
    >
      <button
        className="flex items-center justify-center mb-4 mt-2 w-10 h-10 rounded hover:bg-white/10 transition self-end"
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map(({ key, icon: Icon, label }) => (
            <li key={key}>
              <button
                onClick={() => setActiveView(key)}
                className={`w-full flex items-center gap-2 p-3 rounded-lg transition min-w-0 ${
                  activeView === key
                    ? "bg-white/20 font-bold"
                    : "hover:bg-white/10"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span
                  className={`truncate flex-1 text-left transition-all duration-200 ${
                    !sidebarOpen ? "opacity-0 w-0" : "opacity-100 w-auto ml-2"
                  }`}
                >
                  {label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
