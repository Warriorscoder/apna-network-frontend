import { Briefcase, Search, Star, MapPin, Clock, Award, Filter, ChevronRight, ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import Dialoguebox from '@/components/servicePage/Dialoguebox';

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
        className={`transition-all duration-300 ease-in-out flex flex-col items-center ${
          hovered ? "translate-y-[-25%] sm:translate-y-[-30%]" : "translate-y-0"
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
        <Award className="w-4 h-4 text-[#695aa6] flex-shrink-0" />
        <span className="text-gray-600">
          {service.experience}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
        <span className="text-gray-600">
          {service.availability}
        </span>
      </div>
    </div>
    
    <button
      onClick={() => onMoreDetails(service)}
      className="w-full py-2.5 px-4 bg-[#695aa6] text-white rounded-lg text-sm hover:bg-[#5a4d8a] transition-colors font-medium"
    >
      View Details
    </button>
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

  const filteredServiceCategories = serviceCategories.filter(
    (category) =>
      category.title.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  const handleCategorySelect = async (service) => {
    setSelectedService(service);
    setViewMode("providers");
    fetchServiceProviders(service.serviceKey);
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
        const transformedData = providersData.map((provider) => ({
          name: provider.name,
          provider_id: provider._id,
          address: `${provider.village}, ${provider.panchayat_ward}, ${provider.tehsil}, ${provider.district}`,
          rating: Math.floor(Math.random() * 5) + 1,
          experience: `${provider.experience} years`,
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
  };

  const filteredAndSearchedProviders = filteredProviders.filter((provider) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return provider.name?.toLowerCase().includes(searchLower) || provider.address?.toLowerCase().includes(searchLower);
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
                      key={category.serviceKey || index}
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
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder={`Search in ${selectedService?.title?.toLowerCase()}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  <button className="px-6 py-2.5 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition-colors font-semibold text-sm sm:text-base">
                    Search
                  </button>
                </div>
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
                  <p className="text-gray-600 text-sm">{searchTerm ? `No providers found for "${searchTerm}".` : "Check back soon!"}</p>
                </div>
              ) : (
                <div>
                  <div className="mb-4 text-sm text-gray-600 lg:hidden">
                    Found {filteredAndSearchedProviders.length} {selectedService?.title?.toLowerCase()}
                  </div>
                  
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="py-3 px-4 text-left font-semibold text-gray-800">#</th>
                          <th className="py-3 px-4 text-left font-semibold text-gray-800">Name</th>
                          <th className="py-3 px-4 text-left font-semibold text-gray-800">Address</th>
                          <th className="py-3 px-4 text-left font-semibold text-gray-800">Experience</th>
                          <th className="py-3 px-4 text-left font-semibold text-gray-800">Rating</th>
                          <th className="py-3 px-4 text-left font-semibold text-gray-800">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAndSearchedProviders.map((provider, index) => (
                          <tr key={provider.provider_id || index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">{index + 1}</td>
                            <td className="py-3 px-4 font-medium text-gray-800">{provider.name}</td>
                            <td className="py-3 px-4 text-gray-700 max-w-xs truncate">{provider.address}</td>
                            <td className="py-3 px-4 text-gray-700">{provider.experience}</td>
                            <td className="py-3 px-4"><div className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><span>{provider.rating}</span></div></td>
                            <td className="py-3 px-4"><button onClick={() => handleMoreDetails(provider)} className="px-3 py-1.5 bg-[#695aa6] text-white rounded text-xs hover:bg-[#5a4d8a] transition">View Details</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredAndSearchedProviders.map((provider, index) => (
                      <EnhancedServiceCard key={provider.provider_id || index} service={provider} onMoreDetails={handleMoreDetails} index={index}/>
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


// Static Data
const serviceCategories = [
  { image: "/imgs/Car.jpg", title: "Carpenters", subtitle: "All kind of wooden works", serviceKey: "carpenters" },
  { image: "/imgs/plumber 2.jpg", title: "Plumbers", subtitle: "Pipeline and fitting works", serviceKey: "plumbers" },
  { image: "/imgs/mason.jpg", title: "Construction", subtitle: "Build your dreams", serviceKey: "construction-workers" },
  { image: "/imgs/electrician.jpg", title: "Electricians", subtitle: "Get your wirings fixed", serviceKey: "electricians" },
  { image: "/imgs/painter.jpg", title: "Painters", subtitle: "Get your walls painted", serviceKey: "painters" },
  { image: "/imgs/welder.jpg", title: "Welders", subtitle: "Welders of your area", serviceKey: "welders" },
  { image: "/imgs/tailor.jpg", title: "Tailors", subtitle: "Get your outfit done", serviceKey: "tailors" },
  { image: "/imgs/cook.jpg", title: "Cooks", subtitle: "Taste delicious food", serviceKey: "cooks" },
  { image: "/imgs/gardner.jpg", title: "Gardeners", subtitle: "Keep gardens green", serviceKey: "gardeners" },
  { image: "/imgs/housekeeper.jpg", title: "House Keepers", subtitle: "Keep your house clean", serviceKey: "housekeepers" },
  { image: "/imgs/barber.jpg", title: "Barbers", subtitle: "Get your hair styled", serviceKey: "barbers" },
  { image: "/imgs/driver.jpg", title: "Drivers", subtitle: "Go on a long drive", serviceKey: "drivers" },
  { image: "/imgs/drycleaner.jpg", title: "Dry Cleaners", subtitle: "Keep clothes neat", serviceKey: "dry-cleaners" },
  { image: "/imgs/Photographer.jpg", title: "Photographers", subtitle: "Click special moments", serviceKey: "photographers" },
  { image: "/imgs/pandit.jpg", title: "Astrologers", subtitle: "Talk to an astrologer", serviceKey: "astrologers" },
  { image: "/imgs/interior designer.jpg", title: "Interior Designer", subtitle: "Design your space", serviceKey: "interior-designer" },
];

export default ServicesPanel;