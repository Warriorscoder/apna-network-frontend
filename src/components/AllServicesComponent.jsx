// "use client";
// import { useState, useEffect, useMemo } from "react"; // ✅ ADDED useMemo
// import { useRouter } from "next/navigation";
// import { services } from "@/data/services";
// import {
//   ArrowLeft,
//   Home,
//   Search,
//   MapPin,
//   Star,
//   Clock,
//   Award,
//   Menu,
//   X,
//   ChevronDown,
//   ChevronUp,
// } from "lucide-react";
// import Dialoguebox from "@/components/servicePage/Dialoguebox";
// import LocationSelector from "@/components/LocationSelector";
// import axios from "axios";
// import ConditionalNavbar from "./ConditionalNavbar";

// // ServiceCard component - Mobile Optimized
// const ServiceCard = ({ service, onClick }) => {
//   const [hovered, setHovered] = useState(false);
//   return (
//     <div
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       onClick={onClick}
//       className="bg-white border rounded-xl p-3 sm:p-4 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(105,90,166,0.15)] flex flex-col items-center justify-center h-44 sm:h-56 relative overflow-hidden cursor-pointer"
//       style={{ borderColor: "#a99fd4" }}
//     >
//       <div
//         className={`transition-all duration-300 ease-in-out flex flex-col items-center ${
//           hovered ? "translate-y-[-35%] sm:translate-y-[-40%]" : "translate-y-0"
//         }`}
//       >
//         <img
//           src={service.image || "/placeholder.svg?height=64&width=64"}
//           alt={service.title}
//           className="w-12 h-12 sm:w-16 sm:h-16 mb-2 object-contain"
//         />
//         <h3 className="text-lg sm:text-xl font-bold text-[#695aa6] leading-tight">
//           {service.title}
//         </h3>
//       </div>
//       <div
//         className={`absolute bottom-2 sm:bottom-4 px-2 text-xs text-gray-600 text-center transition-all duration-300 ease-in-out ${
//           hovered
//             ? "opacity-100 translate-y-0"
//             : "opacity-0 translate-y-2 pointer-events-none"
//         }`}
//       >
//         <p className="mb-1 text-xs sm:text-sm leading-tight">
//           {service.subtitle}
//         </p>
//       </div>
//     </div>
//   );
// };

// // Mobile-Optimized Login Modal
// const LoginModal = ({ onClose }) => (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//     <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-sm w-full text-center">
//       <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#695aa6]">
//         Login Required
//       </h2>
//       <p className="mb-6 text-gray-700 text-sm sm:text-base">
//         Please log in or register to view service providers.
//       </p>
//       <a
//         href="/login"
//         className="block w-full py-2.5 sm:py-3 rounded-lg font-semibold text-white bg-[#695aa6] hover:bg-[#5a4d8a] transition mb-3 text-sm sm:text-base"
//       >
//         Login
//       </a>
//       <a
//         href="/register"
//         className="block w-full py-2 rounded-lg font-semibold text-[#695aa6] bg-gray-100 hover:bg-gray-200 transition text-sm sm:text-base"
//       >
//         Register
//       </a>
//       <button
//         className="w-full py-2 rounded-lg font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 transition mt-2 text-sm sm:text-base"
//         onClick={onClose}
//       >
//         Cancel
//       </button>
//     </div>
//   </div>
// );

// // Main Unified Component
// const AllServicesComponent = ({
//   openInNewPage = false,
//   showBackButton = false,
//   showNavbar = false,
//   initialServiceKey, // ✅ NEW: open list directly for a given service
//   backBehavior = "inline", // "inline" | "history"
// }) => {
//   const router = useRouter();
//   const [providers, setProviders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showLogin, setShowLogin] = useState(false);

//   // Provider-related states
//   const [showProviderList, setShowProviderList] = useState(false);
//   const [selectedService, setSelectedService] = useState(null);
//   const [filteredProviders, setFilteredProviders] = useState([]);
//   const [selectedProvider, setSelectedProvider] = useState(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [serviceData, setServiceData] = useState([]);
//   // console.log(selectedProvider)
//   // Search and filter states
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFilters, setShowFilters] = useState(false);

//   // Location filter states - simplified (India is fixed) + Tehsil
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");
//   const [selectedTehsil, setSelectedTehsil] = useState(""); // ✅ ADDED: Tehsil filter
//   const [availableTehsils, setAvailableTehsils] = useState([]); // ✅ ADDED: Store available tehsils

//   // reviews related states
//   const [allReviews, setAllReviews] = useState([]);
//   const [reviewdata, setReviewdata] = useState([]);
//   const [providerId, setProviderId] = useState();
//   const [serviceId, setServiceId] = useState();

//   const [categorySearchTerm, setCategorySearchTerm] = useState(""); // ✅ ADDED: Category search state

//   // Handle service click - UNIFIED LOGIC
//   const handleServiceClick = (service) => {
//     if (openInNewPage) {
//       // Featured Services: open separate page
//       router.push(`/service/${service.serviceKey}`);
//       return;
//     }
//     // Navbar service page: open inline provider list
//     setSelectedService(service);
//     setShowProviderList(true);
//     fetchServiceProviders(service.serviceKey);
//   };

//   // Fetch providers for selected service
//   const fetchServiceProviders = async (serviceKey) => {
//     setLoading(true);
//     try {
//       const apiurl = process.env.NEXT_PUBLIC_API_BASE_URL;
//       const response = await axios.get(`${apiurl}/services/`);
//       if (!response.data.success) {
//         throw new Error("Failed to fetch services");
//       }
//       const services = response.data.data || [];
//       const filteredServices = services.filter(
//         (item) => item.category === serviceKey
//       );
//       setServiceData(filteredServices);

//       if (filteredServices.length > 0) {
//         const providerIds = filteredServices.map((item) => item.provider_id);
//         const result = await axios.post(`${apiurl}/providers/multi-by-id`, {
//           ids: providerIds,
//         });
//         if (!result.data.success) {
//           throw new Error("Failed to fetch providers");
//         }

//         const providersData = result.data.providers || [];

//         // Helper function to safely get address components
//         const getAddressComponent = (value) => {
//           if (!value || value === "undefined" || value === null) return null;
//           const cleaned = value.toString().trim();
//           return cleaned === "" || cleaned === "undefined" ? null : cleaned;
//         };

//         // Transform provider data
//         const transformedData = providersData.map((provider) => {
//           // Extract and clean address components
//           const village = getAddressComponent(provider.village);
//           const panchayatWard = getAddressComponent(provider.panchayat_ward);
//           const tehsil = getAddressComponent(provider.tehsil);
//           const district = getAddressComponent(provider.district);
//           const location = getAddressComponent(provider.location);

//           // Build address string with only valid components
//           const addressComponents = [
//             village,
//             panchayatWard,
//             tehsil,
//             district,
//             location,
//           ].filter(Boolean);

//           const formattedAddress =
//             addressComponents.length > 0
//               ? addressComponents.join(", ")
//               : "Address not available";

//           return {
//             name: provider.name || "Name not available",
//             email: provider.email || "Email not available",
//             provider_id: provider._id,
//             village: village || "Not specified",
//             panchayat_ward: panchayatWard || "Not specified",
//             tehsil: tehsil || "Not specified",
//             district: district || "Not specified",
//             location: location || "Not specified",
//             address: formattedAddress,
//             availability: `${provider.availability?.from || "9:00 AM"} - ${
//               provider.availability?.to || "6:00 PM"
//             }`,
//             phone: provider.phone || "Not provided",
//             rating: Math.floor(Math.random() * 5) + 1, // ✅ USE RANDOM RATING LIKE DASHBOARD
//           };
//         });

//         const tehsilSet = new Set();

//         transformedData.forEach((provider) => {
//           if (
//             provider.address &&
//             provider.address !== "Address not available"
//           ) {
//             // Split address by comma and extract potential tehsils
//             const addressParts = provider.address
//               .split(",")
//               .map((part) => part.trim());

//             // Add each valid address part as potential tehsil
//             addressParts.forEach((part) => {
//               if (
//                 part &&
//                 part.length > 2 &&
//                 part !== "Uttar Pradesh" &&
//                 part !== "UP"
//               ) {
//                 tehsilSet.add(part);
//               }
//             });
//           }
//         });

//         // Convert to sorted array
//         const uniqueTehsils = Array.from(tehsilSet).sort();
//         setAvailableTehsils(uniqueTehsils);
//         setFilteredProviders(transformedData);
//       } else {
//         setFilteredProviders([]);
//         setAvailableTehsils([]);
//       }
//       setError(null);
//     } catch (error) {
//       console.error("Error fetching providers:", error);
//       setError("Failed to load providers. Please try again later.");
//       setFilteredProviders([]);
//       setAvailableTehsils([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle provider details
//   const handleMoreDetails = (provider) => {
//     const serviceInfo = serviceData.find(
//       (item) => item.provider_id === provider.provider_id
//     );

//     const cardData = {
//       ...provider,
//       title: serviceInfo?.description || `${selectedService?.title} Service`,
//       tags: serviceInfo?.tags || [selectedService?.title?.toLowerCase()],
//       category: serviceInfo?.category || selectedService?.serviceKey,
//       experience: serviceInfo?.experience_level || "Experience not specified",
//       serviceId: serviceInfo?._id,
//     };
//     // console.log("Card Data:", cardData);
//     setSelectedProvider(cardData);
//     setProviderId(cardData?.provider_id);
//     setServiceId(cardData?.serviceId);
//     setIsDialogOpen(true);
//   };

//   // Handle back to services
//   const handleBackToServices = () => {
//     if (backBehavior === "history") {
//       if (typeof window !== "undefined" && window.history.length > 1) {
//         router.back();
//       } else {
//         router.push("/"); // fallback to home
//       }
//       return;
//     }
//     // default inline behavior
//     setShowProviderList(false);
//     setSelectedService(null);
//     setFilteredProviders([]);
//     setSearchTerm("");
//     setSelectedState("");
//     setSelectedCity("");
//     setSelectedTehsil("");
//     setAvailableTehsils([]);
//     setServiceData([]);
//     setCategorySearchTerm("");
//   };

//   const handleBackToHome = () => {
//     router.push("/");
//   };

//   // all reviews fetch
//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         const allReviews = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews/`
//         );
//         if (allReviews.data.success) {
//           setAllReviews(allReviews.data.data);
//         }

//         // console.log("all reviews", allReviews?.data);
//       } catch (error) {
//         console.log("error in fetching reviews ", error);
//       }
//     };
//     fetchReviews();
//   }, []);
//   // filter out reviews
//   useEffect(() => {
//     // Only run the filter if we have a selected provider and a list of reviews
//     if (selectedProvider && allReviews.length > 0) {
//       const filtered = allReviews.filter(
//         (review) =>
//           review.provider_id === selectedProvider.provider_id &&
//           review.serviceId === selectedProvider.serviceId
//       );

//       setReviewdata(filtered); // Set the filtered reviews to your state
//       // console.log("filtered review ", reviewdata)
//     } else {
//       // Optional: If no provider is selected, clear the reviews
//       setReviewdata([]);
//     }
//   }, [allReviews, selectedProvider]);

//   // Enhanced filter providers based on search term and selected filters
//   const filteredAndSearchedProviders = filteredProviders.filter((provider) => {
//     // ✅ USE filteredProviders DIRECTLY
//     const address = provider.address?.toLowerCase() || "";
//     const name = provider.name?.toLowerCase() || "";
//     const village = provider.village?.toLowerCase() || "";
//     const tehsil = provider.tehsil?.toLowerCase() || "";
//     const district = provider.district?.toLowerCase() || "";
//     const location = provider.location?.toLowerCase() || "";

//     // Search term filtering - check multiple fields
//     const matchesSearchTerm =
//       !searchTerm ||
//       name.includes(searchTerm.toLowerCase()) ||
//       address.includes(searchTerm.toLowerCase()) ||
//       village.includes(searchTerm.toLowerCase()) ||
//       tehsil.includes(searchTerm.toLowerCase()) ||
//       district.includes(searchTerm.toLowerCase()) ||
//       location.includes(searchTerm.toLowerCase());

//     // State filtering - check against Indian states
//     let matchesState = true;
//     if (selectedState) {
//       const selectedStateLower = selectedState.toLowerCase();
//       matchesState =
//         location.includes(selectedStateLower) ||
//         district.includes(selectedStateLower) ||
//         address.includes(selectedStateLower);
//     }

//     // City filtering - enhanced matching
//     let matchesCity = true;
//     if (selectedCity) {
//       const selectedCityLower = selectedCity.toLowerCase();
//       matchesCity =
//         district.includes(selectedCityLower) ||
//         location.includes(selectedCityLower) ||
//         address.includes(selectedCityLower) ||
//         village.includes(selectedCityLower);
//     }

//     let matchesTehsil = true;
//     if (selectedTehsil) {
//       const selectedTehsilLower = selectedTehsil.toLowerCase();
//       matchesTehsil =
//         tehsil.includes(selectedTehsilLower) ||
//         address.includes(selectedTehsilLower);
//     }

//     return matchesSearchTerm && matchesState && matchesCity && matchesTehsil;
//   });

//   // Clear all filters function
//   const clearAllFilters = () => {
//     setSearchTerm("");
//     setSelectedState("");
//     setSelectedCity("");
//     setSelectedTehsil("");
//   };

//   // Filter services based on search term
//   const filteredServices = services.filter(
//     (service) =>
//       service.title.toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
//       service.subtitle?.toLowerCase().includes(categorySearchTerm.toLowerCase())
//   );

//   // ✅ Auto-open provider list on pages that pass initialServiceKey (service category page)
//   useEffect(() => {
//     if (!initialServiceKey) return;
//     const svc = services.find((s) => s.serviceKey === initialServiceKey);
//     if (!svc) return;
//     setSelectedService(svc);
//     setShowProviderList(true);
//     fetchServiceProviders(svc.serviceKey);
//   }, [initialServiceKey]);

//   // Provider List View - Mobile Optimized
//   if (showProviderList && !openInNewPage) {
//     return (
//       <div className="flex flex-col min-h-screen">
//         {/* Mobile-Optimized Header Section */}
//         <div
//           className="relative"
//           style={{
//             background: "linear-gradient(135deg, #a99fd4 0%, #695aa6 100%)",
//           }}
//         >
//           {/* Back button - top left */}
//           <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
//             <button
//               onClick={handleBackToServices}
//               className="flex items-center space-x-1 sm:space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-gray-800 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-200 backdrop-blur-sm text-sm sm:text-base"
//             >
//               <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
//               {/* Always show "Back" */}
//               <span className="font-medium">Back</span>
//             </button>
//           </div>
//           {/* Mobile Navigation */}
//           <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
//             <button
//               onClick={handleBackToServices}
//               className="flex items-center space-x-1 sm:space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-gray-800 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-200 backdrop-blur-sm text-sm sm:text-base"
//             >
//               <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
//               <span className="font-medium hidden sm:inline">All Services</span>
//               <span className="font-medium sm:hidden">Back</span>
//             </button>
//           </div>
//           {/* Header Content */}
//           <div className="py-12 sm:py-16 px-4 text-center">
//             <div className="max-w-4xl mx-auto">
//               <div className="mb-4 sm:mb-6">
//                 <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 inline-block shadow-lg">
//                   <img
//                     src={selectedService?.image || "/imgs/default-service.jpg"}
//                     alt={selectedService?.title}
//                     className="w-16 h-16 sm:w-24 sm:h-24 mx-auto object-contain"
//                   />
//                 </div>
//               </div>
//               <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2 sm:mb-4 px-4">
//                 {selectedService?.title}
//               </h1>
//               <p className="text-sm sm:text-base text-gray-700 px-4 max-w-2xl mx-auto">
//                 {selectedService?.description}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Mobile-Optimized Search and Filter Section */}
//         <div className="bg-gray-50 py-3 sm:py-5">
//           <div className="max-w-4xl mx-auto px-3 sm:px-4">
//             <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
//               {/* Search Bar */}
//               <div className="mb-4">
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="Search by name, location, village, or tehsil..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full pl-10 pr-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent text-sm sm:text-lg"
//                   />
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Search className="w-5 h-5 text-gray-400" />
//                   </div>
//                 </div>
//               </div>

//               {/* Toggle Button for Filters */}
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors mb-2"
//               >
//                 <span className="font-medium text-[#695aa6]">
//                   Location Filters
//                 </span>
//                 <div className="flex items-center space-x-2">
//                   {(selectedState || selectedCity || selectedTehsil) && (
//                     <span className="bg-[#695aa6] text-white text-xs px-2 py-1 rounded-full">
//                       {
//                         [selectedState, selectedCity, selectedTehsil].filter(
//                           Boolean
//                         ).length
//                       }{" "}
//                       selected
//                     </span>
//                   )}
//                   {showFilters ? <ChevronUp /> : <ChevronDown />}
//                 </div>
//               </button>

//               {/* Collapsible Filter Section - Using LocationSelector */}
//               {showFilters && (
//                 <div className="border-t border-gray-200 pt-4">
//                   <LocationSelector
//                     selectedState={selectedState}
//                     selectedCity={selectedCity}
//                     onStateChange={setSelectedState}
//                     onCityChange={setSelectedCity}
//                   />

//                   <div className="mt-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Filter by Tehsil
//                     </label>
//                     <div className="relative">
//                       <select
//                         value={selectedTehsil}
//                         onChange={(e) => setSelectedTehsil(e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent text-sm bg-white"
//                       >
//                         <option value="">All Tehsils</option>
//                         {availableTehsils.map((tehsil, index) => (
//                           <option key={index} value={tehsil}>
//                             {tehsil}
//                           </option>
//                         ))}
//                       </select>
//                       {selectedTehsil && (
//                         <button
//                           onClick={() => setSelectedTehsil("")}
//                           className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       )}
//                     </div>
//                     <p className="text-xs text-gray-500 mt-1">
//                       {availableTehsils.length > 0
//                         ? `Choose from ${availableTehsils.length} available tehsils`
//                         : "No tehsils available for this service"}
//                     </p>
//                   </div>

//                   {/* Clear Filters Button - Updated condition */}
//                   {(selectedState || selectedCity || selectedTehsil) && (
//                     <div className="mt-3 flex justify-end">
//                       <button
//                         onClick={clearAllFilters}
//                         className="px-4 py-2 text-sm text-[#695aa6] hover:text-[#5a4d8a] transition-colors"
//                       >
//                         Clear All Filters
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Mobile-Optimized Providers Section */}
//         <div className="bg-white flex-grow">
//           <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
//             {loading ? (
//               <div className="text-center py-12 sm:py-16">
//                 <div
//                   className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 mx-auto mb-4"
//                   style={{ borderColor: "#695aa6" }}
//                 ></div>
//                 <p className="text-gray-600 text-sm sm:text-base">
//                   Loading {selectedService?.title?.toLowerCase()}...
//                 </p>
//               </div>
//             ) : error ? (
//               <div className="text-center py-12 sm:py-16 px-4">
//                 <div className="text-4xl sm:text-6xl mb-4">⚠️</div>
//                 <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
//                   Error Loading Providers
//                 </h3>
//                 <p className="text-red-600 mb-4 text-sm sm:text-base">
//                   {error}
//                 </p>
//                 <button
//                   onClick={() =>
//                     fetchServiceProviders(selectedService?.serviceKey)
//                   }
//                   className="px-4 sm:px-6 py-2 sm:py-3 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition-colors text-sm sm:text-base"
//                 >
//                   Retry
//                 </button>
//               </div>
//             ) : filteredAndSearchedProviders.length === 0 ? (
//               <div className="text-center py-12 sm:py-16 px-4">
//                 <div className="text-4xl sm:text-6xl mb-4">🔍</div>
//                 <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
//                   No {selectedService?.title} Found
//                 </h3>
//                 <p className="text-gray-600 text-sm sm:text-base mb-4">
//                   No providers found matching your search and filters.
//                   {selectedTehsil && (
//                     <span className="block mt-1">
//                       No providers found in <strong>{selectedTehsil}</strong>{" "}
//                       tehsil.
//                     </span>
//                   )}
//                 </p>

//                 {/* Show available tehsils if user selected one */}
//                 {selectedTehsil && availableTehsils.length > 0 && (
//                   <div className="mb-4">
//                     <p className="text-sm text-gray-500 mb-2">
//                       Available tehsils for this service:
//                     </p>
//                     <div className="flex flex-wrap justify-center gap-2">
//                       {availableTehsils.slice(0, 5).map((tehsil, index) => (
//                         <button
//                           key={index}
//                           onClick={() => setSelectedTehsil(tehsil)}
//                           className="bg-[#695aa6] text-white px-3 py-1 rounded-full text-xs hover:bg-[#5a4d8a] transition-colors"
//                         >
//                           {tehsil}
//                         </button>
//                       ))}
//                       {availableTehsils.length > 5 && (
//                         <span className="text-xs text-gray-500 px-2 py-1">
//                           +{availableTehsils.length - 5} more
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 <button
//                   onClick={clearAllFilters}
//                   className="px-4 sm:px-6 py-2 sm:py-3 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition-colors text-sm sm:text-base"
//                 >
//                   Clear All Filters
//                 </button>
//               </div>
//             ) : (
//               <>
//                 {/* Results Count */}
//                 <div className="mb-4 text-center">
//                   <p className="text-sm text-gray-600">
//                     Found {filteredAndSearchedProviders.length}{" "}
//                     {selectedService?.title?.toLowerCase()} provider
//                     {filteredAndSearchedProviders.length !== 1 ? "s" : ""}
//                     {(selectedState ||
//                       selectedCity ||
//                       selectedTehsil ||
//                       searchTerm) && (
//                       <span className="text-[#695aa6] font-medium">
//                         {" "}
//                         matching your criteria
//                       </span>
//                     )}
//                   </p>
//                   {/* Show active filters */}
//                   {(selectedState || selectedCity || selectedTehsil) && (
//                     <div className="flex flex-wrap justify-center gap-2 mt-2">
//                       {selectedState && (
//                         <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
//                           State: {selectedState}
//                         </span>
//                       )}
//                       {selectedCity && (
//                         <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
//                           City: {selectedCity}
//                         </span>
//                       )}
//                       {selectedTehsil && (
//                         <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
//                           Tehsil: {selectedTehsil}
//                         </span>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {/* Desktop Table View - Hidden on Mobile */}
//                 <div className="hidden lg:block overflow-x-auto">
//                   <table className="w-full bg-white rounded-lg shadow-sm">
//                     <thead>
//                       <tr className="border-b-2 border-gray-200">
//                         <th className="text-left py-4 px-4 font-semibold text-gray-800">
//                           #
//                         </th>
//                         <th className="text-left py-4 px-4 font-semibold text-gray-800">
//                           Provider
//                         </th>
//                         <th className="text-left py-4 px-4 font-semibold text-gray-800">
//                           Location
//                         </th>
//                         {/* <th className="text-left py-4 px-4 font-semibold text-gray-800">
//                           Experience
//                         </th> */}
//                         <th className="text-left py-4 px-4 font-semibold text-gray-800">
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredAndSearchedProviders.map((provider, index) => (
//                         <tr
//                           key={provider.provider_id || index}
//                           className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
//                         >
//                           <td className="py-4 px-4 text-gray-700">
//                             {index + 1}
//                           </td>
//                           <td className="py-4 px-4">
//                             <div className="font-medium text-gray-800">
//                               {provider.name}
//                             </div>
//                           </td>
//                           <td className="py-4 px-4 text-gray-700 max-w-xs">
//                             <div className="break-words">
//                               {provider.address}
//                             </div>
//                           </td>
//                           {/* <td className="py-4 px-4 text-gray-700">
//                             <div className="flex items-center gap-1">
//                               <span>{provider.experience_level}</span>
//                             </div>
//                           </td> */}
//                           <td className="py-4 px-4">
//                             <button
//                               onClick={() => handleMoreDetails(provider)}
//                               className="px-4 py-2 bg-[#695aa6] text-white rounded text-sm hover:bg-[#5a4d8a] transition-colors"
//                             >
//                               View Details
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Mobile Card View - Optimized */}
//                 <div className="lg:hidden">
//                   <div className="space-y-3 sm:space-y-4">
//                     {filteredAndSearchedProviders.map((provider, index) => (
//                       <div
//                         key={provider.provider_id || index}
//                         className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
//                       >
//                         {/* Provider Header */}
//                         <div className="flex items-start justify-between mb-3">
//                           <div className="flex items-center space-x-3 flex-1 min-w-0">
//                             <div className="bg-[#695aa6] text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0">
//                               {index + 1}
//                             </div>
//                             <div className="min-w-0 flex-1">
//                               <h3 className="font-semibold text-gray-800 text-sm sm:text-lg truncate">
//                                 {provider.name}
//                               </h3>
//                               {/* ✅ REMOVED RATING FROM HERE TO MATCH USER DASHBOARD DESKTOP */}
//                             </div>
//                           </div>
//                         </div>

//                         {/* Provider Details */}
//                         <div className="space-y-2 mb-4">
//                           <div className="flex items-start space-x-2">
//                             <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
//                             <span className="text-xs sm:text-sm text-gray-600 break-words leading-relaxed">
//                               {provider.address}
//                             </span>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
//                             <span className="text-xs sm:text-sm text-gray-600">
//                               {provider.availability}
//                             </span>
//                           </div>
//                         </div>

//                         {/* Action Buttons */}
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => handleMoreDetails(provider)}
//                             className="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 bg-[#695aa6] text-white rounded-lg text-xs sm:text-sm hover:bg-[#5a4d8a] transition-colors font-medium"
//                           >
//                             View Details
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Dialog Box */}
//         <Dialoguebox
//           data={selectedProvider}
//           isOpen={isDialogOpen}
//           onClose={() => {
//             setIsDialogOpen(false);
//             setSelectedProvider(null);
//           }}
//           providerId={providerId}
//           serviceId={serviceId}
//           allreviews={reviewdata}
//         />
//       </div>
//     );
//   }

//   // Return the main services view if not showing provider list
//   return (
//     <>
//       {showNavbar && <ConditionalNavbar />}
//       <section
//         className="relative min-h-screen"
//         style={{
//           background:
//             "linear-gradient(to top, #fff 0%, rgba(105, 90, 166, 0.35) 99%, rgba(105, 90, 166, 0.5) 100%)",
//         }}
//       >
//         {/* Spacer div to account for fixed navbar */}
//         {showNavbar && <div className="h-16 sm:h-20 md:h-24"></div>}

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
//           {/* Back to Home Button (conditional) */}
//           {showBackButton && (
//             <div className="mb-6 sm:mb-8">
//               <button
//                 onClick={handleBackToHome}
//                 className="flex items-center space-x-1 sm:space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-200 backdrop-blur-sm text-sm sm:text-base"
//               >
//                 <Home className="w-3 h-3 sm:w-4 sm:h-4" />
//                 <span className="font-medium">Back to Home</span>
//               </button>
//             </div>
//           )}

//           {/* Header - Now properly spaced */}
//           <div className="text-center mb-12 sm:mb-16">
//             <h2
//               className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-8 px-4"
//               style={{ color: "#695aa6" }}
//             >
//               Services We Offer
//             </h2>
//             <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4 mb-6 sm:mb-8">
//               Find trusted service providers in your area
//             </p>

//             <div className="max-w-md mx-auto px-4 mb-8 sm:mb-12">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   placeholder="Search services (e.g., carpenter, plumber)"
//                   value={categorySearchTerm}
//                   onChange={(e) => setCategorySearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent text-sm sm:text-base bg-white shadow-sm"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Mobile-Optimized Services Grid with Search Results */}
//           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
//             {filteredServices.length > 0 ? (
//               filteredServices.map((service, index) => (
//                 <ServiceCard
//                   key={service.serviceKey || index}
//                   service={service}
//                   onClick={() => handleServiceClick(service)}
//                 />
//               ))
//             ) : (
//               <div className="col-span-full flex flex-col items-center justify-center text-center py-12 sm:py-16">
//                 <div className="text-4xl sm:text-6xl mb-4">🔍</div>
//                 <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
//                   No Services Found
//                 </h3>
//                 <p className="text-gray-600 text-sm sm:text-base mb-4">
//                   No services found for "{categorySearchTerm}". Try different
//                   keywords.
//                 </p>
//                 <button
//                   onClick={() => setCategorySearchTerm("")}
//                   className="px-4 sm:px-6 py-2 sm:py-3 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition-colors text-sm sm:text-base"
//                 >
//                   Clear Search
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Login Modal */}
//         {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
//       </section>
//     </>
//   );
// };

// export default AllServicesComponent;


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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Dialoguebox from "@/components/servicePage/Dialoguebox";
import LocationSelector from "@/components/LocationSelector"; // Import the LocationSelector
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
        className={`transition-all duration-300 ease-in-out flex flex-col items-center ${hovered ? "translate-y-[-35%] sm:translate-y-[-40%]" : "translate-y-0"
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
  // console.log(selectedProvider)
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Location filter states - simplified (India is fixed) + Tehsil
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTehsil, setSelectedTehsil] = useState(""); // ✅ ADDED: Tehsil filter
  const [availableTehsils, setAvailableTehsils] = useState([]); // ✅ ADDED: Store available tehsils

  // reviews related states
  const [allReviews, setAllReviews] = useState([])
  const [reviewdata, setReviewdata] = useState([])
  const [providerId, setProviderId] = useState()
  const [serviceId, setServiceId] = useState()

  const [categorySearchTerm, setCategorySearchTerm] = useState(""); // ✅ ADDED: Category search state

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

        // Helper function to safely get address components
        const getAddressComponent = (value) => {
          if (!value || value === "undefined" || value === null) return null;
          const cleaned = value.toString().trim();
          return cleaned === "" || cleaned === "undefined" ? null : cleaned;
        };

        // Transform provider data
        const transformedData = providersData.map((provider) => {
          // Extract and clean address components
          const village = getAddressComponent(provider.village);
          const panchayatWard = getAddressComponent(provider.panchayat_ward);
          const tehsil = getAddressComponent(provider.tehsil);
          const district = getAddressComponent(provider.district);
          const location = getAddressComponent(provider.location);

          // Build address string with only valid components
          const addressComponents = [
            village,
            panchayatWard,
            tehsil,
            district,
            location,
          ].filter(Boolean);

          const formattedAddress =
            addressComponents.length > 0
              ? addressComponents.join(", ")
              : "Address not available";

          return {
            name: provider.name || "Name not available",
            email: provider.email || "Email not available",
            provider_id: provider._id,
            village: village || "Not specified",
            panchayat_ward: panchayatWard || "Not specified",
            tehsil: tehsil || "Not specified",
            district: district || "Not specified",
            location: location || "Not specified",
            address: formattedAddress,
            // experience_level: provider.experience_level || "Not specified",
            availability: `${provider.availability?.from || "9:00 AM"} - ${provider.availability?.to || "6:00 PM"
              }`,
            phone: provider.phone || "Not provided",
          };
        });

        const tehsilSet = new Set();

        transformedData.forEach((provider) => {
          if (
            provider.address &&
            provider.address !== "Address not available"
          ) {
            // Split address by comma and extract potential tehsils
            const addressParts = provider.address
              .split(",")
              .map((part) => part.trim());

            // Add each valid address part as potential tehsil
            addressParts.forEach((part) => {
              if (
                part &&
                part.length > 2 &&
                part !== "Uttar Pradesh" &&
                part !== "UP"
              ) {
                tehsilSet.add(part);
              }
            });
          }
        });

        // Convert to sorted array
        const uniqueTehsils = Array.from(tehsilSet).sort();
        setAvailableTehsils(uniqueTehsils);
        setFilteredProviders(transformedData);
      } else {
        setFilteredProviders([]);
        setAvailableTehsils([]);
      }
      setError(null);
    } catch (error) {
      console.error("Error fetching providers:", error);
      setError("Failed to load providers. Please try again later.");
      setFilteredProviders([]);
      setAvailableTehsils([]);
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
      experience: serviceInfo?.experience_level || "Experience not specified",
      serviceId: serviceInfo?._id,
    };
    // console.log("Card Data:", cardData);
    setSelectedProvider(cardData);
    setProviderId(cardData?.provider_id);
    setServiceId(cardData?.serviceId);
    setIsDialogOpen(true);
  };
  
  // Handle back to services
  const handleBackToServices = () => {
    setShowProviderList(false);
    setSelectedService(null);
    setFilteredProviders([]);
    setSearchTerm("");
    setSelectedState("");
    setSelectedCity("");
    setSelectedTehsil("");
    setAvailableTehsils([]);
    setServiceData([]);
    setCategorySearchTerm("");
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  // all reviews fetch
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const allReviews = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews/`);
        if(allReviews.data.success){
          setAllReviews(allReviews.data.data);
        }

        // console.log("all reviews", allReviews?.data);
      } catch (error) {
        console.log("error in fetching reviews ", error);
      }
    };
    fetchReviews();
  }, [])
  // filter out reviews
  useEffect(() => {
  // Only run the filter if we have a selected provider and a list of reviews
  if (selectedProvider && allReviews.length > 0) {
    const filtered = allReviews.filter(review => 
      review.provider_id === selectedProvider.provider_id && 
      review.serviceId   === selectedProvider.serviceId
    );
    
    setReviewdata(filtered); // Set the filtered reviews to your state
    // console.log("filtered review ", reviewdata) 
  } else {
    // Optional: If no provider is selected, clear the reviews
    setReviewdata([]);
  }
}, [allReviews, selectedProvider]); 

  // Enhanced filter providers based on search term and selected filters
  const filteredAndSearchedProviders = filteredProviders.filter((provider) => {
    const address = provider.address?.toLowerCase() || "";
    const name = provider.name?.toLowerCase() || "";
    const village = provider.village?.toLowerCase() || "";
    const tehsil = provider.tehsil?.toLowerCase() || "";
    const district = provider.district?.toLowerCase() || "";
    const location = provider.location?.toLowerCase() || "";

    // Search term filtering - check multiple fields
    const matchesSearchTerm =
    !searchTerm ||
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
      matchesState =
        location.includes(selectedStateLower) ||
        district.includes(selectedStateLower) ||
        address.includes(selectedStateLower);
    }
    
    // City filtering - enhanced matching
    let matchesCity = true;
    if (selectedCity) {
      const selectedCityLower = selectedCity.toLowerCase();
      matchesCity =
      district.includes(selectedCityLower) ||
        location.includes(selectedCityLower) ||
        address.includes(selectedCityLower) ||
        village.includes(selectedCityLower);
    }

    let matchesTehsil = true;
    if (selectedTehsil) {
      const selectedTehsilLower = selectedTehsil.toLowerCase();
      matchesTehsil =
      tehsil.includes(selectedTehsilLower) ||
        address.includes(selectedTehsilLower);
      }

      return matchesSearchTerm && matchesState && matchesCity && matchesTehsil;
    });
    
  // Clear all filters function
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedState("");
    setSelectedCity("");
    setSelectedTehsil("");
  };
   
  
  // Filter services based on search term
  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
    service.subtitle?.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );
  
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
                <span className="font-medium text-[#695aa6]">
                  Location Filters
                </span>
                <div className="flex items-center space-x-2">
                  {(selectedState || selectedCity || selectedTehsil) && (
                    <span className="bg-[#695aa6] text-white text-xs px-2 py-1 rounded-full">
                      {
                        [selectedState, selectedCity, selectedTehsil].filter(
                          Boolean
                        ).length
                      }{" "}
                      selected
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

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Tehsil
                    </label>
                    <div className="relative">
                      <select
                        value={selectedTehsil}
                        onChange={(e) => setSelectedTehsil(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent text-sm bg-white"
                      >
                        <option value="">All Tehsils</option>
                        {availableTehsils.map((tehsil, index) => (
                          <option key={index} value={tehsil}>
                            {tehsil}
                          </option>
                        ))}
                      </select>
                      {selectedTehsil && (
                        <button
                          onClick={() => setSelectedTehsil("")}
                          className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {availableTehsils.length > 0
                        ? `Choose from ${availableTehsils.length} available tehsils`
                        : "No tehsils available for this service"}
                    </p>
                  </div>

                  {/* Clear Filters Button - Updated condition */}
                  {(selectedState || selectedCity || selectedTehsil) && (
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
                  No providers found matching your search and filters.
                  {selectedTehsil && (
                    <span className="block mt-1">
                      No providers found in <strong>{selectedTehsil}</strong>{" "}
                      tehsil.
                    </span>
                  )}
                </p>

                {/* Show available tehsils if user selected one */}
                {selectedTehsil && availableTehsils.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">
                      Available tehsils for this service:
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {availableTehsils.slice(0, 5).map((tehsil, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedTehsil(tehsil)}
                          className="bg-[#695aa6] text-white px-3 py-1 rounded-full text-xs hover:bg-[#5a4d8a] transition-colors"
                        >
                          {tehsil}
                        </button>
                      ))}
                      {availableTehsils.length > 5 && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          +{availableTehsils.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={clearAllFilters}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition-colors text-sm sm:text-base"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="mb-4 text-center">
                  <p className="text-sm text-gray-600">
                    Found {filteredAndSearchedProviders.length}{" "}
                    {selectedService?.title?.toLowerCase()} provider
                    {filteredAndSearchedProviders.length !== 1 ? "s" : ""}
                    {(selectedState ||
                      selectedCity ||
                      selectedTehsil ||
                      searchTerm) && (
                        <span className="text-[#695aa6] font-medium">
                          {" "}
                          matching your criteria
                        </span>
                      )}
                  </p>
                  {/* Show active filters */}
                  {(selectedState || selectedCity || selectedTehsil) && (
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                      {selectedState && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          State: {selectedState}
                        </span>
                      )}
                      {selectedCity && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          City: {selectedCity}
                        </span>
                      )}
                      {selectedTehsil && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                          Tehsil: {selectedTehsil}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Desktop Table View - Hidden on Mobile */}
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
                        {/* <th className="text-left py-4 px-4 font-semibold text-gray-800">
                          Experience
                        </th> */}
                        <th className="text-left py-4 px-4 font-semibold text-gray-800">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSearchedProviders.map((provider, index) => (
                        <tr
                          key={provider.provider_id || index}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
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
                          {/* <td className="py-4 px-4 text-gray-700">
                            <div className="flex items-center gap-1">
                              <span>{provider.experience_level}</span>
                            </div>
                          </td> */}
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

                {/* Mobile Card View - Optimized */}
                <div className="lg:hidden">
                  <div className="space-y-3 sm:space-y-4">
                    {filteredAndSearchedProviders.map((provider, index) => (
                      <div
                        key={provider.provider_id || index}
                        className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
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
                          {provider.phone &&
                            provider.phone !== "Not provided" && (
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
          providerId = {providerId}
          serviceId = {serviceId}
          allreviews = {reviewdata}
        />
      </div>
    );
  }

  // Return the main services view if not showing provider list
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
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4 mb-6 sm:mb-8">
              Find trusted service providers in your area
            </p>

            <div className="max-w-md mx-auto px-4 mb-8 sm:mb-12">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search services (e.g., carpenter, plumber)"
                  value={categorySearchTerm}
                  onChange={(e) => setCategorySearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent text-sm sm:text-base bg-white shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Mobile-Optimized Services Grid with Search Results */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {filteredServices.length > 0 ? (
              filteredServices.map((service, index) => (
                <ServiceCard
                  key={service.serviceKey || index}
                  service={service}
                  onClick={() => handleServiceClick(service)}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center text-center py-12 sm:py-16">
                <div className="text-4xl sm:text-6xl mb-4">🔍</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  No Services Found
                </h3>
                <p className="text-gray-600 text-sm sm:text-base mb-4">
                  No services found for "{categorySearchTerm}". Try different
                  keywords.
                </p>
                <button
                  onClick={() => setCategorySearchTerm("")}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition-colors text-sm sm:text-base"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Login Modal */}
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </section>
    </>
  );
};

export default AllServicesComponent;
