'use client';

export default function ServicesApprovalTable({ services = [], onApprove, onReject }) {
  const handleApprove = async (id) => {
    if (onApprove) onApprove(services.find(s => s.id === id || s._id === id));
    // If you use an API, you can still call it here if needed
  };
  const handleReject = async (id) => {
    if (onReject) onReject(id);
    // If you use an API, you can still call it here if needed
  };

  if (!services.length) return (
    <div className="text-gray-500">No pending services for approval.</div>
  );
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="py-2">Provider</th>
            <th className="py-2">Title</th>
            <th className="py-2">Category</th>
            <th className="py-2">Description</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => (
            <tr key={service.id || service._id} className="border-t">
              <td className="py-2">{service.provider_name || service.provider || service.provider_id?.name || 'N/A'}</td>
              <td className="py-2">{service.title}</td>
              <td className="py-2">{service.category}</td>
              <td className="py-2 max-w-xs truncate">{service.description}</td>
              <td className="py-2">
                <button
                  onClick={() => handleApprove(service.id || service._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(service.id || service._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
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
