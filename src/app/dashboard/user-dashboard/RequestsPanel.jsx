// import React, { useState, useEffect } from "react";
// import { CheckCircle, XCircle, Clock } from "lucide-react";
// import { useDummyAPI } from "@/app/hooks/useDummyAPI";
// // import { useDummyAPI } from "./useDummyAPI";
// import { ListTodo, UserCircle, Briefcase, Calendar } from "lucide-react"
// import axios from "axios";

// export default function RequestsPanel() {
//     const [requests, setRequests] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const { makeRequest, userId } = useDummyAPI();
//     const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/service-requests/user/68729032f38380c95c04f615`
//         );

//         if (!response.data.success) {
//           throw new Error("Error in fetching requests");
//         }

//         setRequests(response.data.data);
//       } catch (err) {
//         console.error("Failed to fetch requests:", err);
//         if (err.response?.status === 404) {
//           setRequests([]);
//         } else {
//           setError(
//             err.response?.data?.message || "Failed to fetch requests"
//           );
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequests();
//   }, [makeRequest, userId]);

//     // const getStatusIcon = (status) => {
//     //     switch (status) {
//     //         case "completed":
//     //             return <CheckCircle className="w-5 h-5 text-green-500" />;
//     //         case "cancelled":
//     //             return <XCircle className="w-5 h-5 text-red-500" />;
//     //         case "in-progress":
//     //             return <Clock className="w-5 h-5 text-blue-500" />;
//     //         default:
//     //             return <Clock className="w-5 h-5 text-yellow-500" />;
//     //     }
//     // };

//     // const getStatusColor = (status) => {
//     //     switch (status) {
//     //         case "completed":
//     //             return "bg-green-100 text-green-800";
//     //         case "cancelled":
//     //             return "bg-red-100 text-red-800";
//     //         case "in-progress":
//     //             return "bg-blue-100 text-blue-800";
//     //         default:
//     //             return "bg-yellow-100 text-yellow-800";
//     //     }
//     // };

//     if (loading) {
//         return (
//             <div className="bg-white/70 rounded-xl shadow-lg p-6 border border-white/30 backdrop-blur-sm">
//                 <h2 className="text-2xl font-semibold mb-4 text-[#695aa6] flex items-center">
//                     <ListTodo className="w-6 h-6 mr-2" />
//                     My Requests
//                 </h2>
//                 <div className="text-center py-8">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#695aa6] mx-auto"></div>
//                     <p className="mt-2 text-gray-500">Loading requests...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className=" w-full bg-white/70 rounded-xl shadow-lg p-6 border border-white/30 backdrop-blur-sm hover:shadow-xl transition-all overflow-x-auto">
//             <h2 className="text-2xl font-semibold mb-4 text-[#695aa6] flex items-center">
//                 <ListTodo className="w-6 h-6 mr-2" />
//                 My Service Requests
//                 <span className="ml-auto bg-[#695aa6] text-white text-sm px-2 py-1 rounded-full">
//                     {requests.length}
//                 </span>
//             </h2>

//             {requests.length === 0 ? (
//                 <div className="text-center py-8">
//                     <ListTodo className="w-12 h-12 text-gray-400 mx-auto mb-3" />
//                     <p className="text-gray-500 mb-2">No service requests yet</p>
//                     <p className="text-sm text-gray-400">
//                         Browse services and make your first request to get started!
//                     </p>
//                 </div>
//             ) : (
//                 <div className="w-full overflow-x-auto">
//                     <table className="min-w-full bg-white/90 rounded-lg shadow-sm text-sm text-gray-700">
//                         <thead className="bg-[#695aa6] text-white">
//                             <tr>
//                                 <th className="px-4 py-2 text-left whitespace-nowrap">Provider</th>
//                                 <th className="px-4 py-2 text-left whitespace-nowrap">Service Category</th>
//                                 <th className="px-4 py-2 text-left whitespace-nowrap">Date</th>
//                                 <th className="px-4 py-2 text-left whitespace-nowrap">Status</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {requests.map((req, index) => (
//                                 <tr
//                                     key={req._id || index}
//                                     className="border-b border-gray-200 hover:bg-gray-100 transition"
//                                 >
//                                     <td className="px-4 py-3 whitespace-nowrap">
//                                         <span className="inline-flex items-center gap-2">
//                                             <UserCircle className="w-4 h-4 text-gray-500" />
//                                             {req.provider_name || req.providerName || "Unknown"}
//                                         </span>
//                                     </td>
//                                     <td className="px-4 py-3 whitespace-nowrap">
//                                         <span className="inline-flex items-center gap-2">
//                                             <Briefcase className="w-4 h-4 text-gray-500" />
//                                             {req.serviceType || req.service_name || "N/A"}
//                                         </span>
//                                     </td>
//                                     <td className="px-4 py-3 whitespace-nowrap">
//                                         <span className="inline-flex items-center gap-2">
//                                             <Calendar className="w-4 h-4 text-gray-500" />
//                                             {req.createdAt || req.created_at
//                                                 ? new Date(req.createdAt || req.created_at).toLocaleDateString()
//                                                 : "Recent"}
//                                         </span>
//                                     </td>
//                                     <td className="px-4 py-3 whitespace-nowrap">
//                                         <span
//                                             className={`px-2 py-1 text-xs rounded-full font-semibold ${req.status === "completed"
//                                                     ? "bg-green-100 text-green-700"
//                                                     : req.status === "in_progress"
//                                                         ? "bg-blue-100 text-blue-700"
//                                                         : req.status === "accepted"
//                                                             ? "bg-purple-100 text-purple-700"
//                                                             : req.status === "requested"
//                                                                 ? "bg-yellow-100 text-yellow-700"
//                                                                 : req.status === "cancelled"
//                                                                     ? "bg-red-100 text-red-700"
//                                                                     : "bg-gray-100 text-gray-700"
//                                                 }`}
//                                         >
//                                             {req.status || "Pending"}
//                                         </span>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>

//     );
// };


import React, { useState, useEffect } from "react";
import {
  ListTodo,
  UserCircle,
  Briefcase,
  Calendar,
} from "lucide-react";
import axios from "axios";
import { useDummyAPI } from "@/app/hooks/useDummyAPI";

export default function RequestsPanel() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { makeRequest, userId } = useDummyAPI();
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/service-requests/user/68729032f38380c95c04f615`
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
          setError(err.response?.data?.message || "Failed to fetch requests");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [makeRequest, userId]);

  if (loading) {
    return (
      <div className="bg-white/70 rounded-xl shadow-lg p-6 border border-white/30 backdrop-blur-sm">
        <h2 className="text-2xl font-semibold mb-4 text-[#695aa6] flex items-center">
          <ListTodo className="w-6 h-6 mr-2" />
          My Requests
        </h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#695aa6] mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white/70 rounded-xl shadow-lg p-6 border border-white/30 backdrop-blur-sm hover:shadow-xl transition-all overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4 text-[#695aa6] flex items-center">
        <ListTodo className="w-6 h-6 mr-2" />
        My Service Requests
        <span className="ml-auto bg-[#695aa6] text-white text-sm px-2 py-1 rounded-full">
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
        <div className="w-full overflow-x-auto">
          <table className="min-w-full bg-white/90 rounded-lg shadow-sm text-sm text-gray-700">
            <thead className="bg-[#695aa6] text-white">
              <tr>
                <th className="px-4 py-2 text-left whitespace-nowrap">Provider</th>
                <th className="px-4 py-2 text-left whitespace-nowrap">Service Category</th>
                <th className="px-4 py-2 text-left whitespace-nowrap">Date</th>
                <th className="px-4 py-2 text-left whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr
                  key={req._id || index}
                  className="border-b border-gray-200 hover:bg-gray-100 transition"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-2">
                      <UserCircle className="w-4 h-4 text-gray-500" />
                      {req.provider_id?.name || "Unknown"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      {req.service_id?.category || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
