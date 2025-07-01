"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { MapPin, Star, Clock, Award, User, ArrowLeft } from "lucide-react"
import Footer from "@/app/Footer"
import axios from "axios"
import Dialoguebox from "@/components/servicePage/Dialoguebox"

// Main Service Page Component
export default function ServicePage() {
  const params = useParams()
  const service = params?.service
  const [providers, setProviders] = useState([])
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [serviceData, setServiceData] = useState([])
  const router = useRouter()
  
  const handleMoreDetails = (provider) => {
    const service = serviceData.find(item => item.provider_id === provider.provider_id);

    console.log("Service data for provider:", service)
    console.log("Selected provider:", provider)
    const cardData = {
      ...provider,
      title: service?.description,
      tags: service?.tags || [],
      category: service?.category
    }

    setSelectedProvider(cardData)
    setIsModalOpen(true)
  }

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const apiurl = process.env.NEXT_PUBLIC_API_BASE_URL;

        const response = await axios.get(`${apiurl}/services/`);
        console.log("Fetched services:", response.data);

        if (!response.data.success) {
          throw new Error("Failed to fetch services");
        }

        const services = response.data.data || [];

        const fitteredServices = services.filter(item => item.category === service);
        
        console.log("Filtered services:", fitteredServices);
        setServiceData(fitteredServices)

        const providerIds = fitteredServices.map(item => item.provider_id);

        const result = await axios.post(`${apiurl}/providers/multi-by-id`, { ids: providerIds });

        if (!result.data.success) {
          throw new Error("Failed to fetch providers");
        }

        const providersData = result.data.providers || [];
        console.log("Fetched providers:", providersData);
        const transformedData = providersData.map(provider => ({
          name: provider.name,
          provider_id: provider._id,
          address: `${provider.village}, ${provider.panchayat_ward}, ${provider.tehsil}, ${provider.district}, ${provider.location}`,
          rating: Math.floor(Math.random() * 5) + 1,
          experience: `${provider.experience} years of experience`,
          availability: `${provider.availability.from} - ${provider.availability.to}`,
          phone: provider.phone || "Not provided"
        }));

        setProviders(transformedData);
        console.log("transformed providers:", transformedData);
        setError(null);
      } catch (error) {
        console.error("Error fetching providers:", error);
        // setError("Failed to load providers. Please try again later.");
        // setProviders(dummyProviders);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProvider(null)
  }

  const handleBackToServices = () => {
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: "#695aa6" }}
          ></div>
          <p className="text-gray-600">Loading service providers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section with Return Button */}
      <div className="relative" style={{ background: "linear-gradient(135deg, #a99fd4 0%, #695aa6 100%)" }}>
        {/* Return to Home Button - Top Left */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={handleBackToServices}
            className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-gray-800 px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Return to Home</span>
          </button>
        </div>

        {/* Header Content */}
        <div className="py-16 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Service Icon */}
            <div className="mb-6">
              <div className="bg-white rounded-2xl p-6 inline-block shadow-lg">
                <img
                  src={serviceData?.image || "/imgs/default-service.jpg"}
                  alt={serviceData?.title || service}
                  className="w-24 h-24 mx-auto object-contain"
                />
              </div>
            </div>

            {/* Service Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 capitalize">
              {serviceData?.title || service.replace("-", " ")}
            </h1>
          </div>
        </div>
      </div>

      {/* Table Section - Flex grow to push footer down */}
      <div className="bg-white flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Error loading providers: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {!error && providers.length > 0 ? (
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
                    {providers.map((provider, index) => (
                      <tr
                        key={provider.id || provider.provider_id || index}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4 text-gray-700">{index + 1}</td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-800">{provider.name || provider.provider_name}</div>
                        </td>
                        <td className="py-4 px-4 text-gray-700 max-w-xs">
                          <div className="break-words">
                            {provider.address || provider.location || "Address not provided"}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-700">{provider.experience || "Not specified"}</td>
                        <td className="py-4 px-4 text-gray-700 flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                            <polygon points="10,1 12.59,7.36 19.51,7.36 13.97,11.63 16.56,17.99 10,13.72 3.44,17.99 6.03,11.63 0.49,7.36 7.41,7.36" />
                          </svg>
                          <span>{provider.rating ?? "N/A"}</span>
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
                {providers.map((provider, index) => (
                  <div
                    key={provider.id || provider.provider_id || index}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gray-100 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800 text-lg">
                            {provider.name || provider.provider_name}
                          </h3>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-600">{provider.rating || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                        <span className="text-sm text-gray-600 break-words">
                          {provider.address || provider.location || "Address not provided"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4" style={{ color: "#695aa6" }} />
                        <span className="text-sm text-gray-600">
                          {provider.experience || "Experience not specified"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {provider.availability || "Contact for availability"}
                        </span>
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
          ) : (
            !error && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Providers Found</h3>
                <p className="text-gray-600">
                  We're currently expanding our network. Check back soon for professionals in this category.
                </p>
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
  )
}

const dummyProvider = {
  name: "Raj Kumar",
  provider_id: "68614578d78bcebc27e1edff",
  address: "Nangloi, Ward 5, Najafgarh, South West, Delhi",
  rating: 1,
  experience: "3 years of experience",
};

const dummyService = {
  title: "Carpenters Service 1",
  description: "High quality carpenters services provided.",
  category: "carpenters",
  contact: "9876500000",
  tags: ["carpenters", "professional", "local"],
  images: ["/imgs/Car.jpg"],
};