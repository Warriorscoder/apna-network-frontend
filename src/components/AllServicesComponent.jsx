"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { services } from "@/data/services";
import {
  ArrowLeft,
  Home,
  Search,
  MapPin,
  Star,
  Clock,
  Award,
  Menu,
  X,
} from "lucide-react";
import Dialoguebox from "@/components/servicePage/Dialoguebox";
import axios from "axios";
import ConditionalNavbar from "./ConditionalNavbar";

// ServiceCard component - Mobile Optimized
const ServiceCard = ({ service, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="bg-white border rounded-xl p-3 sm:p-4 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(105,90,166,0.15)] flex flex-col items-center justify-center h-44 sm:h-56 relative overflow-hidden cursor-pointer"
      style={{ borderColor: "#a99fd4" }}
    >
      <div
        className={`transition-all duration-300 ease-in-out flex flex-col items-center ${
          hovered ? "translate-y-[-35%] sm:translate-y-[-40%]" : "translate-y-0"
        }`}
      >
        <img
          src={service.image || "/placeholder.svg?height=64&width=64"}
          alt={service.title}
          className="w-12 h-12 sm:w-16 sm:h-16 mb-2 object-contain"
        />
        <h3 className="text-lg sm:text-xl font-bold text-[#695aa6] leading-tight">
          {service.title}
        </h3>
      </div>
      <div
        className={`absolute bottom-2 sm:bottom-4 px-2 text-xs text-gray-600 text-center transition-all duration-300 ease-in-out ${
          hovered
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <p className="mb-1 text-xs sm:text-sm leading-tight">
          {service.subtitle}
        </p>
      </div>
    </div>
  );
};

// Mobile-Optimized Login Modal
const LoginModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-sm w-full text-center">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#695aa6]">
        Login Required
      </h2>
      <p className="mb-6 text-gray-700 text-sm sm:text-base">
        Please log in or register to view service providers.
      </p>
      <a
        href="/login"
        className="block w-full py-2.5 sm:py-3 rounded-lg font-semibold text-white bg-[#695aa6] hover:bg-[#5a4d8a] transition mb-3 text-sm sm:text-base"
      >
        Login
      </a>
      <a
        href="/register"
        className="block w-full py-2 rounded-lg font-semibold text-[#695aa6] bg-gray-100 hover:bg-gray-200 transition text-sm sm:text-base"
      >
        Register
      </a>
      <button
        className="w-full py-2 rounded-lg font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 transition mt-2 text-sm sm:text-base"
        onClick={onClose}
      >
        Cancel
      </button>
    </div>
  </div>
);

// Main Unified Component
const AllServicesComponent = ({
  openInNewPage = false,
  showBackButton = false,
  showNavbar = false,
}) => {
  const router = useRouter();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  // Provider-related states
  const [showProviderList, setShowProviderList] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [serviceData, setServiceData] = useState([]);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Handle service click - UNIFIED LOGIC
  const handleServiceClick = (service) => {
    if (openInNewPage) {
      router.push(`/service/${service.serviceKey}`);
    } else {
      setSelectedService(service);
      setShowProviderList(true);
      fetchServiceProviders(service.serviceKey);
    }
  };

  // Fetch providers for selected service
  const fetchServiceProviders = async (serviceKey) => {
    setLoading(true);
    try {
      const apiurl = process.env.NEXT_PUBLIC_API_BASE_URL;

      const response = await axios.get(`${apiurl}/services/`);

      if (!response.data.success) {
        throw new Error("Failed to fetch services");
      }

      const services = response.data.data || [];
      const filteredServices = services.filter(
        (item) => item.category === serviceKey
      );

      setServiceData(filteredServices);

      if (filteredServices.length > 0) {
        const providerIds = filteredServices.map((item) => item.provider_id);

        const result = await axios.post(`${apiurl}/providers/multi-by-id`, {
          ids: providerIds,
        });

        if (!result.data.success) {
          throw new Error("Failed to fetch providers");
        }

        const providersData = result.data.providers || [];
        const transformedData = providersData.map((provider) => ({
          name: provider.name,
          provider_id: provider._id,
          address: `${provider.village}, ${provider.panchayat_ward}, ${provider.tehsil}, ${provider.district}, ${provider.location}`,
          rating: Math.floor(Math.random() * 5) + 1,
          experience: `${provider.experience} years of experience`,
          availability: `${provider.availability?.from || "9:00 AM"} - ${
            provider.availability?.to || "6:00 PM"
          }`,
          phone: provider.phone || "Not provided",
        }));

        setFilteredProviders(transformedData);
      } else {
        setFilteredProviders([]);
      }

      setError(null);
    } catch (error) {
      console.error("Error fetching providers:", error);
      setError("Failed to load providers. Please try again later.");
      setFilteredProviders([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle provider details
  const handleMoreDetails = (provider) => {
    const serviceInfo = serviceData.find(
      (item) => item.provider_id === provider.provider_id
    );

    const cardData = {
      ...provider,
      title: serviceInfo?.description || `${selectedService?.title} Service`,
      tags: serviceInfo?.tags || [selectedService?.title?.toLowerCase()],
      category: serviceInfo?.category || selectedService?.serviceKey,
    };

    setSelectedProvider(cardData);
    setIsDialogOpen(true);
  };

  // Handle back to services
  const handleBackToServices = () => {
    setShowProviderList(false);
    setSelectedService(null);
    setFilteredProviders([]);
    setSearchTerm("");
    setServiceData([]);
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  // Filter providers based on search
  const filteredAndSearchedProviders = filteredProviders.filter((provider) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const matchesName = provider.name?.toLowerCase().includes(searchLower);
    const matchesAddress = provider.address
      ?.toLowerCase()
      .includes(searchLower);

    return matchesName || matchesAddress;
  });

  // Provider List View - Mobile Optimized
  if (showProviderList && !openInNewPage) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Mobile-Optimized Header Section */}
        <div
          className="relative"
          style={{
            background: "linear-gradient(135deg, #a99fd4 0%, #695aa6 100%)",
          }}
        >
          {/* Mobile Navigation */}
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
            <button
              onClick={handleBackToServices}
              className="flex items-center space-x-1 sm:space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-gray-800 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-200 backdrop-blur-sm text-sm sm:text-base"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium hidden sm:inline">All Services</span>
              <span className="font-medium sm:hidden">Back</span>
            </button>
          </div>

          {/* Header Content */}
          <div className="py-12 sm:py-16 px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="mb-4 sm:mb-6">
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 inline-block shadow-lg">
                  <img
                    src={selectedService?.image || "/imgs/default-service.jpg"}
                    alt={selectedService?.title}
                    className="w-16 h-16 sm:w-24 sm:h-24 mx-auto object-contain"
                  />
                </div>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2 sm:mb-4 px-4">
                {selectedService?.title}
              </h1>
              <p className="text-sm sm:text-base text-gray-700 px-4 max-w-2xl mx-auto">
                {selectedService?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile-Optimized Search Section */}
        <div className="bg-gray-50 py-3 sm:py-5">
          <div className="max-w-4xl mx-auto px-3 sm:px-4">
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder={`Search ${selectedService?.title?.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent text-sm sm:text-lg"
                  />
                </div>
                <button className="px-6 sm:px-8 py-3 sm:py-4 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition-colors font-semibold text-sm sm:text-lg">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-Optimized Providers Section */}
        <div className="bg-white flex-grow">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
            {loading ? (
              <div className="text-center py-12 sm:py-16">
                <div
                  className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 mx-auto mb-4"
                  style={{ borderColor: "#695aa6" }}
                ></div>
                <p className="text-gray-600 text-sm sm:text-base">
                  Loading {selectedService?.title?.toLowerCase()}...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-12 sm:py-16 px-4">
                <div className="text-4xl sm:text-6xl mb-4">⚠️</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  Error Loading Providers
                </h3>
                <p className="text-red-600 mb-4 text-sm sm:text-base">
                  {error}
                </p>
                <button
                  onClick={() =>
                    fetchServiceProviders(selectedService?.serviceKey)
                  }
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition-colors text-sm sm:text-base"
                >
                  Retry
                </button>
              </div>
            ) : filteredAndSearchedProviders.length === 0 ? (
              <div className="text-center py-12 sm:py-16 px-4">
                <div className="text-4xl sm:text-6xl mb-4">🔍</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  No {selectedService?.title} Found
                </h3>
                <p className="text-gray-600 text-sm sm:text-base mb-4">
                  {searchTerm
                    ? `No providers found matching "${searchTerm}". Try different keywords.`
                    : "We're currently expanding our network. Check back soon for professionals in this category."}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="px-4 sm:px-6 py-2 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition-colors text-sm sm:text-base"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Desktop Table View - Hidden on Mobile */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-4 font-semibold text-gray-800">
                          #
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-800">
                          Name
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-800">
                          Address
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-800">
                          Experience
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-800">
                          Rating
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-800">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSearchedProviders.map((provider, index) => (
                        <tr
                          key={provider.provider_id || index}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4 text-gray-700">
                            {index + 1}
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-800">
                              {provider.name}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-700 max-w-xs">
                            <div className="break-words">
                              {provider.address}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-700">
                            {provider.experience}
                          </td>
                          <td className="py-4 px-4 text-gray-700">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{provider.rating}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleMoreDetails(provider)}
                              className="px-3 py-1 bg-[#695aa6] text-white rounded text-sm hover:bg-[#5a4d8a] transition-colors"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View - Optimized */}
                <div className="lg:hidden">
                  {/* Results Count - Mobile */}
                  <div className="mb-4 text-center">
                    <p className="text-sm text-gray-600">
                      Found {filteredAndSearchedProviders.length}{" "}
                      {selectedService?.title?.toLowerCase()}
                    </p>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {filteredAndSearchedProviders.map((provider, index) => (
                      <div
                        key={provider.provider_id || index}
                        className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm"
                      >
                        {/* Provider Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="bg-[#695aa6] text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-gray-800 text-sm sm:text-lg truncate">
                                {provider.name}
                              </h3>
                              <div className="flex items-center space-x-1 mt-1">
                                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                                <span className="text-xs sm:text-sm text-gray-600">
                                  {provider.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Provider Details */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-start space-x-2">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-600 break-words leading-relaxed">
                              {provider.address}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Award className="w-3 h-3 sm:w-4 sm:h-4 text-[#695aa6] flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-600">
                              {provider.experience}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-600">
                              {provider.availability}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleMoreDetails(provider)}
                            className="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 bg-[#695aa6] text-white rounded-lg text-xs sm:text-sm hover:bg-[#5a4d8a] transition-colors font-medium"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Dialog Box */}
        <Dialoguebox
          data={selectedProvider}
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedProvider(null);
          }}
        />
      </div>
    );
  }

  // Main Services Grid View - Complete mobile responsive fix
  return (
    <>
      {showNavbar && <ConditionalNavbar />}
      <section
        className="relative min-h-screen"
        style={{
          background:
            "linear-gradient(to top, #fff 0%, rgba(105, 90, 166, 0.35) 99%, rgba(105, 90, 166, 0.5) 100%)",
        }}
      >
        {/* Spacer div to account for fixed navbar */}
        {showNavbar && <div className="h-16 sm:h-20 md:h-24"></div>}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          {/* Back to Home Button (conditional) */}
          {showBackButton && (
            <div className="mb-6 sm:mb-8">
              <button
                onClick={handleBackToHome}
                className="flex items-center space-x-1 sm:space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-200 backdrop-blur-sm text-sm sm:text-base"
              >
                <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium">Back to Home</span>
              </button>
            </div>
          )}

          {/* Header - Now properly spaced */}
          <div className="text-center mb-12 sm:mb-16">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-8 px-4"
              style={{ color: "#695aa6" }}
            >
              Services We Offer
            </h2>
          </div>

          {/* Mobile-Optimized Services Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {services.map((service, index) => (
              <ServiceCard
                key={service.serviceKey || index}
                service={service}
                onClick={() => handleServiceClick(service)}
              />
            ))}
          </div>
        </div>

        {/* Login Modal */}
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </section>
    </>
  );
};

export default AllServicesComponent;
