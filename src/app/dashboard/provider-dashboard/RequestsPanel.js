'use client';

import { useEffect, useState } from "react";
import {
  LoaderCircle,
  AlertTriangle,
  ListTodo,
  UserCircle,
  Phone,
  Briefcase,
  Calendar,
} from "lucide-react";
import { useAuthenticatedAPI } from "@/app/hooks/useAuthenticatedAPI";
import axios from "axios";
import { toast } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';

// Card component for mobile view
const RequestCard = ({ req, onStatusChange }) => {
  const getStatusColorClasses = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700 border-green-200";
      case "in_progress": return "bg-blue-100 text-blue-700 border-blue-200";
      case "accepted": return "bg-purple-100 text-purple-700 border-purple-200";
      case "requested": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <UserCircle className="w-5 h-5 text-[#695aa6]" />
          <h3 className="font-semibold text-gray-800">{req.user_id?.name || "N/A"}</h3>
        </div>
        <select
          value={req.status}
          onChange={(e) => onStatusChange(req._id, e.target.value)}
          className={`px-2.5 py-1 text-xs rounded-full font-semibold border ${getStatusColorClasses(req.status)}`}
        >
          <option value="requested">Requested</option>
          <option value="accepted">Accepted</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-500" />
          <span>Contact: <span className="font-medium text-gray-800">{req.user_id?.phone || "N/A"}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-gray-500" />
          <span>Service: <span className="font-medium text-gray-800">{req.service_id?.category || req.service_id?.name || "N/A"}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>Date: {new Date(req.createdAt || req.request_date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

const RequestsPanel = () => {
  const { makeRequest, providerId } = useAuthenticatedAPI();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/service-requests/provider/6867b31c38d37b494e1e86c0`
        );

        if (!response.data.success) {
          throw new Error("Error in fetching requests");
        }

        setRequests(response.data.data);
      } catch (err) {
        console.error("Failed to fetch requests:", err);
        if (err.response?.status === 404) {
          setRequests([]);
        } else {
          setError(
            err.response?.data?.message || "Failed to fetch requests"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [makeRequest, providerId]);

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/service-requests/${requestId}/status`,
        { status: newStatus }
      );

      if (response.data.success) {
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === requestId ? { ...req, status: newStatus } : req
          )
        );
        toast.success(`Status updated to "${newStatus.replace("_", " ")}"`);
      } else {
        console.error("Failed to update status:", response.data.message);
        toast.error("Failed to update status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("An error occurred while updating status.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" 
              style={{ textShadow: "0 4px 24px rgba(60,50,100,0.65), 0 2px 4px rgba(0,0,0,0.3)" }}>
            Customer Requests
          </h1>
          <p className="text-white/90 text-lg" 
             style={{ textShadow: "0 2px 12px rgba(60,50,100,0.45), 0 1px 2px rgba(0,0,0,0.3)" }}>
            View and manage customer service requests
          </p>
        </div>

        <div className="bg-white/70 rounded-xl shadow-lg p-4 sm:p-6 border border-white/30 backdrop-blur-sm">
          <div className="flex justify-center items-center py-12">
            <LoaderCircle className="animate-spin w-8 h-8 text-[#695aa6]" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" 
              style={{ textShadow: "0 4px 24px rgba(60,50,100,0.65), 0 2px 4px rgba(0,0,0,0.3)" }}>
            Customer Requests
          </h1>
          <p className="text-white/90 text-lg" 
             style={{ textShadow: "0 2px 12px rgba(60,50,100,0.45), 0 1px 2px rgba(0,0,0,0.3)" }}>
            View and manage customer service requests
          </p>
        </div>

        <div className="bg-white/70 rounded-xl shadow-lg p-4 sm:p-6 border border-white/30 backdrop-blur-sm">
          <div className="bg-red-100 text-red-800 px-4 py-3 rounded flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" 
            style={{ textShadow: "0 4px 24px rgba(60,50,100,0.65), 0 2px 4px rgba(0,0,0,0.3)" }}>
          Customer Requests
        </h1>
        <p className="text-white/90 text-lg" 
           style={{ textShadow: "0 2px 12px rgba(60,50,100,0.45), 0 1px 2px rgba(0,0,0,0.3)" }}>
          View and manage customer service requests
        </p>
      </div>

      <div className="w-full bg-white/70 rounded-xl shadow-lg p-4 sm:p-6 border border-white/30 backdrop-blur-sm hover:shadow-xl transition-all">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-[#695aa6] flex items-center">
          <ListTodo className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          Customer Requests
          <span className="ml-auto bg-[#695aa6] text-white text-xs sm:text-sm px-2 py-1 rounded-full">
            {requests.length}
          </span>
        </h2>

        {requests.length === 0 ? (
          <div className="text-center py-8">
            <ListTodo className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No customer requests yet</p>
            <p className="text-sm text-gray-400">
              When customers request your services, they&aposll appear here!
            </p>
          </div>
        ) : (
          <div>
            {/* Mobile Card View */}
            <div className="space-y-3 lg:hidden">
              {requests.map((req, index) => (
                <RequestCard 
                  key={req._id || index} 
                  req={req} 
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full bg-white/90 rounded-lg shadow-sm text-sm text-gray-700">
                <thead className="bg-[#695aa6] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Customer</th>
                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Contact</th>
                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Service Category</th>
                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Date</th>
                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {requests.map((req, index) => (
                    <tr
                      key={req._id || index}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-2">
                          <UserCircle className="w-5 h-5 text-gray-500" />
                          {req.user_id?.name || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-2">
                          <Phone className="w-5 h-5 text-gray-500" />
                          {req.user_id?.phone || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-gray-500" />
                          {req.service_id?.category || req.service_id?.name || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-gray-500" />
                          {new Date(req.createdAt || req.request_date).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <select
                          value={req.status}
                          onChange={(e) => handleStatusChange(req._id, e.target.value)}
                          className={`px-2 py-1 text-xs rounded font-semibold ${
                            req.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : req.status === "in_progress"
                              ? "bg-blue-100 text-blue-700"
                              : req.status === "accepted"
                              ? "bg-purple-100 text-purple-700"
                              : req.status === "requested"
                              ? "bg-yellow-100 text-yellow-700"
                              : req.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          <option value="requested">Requested</option>
                          <option value="accepted">Accepted</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsPanel;
