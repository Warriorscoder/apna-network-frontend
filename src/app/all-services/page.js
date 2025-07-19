"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Search, MapPin, Star, Clock, Award } from "lucide-react";
import Dialoguebox from "@/components/servicePage/Dialoguebox";
import axios from "axios";
import ConditionalNavbar from "@/components/ConditionalNavbar";

// ServiceCard component matching FeaturedServices design EXACTLY
const ServiceCard = ({ service, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="bg-white border rounded-xl p-4 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(105,90,166,0.15)] flex flex-col items-center justify-center h-56 relative overflow-hidden cursor-pointer"
      style={{ borderColor: "#a99fd4" }}
    >
      <div
        className={`transition-all duration-300 ease-in-out flex flex-col items-center ${
          hovered ? "translate-y-[-40%]" : "translate-y-0"
        }`}
      >
        <img
          src={service.image || "/placeholder.svg?height=64&width=64"}
          alt={service.title}
          className="w-16 h-16 mb-2 object-contain"
        />
        <h3 className="text-xl font-bold text-[#695aa6]">{service.title}</h3>
      </div>
      <div
        className={`absolute bottom-4 px-2 text-xs text-gray-600 text-center transition-all duration-300 ease-in-out ${
          hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <p className="mb-1 text-sm">{service.subtitle}</p>
      </div>
    </div>
  );
};

// Services data matching FeaturedServices EXACTLY
const services = [
  {
    image: "/imgs/Car.jpg",
    title: "Carpenters",
    subtitle: "Click here to get your all kind of wooden works done",
    serviceKey: "carpenters",
  },
  {
    image: "/imgs/plumber 2.jpg",
    title: "Plumbers",
    subtitle: "Click here to get your all kind of pipeline and fitting works done",
    serviceKey: "plumbers",
  },
  {
    image: "/imgs/mason.jpg",
    title: "Construction Workers",
    subtitle: "Click here to build your dreams",
    serviceKey: "construction-workers",
  },
  {
    image: "/imgs/electrician.jpg",
    title: "Electricians",
    subtitle: "Click here to get your wirings fixed",
    serviceKey: "electricians",
  },
  {
    image: "/imgs/painter.jpg",
    title: "Painters",
    subtitle: "Click here to get your walls painted and decorate",
    serviceKey: "painters",
  },
  {
    image: "/imgs/welder.jpg",
    title: "Welders",
    subtitle: "Here are some welders of your area",
    serviceKey: "welders",
  },
  {
    image: "/imgs/tailor.jpg",
    title: "Tailors",
    subtitle: "Click here to get outfit done",
    serviceKey: "tailors",
  },
  {
    image: "/imgs/cook.jpg",
    title: "Cooks",
    subtitle: "Click here to taste the delicious food items",
    serviceKey: "cooks",
  },
  {
    image: "/imgs/gardner.jpg",
    title: "Gardeners",
    subtitle: "Click here to keep your gardens green forever",
    serviceKey: "gardeners",
  },
  {
    image: "/imgs/housekeeper.jpg",
    title: "House Keepers",
    subtitle: "Click here to keep your house clean",
    serviceKey: "housekeepers",
  },
  {
    image: "/imgs/barber.jpg",
    title: "Barbers",
    subtitle: "Click here to get you hairs style done",
    serviceKey: "barbers",
  },
  {
    image: "/imgs/driver.jpg",
    title: "Drivers",
    subtitle: "Click here if you wanna go on long drive",
    serviceKey: "drivers",
  },
  {
    image: "/imgs/drycleaner.jpg",
    title: "Dry Cleaners",
    subtitle: "Click here to keep your clothes neat and cleaned",
    serviceKey: "dry-cleaners",
  },
  {
    image: "/imgs/Photographer.jpg",
    title: "Photographers",
    subtitle: "Tap here to click special moments of your life",
    serviceKey: "photographers",
  },
  {
    image: "/imgs/pandit.jpg",
    title: "Astrologers",
    subtitle: "Tap here to talk to astrologer",
    serviceKey: "astrologers",
  },
  {
    image: "/imgs/interior designer.jpg",
    title: "Interior Designer",
    subtitle: "Contact Interior Designer",
    serviceKey: "interior-designer",
  },
];

// Login Modal component
const LoginModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
      <h2 className="text-2xl font-bold mb-4 text-[#695aa6]">Login Required</h2>
      <p className="mb-6 text-gray-700">Please log in or register to view service providers.</p>
      <a
        href="/login"
        className="block w-full py-3 rounded-lg font-semibold text-white bg-[#695aa6] hover:bg-[#5a4d8a] transition mb-3"
      >
        Login
      </a>
      <a
        href="/register"
        className="block w-full py-2 rounded-lg font-semibold text-[#695aa6] bg-gray-100 hover:bg-gray-200 transition"
      >
        Register
      </a>
      <button
        className="w-full py-2 rounded-lg font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 transition mt-2"
        onClick={onClose}
      >
        Cancel
      </button>
    </div>
  </div>
);

export default function AllServicesPage() {
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

  // Handle service click - show providers (like current service page)
  const handleServiceClick = (service) => {
    setSelectedService(service);
    setShowProviderList(true);
    fetchServiceProviders(service.serviceKey);
  };

  // Fetch providers for selected service (same logic as current service page)
  const fetchServiceProviders = async (serviceKey) => {
    setLoading(true);
    try {
      const apiurl = process.env.NEXT_PUBLIC_API_BASE_URL;

      // Fetch services
      const response = await axios.get(`${apiurl}/services/`);
      
      if (!response.data.success) {
        throw new Error("Failed to fetch services");
      }

      const services = response.data.data || [];
      const filteredServices = services.filter(item => item.category === serviceKey);
      
      setServiceData(filteredServices);

      if (filteredServices.length > 0) {
        const providerIds = filteredServices.map(item => item.provider_id);

        // Fetch providers
        const result = await axios.post(`${apiurl}/providers/multi-by-id`, { ids: providerIds });

        if (!result.data.success) {
          throw new Error("Failed to fetch providers");
        }

        const providersData = result.data.providers || [];
        const transformedData = providersData.map(provider => ({
          name: provider.name,
          provider_id: provider._id,
          address: `${provider.village}, ${provider.panchayat_ward}, ${provider.tehsil}, ${provider.district}, ${provider.location}`,
          rating: Math.floor(Math.random() * 5) + 1,
          experience: `${provider.experience} years of experience`,
          availability: `${provider.availability?.from || "9:00 AM"} - ${provider.availability?.to || "6:00 PM"}`,
          phone: provider.phone || "Not provided"
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

  // Handle provider details (same as current service page)
  const handleMoreDetails = (provider) => {
    const serviceInfo = serviceData.find(item => item.provider_id === provider.provider_id);

    const cardData = {
      ...provider,
      title: serviceInfo?.description || `${selectedService?.title} Service`,
      tags: serviceInfo?.tags || [selectedService?.title?.toLowerCase()],
      category: serviceInfo?.category || selectedService?.serviceKey
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
    router.push('/');
  };

  // Filter providers based on search
  const filteredAndSearchedProviders = filteredProviders.filter(provider => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    const matchesName = provider.name?.toLowerCase().includes(searchLower);
    const matchesAddress = provider.address?.toLowerCase().includes(searchLower);
    
    return matchesName || matchesAddress;
  });

  // If showing provider list, render provider view (like current service page)
  if (showProviderList) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Header Section - Same as current service page */}
        <div className="relative" style={{ background: "linear-gradient(135deg, #a99fd4 0%, #695aa6 100%)" }}>
          {/* Back Buttons - Top Left */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <button
              onClick={handleBackToServices}
              className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-gray-800 px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">All Services</span>
            </button>
          </div>

          {/* Header Content */}
          <div className="py-16 px-4 text-center">
            <div className="max-w-4xl mx-auto">
              {/* Service Icon */}
              <div className="mb-6">
                <div className="bg-white rounded-2xl p-6 inline-block shadow-lg">
                  <img
                    src={selectedService?.image || "/imgs/default-service.jpg"}
                    alt={selectedService?.title}
                    className="w-24 h-24 mx-auto object-contain"
                  />
                </div>
              </div>

              {/* Service Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                {selectedService?.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Search Section - Super Simple */}
        <div className="bg-gray-50 py-5">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex gap-3">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={`Search ${selectedService?.title?.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent text-lg"
                  />
                </div>

                {/* Search Button */}
                <button
                  className="px-8 py-4 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition-colors font-semibold text-lg"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section - Same as current service page */}
        <div className="bg-white flex-grow">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {loading ? (
              <div className="text-center py-16">
                <div
                  className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                  style={{ borderColor: "#695aa6" }}
                ></div>
                <p className="text-gray-600">Loading {selectedService?.title?.toLowerCase()}...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Providers</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => fetchServiceProviders(selectedService?.serviceKey)}
                  className="px-6 py-3 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : filteredAndSearchedProviders.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  No {selectedService?.title} Found
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? `No providers found matching "${searchTerm}". Try different keywords.`
                    : "We're currently expanding our network. Check back soon for professionals in this category."}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-4 px-6 py-2 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-4 font-semibold text-gray-800">#</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-800">Name</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-800">Address</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-800">Working Experience</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-800">Rating</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSearchedProviders.map((provider, index) => (
                        <tr
                          key={provider.provider_id || index}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4 text-gray-700">{index + 1}</td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-800">{provider.name}</div>
                          </td>
                          <td className="py-4 px-4 text-gray-700 max-w-xs">
                            <div className="break-words">{provider.address}</div>
                          </td>
                          <td className="py-4 px-4 text-gray-700">{provider.experience}</td>
                          <td className="py-4 px-4 text-gray-700 flex items-center gap-1">
                            <svg className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                              <polygon points="10,1 12.59,7.36 19.51,7.36 13.97,11.63 16.56,17.99 10,13.72 3.44,17.99 6.03,11.63 0.49,7.36 7.41,7.36" />
                            </svg>
                            <span>{provider.rating}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              <button
                                style={{ backgroundColor: "#695aa6", color: "white" }}
                                onClick={() => handleMoreDetails(provider)}
                                className="px-3 py-1 rounded text-sm transition-colors duration-200 hover:opacity-90"
                              >
                                Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {filteredAndSearchedProviders.map((provider, index) => (
                    <div
                      key={provider.provider_id || index}
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gray-100 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800 text-lg">{provider.name}</h3>
                            <div className="flex items-center space-x-1 mt-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-gray-600">{provider.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                          <span className="text-sm text-gray-600 break-words">{provider.address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Award className="w-4 h-4" style={{ color: "#695aa6" }} />
                          <span className="text-sm text-gray-600">{provider.experience}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{provider.availability}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          style={{ backgroundColor: "#695aa6", color: "white" }}
                          onClick={() => handleMoreDetails(provider)}
                          className="flex-1 py-2 px-4 rounded text-sm transition-colors duration-200 hover:opacity-90 font-medium"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => window.open(`sms:${provider.phone}`)}
                          className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded text-sm transition-colors duration-200 hover:bg-gray-50 font-medium"
                        >
                          Contact
                        </button>
                      </div>
                    </div>
                  ))}
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

  // Main services view - EXACT copy of FeaturedServices layout
  return (<>
    <ConditionalNavbar/>
    <section
      className="py-20"
      style={{
        background: "linear-gradient(to top, #fff 0%, rgba(105, 90, 166, 0.35) 99%, rgba(105, 90, 166, 0.5) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Back to Home Button */}

        {/* Header - EXACT copy from FeaturedServices */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: "#695aa6" }}>
            Services We Offer
          </h2>
        </div>

        {/* Services Grid - EXACT copy of FeaturedServices */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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
}
