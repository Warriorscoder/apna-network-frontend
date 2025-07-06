"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import {
  LayoutDashboard,
  Briefcase,
  ListTodo,
  HelpCircle,
  Menu,
  X,
  UserCircle,
  Bell,
  Star,
  MapPin,
  Phone,
  Mail,
  Search,
  Filter,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { useAuth } from "../../context/Authcontext";
import ConditionalNavbar from "../../../components/ConditionalNavbar";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// Service categories with icons
const serviceCategories = [
  {
    image: "/imgs/Car.jpg",
    title: "Carpenters",
    subtitle: "Expert carpentry services.",
    serviceKey: "carpenter",
  },
  {
    image: "/imgs/plumber 2.jpg",
    title: "Plumbers",
    subtitle: "Reliable plumbing solutions.",
    serviceKey: "plumber",
  },
  {
    image: "/imgs/mason.jpg",
    title: "Construction Workers",
    subtitle: "Building your future.",
    serviceKey: "construction-worker",
  },
  {
    image: "/imgs/electrician.jpg",
    title: "Electricians",
    subtitle: "Safe electrical services.",
    serviceKey: "electrician",
  },
  {
    image: "/imgs/painter.jpg",
    title: "Painters",
    subtitle: "Professional painting services.",
    serviceKey: "painter",
  },
  {
    image: "/imgs/welder.jpg",
    title: "Welders",
    subtitle: "Strong and precise welding.",
    serviceKey: "welder",
  },
  {
    image: "/imgs/tailor.jpg",
    title: "Tailors",
    subtitle: "Custom-fit clothing.",
    serviceKey: "tailor",
  },
  {
    image: "/imgs/cook.jpg",
    title: "Cooks",
    subtitle: "Delicious meals prepared for you.",
    serviceKey: "cook",
  },
  {
    image: "/imgs/gardner.jpg",
    title: "Gardeners",
    subtitle: "Beautiful garden maintenance.",
    serviceKey: "gardener",
  },
  {
    image: "/imgs/housekeeper.jpg",
    title: "House Keepers",
    subtitle: "Keep your home sparkling clean.",
    serviceKey: "housekeeper",
  },
  {
    image: "/imgs/barber.jpg",
    title: "Barbers",
    subtitle: "Stylish haircuts and shaves.",
    serviceKey: "barber",
  },
  {
    image: "/imgs/driver.jpg",
    title: "Drivers",
    subtitle: "Safe and reliable drivers.",
    serviceKey: "driver",
  },
  {
    image: "/imgs/drycleaner.jpg",
    title: "Dry Cleaners",
    subtitle: "Expert dry cleaning services.",
    serviceKey: "dry-cleaner",
  },
  {
    image: "/imgs/Photographer.jpg",
    title: "Photographers",
    subtitle: "Capture your precious moments.",
    serviceKey: "photographer",
  },
  {
    image: "/imgs/pandit.jpg",
    title: "Astrologers",
    subtitle: "Guidance from the stars.",
    serviceKey: "astrologer",
  },
  {
    image: "/imgs/interior designer.jpg",
    title: "Interior Designer",
    subtitle: "Design your dream space.",
    serviceKey: "interior-designer",
  },
];

// Custom hook for API calls with authentication
const useAuthenticatedAPI = () => {
  const { isAuthenticated, getCurrentUser } = useAuth();
  const router = useRouter();

  const makeRequest = useCallback(
    async (url, options = {}) => {
      const currentUser = getCurrentUser();

      if (!isAuthenticated() || !currentUser) {
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

  const makePostRequest = useCallback(
    async (url, data, options = {}) => {
      const currentUser = getCurrentUser();

      if (!isAuthenticated() || !currentUser) {
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
        return await axios.post(`${API_BASE}${url}`, data, {
          ...options,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            ...options.headers,
          },
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

  const currentUser = getCurrentUser();

  return {
    makeRequest,
    makePostRequest,
    isReady: !!(currentUser && isAuthenticated()),
    userId: currentUser?._id,
    user: currentUser,
  };
};

// Service Request Modal Component
const ServiceRequestModal = ({ isOpen, onClose, provider, serviceType }) => {
  const [requestDetails, setRequestDetails] = useState("");
  const [urgency, setUrgency] = useState("normal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { makePostRequest } = useAuthenticatedAPI();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requestDetails.trim()) {
      toast.error("Please provide request details");
      return;
    }

    setIsSubmitting(true);
    try {
      await makePostRequest("/service-requests", {
        providerId: provider._id,
        serviceType,
        details: requestDetails,
        urgency,
      });

      toast.success("Service request sent successfully!");
      onClose();
      setRequestDetails("");
      setUrgency("normal");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4 text-[#695aa6]">
          Request Service from {provider?.name}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type
            </label>
            <p className="text-[#695aa6] font-medium">{serviceType}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Request Details
            </label>
            <textarea
              value={requestDetails}
              onChange={(e) => setRequestDetails(e.target.value)}
              className="w-full border rounded-lg p-3 h-24"
              placeholder="Describe your requirements..."
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency
            </label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ service, onRequestService }) => (
  <div className="bg-white/70 rounded-xl shadow-lg p-6 border border-white/30 backdrop-blur-sm hover:shadow-xl transition-all">
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-xl font-semibold text-[#695aa6] mb-2">
          {service.title}
        </h3>
        <p className="text-gray-600 text-sm mb-2">{service.description}</p>
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <MapPin className="w-4 h-4 mr-1" />
          {service.location}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
          {service.rating || "4.5"} ({service.reviews || "12"} reviews)
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-[#695aa6]">
          ₹{service.price || "500"}/hr
        </div>
        <div className="text-sm text-gray-500">
          {service.experience || "5+ years"}
        </div>
      </div>
    </div>

    <div className="flex gap-2 mb-4">
      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
        {service.category}
      </span>
      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
        Available
      </span>
    </div>

    <button
      onClick={() => onRequestService(service)}
      className="w-full bg-[#695aa6] text-white py-2 rounded-lg hover:bg-[#5a4d8a] transition-colors"
    >
      Request Service
    </button>
  </div>
);

// Dashboard Panel Component
const DashboardPanel = () => {
  const { user } = useAuthenticatedAPI();

  return (
    <div className="space-y-6">
      <div className="bg-white/70 rounded-xl shadow-lg p-6 border border-white/30 backdrop-blur-sm">
        <h2 className="text-2xl font-semibold mb-4 text-[#695aa6] flex items-center">
          <LayoutDashboard className="w-6 h-6 mr-2" />
          Welcome to Your Dashboard
        </h2>
        <p className="text-gray-700 mb-4">
          Find and connect with local service providers in your area.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Active Requests</h3>
            <p className="text-2xl font-bold text-blue-600">0</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">Completed Services</h3>
            <p className="text-2xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800">
              Favorite Providers
            </h3>
            <p className="text-2xl font-bold text-purple-600">0</p>
          </div>
        </div>
      </div>

      <div className="bg-white/70 rounded-xl shadow-lg p-6 border border-white/30 backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-4 text-[#695aa6]">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {serviceCategories.slice(0, 8).map((category, index) => (
            <button
              key={index}
              className="p-3 border border-[#695aa6]/20 rounded-lg hover:bg-[#695aa6]/10 transition-colors text-center"
            >
              <div className="text-sm font-medium text-[#695aa6]">
                {category.title}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Services Panel Component
const ServicesPanel = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [modalData, setModalData] = useState({
    isOpen: false,
    provider: null,
    serviceType: "",
  });
  const { makeRequest } = useAuthenticatedAPI();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);

        // Try multiple endpoints to fetch services
        const endpoints = ["/services", "/providers", "/services/all"];

        let response = null;
        for (const endpoint of endpoints) {
          try {
            response = await makeRequest(endpoint);
            if (
              response.data.success ||
              response.data.services ||
              response.data.providers
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
            response.data.services ||
            response.data.providers ||
            response.data.data ||
            [];
          setServices(Array.isArray(servicesData) ? servicesData : []);
        } else {
          // Fallback to demo data if no services from API
          setServices(
            serviceCategories.map((cat, index) => ({
              _id: `demo-${index}`,
              title: cat.title,
              description: cat.subtitle,
              category: cat.serviceKey,
              location: "Local Area",
              rating: 4.5,
              reviews: 12,
              price: 500,
              experience: "5+ years",
              provider_name: `Expert ${cat.title.slice(0, -1)}`,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch services:", error);
        toast.error("Failed to load services");
        // Use demo data as fallback
        setServices(
          serviceCategories.map((cat, index) => ({
            _id: `demo-${index}`,
            title: cat.title,
            description: cat.subtitle,
            category: cat.serviceKey,
            location: "Local Area",
            rating: 4.5,
            reviews: 12,
            price: 500,
            experience: "5+ years",
            provider_name: `Expert ${cat.title.slice(0, -1)}`,
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [makeRequest]);

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRequestService = (service) => {
    setModalData({
      isOpen: true,
      provider: {
        _id: service._id,
        name: service.provider_name || service.title,
      },
      serviceType: service.title,
    });
  };

  if (loading) {
    return (
      <div className="bg-white/70 rounded-xl shadow-lg p-6 border border-white/30 backdrop-blur-sm">
        <h2 className="text-2xl font-semibold mb-4 text-[#695aa6] flex items-center">
          <Briefcase className="w-6 h-6 mr-2" />
          Available Services
        </h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#695aa6] mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/70 rounded-xl shadow-lg p-6 border border-white/30 backdrop-blur-sm">
        <h2 className="text-2xl font-semibold mb-4 text-[#695aa6] flex items-center">
          <Briefcase className="w-6 h-6 mr-2" />
          Available Services
        </h2>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent"
          >
            <option value="">All Categories</option>
            {serviceCategories.map((cat) => (
              <option key={cat.serviceKey} value={cat.serviceKey}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              onRequestService={handleRequestService}
            />
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No services found matching your criteria.
            </p>
          </div>
        )}
      </div>

      <ServiceRequestModal
        isOpen={modalData.isOpen}
        onClose={() =>
          setModalData({ isOpen: false, provider: null, serviceType: "" })
        }
        provider={modalData.provider}
        serviceType={modalData.serviceType}
      />
    </div>
  );
};

// Requests Panel Component
const RequestsPanel = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { makeRequest, userId } = useAuthenticatedAPI();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);

        // Try multiple endpoints to fetch user requests
        const endpoints = [
          `/service-requests/user/${userId}`,
          `/users/${userId}/requests`,
          "/service-requests",
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
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchRequests();
    }
  }, [makeRequest, userId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (loading) {
    return (
      <div className="bg-white/70 rounded-xl shadow-lg p-6 border border-white/30 backdrop-blur-sm">
        <h2 className="text-2xl font-semibold mb-4 text-[#695aa6] flex items-center">
          <ListTodo className="w-6 h-6 mr-2" />
          My Requests
        </h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#695aa6] mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 rounded-xl shadow-lg p-6 border border-white/30 backdrop-blur-sm">
      <h2 className="text-2xl font-semibold mb-4 text-[#695aa6] flex items-center">
        <ListTodo className="w-6 h-6 mr-2" />
        My Service Requests
      </h2>

      {requests.length === 0 ? (
        <div className="text-center py-8">
          <ListTodo className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No service requests yet</p>
          <p className="text-sm text-gray-400">
            Browse services and make your first request to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {request.serviceType || request.service_name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Provider:{" "}
                    {request.provider_name || request.providerName || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {request.details || request.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusIcon(request.status)}
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status || "pending"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>
                  Urgency:{" "}
                  <span className="font-medium">
                    {request.urgency || "normal"}
                  </span>
                </span>
                <span>
                  {request.created_at || request.createdAt
                    ? new Date(
                        request.created_at || request.createdAt
                      ).toLocaleDateString()
                    : "Recent"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
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
        Our support team is here to help you find the best service providers in
        your area.
      </p>

      <ul className="text-gray-600 space-y-2">
        <li className="flex items-start">
          <span className="w-2 h-2 bg-[#695aa6] rounded-full mt-2 mr-3 flex-shrink-0"></span>
          How to search and filter services
        </li>
        <li className="flex items-start">
          <span className="w-2 h-2 bg-[#695aa6] rounded-full mt-2 mr-3 flex-shrink-0"></span>
          Making service requests and communicating with providers
        </li>
        <li className="flex items-start">
          <span className="w-2 h-2 bg-[#695aa6] rounded-full mt-2 mr-3 flex-shrink-0"></span>
          Managing your profile and preferences
        </li>
        <li className="flex items-start">
          <span className="w-2 h-2 bg-[#695aa6] rounded-full mt-2 mr-3 flex-shrink-0"></span>
          Payment and booking processes
        </li>
      </ul>

      <div className="bg-gray-50 rounded-lg p-4 mt-4">
        <h3 className="font-semibold text-gray-800 mb-2">Quick Tips</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Use specific keywords when searching for services</li>
          <li>• Check provider ratings and reviews before requesting</li>
          <li>• Be detailed in your service request descriptions</li>
          <li>• Save your favorite providers for quick access</li>
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

// Helper functions
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

// Main Dashboard Component
export default function UserDashboard() {
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
    if (role === "provider") {
      router.push("/dashboard/provider-dashboard");
      return;
    }

    if (role === "admin") {
      router.push("/dashboard/admin-dashboard");
      return;
    }

    // Allow access for users
    if (role === "user") {
      return;
    }

    // If role is not recognized, redirect to login
    router.push("/login");
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
  const currentUser = getCurrentUser();
  const role = getUserRole();

  if (!isAuthenticated() || !currentUser || role !== "user") {
    return null;
  }

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardPanel />;
      case "services":
        return <ServicesPanel />;
      case "requests":
        return <RequestsPanel />;
      case "help":
        return <HelpPanel />;
      default:
        return <DashboardPanel />;
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
          {/* Background Elements */}
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

            {/* Landscape SVG */}
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

                {/* Ground layers */}
                <path
                  d="M0,280 L1200,260 L1200,400 L0,400 Z"
                  fill="rgba(105, 90, 166, 0.4)"
                />
                <path
                  d="M0,320 L1200,300 L1200,400 L0,400 Z"
                  fill="rgba(105, 90, 166, 0.3)"
                />

                {/* Simple house */}
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

          {/* Backdrop blur overlay */}
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
              {getGreeting()}, {getCurrentUser()?.name || "Guest"}! 👋
            </h1>
            {/* User Info */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Customer
                </span>
                <span className="text-white text-sm">•</span>
                <span className="text-white text-sm">
                  {getCurrentUser()?.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Notification */}
          <div className="flex items-center gap-3 bg-white/30 backdrop-blur-sm rounded-lg px-4 py-3 shadow border border-white/30 mb-8 max-w-md mx-auto z-10">
            <Bell className="w-5 h-5 text-[#695aa6]" />
            <span className="text-sm text-gray-700">
              Dashboard ready - Find services and manage requests
            </span>
          </div>

          {/* Main Dashboard Content */}
          <div className="w-full z-10 px-4 md:px-10 pb-10">
            {renderContent()}
          </div>
        </section>
      </main>

      {/* Custom CSS for animations */}
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
