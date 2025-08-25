"use client";

import React, { useState, useEffect } from "react";
import {
  ListTodo,
  UserCircle,
  Briefcase,
  Calendar,
  ChevronRight,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";
import axios from "axios";
import { useDummyAPI } from "@/app/hooks/useDummyAPI";
import { useAuth } from "@/app/context/Authcontext";
import UserFeedbackModal from "@/components/ui/UserFeedbackModal";

// ✅ Warning Modal Component
const DeleteWarningModal = ({ isOpen, onClose, onConfirm, requestData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Service Request
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this service request? This action
              cannot be undone.
            </p>

            {/* Request Details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Briefcase className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Service:</span>
                <span>{requestData?.service_id?.category || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <UserCircle className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Provider:</span>
                <span>{requestData?.provider_id?.name || "Unknown"}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Date:</span>
                <span>
                  {new Date(requestData?.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> If the service is already in progress or
                completed, consider contacting the provider directly instead of
                deleting the request.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
            >
              Delete Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Enhanced Card component for mobile view with delete button
const RequestCard = ({ req, onFeedback, onDelete }) => {
  const getStatusColorClasses = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "accepted":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "requested":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // ✅ Check if delete is allowed
  const canDelete = req.status === "requested" || req.status === "cancelled";

  return (
    <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-[#695aa6]" />
          <h3 className="font-semibold text-gray-800">
            {req.service_id?.category || "N/A"}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-2.5 py-1 text-xs rounded-full font-semibold border ${getStatusColorClasses(
              req.status
            )}`}
          >
            {req.status || "Pending"}
          </span>
          {/* ✅ Delete button for mobile */}
          {canDelete && (
            <button
              onClick={() => onDelete(req)}
              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
              title="Delete request"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="pl-7 space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <UserCircle className="w-4 h-4 text-gray-500" />
          <span>
            Provider:{" "}
            <span className="font-medium text-gray-800">
              {req.provider_id?.name || "Unknown"}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>Date: {new Date(req.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* ✅ Action buttons */}
      <div className="flex space-x-2">
        {req.status === "completed" && (
          <button
            onClick={() => onFeedback(req)}
            className="flex-1 text-sm text-white bg-[#695aa6] hover:bg-[#5a4d8a] px-3 py-1 rounded-md transition-colors"
          >
            Give Feedback
          </button>
        )}
        {canDelete && (
          <button
            onClick={() => onDelete(req)}
            className="px-3 py-1 text-sm text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default function RequestsPanel() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const { makeRequest, userId } = useDummyAPI();
  const [error, setError] = useState("");
  const { user } = useAuth();

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedRequestForFeedback, setSelectedRequestForFeedback] =
    useState(null);

  // ✅ Delete modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRequestForDelete, setSelectedRequestForDelete] =
    useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/service-requests/user/${user.id}`
        );
        if (!response.data.success)
          throw new Error("Error in fetching requests");
        setRequests(response.data.data);
      } catch (err) {
        console.error("Failed to fetch requests:", err);
        if (err.response?.status === 404) setRequests([]);
        else
          setError(err.response?.data?.message || "Failed to fetch requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [makeRequest, userId]);

  // ✅ Delete request function
  const handleDeleteRequest = async (requestId) => {
    try {
      setDeleting(true);
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/service-requests/${requestId}`
      );

      if (response.data.success) {
        // Remove the deleted request from the list
        setRequests((prev) => prev.filter((req) => req._id !== requestId));
        setDeleteModalOpen(false);
        setSelectedRequestForDelete(null);

        // Show success message (you can add a toast notification here)
        console.log("Request deleted successfully");
      } else {
        throw new Error("Failed to delete request");
      }
    } catch (err) {
      console.error("Failed to delete request:", err);
      setError(err.response?.data?.message || "Failed to delete request");
    } finally {
      setDeleting(false);
    }
  };

  // ✅ Open delete modal
  const openDeleteModal = (request) => {
    setSelectedRequestForDelete(request);
    setDeleteModalOpen(true);
  };

  // ✅ Close delete modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedRequestForDelete(null);
  };

  // ✅ Confirm delete
  const confirmDelete = () => {
    if (selectedRequestForDelete) {
      handleDeleteRequest(selectedRequestForDelete._id);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1
            className="text-3xl sm:text-4xl font-bold text-white mb-2"
            style={{
              textShadow:
                "0 4px 24px rgba(60,50,100,0.65), 0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            My Service Requests
          </h1>
          <p
            className="text-white/90 text-lg"
            style={{
              textShadow:
                "0 2px 12px rgba(60,50,100,0.45), 0 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            Track and manage all your service requests
          </p>
        </div>
        <div className="bg-white/70 rounded-xl shadow-lg p-4 sm:p-6 border border-white/30 backdrop-blur-sm">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-[#695aa6] flex items-center">
            <ListTodo className="w-5 h-5 sm:w-6 sm:h-6 mr-2" /> My Requests
          </h2>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#695aa6] mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1
          className="text-3xl sm:text-4xl font-bold text-white mb-2"
          style={{
            textShadow:
              "0 4px 24px rgba(60,50,100,0.65), 0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          My Service Requests
        </h1>
        <p
          className="text-white/90 text-lg"
          style={{
            textShadow:
              "0 2px 12px rgba(60,50,100,0.45), 0 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          Track and manage all your service requests
        </p>
      </div>

      {/* ✅ Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="w-full bg-white/70 rounded-xl shadow-lg p-4 sm:p-6 border border-white/30 backdrop-blur-sm hover:shadow-xl transition-all">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-[#695aa6] flex items-center">
          <ListTodo className="w-5 h-5 sm:w-6 sm:h-6 mr-2" /> My Service
          Requests
          <span className="ml-auto bg-[#695aa6] text-white text-xs sm:text-sm px-2 py-1 rounded-full">
            {requests.length}
          </span>
        </h2>

        {requests.length === 0 ? (
          <div className="text-center py-8">
            <ListTodo className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No service requests yet</p>
            <p className="text-sm text-gray-400">
              Browse services and make your first request to get started!
            </p>
          </div>
        ) : (
          <div>
            {/* ✅ Mobile Card View with delete functionality */}
            <div className="space-y-3 lg:hidden">
              {requests.map((req, index) => (
                <RequestCard
                  key={req._id || index}
                  req={req}
                  onFeedback={(req) => {
                    setSelectedRequestForFeedback(req);
                    setFeedbackModalOpen(true);
                  }}
                  onDelete={openDeleteModal}
                />
              ))}
            </div>

            {/* ✅ Desktop Table View with delete functionality */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full bg-white/90 rounded-lg shadow-sm text-sm text-gray-700">
                <thead className="bg-[#695aa6] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                      Provider
                    </th>
                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                      Service Category
                    </th>
                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {requests.map((req, index) => {
                    const canDelete =
                      req.status === "requested" || req.status === "cancelled";

                    return (
                      <tr
                        key={req._id || index}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2">
                            <UserCircle className="w-5 h-5 text-gray-500" />
                            {req.provider_id?.name || "Unknown"}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-gray-500" />
                            {req.service_id?.category || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-semibold ${
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
                            {req.status || "Pending"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            {/* ✅ Feedback button */}
                            {req.status === "completed" && (
                              <button
                                onClick={() => {
                                  setSelectedRequestForFeedback(req);
                                  setFeedbackModalOpen(true);
                                }}
                                className="px-3 py-1.5 bg-[#695aa6] text-white rounded text-xs hover:bg-[#5a4d8a] transition"
                              >
                                Give Feedback
                              </button>
                            )}

                            {/* ✅ Delete button */}
                            {canDelete && (
                              <button
                                onClick={() => openDeleteModal(req)}
                                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                title="Delete request"
                                disabled={deleting}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ✅ User Feedback Modal */}
      <UserFeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => {
          setFeedbackModalOpen(false);
          setSelectedRequestForFeedback(null);
        }}
        onSubmitted={() => {
          setFeedbackModalOpen(false);
          setSelectedRequestForFeedback(null);
        }}
      />

      {/* ✅ Delete Warning Modal */}
      <DeleteWarningModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        requestData={selectedRequestForDelete}
      />

      {/* ✅ Loading overlay when deleting */}
      {deleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
            <span className="text-gray-700">Deleting request...</span>
          </div>
        </div>
      )}
    </div>
  );
}
