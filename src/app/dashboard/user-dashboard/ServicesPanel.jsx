import { Briefcase, Search, Star, MapPin, Clock, Award, Filter, ChevronRight, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dialoguebox from '@/components/servicePage/Dialoguebox';
import LocationSelector from '@/components/LocationSelector';

const ServiceCategoryCard = ({ service, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="bg-white border rounded-xl p-3 sm:p-4 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(105,90,166,0.15)] flex flex-col items-center justify-center h-40 sm:h-48 relative overflow-hidden cursor-pointer"
      style={{ borderColor: "#a99fd4" }}
    >
      <div
        className={`transition-all duration-300 ease-in-out flex flex-col items-center ${hovered ? "translate-y-[-25%] sm:translate-y-[-30%]" : "translate-y-0"
          }`}
      >
        <img
          src={service.image || "/placeholder.svg?height=64&width=64"}
          alt={service.title}
          className="w-10 h-10 sm:w-14 sm:h-14 mb-2 object-contain"
        />
        <h3 className="text-base sm:text-lg font-bold text-[#695aa6] leading-tight">
          {service.title}
        </h3>
      </div>
      <div
        className={`absolute bottom-2 sm:bottom-4 px-2 text-xs text-gray-600 text-center transition-all duration-300 ease-in-out ${hovered
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

const EnhancedServiceCard = ({ service, onMoreDetails, index }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="bg-[#695aa6] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium flex-shrink-0">
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-800 text-base truncate">
            {service.name}
          </h3>
          <div className="flex items-center space-x-1 mt-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
            <span className="text-xs text-gray-600">
              {service.rating}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div className="space-y-2 mb-4 text-sm">
      <div className="flex items-start space-x-2">
        <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
        <span className="text-gray-600 break-words leading-relaxed">
          {service.address}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
        <span className="text-gray-600">
          {service.availability}
        </span>
      </div>
    </div>

    <div className="flex space-x-2">
      <button
        onClick={() => onMoreDetails(service)}
        className="flex-1 py-2.5 px-4 bg-[#695aa6] text-white rounded-lg text-sm hover:bg-[#5a4d8a] transition-colors font-medium"
      >
        View Details
      </button>
      {service.phone && service.phone !== "Not provided" && (
        <a
          href={`tel:${service.phone}`}
          className="py-2.5 px-4 border border-[#695aa6] text-[#695aa6] rounded-lg text-sm hover:bg-[#695aa6] hover:text-white transition-colors font-medium"
        >
          Call
        </a>
      )}
    </div>
  </div>
);

function ServicesPanel() {
  const [viewMode, setViewMode] = useState("categories");
  const [selectedService, setSelectedService] = useState(null);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [allcategories, setAllcategories] = useState([]);
  
  // New filter states matching page.jsx
  const [showFilters, setShowFilters] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    const fetchallcategories = async () => {
      try {
        setLoading(true)

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/`)

        if (!response.data.success) {
          console.log("error in fetching categories")
        }

        setAllcategories(response.data.data)
      }
      catch (error) {
        console.log("Internal server error")
        throw new Error
      }
      finally {
        setLoading(false);
      }
    }

    fetchallcategories();
  }, [])

  const filteredServiceCategories = allcategories.filter(
    (category) =>
      category.title.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  const handleCategorySelect = async (service) => {
    setSelectedService(service);
    setViewMode("providers");
    fetchServiceProviders(service.key);
  };

  const fetchServiceProviders = async (serviceKey) => {
    setLoading(true);
    try {
      const apiurl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axios.get(`${apiurl}/services/`);
      if (!response.data.success) throw new Error("Failed to fetch services");

      const services = response.data.data || [];
      const filteredServices = services.filter((item) => item.category === serviceKey);
      setServiceData(filteredServices);

      if (filteredServices.length > 0) {
        const providerIds = filteredServices.map((item) => item.provider_id);
        const result = await axios.post(`${apiurl}/providers/multi-by-id`, { ids: providerIds });
        if (!result.data.success) throw new Error("Failed to fetch providers");

        const providersData = result.data.providers || [];
        
        // Enhanced provider data transformation to match page.jsx structure
        const transformedData = providersData.map((provider) => ({
          name: provider.name,
          email: provider.email,
          provider_id: provider._id,
          village: provider.village,
          panchayat_ward: provider.panchayat_ward,
          tehsil: provider.tehsil,
          district: provider.district,
          location: provider.location,
          address: `${provider.village}, ${provider.panchayat_ward}, ${provider.tehsil}, ${provider.district}, ${provider.location}`,
          rating: Math.floor(Math.random() * 5) + 1,
          availability: `${provider.availability?.from || "9 AM"} - ${provider.availability?.to || "6 PM"}`,
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

  const handleMoreDetails = (provider) => {
    const serviceInfo = serviceData.find((item) => item.provider_id === provider.provider_id);
    const cardData = {
      ...provider,
      title: serviceInfo?.description || `${selectedService?.title} Service`,
      tags: serviceInfo?.tags || [selectedService?.title?.toLowerCase()],
      category: serviceInfo?.category || selectedService?.serviceKey,
      experience: serviceInfo?.experience_level,
      serviceId: serviceInfo._id
    };
    setSelectedProvider(cardData);
    setIsDialogOpen(true);
  };

  const handleBackToCategories = () => {
    setViewMode("categories");
    setSelectedService(null);
    setFilteredProviders([]);
    setSearchTerm("");
    setServiceData([]);
    setCategorySearchTerm("");
    // Reset filters
    setSelectedState("");
    setSelectedCity("");
    setShowFilters(false);
  };

  // Clear all filters function
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedState("");
    setSelectedCity("");
  };

  // Enhanced filter providers based on search term and selected filters (matching page.jsx)
  const filteredAndSearchedProviders = filteredProviders.filter((provider) => {
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2"
          style={{ textShadow: "0 4px 24px rgba(60,50,100,0.65), 0 2px 4px rgba(0,0,0,0.3)" }}>
          {viewMode === "categories" ? "Browse Services" : `${selectedService?.title || "Service"} Providers`}
        </h1>
        <p className="text-white/90 text-lg"
          style={{ textShadow: "0 2px 12px rgba(60,50,100,0.45), 0 1px 2px rgba(0,0,0,0.3)" }}>
          {viewMode === "categories"
            ? "Find trusted professionals for all your needs"
            : `Connect with verified ${selectedService?.title?.toLowerCase()} in your area`
          }
        </p>
      </div>

      <div className="bg-white/70 rounded-xl shadow-lg border border-white/30 backdrop-blur-sm">
        <div className="p-4 sm:p-6 border-b border-white/20">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#695aa6] flex items-center">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0" />
              <span className="truncate">{viewMode === "categories"
                ? "Service Categories"
                : `${selectedService?.title || "Service"} Providers`}
              </span>
            </h2>
            {viewMode === "providers" && (
              <button
                onClick={handleBackToCategories}
                className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-gray-800 px-3 py-1.5 rounded-lg transition-all text-sm flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium hidden sm:inline">Back</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6" style={{ minHeight: '50vh' }}>
          {viewMode === "categories" ? (
            <>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search categories (e.g., carpenter)"
                    value={categorySearchTerm}
                    onChange={(e) => setCategorySearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {filteredServiceCategories.length > 0 ? (
                  filteredServiceCategories.map((category, index) => (
                    <ServiceCategoryCard
                      key={category.key || index}
                      service={category}
                      onClick={() => handleCategorySelect(category)}
                    />
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center text-center py-10">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-gray-500">No services found for "{categorySearchTerm}"</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Enhanced Search and Filter Section matching page.jsx */}
              <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
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

              {loading ? (
                <div className="flex flex-col items-center justify-center text-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#695aa6] mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading {selectedService?.title?.toLowerCase()}...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center text-center py-10">
                  <div className="text-4xl mb-4">⚠️</div>
                  <p className="text-red-600">{error}</p>
                </div>
              ) : filteredAndSearchedProviders.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-10">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No {selectedService?.title} Found</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    No providers found matching your search and filters. Try different keywords or filters.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition-colors text-sm sm:text-base"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div>
                  {/* Results Count */}
                  <div className="mb-4 text-center">
                    <p className="text-sm text-gray-600">
                      Found {filteredAndSearchedProviders.length}{" "}
                      {selectedService?.title?.toLowerCase()} provider{filteredAndSearchedProviders.length !== 1 ? 's' : ''}
                      {(selectedState || selectedCity || searchTerm) && (
                        <span className="text-[#695aa6] font-medium">
                          {" "}matching your criteria
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-sm bg-white rounded-lg shadow-sm">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="py-4 px-4 text-left font-semibold text-gray-800">#</th>
                          <th className="py-4 px-4 text-left font-semibold text-gray-800">Provider</th>
                          <th className="py-4 px-4 text-left font-semibold text-gray-800">Location</th>
                          <th className="py-4 px-4 text-left font-semibold text-gray-800">Rating</th>
                          <th className="py-4 px-4 text-left font-semibold text-gray-800">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAndSearchedProviders.map((provider, index) => (
                          <tr key={provider.provider_id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4 text-gray-700">{index + 1}</td>
                            <td className="py-4 px-4">
                              <div className="font-medium text-gray-800">{provider.name}</div>
                              <div className="text-sm text-gray-600">{provider.phone}</div>
                            </td>
                            <td className="py-4 px-4 text-gray-700 max-w-xs">
                              <div className="break-words">{provider.address}</div>
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

                  <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredAndSearchedProviders.map((provider, index) => (
                      <EnhancedServiceCard key={provider.provider_id || index} service={provider} onMoreDetails={handleMoreDetails} index={index} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

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
export default ServicesPanel;