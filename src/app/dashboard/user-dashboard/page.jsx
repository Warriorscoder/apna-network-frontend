"use client";
import React, { useEffect, useState } from "react";
import {
  Menu,
  X,
  UserCircle,
  Bell,
  Briefcase,
  ListTodo,
  HelpCircle,
  LayoutDashboard,
} from "lucide-react";
import ConditionalNavbar from "../../../components/ConditionalNavbar";
import DashboardPanel from "./DashboardPanel";
import ServicesPanel from "./ServicesPanel";
import RequestsPanel from "./RequestsPanel";
import HelpPanel from "./HelpPanel";
import { useDummyAPI } from "@/app/hooks/useDummyAPI";

const useClientGreeting = () => {
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return greeting;
};

export default function UserDashboard() {
  const { user } = useDummyAPI();
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modalData, setModalData] = useState({
    isOpen: false,
    provider: null,
    serviceType: "",
    showDetails: false,
  });

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardPanel setActiveView={setActiveView} />;
      case "services":
        return <ServicesPanel onRequest={setModalData} />;
      case "requests":
        return <RequestsPanel />;
      case "help":
        return <HelpPanel />;
      default:
        return <DashboardPanel setActiveView={setActiveView} />;
    }
  };

  const greeting = useClientGreeting();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#a395d4] via-[#b8a7e8] to-[#8b7cc8] flex flex-col">
      <ConditionalNavbar />
      <main className="flex flex-1 pt-20">
        {/* Sidebar */}
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
              {[
                { key: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
                { key: "services", icon: Briefcase, label: "Services" },
                { key: "requests", icon: ListTodo, label: "Requests" },
                { key: "help", icon: HelpCircle, label: "Help" },
              ].map(({ key, icon: Icon, label }) => (
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

        {/* Main Section */}
        <section className="relative flex flex-col items-center flex-1">
          {/* Welcome Section */}
          <div className="relative flex flex-col items-center justify-center min-h-[50vh] py-12 z-10 w-full">
            <UserCircle className="w-20 h-20 text-white drop-shadow-lg bg-gradient-to-br from-[#695aa6] to-[#b8a7e8] rounded-full p-2 mb-4" />
            <h1
              className="text-4xl md:text-5xl font-extrabold text-white text-center"
              style={{
                textShadow: "0 4px 24px rgba(60,50,100,0.65), 0 1px 0 #000",
                letterSpacing: "0.5px",
              }}
              suppressHydrationWarning={true}
            >
              {greeting}, {user?.name ?? "Guest"}! 👋
            </h1>

            <div className="flex items-center mt-4">
              <span
                className="text-2xl md:text-3xl font-bold text-center"
                style={{
                  color: "#695aa6",
                  letterSpacing: "0.4px",
                  textShadow: "0 2px 12px rgba(255,255,255,0.8)",
                }}
              >
                Find Quality Services with Apna Network
              </span>
            </div>

            <p
              className="text-lg md:text-xl text-white max-w-xl mx-auto mb-2 text-center"
              style={{
                textShadow: "0 2px 12px rgba(60,50,100,0.45), 0 1px 0 #000",
              }}
            >
              Connect with trusted local service providers.
              <br />
              From home repairs to personal services, find reliable professionals in your community.
            </p>

            {/* User Info */}
            {/* <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Customer
                </span>
              </div>
            </div> */}
          </div>

          {/* Notification */}
          <div className="flex items-center gap-3 bg-white/30 backdrop-blur-sm rounded-lg px-4 py-3 shadow border border-white/30 mb-8 max-w-md mx-auto z-10">
            <Bell className="w-5 h-5 text-[#695aa6]" />
            <span className="text-sm text-gray-700">
              Notifications
            </span>
          </div>

          {renderContent()}
        </section>
      </main>

      {modalData.provider && (
        <ServiceRequestModal
          isOpen={modalData.isOpen}
          onClose={() =>
            setModalData({ isOpen: false, provider: null, serviceType: "" })
          }
          provider={modalData.provider}
          serviceType={modalData.serviceType}
        />
      )}
    </div>
  );
}
