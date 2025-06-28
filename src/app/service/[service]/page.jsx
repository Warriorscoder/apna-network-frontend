"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Star, Clock, Award, User, ArrowLeft } from "lucide-react"
import Footer from "@/app/Footer"

// Service metadata for better display - Complete list for all services
const serviceMetadata = {
  plumbers: {
    title: "Plumbers",
    image: "/imgs/plumber 2.jpg",
    description: "Professional plumbing services for your home and business",
  },
  electricians: {
    title: "Electricians",
    image: "/imgs/electrician.jpg",
    description: "Expert electrical services and installations",
  },
  carpenters: {
    title: "Carpenters",
    image: "/imgs/Car.jpg",
    description: "Skilled carpentry and woodworking services",
  },
  painters: {
    title: "Painters",
    image: "/imgs/painter.jpg",
    description: "Professional painting and decoration services",
  },
  "construction-workers": {
    title: "Construction Workers",
    image: "/imgs/mason.jpg",
    description: "Professional construction and masonry services",
  },
  welders: {
    title: "Welders",
    image: "/imgs/welder.jpg",
    description: "Expert welding and metal fabrication services",
  },
  tailors: {
    title: "Tailors",
    image: "/imgs/tailor.jpg",
    description: "Professional tailoring and clothing alteration services",
  },
  cooks: {
    title: "Cooks",
    image: "/imgs/cook.jpg",
    description: "Professional cooking and catering services",
  },
  gardeners: {
    title: "Gardeners",
    image: "/imgs/gardner.jpg",
    description: "Professional gardening and landscaping services",
  },
  housekeepers: {
    title: "House Keepers",
    image: "/imgs/housekeeper.jpg",
    description: "Professional house cleaning and maintenance services",
  },
  barbers: {
    title: "Barbers",
    image: "/imgs/barber.jpg",
    description: "Professional hair cutting and grooming services",
  },
  drivers: {
    title: "Drivers",
    image: "/imgs/driver.jpg",
    description: "Professional driving and transportation services",
  },
  "dry-cleaners": {
    title: "Dry Cleaners",
    image: "/imgs/drycleaner.jpg",
    description: "Professional dry cleaning and laundry services",
  },
  photographers: {
    title: "Photographers",
    image: "/imgs/Photographer.jpg",
    description: "Professional photography and videography services",
  },
  astrologers: {
    title: "Astrologers",
    image: "/imgs/pandit.jpg",
    description: "Professional astrology and spiritual consultation services",
  },
  "interior-designer": {
    title: "Interior Designer",
    image: "/imgs/interior designer.jpg",
    description: "Professional interior design and decoration services",
  },
  "other-services": {
    title: "Other Services",
    image: "/imgs/4.png",
    description: "Explore additional services we offer",
  },
}

// Dummy providers to show if backend returns none
const dummyProviders = [
  {
    id: "dummy1",
    name: "Ramesh Kumar",
    address: "Model Town, Kanpur",
    experience: "5 years experienced",
    rating: 4.5,
    phone: "9876543210",
    availability: "9:00 AM - 6:00 PM",
    services: ["Plumbing", "Pipe Fitting"],
    bio: "Expert plumber with 5 years of experience in residential and commercial projects.",
  },
  {
    id: "dummy2",
    name: "Suresh Singh",
    address: "Civil Lines, Lucknow",
    experience: "3 years experienced",
    rating: 4.2,
    phone: "9123456780",
    availability: "10:00 AM - 8:00 PM",
    services: ["Plumbing", "Leak Repair"],
    bio: "Quick and reliable plumber for all your needs.",
  },
]

// Provider Details Modal
const ProviderModal = ({ provider, isOpen, onClose }) => {
  if (!isOpen || !provider) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#695aa6" }}
              >
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{provider.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-600">{provider.rating || "N/A"}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
              ×
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-gray-600">{provider.bio || provider.description || "Professional service provider"}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                  <span className="text-gray-600">{provider.address || "Address not provided"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">{provider.availability || "Contact for availability"}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Service Details</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5" style={{ color: "#695aa6" }} />
                  <span className="text-gray-600">{provider.experience || "Experience not specified"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Services</h3>
            <div className="flex flex-wrap gap-2">
              {provider.services && provider.services.length > 0 ? (
                provider.services.map((service, index) => (
                  <span
                    key={index}
                    className="text-white px-3 py-1 rounded-full text-sm"
                    style={{ backgroundColor: "#695aa6" }}
                  >
                    {service}
                  </span>
                ))
              ) : (
                <span className="text-white px-3 py-1 rounded-full text-sm" style={{ backgroundColor: "#695aa6" }}>
                  {provider.service?.title || "Service Provider"}
                </span>
              )}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => window.open(`sms:${provider.phone}`)}
              className="flex-1 text-white border py-3 px-6 rounded-lg transition-colors duration-200 font-medium"
              style={{ backgroundColor: "#695aa6" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#5a4a96")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#695aa6")}
            >
              Send SMS
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Service Page Component
export default function ServicePage({ params }) {
  const router = useRouter()
  const { service } = React.use(params)
  const [providers, setProviders] = useState([])
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const serviceData = serviceMetadata[service]

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true)
        setError(null)

        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL

        // First, try to get all providers since your backend doesn't have service-specific filtering
        const allProvidersResponse = await fetch(`${apiUrl}/api/providers/`)

        if (!allProvidersResponse.ok) {
          throw new Error("Failed to fetch providers")
        }

        const providersResult = await allProvidersResponse.json()

        // Handle the backend response format { success: true, providers: [...] }
        const allProviders = providersResult.success ? providersResult.providers : []

        // Since your backend doesn't have service filtering, we'll show all providers for now
        // You can implement service-specific filtering later by adding service categories to providers
        const transformedProviders = allProviders.map((provider) => ({
          ...provider,
          id: provider._id,
          provider_name: provider.name,
          address: `${provider.village || ""}, ${provider.tehsil || ""}, ${provider.district || ""}`.replace(
            /^,\s*|,\s*$/g,
            "",
          ),
          contact_number: provider.phone,
          experience: provider.work_experience
            ? `${provider.work_experience} years experienced`
            : "Experience not specified",
          availability: provider.availability
            ? `${provider.availability.from || ""} - ${provider.availability.to || ""}`
            : "Contact for availability",
          rating: 4.0 + Math.random() * 1, // Temporary random rating since not in your model
        }))

        // If no providers, use dummy data
        setProviders(transformedProviders.length > 0 ? transformedProviders : dummyProviders)
      } catch (err) {
        console.error("Error fetching providers:", err)
        setError(err.message)
        setProviders(dummyProviders) // Show dummy data on error as well
      } finally {
        setLoading(false)
      }
    }

    fetchProviders()
  }, [service])

  const handleMoreDetails = (provider) => {
    setSelectedProvider(provider)
    setIsModalOpen(true)
  }

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
      <ProviderModal provider={selectedProvider} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}