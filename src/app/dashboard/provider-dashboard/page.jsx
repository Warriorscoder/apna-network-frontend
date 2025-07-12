"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import {
  UserCircle,
  Bell,
  LayoutDashboard,
  Briefcase,
  ListTodo,
  HelpCircle,
  Menu,
  X,
  Mail,
  Plus,
  Edit3,
  MapPin,
  Clock,
  Star,
  Phone,
  DollarSign,
} from "lucide-react";
import ConditionalNavbar from "../../../components/ConditionalNavbar";
import { useAuth } from "../../context/Authcontext";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// Custom hook for API calls with authentication
const useAuthenticatedAPI = () => {
  const { isAuthenticated, getCurrentUser } = useAuth();
  const router = useRouter();

  const makeRequest = useCallback(
    async (url, options = {}) => {
      const currentProvider = getCurrentUser();

      if (!isAuthenticated() || !currentProvider) {
        toast.error("Please login to continue");
        router.push("/login");
        throw new Error("Authentication required");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Session expired. Please login again");
        router.push("/login");
        throw new Error("No token found");
      }

      try {
        return await axios({
          url: `${API_BASE}${url}`,
          method: options.method || "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            ...options.headers,
          },
          ...options,
        });
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again");
          router.push("/login");
        }
        throw error;
      }
    },
    [isAuthenticated, getCurrentUser, router]
  );

  const currentProvider = getCurrentUser();

  return {
    makeRequest,
    isReady: !!(currentProvider && isAuthenticated()),
    providerId: currentProvider?._id,
    provider: currentProvider,
  };
};

// Requests Panel Component
const RequestsPanel = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { makeRequest, isReady, providerId } = useAuthenticatedAPI();

  useEffect(() => {
    const fetchRequests = async () => {
      if (!isReady) {
        setLoading(false);
        setError("Authentication required. Please login again.");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const endpoints = [
          `/services/requests/provider/${providerId}`,
          `/requests/provider/${providerId}`,
          `/providers/${providerId}/requests`,
        ];

        let response = null;
        for (const endpoint of endpoints) {
          try {
            response = await makeRequest(endpoint);
            if (response.data.success || response.data.requests) {
              break;
            }
          } catch (err) {
            console.warn(`Endpoint ${endpoint} failed:`, err.response?.status);
            continue;
          }
        }

        if (response && response.data) {
          const requestsData =
            response.data.requests || response.data.data || [];
          setRequests(Array.isArray(requestsData) ? requestsData : []);
        } else {
          setRequests([]);
        }
      } catch (err) {
        console.error("Failed to fetch requests:", err);
        if (err.response?.status === 404) {
          setRequests([]);
        } else {
          setError(err.response?.data?.message || "Failed to fetch requests");
        }
      } finally {
        setLoading(false);
      }
    };

    if (!isReady || !providerId) return;
    fetchRequests();
  }, [isReady, makeRequest, providerId]);

  const handleRequestAction = async (requestId, action) => {
    try {
      await makeRequest(`/requests/${requestId}/${action}`, {
        method: "PATCH",
      });
      toast.success(`Request ${action}ed successfully`);
      window.location.reload();
    } catch (error) {
      toast.error(`Failed to ${action} request`);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/70 rounded-xl shadow-lg p-6 border border-white/30 backdrop-blur-sm">
        <h2 className="text-2xl font-semibold mb-4 text-[#695aa6] flex items-center">
          <ListTodo className="w-6 h-6 mr-2" />
          Service Requests
        </h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#695aa6] mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/70 rounded-xl shadow-lg p-6 border border-white/30 backdrop-blur-sm">
        <h2 className="text-2xl font-semibold mb-4 text-[#695aa6] flex items-center">
          <ListTodo className="w-6 h-6 mr-2" />
          Service Requests
        </h2>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error: {error}</p>
          {error.includes("login") && (
            <button
              onClick={() => (window.location.href = "/login")}
              className="px-4 py-2 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 rounded-xl shadow-lg p-6 border border-white/30 backdrop-blur-sm hover:shadow-xl transition-all">
      <h2 className="text-2xl font-semibold mb-4 text-[#695aa6] flex items-center">
        <ListTodo className="w-6 h-6 mr-2" />
        Service Requests
        <span className="ml-auto bg-[#695aa6] text-white text-sm px-2 py-1 rounded-full">
          {requests.length}
        </span>
      </h2>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <ListTodo className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No service requests yet</p>
            <p className="text-sm text-gray-400">
              Requests will appear here when customers book your services
            </p>
          </div>
        ) : (
          requests.map((req, index) => (
            <div
              key={req._id || index}
              className="bg-white/90 rounded-lg p-4 shadow-sm hover:shadow-md transition-all border border-gray-100"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg">
                    {req.serviceType || req.title || "Service Request"}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <UserCircle className="w-4 h-4 mr-1" />
                    <span>
                      {req.customerName || req.customer || "Customer"}
                    </span>
                    <span className="mx-2">•</span>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>
                      {new Date(req.createdAt || req.date).toLocaleDateString()}
                    </span>
                  </div>
                  {req.location && (
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{req.location}</span>
                    </div>
                  )}
                  {req.phone && (
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <Phone className="w-4 h-4 mr-1" />
                      <span>{req.phone}</span>
                    </div>
                  )}
                  {req.budget && (
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span>Budget: ₹{req.budget}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${
                      req.status === "Completed" || req.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : req.status === "In Progress" ||
                          req.status === "in-progress"
                        ? "bg-blue-100 text-blue-700"
                        : req.status === "Accepted" || req.status === "accepted"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {req.status || "Pending"}
                  </span>

                  {req.status === "pending" && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleRequestAction(req._id, "accept")}
                        className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRequestAction(req._id, "decline")}
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {req.description && (
                <p className="text-gray-600 text-sm mt-2 bg-gray-50 p-2 rounded">
                  {req.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Services Panel Component
const ServicesPanel = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { makeRequest, isReady, providerId, provider } = useAuthenticatedAPI();

  useEffect(() => {
    const fetchServices = async () => {
      if (!isReady) {
        setLoading(false);
        setError("Authentication required. Please login again.");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // First, try to get provider's registered services from provider profile
        if (provider?.services || provider?.skills) {
          const providerServices = provider.services || provider.skills || [];

          // Transform provider services to display format
          const transformedServices = providerServices.map(
            (service, index) => ({
              _id: `${providerId}-service-${index}`,
              title: service,
              description: `${service} service provided by ${provider.name}`,
              category: service.toLowerCase(),
              isActive: true,
              provider_name: provider.name,
              location:
                provider.location?.address ||
                `${provider.village}, ${provider.district}`,
              experience: provider.experience
                ? `${provider.experience} years`
                : "Experience not specified",
            })
          );

          setServices(transformedServices);
          setLoading(false);
          return;
        }

        // If no services in provider profile, try fetching from services API
        const endpoints = [
          `/services/by_provider_id/${providerId}`,
          `/providers/${providerId}/services`,
          `/services?provider_id=${providerId}`,
        ];

        let response = null;
        for (const endpoint of endpoints) {
          try {
            response = await makeRequest(endpoint);
            if (
              response.data.success ||
              response.data.services ||
              response.data.data
            ) {
              break;
            }
          } catch (err) {
            console.warn(`Endpoint ${endpoint} failed:`, err.response?.status);
            continue;
          }
        }

        if (response && response.data) {
          const servicesData =
            response.data.services || response.data.data || [];
          setServices(Array.isArray(servicesData) ? servicesData : []);
        } else {
          setServices([]);
        }
      } catch (err) {
        console.error("Failed to fetch services:", err);
        if (err.response?.status === 404) {
          setServices([]);
        } else {
          setError(err.response?.data?.message || "Failed to fetch services");
        }
      } finally {
        setLoading(false);
      }
    };
     if (!isReady || !providerId || !provider) return;
    fetchServices();
  }, [isReady, makeRequest, providerId]);

  const handleEditService = (serviceId) => {
    toast.info("Edit service functionality coming soon!");
    console.log("Edit service:", serviceId);
  };

  const handleAddNewService = () => {
    toast.info("Add new service functionality coming soon!");
    console.log("Add new service");
  };

  const toggleServiceStatus = async (serviceId, currentStatus) => {
    try {
      await makeRequest(`/services/${serviceId}/toggle`, {
        method: "PATCH",
        data: { isActive: !currentStatus },
      });
      toast.success("Service status updated");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update service status");
    }
  };

  if (loading) {
    return (
      <div className="bg-white/70 rounded-xl shadow-lg p-6 border border-white/30 backdrop-blur-sm">
        <h2 className="text-2xl font-semibold mb-4 text-[#695aa6] flex items-center">
          <Briefcase className="w-6 h-6 mr-2" />
          My Services
        </h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#695aa6] mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/70 rounded-xl shadow-lg p-6 border border-white/30 backdrop-blur-sm">
        <h2 className="text-2xl font-semibold mb-4 text-[#695aa6] flex items-center">
          <Briefcase className="w-6 h-6 mr-2" />
          My Services
        </h2>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error: {error}</p>
          {error.includes("login") && (
            <button
              onClick={() => (window.location.href = "/login")}
              className="px-4 py-2 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 rounded-xl shadow-lg p-6 border border-white/30 backdrop-blur-sm hover:shadow-xl transition-all">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-[#695aa6] flex items-center">
          <Briefcase className="w-6 h-6 mr-2" />
          My Services
          <span className="ml-2 bg-[#695aa6] text-white text-sm px-2 py-1 rounded-full">
            {services.length}
          </span>
        </h2>
        <button
          onClick={handleAddNewService}
          className="flex items-center gap-2 px-4 py-2 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {services.length === 0 ? (
          <div className="text-center py-8">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No services listed yet</p>
            <p className="text-sm text-gray-400 mb-4">
              Add your first service to start getting customers
            </p>
            <button
              onClick={handleAddNewService}
              className="px-6 py-2 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition"
            >
              Add Your First Service
            </button>
          </div>
        ) : (
          services.map((service, index) => (
            <div
              key={service._id || index}
              className="bg-white/90 rounded-lg p-4 shadow-sm hover:shadow-md transition-all border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg">
                    {service.title || service.name || "Unnamed Service"}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {service.description || "No description available"}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                    {service.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{service.location}</span>
                      </div>
                    )}
                    {service.price && (
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span>₹{service.price}</span>
                      </div>
                    )}
                    {service.rate && (
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span>₹{service.rate}/hr</span>
                      </div>
                    )}
                    {service.rating && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-500" />
                        <span>{service.rating}</span>
                      </div>
                    )}
                  </div>

                  {service.category && (
                    <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {service.category}
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 ml-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-semibold ${
                        service.isActive || service.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {service.isActive || service.status === "active"
                        ? "Active"
                        : "Inactive"}
                    </span>

                    <button
                      onClick={() =>
                        toggleServiceStatus(service._id, service.isActive)
                      }
                      className="p-1 text-gray-500 hover:text-gray-700 transition"
                      title="Toggle Status"
                    >
                      <Clock className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleEditService(service._id)}
                      className="p-1 text-gray-500 hover:text-gray-700 transition"
                      title="Edit Service"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Help Panel Component
const HelpPanel = () => (
  <div className="bg-white/70 rounded-xl shadow-lg p-6 border border-white/30 backdrop-blur-sm hover:shadow-xl transition-all">
    <h2 className="text-2xl font-semibold mb-4 text-[#695aa6] flex items-center">
      <HelpCircle className="w-6 h-6 mr-2" />
      Need Help?
    </h2>

    <div className="space-y-4">
      <p className="text-gray-700">
        Our support team is here to help you succeed. Get assistance with:
      </p>

      <ul className="text-gray-600 space-y-2">
        <li className="flex items-start">
          <span className="w-2 h-2 bg-[#695aa6] rounded-full mt-2 mr-3 flex-shrink-0"></span>
          Setting up your profile and services
        </li>
        <li className="flex items-start">
          <span className="w-2 h-2 bg-[#695aa6] rounded-full mt-2 mr-3 flex-shrink-0"></span>
          Managing customer requests efficiently
        </li>
        <li className="flex items-start">
          <span className="w-2 h-2 bg-[#695aa6] rounded-full mt-2 mr-3 flex-shrink-0"></span>
          Optimizing your business listing for better visibility
        </li>
        <li className="flex items-start">
          <span className="w-2 h-2 bg-[#695aa6] rounded-full mt-2 mr-3 flex-shrink-0"></span>
          Understanding pricing and payment processes
        </li>
      </ul>

      <div className="bg-gray-50 rounded-lg p-4 mt-4">
        <h3 className="font-semibold text-gray-800 mb-2">Quick Tips</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Keep your services updated and well-described</li>
          <li>• Respond to requests promptly for better ratings</li>
          <li>• Upload clear photos of your work</li>
          <li>• Set competitive and fair pricing</li>
        </ul>
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <button className="flex items-center justify-center gap-2 bg-[#695aa6] hover:bg-[#5a4d8a] rounded-lg p-3 text-white transition">
          <Mail className="w-4 h-4" />
          <span className="font-medium">Contact Support</span>
        </button>

        <div className="text-center text-sm text-gray-500">
          Email: support@apnanetwork.com
        </div>
      </div>
    </div>
  </div>
);

// Main Dashboard Component
export default function ProviderDashboard() {
  const {
    isAuthenticated,
    loading,
    getCurrentUser,
    getUserRole,
    authInitialized,
  } = useAuth();
  const router = useRouter();
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Authentication check
  useEffect(() => {
    // Add a small delay to ensure auth state is properly set after redirects
    const checkAuth = async () => {
      // Wait a bit longer for auth to initialize after redirects
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Wait for auth to finish loading AND be initialized
      if (loading || !authInitialized) {
        return;
      }

      // Check if authenticated at all
      if (!isAuthenticated()) {
        router.push("/login");
        return;
      }

      // Get current user and role
      const currentUser = getCurrentUser();
      const role = getUserRole();

      if (!currentUser) {
        router.push("/login");
        return;
      }

      // Role-based redirects
      if (role === "user") {
        router.push("/dashboard/user-dashboard");
        return;
      }

      if (role === "admin") {
        router.push("/dashboard/admin-dashboard");
        return;
      }

      // Allow access for providers
      if (role === "provider") {
        return;
      }

      // If role is not recognized, redirect to login
      router.push("/login");
    };

    checkAuth();
  }, [
    isAuthenticated,
    loading,
    authInitialized,
    router,
    getCurrentUser,
    getUserRole,
  ]);

  // Show loading while auth is being determined
  if (loading || !authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#a395d4] via-[#b8a7e8] to-[#8b7cc8]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated or wrong role
  const currentProvider = getCurrentUser();
  const role = getUserRole();

  if (!isAuthenticated() || !currentProvider || role !== "provider") {
    return null;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

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
            {/* Manage Services */}
            <div className="bg-white/70 rounded-xl shadow-lg p-8 border border-white/30 flex flex-col items-center text-center transition hover:shadow-xl backdrop-blur-sm">
              <Briefcase className="w-12 h-12 text-[#695aa6] mb-4" />
              <h2 className="text-xl font-semibold mb-3 text-[#695aa6]">
                Your Services
              </h2>
              <p className="text-gray-700 mb-6">
                View and edit the services you offer to customers.
              </p>
              <button
                onClick={() => setActiveView("services")}
                className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-[#695aa6] to-[#5a4d8a] hover:opacity-90 transition shadow-lg"
              >
                Manage Services
              </button>
            </div>

            {/* View Requests */}
            <div className="bg-white/70 rounded-xl shadow-lg p-8 border border-white/30 flex flex-col items-center text-center transition hover:shadow-xl backdrop-blur-sm">
              <ListTodo className="w-12 h-12 text-[#695aa6] mb-4" />
              <h2 className="text-xl font-semibold mb-3 text-[#695aa6]">
                Service Requests
              </h2>
              <p className="text-gray-700 mb-6">
                See and respond to new service requests from customers.
              </p>
              <button
                onClick={() => setActiveView("requests")}
                className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-[#695aa6] to-[#5a4d8a] hover:opacity-90 transition shadow-lg"
              >
                View Requests
              </button>
            </div>
          </div>
        );
    }
  };

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
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <nav className="flex-1">
            <ul className="space-y-2">
              {[
                { key: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
                { key: "requests", icon: ListTodo, label: "Requests" },
                { key: "services", icon: Briefcase, label: "Services" },
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
                        !sidebarOpen
                          ? "opacity-0 w-0"
                          : "opacity-100 w-auto ml-2"
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

        {/* Main Content */}
        <section className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden w-full">
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
                className="absolute bottom-20 left-1/3 w-36 h-36 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-6000"
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

          {/* Welcome Section */}
          <div className="relative flex flex-col items-center justify-center min-h-[50vh] py-12 z-10 w-full">
            <UserCircle className="w-20 h-20 text-white drop-shadow-lg bg-gradient-to-br from-[#695aa6] to-[#b8a7e8] rounded-full p-2 mb-4" />
            <h1
              className="text-4xl md:text-5xl font-extrabold mb-4 text-white text-center"
              style={{
                textShadow: "0 4px 24px rgba(60,50,100,0.65), 0 1px 0 #000",
                letterSpacing: "0.5px",
              }}
            >
              {getGreeting()}, {getCurrentUser()?.name || "Provider"}! 👋
            </h1>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-2xl md:text-3xl font-bold text-center"
                style={{
                  color: "#695aa6",
                  letterSpacing: "0.4px",
                  textShadow: "0 2px 12px rgba(255,255,255,0.8)",
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

            {/* Provider Info */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Provider
                </span>
              </div>
            </div>
          </div>

          {/* Notification */}
          <div className="flex items-center gap-3 bg-white/30 backdrop-blur-sm rounded-lg px-4 py-3 shadow border border-white/30 mb-8 max-w-md mx-auto z-10">
            <Bell className="w-5 h-5 text-[#695aa6]" />
            <span className="text-sm text-gray-700">
              2 new service requests pending.{" "}
            </span>
          </div>

          {/* Main Dashboard Content */}
          <div className="w-full z-10 px-4 md:px-10 pb-10">
            {renderContent()}
          </div>
        </section>
      </main>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
      `}</style>
    </div>
  );
}
