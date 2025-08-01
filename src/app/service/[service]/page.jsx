"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Star,
  Clock,
  Award,
  User,
  ArrowLeft,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { services } from "@/data/services";
import Footer from "@/app/Footer";
import axios from "axios";
import Dialoguebox from "@/components/servicePage/Dialoguebox";
import LocationSelector from "@/components/LocationSelector";

// Main Service Page Component
export default function ServicePage() {
  const params = useParams();
  const serviceKey = params?.service;
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serviceData, setServiceData] = useState([]);
  const [imageError, setImageError] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  
  const router = useRouter();

  // Get service info from services data
  const serviceInfo = services.find(
    (service) => service.serviceKey === serviceKey
  ) || {
    title: "Service Not Found",
    subtitle: "Service information not available",
    description: "This service is not currently available.",
    image: "/placeholder.svg?height=96&width=96",
    serviceKey: serviceKey,
  };

  const handleMoreDetails = (provider) => {
    const service = serviceData.find(
      (item) => item.provider_id === provider.provider_id
    );

    const cardData = {
      ...provider,
      title: service?.description || serviceInfo?.title,
      tags: service?.tags || [serviceInfo?.title?.toLowerCase()],
      category: service?.category || serviceKey,
    };

    setSelectedProvider(cardData);
    setIsModalOpen(true);
  };

  const handleSearch = () => {
    // Search functionality is handled by filteredProviders
    console.log(`Searching for: ${searchTerm} in ${serviceInfo.title}`);
  };

  // Clear all filters function
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedState("");
    setSelectedCity("");
  };

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const apiurl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axios.get(`${apiurl}/services/`);

        if (!response.data.success) {
          throw new Error("Failed to fetch services");
        }

        const servicesData = response.data.data || [];
        const filteredServices = servicesData.filter(
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
            village: provider.village,
            panchayat_ward: provider.panchayat_ward,
            tehsil: provider.tehsil,
            district: provider.district,
            location: provider.location,
            address: `${provider.village}, ${provider.panchayat_ward}, ${provider.tehsil}, ${provider.district}, ${provider.location}`,
            rating: Math.floor(Math.random() * 5) + 1,
            experience: `${provider.experience} years of experience`,
            availability: `${provider.availability?.from || "9:00 AM"} - ${
              provider.availability?.to || "6:00 PM"
            }`,
            phone: provider.phone || "Not provided",
          }));

          setProviders(transformedData);
        } else {
          setProviders([]);
        }

        setError(null);
      } catch (error) {
        console.error("Error fetching providers:", error);
        setError("Failed to load providers. Please try again later.");
        setProviders([]);
      } finally {
        setLoading(false);
      }
    };

    if (serviceKey) {
      fetchServices();
    }
  }, [serviceKey]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProvider(null);
  };

  const handleBackToServices = () => {
    router.push("/");
  };

  // Enhanced filter providers based on search term and selected filters (same as AllServicesComponent)
  const filteredProviders = providers.filter((provider) => {
    const address = provider.address?.toLowerCase() || "";
    const name = provider.name?.toLowerCase() || "";
    const village = provider.village?.toLowerCase() || "";
    const tehsil = provider.tehsil?.toLowerCase() || "";
    const district = provider.district?.toLowerCase() || "";
    const location = provider.location?.toLowerCase() || "";

    // Search term filtering - check multiple fields
    const matchesSearchTerm = !searchTerm ||
                              name.includes(searchTerm.toLowerCase()) ||
                              address.includes(searchTerm.toLowerCase()) ||
                              village.includes(searchTerm.toLowerCase()) ||
                              tehsil.includes(searchTerm.toLowerCase()) ||
                              district.includes(searchTerm.toLowerCase()) ||
                              location.includes(searchTerm.toLowerCase());

    // State filtering - check against Indian states
    let matchesState = true;
    if (selectedState) {
      const selectedStateLower = selectedState.toLowerCase();
      matchesState = location.includes(selectedStateLower) ||
                     district.includes(selectedStateLower) ||
                     address.includes(selectedStateLower);
    }

    // City filtering - enhanced matching
    let matchesCity = true;
    if (selectedCity) {
      const selectedCityLower = selectedCity.toLowerCase();
      matchesCity = district.includes(selectedCityLower) ||
                    location.includes(selectedCityLower) ||
                    address.includes(selectedCityLower) ||
                    village.includes(selectedCityLower);
    }

    return matchesSearchTerm && matchesState && matchesCity;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-4">
          <div
            className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 mx-auto mb-3 sm:mb-4"
            style={{ borderColor: "#695aa6" }}
          ></div>
          <p className="text-gray-600 text-sm sm:text-base">
            Loading {serviceInfo.title?.toLowerCase()}...
          </p>
        </div>
      </div>
    );
  }

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
                  src={
                    imageError
                      ? "/placeholder.svg?height=96&width=96"
                      : serviceInfo.image
                  }
                  alt={serviceInfo.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto object-contain"
                  onError={() => setImageError(true)}
                  onLoad={() => setImageError(false)}
                />
              </div>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2 sm:mb-4 px-4">
              {serviceInfo.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-700 px-4 max-w-2xl mx-auto">
              {serviceInfo.description}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile-Optimized Search and Filter Section */}
      <div className="bg-gray-50 py-3 sm:py-5">
        <div className="max-w-4xl mx-auto px-3 sm:px-4">
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, location, village, or tehsil..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent text-sm sm:text-lg"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Toggle Button for Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors mb-2"
            >
              <span className="font-medium text-[#695aa6]">Location Filters</span>
              <div className="flex items-center space-x-2">
                {(selectedState || selectedCity) && (
                  <span className="bg-[#695aa6] text-white text-xs px-2 py-1 rounded-full">
                    {[selectedState, selectedCity].filter(Boolean).length} selected
                  </span>
                )}
                {showFilters ? <ChevronUp /> : <ChevronDown />}
              </div>
            </button>

            {/* Collapsible Filter Section - Using LocationSelector */}
            {showFilters && (
              <div className="border-t border-gray-200 pt-4">
                <LocationSelector
                  selectedState={selectedState}
                  selectedCity={selectedCity}
                  onStateChange={setSelectedState}
                  onCityChange={setSelectedCity}
                />

                {/* Clear Filters Button */}
                {(selectedState || selectedCity) && (
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={clearAllFilters}
                      className="px-4 py-2 text-sm text-[#695aa6] hover:text-[#5a4d8a] transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile-Optimized Content Section */}
      <div className="bg-white flex-grow">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
          {error ? (
            <div className="text-center py-8 sm:py-12 px-4">
              <div className="text-4xl sm:text-6xl mb-4">⚠️</div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Error Loading Providers
              </h3>
              <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition-colors text-sm sm:text-base"
              >
                Retry
              </button>
            </div>
          ) : filteredProviders.length > 0 ? (
            <>
              {/* Results Count */}
              <div className="mb-4 text-center">
                <p className="text-sm text-gray-600">
                  Found {filteredProviders.length}{" "}
                  {serviceInfo.title?.toLowerCase()} provider{filteredProviders.length !== 1 ? 's' : ''}
                  {(selectedState || selectedCity || searchTerm) && (
                    <span className="text-[#695aa6] font-medium">
                      {" "}matching your criteria
                    </span>
                  )}
                </p>
              </div>

              {/* Desktop Table View - Hidden on mobile */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full bg-white rounded-lg shadow-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-gray-800">
                        #
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-800">
                        Provider
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-800">
                        Location
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
                    {filteredProviders.map((provider, index) => (
                      <tr
                        key={provider.provider_id || index}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4 text-gray-700">{index + 1}</td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-800">
                            {provider.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {provider.phone}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-700 max-w-xs">
                          <div className="break-words">{provider.address}</div>
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
                            className="px-4 py-2 bg-[#695aa6] text-white rounded text-sm hover:bg-[#5a4d8a] transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden">
                <div className="space-y-3 sm:space-y-4">
                  {filteredProviders.map((provider, index) => (
                    <div
                      key={provider.provider_id || index}
                      className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Mobile Provider Header */}
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

                      {/* Mobile Provider Details */}
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

                      {/* Mobile Action Buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleMoreDetails(provider)}
                          className="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 bg-[#695aa6] text-white rounded-lg text-xs sm:text-sm hover:bg-[#5a4d8a] transition-colors font-medium"
                        >
                          View Details
                        </button>
                        {provider.phone && provider.phone !== "Not provided" && (
                          <a
                            href={`tel:${provider.phone}`}
                            className="py-2 sm:py-2.5 px-3 sm:px-4 border border-[#695aa6] text-[#695aa6] rounded-lg text-xs sm:text-sm hover:bg-[#695aa6] hover:text-white transition-colors font-medium"
                          >
                            Call
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            !error && (
              <div className="text-center py-12 sm:py-16 px-4">
                <div className="text-4xl sm:text-6xl mb-4">🔍</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  No {serviceInfo.title} Found
                </h3>
                <p className="text-gray-600 text-sm sm:text-base mb-4">
                  No providers found matching your search and filters. Try different keywords or filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition-colors text-sm sm:text-base"
                >
                  Clear All Filters
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {/* Provider Details Modal */}
      <Dialoguebox
        isOpen={isModalOpen}
        onClose={closeModal}
        data={selectedProvider}
      />
    </div>
  );
}