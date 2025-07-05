'use client';

import { useEffect, useState } from 'react';

export default function ComplaintsTable() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/complaints');
        if (!res.ok) throw new Error('Failed to fetch complaints');
        const data = await res.json();
        setComplaints(data);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) return <div className="text-center text-gray-400 py-4">Loading complaints...</div>;
  if (error) return <div className="text-center text-red-500 py-4">Error: {error}</div>;
  if (!complaints.length) return <div className="text-center text-gray-400 py-4">No complaints found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-300 rounded-xl overflow-hidden text-sm">
        <thead className="bg-[#f9f7ff] sticky top-0 z-10 border-b border-gray-300">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-[#695aa6]">Title</th>
            <th className="px-4 py-3 text-left font-semibold text-[#695aa6]">User</th>
            <th className="px-4 py-3 text-left font-semibold text-[#695aa6]">Provider</th>
            <th className="px-4 py-3 text-left font-semibold text-[#695aa6]">Status</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c._id} className="even:bg-gray-50 hover:bg-[#f3f0fa] border-b border-gray-200">
              <td className="px-4 py-2">{c.title}</td>
              <td className="px-4 py-2">{c.userName || c.user_id?.name || "N/A"}</td>
              <td className="px-4 py-2">{c.providerName || c.provider_id?.name || "N/A"}</td>
              <td className="px-4 py-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  c.status?.toLowerCase() === "resolved"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {c.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
