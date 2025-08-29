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
  Tag,
  Phone,
  User,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "@/app/context/Authcontext";

// Enhanced ServiceModal with all schema fields
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

  const handleTagsChange = (e) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setServiceData((prev) => ({ ...prev, tags: tagsArray }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate required fields
    if (!serviceData.title || !serviceData.category || !serviceData.description || !serviceData.experience_level) {
      toast.error("Please fill all required fields.");
      return;
    }
    onSave(serviceData);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-start z-30 p-4 pt-20">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-lg max-h-[75vh] overflow-y-auto mt-4">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-[#695aa6]">
              {isEditing ? "Edit Service" : "Add New Service"}
            </h3>
            <button 
              onClick={onClose} 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Service Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
                Service Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={serviceData.title || ''}
                onChange={handleInputChange}
                placeholder="e.g., Professional Web Development"
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-[#695aa6] transition-colors"
                required
              />
            </div>

            {/* Service Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
                Service Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={serviceData.category || ''}
                onChange={handleInputChange}
                disabled={isEditing}
                className={`w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-[#695aa6] transition-colors ${
                  isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                }`}
                required
              >
                <option value="" disabled>Select a service category</option>
                {isEditing ? (
                  <option value={serviceData.category}>
                    {serviceData.category}
                  </option>
                ) : (
                  availableCategories.length > 0 ? (
                    availableCategories.map((cat) => (
                      <option key={cat.key || cat._id} value={cat.key || cat._id}>
                        {cat.title || cat.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No available categories</option>
                  )
                )}
              </select>
              {isEditing && (
                <p className="text-xs text-gray-500 mt-1">Category cannot be changed when editing</p>
              )}
            </div>
            
            {/* Service Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                Service Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={serviceData.description || ''}
                onChange={handleInputChange}
                placeholder="Describe the service you provide in detail..."
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-[#695aa6] resize-none transition-colors"
                required
              />
            </div>

            {/* Experience Level */}
            <div>
              <label htmlFor="experience_level" className="block text-sm font-medium text-gray-700 mb-1.5">
                Experience Level <span className="text-red-500">*</span>
              </label>
              <select
                id="experience_level"
                name="experience_level"
                value={serviceData.experience_level || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-[#695aa6] bg-white transition-colors"
                required
              >
                <option value="" disabled>Select experience level</option>
                <option value="1">Beginner (0-1 years)</option>
                <option value="2">Intermediate (1-3 years)</option>
                <option value="3">Experienced (3-5 years)</option>
                <option value="4">Expert (5-8 years)</option>
                <option value="5">Master (8+ years)</option>
              </select>
            </div>

            {/* Service Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1.5">
                Service Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={serviceData.tags ? serviceData.tags.join(', ') : ''}
                onChange={handleTagsChange}
                placeholder="e.g., React, JavaScript, Frontend (comma separated)"
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-[#695aa6] transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
            </div>
            
            <div className="mt-4 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition-colors text-sm sm:text-base font-medium"
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

// Enhanced Delete confirmation modal
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, serviceName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-30 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md">
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
  const { user } = useAuth();
  const providerId = user?.id;

  const [services, setServices] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // Complete service data state with all schema fields
  const [serviceData, setServiceData] = useState({
    title: "",
    category: "",
    description: "",
    tags: [],
    experience_level: "",
    contact: "",
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Experience level mapping
  const getExperienceLabel = (level) => {
    const levels = {
      1: "Beginner (0-1 years)",
      2: "Intermediate (1-3 years)", 
      3: "Experienced (3-5 years)",
      4: "Expert (5-8 years)",
      5: "Master (8+ years)"
    };
    return levels[level] || `${level} years`;
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch categories
        const categoriesRes = await axios.get(`${API_BASE_URL}/categories`);
        if (categoriesRes.data.success) {
          setAllCategories(categoriesRes.data.data);
          console.log("all categories:", categoriesRes.data.data);
        } else {
          toast.error("Could not load service categories.");
          console.error("Error in categories response:", categoriesRes.data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch service categories from server.");
        console.error("Error fetching categories:", error);
      }

      try {
        // Fetch existing services
        const servicesRes = await axios.get(`${API_BASE_URL}/services/by_provider_id/${providerId}`);
        if (servicesRes.data.success) {
          setServices(servicesRes.data.data);
        } else {
          toast.error("Could not load your existing services.");
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

    if (providerId) {
      fetchInitialData();
    }
  }, [providerId, API_BASE_URL]);

  const handleEditService = (service) => {
    setIsEditing(true);
    setEditingServiceId(service._id);
    setServiceData({
      title: service.title || "",
      category: service.category || "",
      description: service.description || "",
      tags: service.tags || [],
      experience_level: service.experience_level?.toString() || "",
      contact: service.contact || "",
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
      title: "",
      category: "",
      description: "",
      tags: [],
      experience_level: "",
      contact: "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingServiceId(null);
    setServiceData({
      title: "",
      category: "",
      description: "",
      tags: [],
      experience_level: "",
      contact: "",
    });
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setServiceToDelete(null);
  };

  const handleSaveService = async (data) => {
    try {
      // Prepare payload with all schema fields
      const payload = {
        title: data.title,
        category: data.category,
        description: data.description,
        tags: data.tags || [],
        experience_level: parseInt(data.experience_level) || 1,
        contact: data.contact || "",
      };

      if (isEditing) {
        const response = await axios.put(`${API_BASE_URL}/services/update/${editingServiceId}`, payload);

        if (response.data.success) {
          setServices(prev => 
            prev.map(service => 
              service._id === editingServiceId 
                ? { ...service, ...payload }
                : service
            )
          );
          toast.success("Service updated successfully!");
          handleCloseModal();
        } else {
          toast.error(response.data.message || "Could not update service.");
        }
      } else {
        // Add provider_id for new services
        payload.provider_id = providerId;

        const response = await axios.post(`${API_BASE_URL}/services/create`, payload);

        if (response.data.success) {
          setServices(prev => [...prev, response.data.data]);
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
    (cat) => !services.some((s) => s.category === (cat.key || cat._id))
  );
  console.log("available categories:", availableCategories);
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
            disabled={availableCategories.length === 0 && !isEditing}
            className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-[#695aa6] text-white rounded-lg hover:bg-[#5a4d8a] transition-colors text-sm sm:text-base font-medium w-full sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
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
          ) : services.length === 0 ? (
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
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                        {service.title || "Unnamed Service"}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                      {service.description || "No description provided"}
                    </p>

                    {/* Service Details */}
                    <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                      {service.experience_level && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{getExperienceLabel(service.experience_level)}</span>
                        </span>
                      )}
                      {service.contact && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{service.contact}</span>
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {service.tags && service.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {service.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                        {service.tags.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                            +{service.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Category Tag */}
                    {service.category && (
                      <span className="inline-block px-2 py-1 bg-[#695aa6]/10 text-[#695aa6] text-xs rounded-md font-medium">
                        {allCategories.find(c => (c.key || c._id) === service.category)?.title || service.category}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex sm:flex-col gap-2 justify-end sm:items-end flex-shrink-0">
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
