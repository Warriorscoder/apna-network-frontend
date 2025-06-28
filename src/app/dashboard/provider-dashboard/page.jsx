"use client";
import { useState, useEffect } from "react";
import {
  Star,
  Bell,
  TrendingUp,
  Users,
  Award,
  Mail,
  LayoutDashboard,
  Briefcase,
  ListTodo,
  HelpCircle,
  UserCircle,
  Menu,
  X,
} from "lucide-react";
import ConditionalNavbar from "@/components/ConditionalNavbar";

const dummyRequests = [
  {
    id: 1,
    title: "Fix kitchen sink",
    status: "Pending",
    customer: "Amit",
    date: "2025-06-18",
  },
  {
    id: 2,
    title: "Install ceiling fan",
    status: "Completed",
    customer: "Priya",
    date: "2025-06-17",
  },
  {
    id: 3,
    title: "Paint bedroom walls",
    status: "Pending",
    customer: "Sunita",
    date: "2025-06-20",
  },
];

const dummyServices = [
  {
    id: 1,
    name: "Plumbing",
    description: "All kinds of pipe and sink repairs.",
    rate: "₹500/hr",
  },
  {
    id: 2,
    name: "Electrical Work",
    description: "Fan installation, wiring, and more.",
    rate: "₹600/hr",
  },
  {
    id: 3,
    name: "Painting",
    description: "Interior and exterior painting services.",
    rate: "₹30/sq.ft.",
  },
];

const RequestsPanel = () => (
  <div className="bg-white/70 rounded-xl shadow p-6 border border-white/30 text-gray-800 transition hover:shadow-lg">
    <h2 className="text-2xl font-semibold mb-4 text-[#695aa6]">
      Service Requests
    </h2>
    <div className="space-y-3">
      {dummyRequests.map((req) => (
        <div
          key={req.id}
          className="bg-white/90 rounded-lg p-3 flex justify-between items-center shadow-sm"
        >
          <div>
            <p className="font-bold text-base text-gray-700">{req.title}</p>
            <p className="text-xs text-gray-500">
              <UserCircle className="inline w-4 h-4 mr-1" /> {req.customer} |{" "}
              {req.date}
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
      ))}
    </div>
  </div>
);

const ServicesPanel = () => (
  <div className="bg-white/70 rounded-xl shadow p-6 border border-white/30 text-gray-800 transition hover:shadow-lg">
    <h2 className="text-2xl font-semibold mb-4 text-[#695aa6]">
      Manage Your Services
    </h2>
    <div className="space-y-3">
      {dummyServices.map((service) => (
        <div
          key={service.id}
          className="bg-white/90 rounded-lg p-3 flex justify-between items-center shadow-sm"
        >
          <div>
            <h3 className="font-bold text-base text-gray-700">
              {service.name}
            </h3>
            <p className="text-xs text-gray-500">{service.description}</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-gray-600">
              {service.rate}
            </span>
            <button className="text-xs text-blue-600 hover:underline mt-1">
              Edit
            </button>
          </div>
        </div>
      ))}
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
      Our support team is here to help you succeed. Get assistance with:
    </p>
    <ul className="text-gray-600 text-sm mb-4 list-disc list-inside">
      <li>Setting up your profile and services</li>
      <li>Managing customer requests</li>
      <li>Optimizing your business listing</li>
    </ul>
    <button className="w-full flex items-center justify-center gap-2 bg-[#695aa6]/90 hover:bg-[#5a4d8a]/90 rounded-lg p-2 text-white mt-2 transition">
      <Mail className="w-4 h-4" />
      <span className="text-sm font-medium">
        Email: support@apnanetwork.com
      </span>
    </button>
  </div>
);

export default function ProviderDashboard() {
  // --- Backend/Auth Logic Start ---
  // The following lines handle user authentication and redirection.
  // They have been commented out to run the page without a backend.

  // const { user, loading } = useAuth(); // This hook gets user data and loading state from the authentication context.
  // const router = useRouter(); // This is the Next.js hook for programmatic navigation, used here for redirection.

  // This useEffect hook would redirect the user to the homepage if they are not logged in.
  /*
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/"); // Redirect to HomePage if not logged in
    }
  }, [user, loading, router]);
  */

  // This conditional rendering prevents the dashboard from showing while the auth state is loading or if the user is not logged in.
  // A static user object is created below to allow the component to render without real authentication.
  /*
  if (loading || !user) {
    return null; // Or a spinner if you want
  }
  */

  // Mock user object to replace the one from useAuth
  const user = { name: "Provider" };
  // --- Backend/Auth Logic End ---

  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeView) {
      case "requests":
        return <RequestsPanel />;
      case "services":
        return <ServicesPanel />;
      case "help":
        return <HelpPanel />;
      case "dashboard":
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/70 rounded-xl shadow p-8 border border-white/30 flex flex-col items-center text-center transition hover:shadow-lg">
              <h2 className="text-xl font-semibold mb-3 text-[#695aa6]">
                Your Services
              </h2>
              <p className="text-gray-700 mb-6">
                View and edit the services you offer.
              </p>
              <button
                onClick={() => setActiveView("services")}
                className="px-5 py-2 rounded-md font-semibold text-white bg-gradient-to-r from-[#695aa6] to-[#5a4d8a] hover:opacity-90 transition"
              >
                Manage Services
              </button>
            </div>
            <div className="bg-white/70 rounded-xl shadow p-8 border border-white/30 flex flex-col items-center text-center transition hover:shadow-lg">
              <h2 className="text-xl font-semibold mb-3 text-[#695aa6]">
                Requests
              </h2>
              <p className="text-gray-700 mb-6">
                See new service requests from users.
              </p>
              <button
                onClick={() => setActiveView("requests")}
                className="px-5 py-2 rounded-md font-semibold text-white bg-gradient-to-r from-[#695aa6] to-[#5a4d8a] hover:opacity-90 transition"
              >
                View Requests
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#a395d4] via-[#b8a7e8] to-[#8b7cc8] min-h-screen flex flex-col">
      {/* Navbar at the very top */}
      {/* The 'user' object from useAuth would be passed here to show the user's name. */}
      <ConditionalNavbar showProfile={true} userName={user?.name || "Guest"} />

      <main className="flex flex-1 pt-20">
        {/* Sidebar */}
        <aside
          className={`
            ${sidebarOpen ? "w-64" : "w-16"}
            min-h-screen p-2 flex flex-col text-white sticky top-0 transition-all duration-300 bg-[rgba(60,50,100,0.92)]
            z-20
          `}
        >
          {/* Toggle button */}
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

        {/* Main content section */}
        <section
          className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden w-full"
          style={{
            background: "transparent",
          }}
        >
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-30">
              <div
                className="absolute top-20 left-10 w-32 h-32 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"
                style={{ backgroundColor: "rgba(105, 90, 166, 0.6)" }}
              ></div>
              <div
                className="absolute top-40 right-20 w-40 h-40 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"
                style={{ backgroundColor: "rgba(105, 90, 166, 0.5)" }}
              ></div>
              <div
                className="absolute bottom-20 left-1/3 w-36 h-36 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"
                style={{ backgroundColor: "rgba(105, 90, 166, 0.7)" }}
              ></div>
            </div>

            {/* Rural Landscape Illustration */}
            <div className="absolute bottom-0 left-0 right-0 h-2/3">
              <svg viewBox="0 0 1200 400" className="w-full h-full">
                {/* Mountains */}
                <path
                  d="M0,200 L200,80 L400,120 L600,60 L800,100 L1000,40 L1200,80 L1200,400 L0,400 Z"
                  fill="#695aa6"
                  opacity="0.2"
                />
                <path
                  d="M0,240 L150,140 L350,180 L550,120 L750,160 L950,100 L1200,140 L1200,400 L0,400 Z"
                  fill="#695aa6"
                  opacity="0.3"
                />

                {/* Fields */}
                <path
                  d="M0,280 L1200,260 L1200,400 L0,400 Z"
                  fill="rgba(105, 90, 166, 0.4)"
                />
                <path
                  d="M0,320 L1200,300 L1200,400 L0,400 Z"
                  fill="rgba(105, 90, 166, 0.3)"
                />

                {/* House */}
                <rect x="800" y="240" width="60" height="40" fill="#8B4513" />
                <path d="M790,240 L830,210 L870,240 Z" fill="#CD853F" />

                {/* Windmill */}
                <rect x="1020" y="200" width="4" height="80" fill="#8B4513" />
                <g
                  transform="translate(1022,210) rotate(45)"
                  className="animate-spin"
                  style={{ animationDuration: "3s" }}
                >
                  <rect x="-20" y="-2" width="40" height="4" fill="#8B4513" />
                  <rect x="-2" y="-20" width="4" height="40" fill="#8B4513" />
                </g>

                {/* Trees */}
                <circle cx="200" cy="260" r="15" fill="#10b981" />
                <rect x="198" y="260" width="4" height="20" fill="#8B4513" />
                <circle cx="400" cy="270" r="12" fill="#10b981" />
                <rect x="398" y="270" width="4" height="15" fill="#8B4513" />
                <circle cx="600" cy="250" r="18" fill="#10b981" />
                <rect x="598" y="250" width="4" height="25" fill="#8B4513" />
              </svg>
            </div>
          </div>

          {/* Subtle blur overlay */}
          <div className="absolute inset-0 z-0 backdrop-blur-md pointer-events-none" />

          {/* Centered Welcome & Motto */}
          <div className="relative flex flex-col items-center justify-center min-h-[50vh] py-12 z-10 w-full">
            <UserCircle className="w-20 h-20 text-white drop-shadow-lg bg-gradient-to-br from-[#695aa6] to-[#b8a7e8] rounded-full p-2 mb-4" />
            <h1
              className="text-4xl md:text-5xl font-extrabold mb-4 text-white text-center"
              style={{
                textShadow: "0 4px 24px rgba(60,50,100,0.65), 0 1px 0 #000",
                letterSpacing: "0.5px",
              }}
            >
              {/* This greeting would dynamically display the logged-in user's name. */}
              Welcome, {user?.name || "Guest"}!
            </h1>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-3xl md:text-3xl font-bold text-center"
                style={{
                  color: "#695aa6",
                  letterSpacing: "0.4px",
                }}
              >
                Grow Your Business with Apna Network
              </span>
            </div>
            <p
              className="text-lg md:text-xl text-white max-w-xl mx-auto mb-2 text-center"
              style={{
                textShadow: "0 2px 12px rgba(60,50,100,0.45), 0 1px 0 #000",
              }}
            >
              Transform your local service business with our comprehensive
              platform.
              <br />
              Get more customers, manage requests efficiently, and build lasting
              relationships in your community.
            </p>
          </div>

          {/* Notification */}
          <div className="flex items-center gap-3 bg-white/30 backdrop-blur-sm rounded-lg px-4 py-3 shadow border border-white/30 mb-8 max-w-md mx-auto z-10">
            <Bell className="w-5 h-5 text-[#695aa6]" />
            <span className="text-sm text-gray-700">
              You have 3 new requests
            </span>
          </div>

          {/* Main Dashboard Content */}
          <div className="w-full z-10 px-4 md:px-10">{renderContent()}</div>
        </section>
      </main>
      <style jsx>{`
        .animate-pulse {
          animation: pulse 6s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.1);
          }
        }
        .animate-spin {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
