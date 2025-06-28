"use client";
import { useState, useEffect } from "react";

function mapExperienceToDisplay(level) {
  if (!level) return "Not specified";
  return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
}

// Predefined lists as per team requirements
const allowedServices = [
  "Plumbing",
  "Electrical",
  "Painting",
  "Carpentry",
  "Construction",
  "Solar Panel Installation"
];

const allowedTags = [
  "Urgent",
  "Weekend",
  "Emergency",
  "Discount"
];

export default function AllServicesPage() {
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");
  const [experienceFilter, setExperienceFilter] = useState("All");

  // Safe fetch for providers
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await fetch("/api/providers/");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const contentType = res.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json"))
          throw new Error("Response is not JSON");
        const data = await res.json();
        if (data.success) {
          const providerMap = {};
          data.data.forEach((provider) => {
            providerMap[provider._id] = provider.name;
          });
          setProviders(providerMap);
        } else alert(data.message);
      } catch (error) {
        console.error("Error fetching providers", error.message);
      }
    };
    fetchProviders();
  }, []);

  // Safe fetch for services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services/");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const contentType = res.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json"))
          throw new Error("Response is not JSON");
        const data = await res.json();
        if (data.success) setServices(data.data);
        else alert(data.message);
      } catch (error) {
        alert(`Error fetching services: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Collect all unique experience levels for dropdown
  const allExperienceLevels = Array.from(
    new Set(services.map((s) => s.experience_level))
  ).filter(Boolean);

  // Filter services
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      (service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        providers[service.provider_id]?.toLowerCase().includes(searchTerm.toLowerCase())) ??
      false;
    const matchesService =
      serviceFilter === "All" || service.category === serviceFilter;
    const matchesTag =
      tagFilter === "All" || service.tags?.includes(tagFilter);
    const matchesExperience =
      experienceFilter === "All" ||
      service.experience_level === experienceFilter;
    return matchesSearch && matchesService && matchesTag && matchesExperience;
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      {/* Header Section */}
      <header className="w-full max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">All Services</h1>
        <p className="text-gray-600 mb-4">
          Browse our comprehensive selection of professional services from verified providers.
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            placeholder="Search services or providers"
            className="flex-1 p-2 rounded-[6px] border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#695aa6]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => setFilterPanelOpen(!filterPanelOpen)}
            className="p-2 rounded-[6px] bg-[#695aa6] text-white font-semibold shadow-sm"
          >
            Filters
          </button>
        </div>
      </header>

      {/* Filter Panel */}
      {filterPanelOpen && (
        <div className="w-full max-w-6xl mx-auto mb-6 p-4 bg-white rounded-[6px] border border-gray-200 shadow-lg">
          <h2 className="font-bold mb-3 text-gray-900">Filter Services</h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Service</label>
              <select
                className="w-full p-2 rounded-[6px] border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#695aa6]"
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
              >
                <option value="All">All</option>
                {allowedServices.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Tags</label>
              <select
                className="w-full p-2 rounded-[6px] border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#695aa6]"
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
              >
                <option value="All">All</option>
                {allowedTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Experience Level</label>
              <select
                className="w-full p-2 rounded-[6px] border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#695aa6]"
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
              >
                <option value="All">All</option>
                {allExperienceLevels.map((level) => (
                  <option key={level} value={level}>
                    {mapExperienceToDisplay(level)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <button
              className="p-2 rounded-[6px] border border-gray-300 bg-white text-gray-700 font-semibold"
              onClick={() => {
                setServiceFilter("All");
                setTagFilter("All");
                setExperienceFilter("All");
              }}
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Service/Provider Listing Section */}
      <section className="w-full max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-full text-center text-gray-600">Loading services...</p>
        ) : filteredServices.length === 0 ? (
          <p className="col-span-full text-center text-gray-600">No services found. Try adjusting your filters or check your backend.</p>
        ) : (
          filteredServices.map((service) => (
            <div
              key={service._id}
              className="p-4 bg-white rounded-[6px] border border-gray-200 shadow-lg"
            >
              <h3 className="font-bold text-lg text-gray-900">{service.title}</h3>
              <p className="text-gray-700">{providers[service.provider_id]}</p>
              <p className="my-2 text-gray-600">{service.description}</p>
              <div className="flex gap-2 text-sm">
                <span className="bg-[#695aa6]/10 text-[#695aa6] px-2 py-1 rounded">
                  {service.category}
                </span>
                {service.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-[#695aa6]/5 text-[#695aa6] px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
                <span className="bg-[#695aa6]/20 text-[#695aa6] px-2 py-1 rounded">
                  {mapExperienceToDisplay(service.experience_level)}
                </span>
              </div>
              <div className="flex gap-2 mt-2">
                <button className="p-2 rounded-[6px] border border-gray-300 bg-white text-gray-700 font-semibold">
                  View Details
                </button>
                <button className="p-2 rounded-[6px] bg-[#695aa6] text-white font-semibold shadow-sm">
                  Book Now
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
