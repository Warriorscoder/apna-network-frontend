'use client';

import { useEffect, useState } from 'react';

export default function ServicesApprovalTable() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPendingServices = async () => {
    try {
      setLoading(true);

      const res = await fetch('http://localhost:8000/api/services?status=pending');

      const data = await res.json();
      if (data.success) {
        setServices(data.data);
      } else {
        setError(data.message || 'Failed to fetch services');
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingServices();
  }, []);

  const handleApprove = async (id) => {
    try {

      const res = await fetch(`http://localhost:8000/api/services/approve/${id}`, {

        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setServices((prev) => prev.filter((s) => s._id !== id));
      } else {
        alert(data.message || 'Failed to approve service');
      }
    } catch (err) {
      alert('Error approving service');
    }
  };

  const handleReject = async (id) => {
    try {

      const res = await fetch(`http://localhost:8000/api/services/reject/${id}`, {

        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setServices((prev) => prev.filter((s) => s._id !== id));
      } else {
        alert(data.message || 'Failed to reject service');
      }
    } catch (err) {
      alert('Error rejecting service');
    }
  };

  if (loading) return <div className="text-gray-500 text-center py-4">Loading services...</div>;
  if (error) return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  if (!services.length) return <div className="text-gray-400 text-center py-4">No pending services for approval.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left bg-white rounded-xl border border-gray-200 shadow">
        <thead className="bg-[#f9f7ff] sticky top-0 z-10 border-b border-gray-300">
          <tr>
            <th className="py-3 px-4 text-[#695aa6] font-semibold">Provider</th>
            <th className="py-3 px-4 text-[#695aa6] font-semibold">Title</th>
            <th className="py-3 px-4 text-[#695aa6] font-semibold">Category</th>
            <th className="py-3 px-4 text-[#695aa6] font-semibold">Description</th>
            <th className="py-3 px-4 text-[#695aa6] font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service._id} className="even:bg-gray-50 hover:bg-[#f3f0fa] border-b border-gray-200">
              <td className="py-2 px-4">{service.provider_name || service.provider_id?.name || 'N/A'}</td>
              <td className="py-2 px-4">{service.title}</td>
              <td className="py-2 px-4">{service.category}</td>
              <td className="py-2 px-4 max-w-xs truncate" title={service.description}>
                {service.description}
              </td>
              <td className="py-2 px-4 space-x-2">
                <button
                  onClick={() => handleApprove(service._id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(service._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}