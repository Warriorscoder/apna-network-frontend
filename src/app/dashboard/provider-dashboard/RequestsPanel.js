'use client';

import { useEffect, useState } from "react";
import {
  LoaderCircle,
  AlertTriangle,
  ListTodo,
  UserCircle,
  Phone,
} from "lucide-react";
import { useAuthenticatedAPI } from "@/app/hooks/useAuthenticatedAPI";
import axios from "axios";
import { toast } from "react-toastify"; // React Toastify

import 'react-toastify/dist/ReactToastify.css'; // (if not imported globally)

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

  if (loading)
    return (
      <div className="flex justify-center items-center py-12">
        <LoaderCircle className="animate-spin w-8 h-8 text-[#695aa6]" />
      </div>
    );

  if (error)
    return (
      <div className="bg-red-100 text-red-800 px-4 py-3 rounded flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" />
        {error}
      </div>
    );

  return (
    <div className="bg-white/70 rounded-xl shadow-lg p-6 border border-white/30 backdrop-blur-sm hover:shadow-xl transition-all overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4 text-[#695aa6] flex items-center">
        <ListTodo className="w-6 h-6 mr-2" />
        Service Requests
        <span className="ml-auto bg-[#695aa6] text-white text-sm px-2 py-1 rounded-full">
          {requests.length}
        </span>
      </h2>

      {requests.length === 0 ? (
        <div className="text-center py-8">
          <ListTodo className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">No service requests yet</p>
          <p className="text-sm text-gray-400">
            Requests will appear here when customers book your services
          </p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full bg-white/90 rounded-lg shadow-sm text-sm text-gray-700">
            <thead className="bg-[#695aa6] text-white">
              <tr>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Contact</th>
                <th className="px-4 py-2 text-left">Service Category</th>
                <th className="px-4 py-2 text-left">Date of Request</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr
                  key={req._id || index}
                  className="border-b border-gray-200 hover:bg-gray-100 transition"
                >
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2">
                      <UserCircle className="w-4 h-4 text-gray-500" />
                      {req.user_id?.name || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      {req.user_id?.phone || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {req.service_id?.category ||
                      req.service_id?.name ||
                      "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(req.createdAt || req.request_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
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
      )}
    </div>
  );
};

export default RequestsPanel;
