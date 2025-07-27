import { useState, useEffect } from "react";
import {
  Briefcase,
  MapPin,
  Star,
  Clock,
  Edit3,
  Plus,
  X,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

// Mobile-responsive modal component for both Add and Edit
const ServiceModal = ({
  isOpen,
  onClose,
  onSave,
  availableCategories,
  serviceData,
  setServiceData,
  isEditing = false,
}) => {
  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!serviceData.category || !serviceData.description || !serviceData.experience_level) {
        toast.error("Please fill all the fields.");
        return;
    }
    onSave(serviceData);
  };

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex justify-center items-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/40 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-[#695aa6]">
              {isEditing ? "Edit Service" : "Add New Service"}
            </h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Service
                </label>
                <select
                  id="category"
                  name="category"
                  value={serviceData.category}
                  onChange={handleInputChange}
                  disabled={isEditing}
                  className={`w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-[#695aa6] focus:border-[#695aa6] bg-white ${
                    isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="" disabled>Select a service</option>
                  {isEditing ? (
                    <option value={serviceData.category}>
                      {serviceData.title || serviceData.category}
                    </option>
                  ) : (
                    availableCategories.length > 0 ? (
                      availableCategories.map((cat) => (
                        <option key={cat.key} value={cat.key}>
                          {cat.title}
                        </option>
                      ))
                    ) : (
                      <option disabled>No available services to add</option>
                    )
                  )}
                </select>
                {isEditing && (
                  <p className="text-xs text-gray-500 mt-1">Category cannot be changed when editing</p>
                )}
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={serviceData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the service you will provide..."
                  className="w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-[#695aa6] focus:border-[#695aa6] resize-none"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="experience_level" className="block text-sm font-medium text-gray-700 mb-2">
                  Experience
                </label>
                <input
                  type="text"
                  id="experience_level"
                  name="experience_level"
                  value={serviceData.experience_level}
                  onChange={handleInputChange}
                  placeholder="e.g., 5 years"
                  className="w-full px-3 py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-[#695aa6] focus:border-[#695aa6]"
                />
              </div>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2.5 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition-colors text-sm sm:text-base font-medium"
              >
                {isEditing ? "Update Service" : "Add Service"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Delete confirmation modal
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, serviceName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex justify-center items-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/40 w-full max-w-md">
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-red-600">
                Delete Service
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                This action cannot be undone
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-sm sm:text-base text-gray-700">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{serviceName}</span>? 
              This will permanently remove the service from your listings.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="w-full sm:w-auto px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base font-medium"
            >
              Delete Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServicesPanel = () => {
  const providerId = "669f9e8ba7a99a16a1314348";

  const [services, setServices] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [serviceData, setServiceData] = useState({
    category: "",
    description: "",
    experience_level: "",
    title: "",
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      
      try {
        const categoriesRes = await axios.get(`${API_BASE_URL}/categories`);
        if (categoriesRes.data.success) {
          setAllCategories(categoriesRes.data.data);
        } else {
           toast.error("Could not load service categories.");
           console.error("Error in categories response:", categoriesRes.data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch service categories from server.");
        console.error("Error fetching categories:", error);
      }

      try {
        const servicesRes = await axios.get(`${API_BASE_URL}/services/by_provider_id/${providerId}`);
        if (servicesRes.data.success) {
          const formattedServices = servicesRes.data.data.map(s => ({...s, isActive: s.active}));
          setServices(formattedServices);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setServices([]);
        } else {
          toast.error("Failed to load your existing services.");
          console.error("Error fetching services:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [providerId]);

  const toggleServiceStatus = async (serviceId, currentStatus) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/services/update/${serviceId}`, {
            active: !currentStatus
        });
        if(response.data.success){
            setServices((prev) =>
              prev.map((s) =>
                s._id === serviceId ? { ...s, isActive: !s.isActive } : s
              )
            );
            toast.success("Service status updated!");
        } else {
            toast.error(response.data.message || "Couldn't update status.");
        }
    } catch(error){
        toast.error("Failed to update service status.");
        console.error("Error updating service status:", error);
    }
  };

  const handleEditService = (service) => {
    setIsEditing(true);
    setEditingServiceId(service._id);
    setServiceData({
      category: service.category,
      description: service.description || "",
      experience_level: service.experience_level || "",
      title: service.title || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteService = (service) => {
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteService = async () => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/services/delete/${serviceToDelete._id}`);
      
      if (response.data.success) {
        setServices(prev => prev.filter(service => service._id !== serviceToDelete._id));
        toast.success("Service deleted successfully!");
        setIsDeleteModalOpen(false);
        setServiceToDelete(null);
      } else {
        toast.error(response.data.message || "Could not delete service.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while deleting the service.");
      console.error("Error deleting service:", error);
    }
  };

  const handleAddNewService = () => {
    setIsEditing(false);
    setEditingServiceId(null);
    setServiceData({ 
      category: "", 
      description: "", 
      experience_level: "", 
      title: "" 
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingServiceId(null);
    setServiceData({ 
      category: "", 
      description: "", 
      experience_level: "", 
      title: "" 
    });
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setServiceToDelete(null);
  };

  const handleSaveService = async (data) => {
    try {
      if (isEditing) {
        const response = await axios.put(`${API_BASE_URL}/services/update/${editingServiceId}`, {
          description: data.description,
          experience_level: data.experience_level,
        });

        if (response.data.success) {
          setServices(prev => 
            prev.map(service => 
              service._id === editingServiceId 
                ? { 
                    ...service, 
                    description: data.description, 
                    experience_level: data.experience_level 
                  }
                : service
            )
          );
          toast.success("Service updated successfully!");
          handleCloseModal();
        } else {
          toast.error(response.data.message || "Could not update service.");
        }
      } else {
        const payload = {
          ...data,
          provider_id: providerId,
          title: allCategories.find(c => c.key === data.category)?.title || data.category,
        };

        const response = await axios.post(`${API_BASE_URL}/services/create`, payload);

        if (response.data.success) {
          const newService = {...response.data.data, isActive: response.data.data.active};
          setServices(prev => [...prev, newService]);
          toast.success("Service added successfully!");
          handleCloseModal();
        } else {
          toast.error(response.data.message || "Could not add service.");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `An error occurred while ${isEditing ? 'updating' : 'adding'} the service.`);
      console.error(`Error ${isEditing ? 'updating' : 'saving'} service:`, error);
    }
  };

  const availableCategories = allCategories.filter(
    (cat) => !services.some((s) => s.category === cat.key)
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" 
            style={{ textShadow: "0 4px 24px rgba(60,50,100,0.65), 0 2px 4px rgba(0,0,0,0.3)" }}>
          My Services
        </h1>
        <p className="text-white/90 text-base sm:text-lg" 
           style={{ textShadow: "0 2px 12px rgba(60,50,100,0.45), 0 1px 2px rgba(0,0,0,0.3)" }}>
          Manage and showcase your professional services
        </p>
      </div>

      <ServiceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveService}
        availableCategories={availableCategories}
        serviceData={serviceData}
        setServiceData={setServiceData}
        isEditing={isEditing}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDeleteService}
        serviceName={serviceToDelete?.title || "Unknown Service"}
      />
      
      <div className="bg-white/70 rounded-xl shadow-lg p-4 sm:p-6 border border-white/30 backdrop-blur-sm hover:shadow-xl transition-all">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#695aa6] flex items-center">
            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0" />
            <span className="mr-2">My Services</span>
            <span className="bg-[#695aa6] text-white text-xs sm:text-sm px-2 py-1 rounded-full">
              {services.length}
            </span>
          </h2>
          
          <button
            onClick={handleAddNewService}
            className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition-colors text-sm sm:text-base font-medium w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span>Add Service</span>
          </button>
        </div>

        {/* Services List */}
        <div className="space-y-3 sm:space-y-4 max-h-[60vh] sm:max-h-[500px] overflow-y-auto">
          {isLoading ? (
            <div className="text-center text-gray-600 py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#695aa6] mx-auto mb-4"></div>
              <p className="text-sm sm:text-base">Loading services...</p>
            </div>
          ) : services.length === 0 && !isLoading ? (
            <div className="text-center text-gray-600 py-8">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 mb-2 text-sm sm:text-base">No services listed yet</p>
              <p className="text-xs sm:text-sm text-gray-400">
                Add your first service to start attracting customers
              </p>
            </div>
          ) : (
            services.map((service) => (
              <div
                key={service._id}
                className="bg-white/90 p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  {/* Service Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                        {service.title || "Unnamed Service"}
                      </h3>
                      
                      {/* Status Badge */}
                      <span
                        className={`self-start px-2.5 py-1 text-xs rounded-full font-semibold flex-shrink-0 ${
                          service.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                      {service.description || "No description provided"}
                    </p>

                    {/* Service Details */}
                    <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                      {service.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{service.location}</span>
                        </span>
                      )}
                      {service.experience_level && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{service.experience_level}</span>
                        </span>
                      )}
                      {service.rating && (
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 flex-shrink-0" />
                          <span>{service.rating}</span>
                        </span>
                      )}
                    </div>

                    {/* Category Tag */}
                    {service.category && (
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                        {allCategories.find(c => c.key === service.category)?.title || service.category}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex sm:flex-col gap-2 justify-end sm:items-end flex-shrink-0">
                    <button
                      onClick={() => toggleServiceStatus(service._id, service.isActive)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Toggle Status"
                    >
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => handleEditService(service)}
                      className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Service"
                    >
                      <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesPanel;
