import { useDummyAPI } from '@/app/hooks/useDummyAPI';
import Dialoguebox from '@/components/servicePage/Dialoguebox';
import axios from 'axios';
import { Briefcase, ChevronRight, Clock, Filter, MapPin, Search, Star } from 'lucide-react';
import React, { useState } from 'react'

const ServiceCategoryCard = ({ service, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="bg-white/80 border rounded-xl p-4 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(105,90,166,0.2)] flex flex-col items-center justify-center h-48 relative overflow-hidden cursor-pointer backdrop-blur-sm"
      style={{ borderColor: "#a99fd4" }}
    >
      <div
        className={`transition-all duration-300 ease-in-out flex flex-col items-center ${
          hovered ? "translate-y-[-30%]" : "translate-y-0"
        }`}
      >
        <img
          src={service.image || "/placeholder.svg?height=64&width=64"}
          alt={service.title}
          className="w-14 h-14 mb-2 object-cover rounded-lg"
        />
        <h3 className="text-lg font-bold text-[#695aa6]">{service.title}</h3>
      </div>
      <div
        className={`absolute bottom-3 px-2 text-xs text-gray-600 text-center transition-all duration-300 ease-in-out ${
          hovered
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <p className="mb-1 text-sm">{service.subtitle}</p>
        <div className="text-xs text-[#695aa6] font-medium">
          Click to browse providers
        </div>
      </div>
    </div>
  );
};


const ServiceRequestModal = ({ isOpen, onClose, provider, serviceType }) => {
  const [requestDetails, setRequestDetails] = useState("");
  const [urgency, setUrgency] = useState("normal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { makePostRequest } = useDummyAPI();

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

function ServicesPanel() {
const [viewMode, setViewMode] = useState("categories"); // "categories" or "providers"
  const [selectedCategory, setSelectedCategory] = useState("");
  const [services, setServices] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [modalData, setModalData] = useState({
    isOpen: false,
    provider: null,
    serviceType: "",
  });
  const [categorySearchTerm, setCategorySearchTerm] = useState(""); // For category search only
  const { makeRequest } = useDummyAPI();

  // Updated sorting options (removed price-related options)
  const sortOptions = [
    { value: "name", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "rating", label: "Highest Rating" },
    { value: "rating-low", label: "Lowest Rating" },
    { value: "experience", label: "Most Experienced" },
    { value: "reviews", label: "Most Reviews" },
  ];

  // Filter service categories based on category search (for grid display)
  const filteredServiceCategories = serviceCategories.filter(
    (category) =>
      category.title.toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
      category.subtitle.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  // Handle category selection with enhanced logic
  const handleCategorySelect = async (category) => {
    setSelectedCategory(category.serviceKey);
    setViewMode("providers");
    setLoading(true);
    setCategorySearchTerm(""); // Clear category search when switching views

    try {
      const apiurl = process.env.NEXT_PUBLIC_API_BASE_URL;

      // Step 1: Try to fetch real services for the selected category
      let realProviders = [];
      try {
        const response = await axios.get(`${apiurl}/services/`);

        if (response.data.success) {
          const allServices = response.data.data || [];
          const filteredServices = allServices.filter(
            (item) => item.category === category.serviceKey
          );
          setServiceData(filteredServices);

          if (filteredServices.length > 0) {
            const providerIds = filteredServices.map(
              (item) => item.provider_id
            );
            const providersResponse = await axios.post(
              `${apiurl}/providers/multi-by-id`,
              {
                ids: providerIds,
              }
            );

            if (providersResponse.data.success) {
              const providersData = providersResponse.data.providers || [];
              realProviders = providersData.map((provider) => {
                const providerService = filteredServices.find(
                  (service) => service.provider_id === provider._id
                );

                return {
                  _id: provider._id,
                  provider_id: provider._id,
                  name: provider.name,
                  provider_name: provider.name,
                  title:
                    providerService?.description || `${category.title} Service`,
                  description:
                    providerService?.description || category.subtitle,
                  category: category.serviceKey,
                  address: `${provider.village || ""}, ${
                    provider.panchayat_ward || ""
                  }, ${provider.tehsil || ""}, ${provider.district || ""}, ${
                    provider.location || ""
                  }`
                    .replace(/^,+|,+$/g, "")
                    .replace(/,+/g, ", "),
                  location: `${provider.village || ""}, ${
                    provider.panchayat_ward || ""
                  }, ${provider.tehsil || ""}, ${provider.district || ""}, ${
                    provider.location || ""
                  }`
                    .replace(/^,+|,+$/g, "")
                    .replace(/,+/g, ", "),
                  email: provider.email || "Not provided",
                  rating: Math.floor(Math.random() * 2) + 4,
                  reviews: Math.floor(Math.random() * 20) + 5,
                  experience: `${provider.experience || "2+"} years`,
                  experienceYears: parseInt(
                    provider.experience?.replace(/\D/g, "") || "2"
                  ),
                  availability: provider.availability
                    ? `${provider.availability.from || "9:00"} - ${
                        provider.availability.to || "18:00"
                      }`
                    : "Contact for availability",
                  serviceType: providerService?.category || category.serviceKey,
                  tags: providerService?.tags || [category.serviceKey],
                  images: providerService?.images || [category.image],
                };
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching real providers:", error);
      }

      // Step 2: Get mock providers for this category
      const mockProvidersForCategory = mockProviders[category.serviceKey] || [];

      // Step 3: Combine real and mock providers (remove phone from mock data too)
      const allProviders = [
        ...realProviders,
        ...mockProvidersForCategory.map((provider) => {
          const { phone, contact, ...providerWithoutPhone } = provider;
          return providerWithoutPhone;
        }),
      ];

      if (allProviders.length === 0) {
        // Fallback to a single demo provider (without phone)
        setServices([
          {
            _id: `demo-${category.serviceKey}`,
            provider_id: `demo-${category.serviceKey}`,
            name: `Expert ${category.title.slice(0, -1)}`,
            provider_name: `Expert ${category.title.slice(0, -1)}`,
            title: category.title,
            description: category.subtitle,
            category: category.serviceKey,
            location: "Local Area",
            address: "Local Area, City",
            email: "provider@example.com",
            rating: 4.5,
            reviews: 12,
            experience: "5+ years",
            experienceYears: 5,
            availability: "9:00 AM - 6:00 PM",
            serviceType: category.serviceKey,
            tags: [category.serviceKey],
            images: [category.image],
          },
        ]);
      } else {
        setServices(allProviders);
      }
    } catch (error) {
      console.error("Error in handleCategorySelect:", error);
      // Use mock providers as fallback (without phone)
      const mockProvidersForCategory = mockProviders[category.serviceKey] || [];
      const sanitizedMockProviders = mockProvidersForCategory.map(
        (provider) => {
          const { phone, contact, ...providerWithoutPhone } = provider;
          return providerWithoutPhone;
        }
      );
      setServices(sanitizedMockProviders);
    } finally {
      setLoading(false);
    }
  };

  // Updated sorting function (removed price sorting)
  const sortServices = (servicesList, sortType) => {
    const sorted = [...servicesList].sort((a, b) => {
      switch (sortType) {
        case "name":
          return (a.provider_name || a.name || "").localeCompare(
            b.provider_name || b.name || ""
          );
        case "name-desc":
          return (b.provider_name || b.name || "").localeCompare(
            a.provider_name || a.name || ""
          );
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "rating-low":
          return (a.rating || 0) - (b.rating || 0);
        case "experience":
          return (b.experienceYears || 0) - (a.experienceYears || 0);
        case "reviews":
          return (b.reviews || 0) - (a.reviews || 0);
        default:
          return 0;
      }
    });
    return sorted;
  };

  // Apply search and sorting
  const filteredAndSortedServices = () => {
    const filtered = services.filter((service) => {
      const matchesSearch =
        service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.provider_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.location?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    return sortServices(filtered, sortBy);
  };

  const processedServices = filteredAndSortedServices();

  const handleRequestService = (service) => {
    setModalData({
      isOpen: true,
      provider: {
        _id: service._id || service.provider_id,
        name: service.provider_name || service.name,
        email: service.email,
        location: service.location || service.address,
      },
      serviceType: service.title || service.serviceType,
    });
  };

  const handleMoreDetails = (provider) => {
    const service = serviceData.find(
      (item) =>
        item.provider_id === provider.provider_id ||
        item.provider_id === provider._id
    );

    const cardData = {
      ...provider,
      title: service?.description || provider.title,
      tags: service?.tags || provider.tags || [],
      category: service?.category || provider.category,
    };

    setModalData({
      isOpen: true,
      provider: cardData,
      serviceType: cardData.title || cardData.serviceType,
      showDetails: true,
    });
  };

  const handleBackToCategories = () => {
    setViewMode("categories");
    setSelectedCategory("");
    setServices([]);
    setServiceData([]);
    setSearchTerm("");
    setSortBy("name");
  };

  // Enhanced Service Card Component (removed phone display)
  const EnhancedServiceCard = ({
    service,
    onRequestService,
    onMoreDetails,
  }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-[#695aa6] to-[#b8a7e8] text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
            {(service.provider_name || service.name || "U")
              .charAt(0)
              .toUpperCase()}
          </div>
          <div>
            <h3 className="font-medium text-gray-800 text-lg">
              {service.provider_name || service.name}
            </h3>
            <div className="flex items-center space-x-1 mt-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">
                {service.rating || "N/A"} ({service.reviews || 0} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
          <span className="text-sm text-gray-600 break-words">
            {service.address || service.location || "Address not provided"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {service.availability || "Contact for availability"}
          </span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          {service.category}
        </span>
        {service.tags &&
          service.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => onMoreDetails(service)}
          className="flex-1 bg-[#695aa6] text-white py-2 px-4 rounded text-sm transition-colors duration-200 hover:bg-[#5a4d8a] font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white/70 rounded-xl shadow-lg p-6 border border-white/30 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-[#695aa6] flex items-center">
            <Briefcase className="w-6 h-6 mr-2" />
            {viewMode === "categories"
              ? "Service Categories"
              : `${
                  serviceCategories.find(
                    (cat) => cat.serviceKey === selectedCategory
                  )?.title || "Service"
                } Providers`}
          </h2>

          {viewMode === "providers" && (
            <button
              onClick={handleBackToCategories}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ← Back to Categories
            </button>
          )}
        </div>

        {viewMode === "categories" ? (
          <>
            {/* Simple Search Bar for Categories (no dropdown) */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search service categories (e.g., carpenter, plumber, cook...)"
                  value={categorySearchTerm}
                  onChange={(e) => setCategorySearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Service Categories Grid - now filtered by search */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredServiceCategories.length > 0 ? (
                filteredServiceCategories.map((category, index) => (
                  <ServiceCategoryCard
                    key={category.serviceKey || index}
                    service={category}
                    onClick={() => handleCategorySelect(category)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-gray-500">
                    No services found matching "{categorySearchTerm}"
                  </p>
                  <button
                    onClick={() => setCategorySearchTerm("")}
                    className="mt-2 px-4 py-2 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition-colors text-sm"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          // Providers View
          <>
            {/* Search and Filters for Providers */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search providers by name, location, or service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent"
                  />
                </div>

                {/* Sort Dropdown */}
                <div className="relative min-w-[200px]">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent bg-white appearance-none"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
                  <span>
                    Found {processedServices.length} provider
                    {processedServices.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Active Filters Display */}
              {(searchTerm || sortBy !== "name") && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {searchTerm && (
                    <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      <span>Search: "{searchTerm}"</span>
                      <button
                        onClick={() => setSearchTerm("")}
                        className="ml-1 hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  {sortBy !== "name" && (
                    <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                      <span>
                        Sort:{" "}
                        {sortOptions.find((opt) => opt.value === sortBy)?.label}
                      </span>
                      <button
                        onClick={() => setSortBy("name")}
                        className="ml-1 hover:bg-purple-200 rounded-full w-4 h-4 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#695aa6] mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading providers...</p>
              </div>
            ) : (
              <>
                {/* Mock Data Indicator
                {processedServices.some((service) =>
                  service._id.startsWith("mock-")
                ) && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800 text-sm">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>
                        Showing mock providers for testing. Real providers will
                        be loaded from API when available.
                      </span>
                    </div>
                  </div>
                )} */}

                {/* Providers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {processedServices.map((service, index) => (
                    <EnhancedServiceCard
                      key={service._id || service.provider_id || index}
                      service={service}
                      onRequestService={handleRequestService}
                      onMoreDetails={handleMoreDetails}
                    />
                  ))}
                </div>

                {/* Empty State */}
                {processedServices.length === 0 && !loading && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      No Providers Found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm
                        ? "Try adjusting your search terms or browse other categories."
                        : "We're currently expanding our network. Check back soon for professionals in this category."}
                    </p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="px-4 py-2 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition-colors"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Enhanced Service Request Modal or Details Modal */}
      {modalData.showDetails ? (
        <Dialoguebox
          isOpen={modalData.isOpen}
          onClose={() =>
            setModalData({
              isOpen: false,
              provider: null,
              serviceType: "",
              showDetails: false,
            })
          }
          data={modalData.provider}
        />
      ) : (
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
};

// Updated mock providers data (remove phone numbers)
const mockProviders = {
  carpenter: [
    {
      _id: "mock-carpenter-1",
      provider_id: "mock-carpenter-1",
      name: "Ramesh Kumar",
      provider_name: "Ramesh Kumar",
      title: "Professional Carpenter",
      description:
        "Expert in furniture making, door installation, and wooden work",
      category: "carpenter",
      address: "Sector 15, Gurgaon, Haryana",
      location: "Sector 15, Gurgaon, Haryana",
      email: "ramesh.carpenter@email.com",
      rating: 4.8,
      reviews: 45,
      experience: "8 years",
      experienceYears: 8,
      availability: "9:00 AM - 6:00 PM",
      serviceType: "carpenter",
      tags: ["furniture", "doors", "wooden-work"],
    },
    {
      _id: "mock-carpenter-2",
      provider_id: "mock-carpenter-2",
      name: "Suresh Singh",
      provider_name: "Suresh Singh",
      title: "Furniture Specialist",
      description: "Custom furniture design and repair services",
      category: "carpenter",
      address: "DLF Phase 2, Gurgaon, Haryana",
      location: "DLF Phase 2, Gurgaon, Haryana",
      email: "suresh.furniture@email.com",
      rating: 4.6,
      reviews: 32,
      experience: "6 years",
      experienceYears: 6,
      availability: "8:00 AM - 7:00 PM",
      serviceType: "carpenter",
      tags: ["custom-furniture", "repair", "design"],
    },
  ],
  plumber: [
    {
      _id: "mock-plumber-1",
      provider_id: "mock-plumber-1",
      name: "Amit Sharma",
      provider_name: "Amit Sharma",
      title: "Licensed Plumber",
      description: "24/7 plumbing services, pipe repair, and installation",
      category: "plumber",
      address: "Cyber City, Gurgaon, Haryana",
      location: "Cyber City, Gurgaon, Haryana",
      email: "amit.plumber@email.com",
      rating: 4.9,
      reviews: 67,
      experience: "12 years",
      experienceYears: 12,
      availability: "24/7 Available",
      serviceType: "plumber",
      tags: ["emergency", "pipes", "installation"],
    },
    {
      _id: "mock-plumber-2",
      provider_id: "mock-plumber-2",
      name: "Rajesh Gupta",
      provider_name: "Rajesh Gupta",
      title: "Bathroom Specialist",
      description: "Bathroom fitting, leak repair, and drainage solutions",
      category: "plumber",
      address: "Sohna Road, Gurgaon, Haryana",
      location: "Sohna Road, Gurgaon, Haryana",
      email: "rajesh.bathroom@email.com",
      rating: 4.7,
      reviews: 38,
      experience: "9 years",
      experienceYears: 9,
      availability: "9:00 AM - 9:00 PM",
      serviceType: "plumber",
      tags: ["bathroom", "leaks", "drainage"],
    },
  ],
  electrician: [
    {
      _id: "mock-electrician-1",
      provider_id: "mock-electrician-1",
      name: "Vikash Yadav",
      provider_name: "Vikash Yadav",
      title: "Certified Electrician",
      description:
        "Home wiring, electrical repairs, and appliance installation",
      category: "electrician",
      address: "Golf Course Road, Gurgaon, Haryana",
      location: "Golf Course Road, Gurgaon, Haryana",
      email: "vikash.electric@email.com",
      rating: 4.8,
      reviews: 52,
      experience: "10 years",
      experienceYears: 10,
      availability: "8:00 AM - 8:00 PM",
      serviceType: "electrician",
      tags: ["wiring", "appliances", "repairs"],
    },
  ],
  painter: [
    {
      _id: "mock-painter-1",
      provider_id: "mock-painter-1",
      name: "Mohan Lal",
      provider_name: "Mohan Lal",
      title: "Professional Painter",
      description:
        "Interior and exterior painting, wall texture, and decoration",
      category: "painter",
      address: "MG Road, Gurgaon, Haryana",
      location: "MG Road, Gurgaon, Haryana",
      email: "mohan.painter@email.com",
      rating: 4.5,
      reviews: 29,
      experience: "7 years",
      experienceYears: 7,
      availability: "9:00 AM - 6:00 PM",
      serviceType: "painter",
      tags: ["interior", "exterior", "texture"],
    },
  ],
  cook: [
    {
      _id: "mock-cook-1",
      provider_id: "mock-cook-1",
      name: "Sunita Devi",
      provider_name: "Sunita Devi",
      title: "Home Cook",
      description: "North Indian cuisine specialist, tiffin services available",
      category: "cook",
      address: "Sector 14, Gurgaon, Haryana",
      location: "Sector 14, Gurgaon, Haryana",
      email: "sunita.cook@email.com",
      rating: 4.9,
      reviews: 73,
      experience: "15 years",
      experienceYears: 15,
      availability: "6:00 AM - 10:00 PM",
      serviceType: "cook",
      tags: ["north-indian", "tiffin", "home-style"],
    },
  ],
  gardener: [
    {
      _id: "mock-gardener-1",
      provider_id: "mock-gardener-1",
      name: "Ravi Prasad",
      provider_name: "Ravi Prasad",
      title: "Garden Specialist",
      description: "Lawn maintenance, plant care, and garden design",
      category: "gardener",
      address: "DLF Phase 3, Gurgaon, Haryana",
      location: "DLF Phase 3, Gurgaon, Haryana",
      email: "ravi.garden@email.com",
      rating: 4.6,
      reviews: 41,
      experience: "5 years",
      experienceYears: 5,
      availability: "6:00 AM - 4:00 PM",
      serviceType: "gardener",
      tags: ["lawn", "plants", "design"],
    },
  ],
};

export default ServicesPanel

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