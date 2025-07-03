"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/app/context/Authcontext";
import {
  LayoutDashboard,
  ListTodo,
  Briefcase,
  HelpCircle,
  Menu,
  X,
  Bell,
  UserCircle,
} from "lucide-react";
import ConditionalNavbar from "@/components/ConditionalNavbar";

const getAuthToken = () => localStorage.getItem("token");

const RequestsPanel = ({ requests }) => (
  <div className="bg-white/70 rounded-xl shadow p-6 border border-white/30 text-gray-800 transition hover:shadow-lg">
    <h2 className="text-2xl font-semibold mb-4 text-[#695aa6]">
      Service Requests
    </h2>
    <div className="space-y-3">
      {requests && requests.length > 0 ? (
        requests.map((req) => (
          <div
            key={req._id}
            className="bg-white/90 rounded-lg p-3 flex justify-between items-center shadow-sm"
          >
            <div>
              <p className="font-bold text-base text-gray-700">
                {req.serviceType}
              </p>
              <p className="text-xs text-gray-500">
                <UserCircle className="inline w-4 h-4 mr-1" />{" "}
                {req.customerName || "A User"} |{" "}
                {new Date(req.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-3 py-1 text-xs rounded-full font-semibold ${
                req.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {req.status}
            </span>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 py-4">
          No service requests found.
        </p>
      )}
    </div>
  </div>
);

const ServicesPanel = ({ services }) => (
  <div className="bg-white/70 rounded-xl shadow p-6 border border-white/30 text-gray-800 transition hover:shadow-lg">
    <h2 className="text-2xl font-semibold mb-4 text-[#695aa6]">
      Manage Your Services
    </h2>
    <div className="space-y-3">
      {services && services.length > 0 ? (
        services.map((service) => (
          <div
            key={service._id || service}
            className="bg-white/90 rounded-lg p-3 flex justify-between items-center shadow-sm"
          >
            <div>
              <h3 className="font-bold text-base text-gray-700">
                {service.name || service}
              </h3>
              <p className="text-xs text-gray-500">{service.description}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-600">
                {service.rate || "N/A"}
              </span>
              <button className="text-xs text-blue-600 hover:underline mt-1">
                Edit
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 py-4">
          You have not added any services yet.
        </p>
      )}
    </div>
    <div className="text-center mt-5">
      <button className="px-5 py-2 rounded-md font-semibold text-white bg-gradient-to-r from-[#695aa6] to-[#5a4d8a] hover:opacity-90 transition">
        Add New Service
      </button>
    </div>
  </div>
);

const HelpPanel = () => (
  <div className="bg-white/70 rounded-xl shadow p-6 border border-white/30 text-gray-800 transition hover:shadow-lg">
    <h2 className="text-2xl font-semibold mb-4 text-[#695aa6]">Need Help?</h2>
    <p className="mb-2 text-gray-700">
      Our support team is here to help you succeed.
    </p>
    <ul className="text-gray-600 text-sm mb-4 list-disc list-inside">
      <li>Setting up your profile and services</li>
      <li>Managing customer requests</li>
      <li>Optimizing your business listing</li>
    </ul>
    <button className="w-full flex items-center justify-center gap-2 bg-[#695aa6]/90 hover:bg-[#5a4d8a]/90 rounded-lg p-2 text-white mt-2 transition">
      <HelpCircle className="w-4 h-4" />
      <span className="text-sm font-medium">support@apnanetwork.com</span>
    </button>
  </div>
);

export default function ProviderDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && (!user || user.role !== "provider")) {
      router.replace("/");
      return;
    }

    if (user) {
      const token = getAuthToken();
      if (!token) {
        setError("Authentication error. Please log in again.");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      axios
        .get(`${apiBaseUrl}/providers/services`, { headers })
        .then((res) => setServices(res.data.data))
        .catch((err) => {
          console.error("Failed to fetch services:", err);
          setError("Failed to fetch services.");
        });

      axios
        .get(`${apiBaseUrl}/api/providers/requests`, { headers })
        .then((res) => setRequests(res.data.data))
        .catch((err) => {
          console.error("Failed to fetch requests:", err);
          setError("Failed to fetch requests.");
        });
    }
  }, [user, loading, router]);

  // if (loading || !user) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <p>Loading Dashboard...</p>
  //     </div>
  //   );
  // }

  const renderContent = () => {
    if (error) {
      return (
        <div className="text-red-500 text-center p-4 bg-red-100 rounded-lg">
          {error}
        </div>
      );
    }

    switch (activeView) {
      case "requests":
        return <RequestsPanel requests={requests} />;
      case "services":
        return <ServicesPanel services={services} />;
      case "help":
        return <HelpPanel />;
      default:
        return <p>Welcome to your dashboard!</p>;
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#a395d4] via-[#b8a7e8] to-[#8b7cc8] min-h-screen flex flex-col">
      <ConditionalNavbar />
      <main className="flex flex-1 pt-20">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-16"
          } min-h-screen p-2 flex flex-col text-white sticky top-0 transition-all duration-300 bg-[rgba(60,50,100,0.92)] z-20`}
        >
          <button
            className="flex items-center justify-center mb-4 mt-2 w-10 h-10 rounded hover:bg-white/10 transition self-end"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          <nav className="flex-1">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveView("dashboard")}
                  className={`w-full flex items-center gap-2 p-3 rounded-lg transition min-w-0 ${
                    activeView === "dashboard"
                      ? "bg-white/20 font-bold"
                      : "hover:bg-white/10"
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                  <span
                    className={`truncate flex-1 text-left transition-all duration-200 ${
                      !sidebarOpen ? "opacity-0 w-0" : "opacity-100 w-auto ml-2"
                    }`}
                  >
                    Dashboard
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView("requests")}
                  className={`w-full flex items-center gap-2 p-3 rounded-lg transition min-w-0 ${
                    activeView === "requests"
                      ? "bg-white/20 font-bold"
                      : "hover:bg-white/10"
                  }`}
                >
                  <ListTodo className="w-5 h-5 flex-shrink-0" />
                  <span
                    className={`truncate flex-1 text-left transition-all duration-200 ${
                      !sidebarOpen ? "opacity-0 w-0" : "opacity-100 w-auto ml-2"
                    }`}
                  >
                    Requests
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView("services")}
                  className={`w-full flex items-center gap-2 p-3 rounded-lg transition min-w-0 ${
                    activeView === "services"
                      ? "bg-white/20 font-bold"
                      : "hover:bg-white/10"
                  }`}
                >
                  <Briefcase className="w-5 h-5 flex-shrink-0" />
                  <span
                    className={`truncate flex-1 text-left transition-all duration-200 ${
                      !sidebarOpen ? "opacity-0 w-0" : "opacity-100 w-auto ml-2"
                    }`}
                  >
                    Manage Services
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView("help")}
                  className={`w-full flex items-center gap-2 p-3 rounded-lg transition min-w-0 ${
                    activeView === "help"
                      ? "bg-white/20 font-bold"
                      : "hover:bg-white/10"
                  }`}
                >
                  <HelpCircle className="w-5 h-5 flex-shrink-0" />
                  <span
                    className={`truncate flex-1 text-left transition-all duration-200 ${
                      !sidebarOpen ? "opacity-0 w-0" : "opacity-100 w-auto ml-2"
                    }`}
                  >
                    Help
                  </span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <section className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden w-full">
          {renderContent()}
        </section>
      </main>
    </div>
  );
}
