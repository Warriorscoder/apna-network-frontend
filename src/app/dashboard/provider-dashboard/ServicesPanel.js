import { useState } from "react";
import {
  Briefcase,
  MapPin,
  Star,
  Clock,
  Edit3,
  Plus,
} from "lucide-react";
import { toast } from "react-toastify";

const dummyServices = [
  {
    _id: "1",
    title: "Plumbing",
    description: "Professional plumbing service for all your needs.",
    category: "home repair",
    isActive: true,
    provider_name: "John Doe",
    location: "123 Main St, Springfield",
    experience: "5 years",
    rating: 4.5,
  },
  {
    _id: "2",
    title: "Electrician",
    description: "Certified electrician for residential and commercial work.",
    category: "electrical",
    isActive: false,
    provider_name: "Jane Smith",
    location: "456 Elm St, Shelbyville",
    experience: "8 years",
    rating: 4.7,
  },
];

const ServicesPanel = () => {
  const [services, setServices] = useState(dummyServices);

  const toggleServiceStatus = (serviceId, currentStatus) => {
    setServices((prev) =>
      prev.map((s) =>
        s._id === serviceId ? { ...s, isActive: !s.isActive } : s
      )
    );
    toast.success("Service status updated");
  };

  const handleEditService = (id) => {
    toast.info("Edit service functionality coming soon");
    console.log("Edit service:", id);
  };

  const handleAddNewService = () => {
    toast.info("Add service functionality coming soon");
  };

  return (
    <div className="bg-white/70 rounded-xl shadow-lg p-6 border border-white/30 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-[#695aa6] flex items-center">
          <Briefcase className="w-6 h-6 mr-2" />
          My Services
          <span className="ml-2 bg-[#695aa6] text-white text-sm px-2 py-1 rounded-full">
            {services.length}
          </span>
        </h2>
        <button
          onClick={handleAddNewService}
          className="flex items-center gap-2 px-4 py-2 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a]"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {services.length === 0 ? (
          <div className="text-center text-gray-600">
            No services listed. Add one to get started.
          </div>
        ) : (
          services.map((service, idx) => (
            <div
              key={service._id || idx}
              className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {service.title || "Unnamed Service"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {service.description || "No description provided"}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                    {service.location && (
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {service.location}
                      </span>
                    )}
                    {service.experience && (
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {service.experience}
                      </span>
                    )}
                    {service.rating && (
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-500" />
                        {service.rating}
                      </span>
                    )}
                  </div>

                  {service.category && (
                    <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {service.category}
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 ml-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-semibold ${
                      service.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {service.isActive ? "Active" : "Inactive"}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        toggleServiceStatus(service._id, service.isActive)
                      }
                      className="p-1 text-gray-500 hover:text-gray-700"
                      title="Toggle Status"
                    >
                      <Clock className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditService(service._id)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      title="Edit Service"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ServicesPanel;
