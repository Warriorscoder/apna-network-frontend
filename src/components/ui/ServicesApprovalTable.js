'use client';

import { useEffect, useState } from 'react';

export default function ServicesApprovalTable() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPendingServices = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/services?status=pending`);
      const data = await res.json();
      if (data.success) {
        setServices(data.data);
      } else {
        setError(data.message || 'Failed to fetch services');
      }
    } catch {
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/services/approve/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setServices((prev) => prev.filter((s) => s._id !== id));
      } else {
        alert(data.message || 'Failed to approve service');
      }
    } catch {
      alert('Error approving service');
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/services/reject/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setServices((prev) => prev.filter((s) => s._id !== id));
      } else {
        alert(data.message || 'Failed to reject service');
      }
    } catch {
      alert('Error rejecting service');
    }
  };

  if (loading) return <div className="text-gray-500 text-center py-4 text-sm">Loading services...</div>;
  if (error) return <div className="text-red-500 text-center py-4 text-sm">Error: {error}</div>;
  if (!services.length) return <div className="text-gray-400 text-center py-4 text-sm">No pending services for approval.</div>;

  return (
    <div className="w-full">
      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {services.map(service => (
          <div key={service._id} className="bg-white border rounded-lg p-4 text-xs shadow-sm">
            <h3 className="font-semibold text-[#695aa6]">{service.title}</h3>
            <p className="mt-1 text-gray-600"><span className="font-medium">Provider:</span> {service.provider_name || service.provider_id?.name || 'N/A'}</p>
            <p className="text-gray-600"><span className="font-medium">Category:</span> {service.category}</p>
            <p className="text-gray-600 line-clamp-2 text-[11px]">{service.description}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => handleApprove(service._id)} className="flex-1 bg-green-500 text-white rounded py-1 hover:bg-green-600">
                Approve
              </button>
              <button onClick={() => handleReject(service._id)} className="flex-1 bg-red-500 text-white rounded py-1 hover:bg-red-600">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="w-full overflow-x-auto px-2 sm:px-4 hidden sm:block">
        <table className="min-w-full table-auto bg-white rounded-xl border border-gray-200 shadow text-xs sm:text-sm md:text-base">
          <thead className="bg-[#f9f7ff] sticky top-0 z-10 border-b border-gray-300">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-[#695aa6]">Provider</th>
              <th className="py-3 px-4 text-left font-semibold text-[#695aa6]">Title</th>
              <th className="py-3 px-4 text-left font-semibold text-[#695aa6]">Category</th>
              <th className="py-3 px-4 text-left font-semibold text-[#695aa6]">Description</th>
              <th className="py-3 px-4 text-left font-semibold text-[#695aa6]">Actions</th>
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
                <td className="py-2 px-4">
                  <div className="flex flex-col sm:flex-row gap-2">
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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
