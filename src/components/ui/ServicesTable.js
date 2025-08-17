'use client';

export default function ServicesTable({ services = [] }) {
  if (!services.length)
    return (
      <div className="text-gray-400 text-center py-4 text-sm sm:text-base">
        No services found.
      </div>
    );

  return (
    <div className="w-full overflow-x-auto px-2 sm:px-4">
      <table className="min-w-full bg-white text-xs sm:text-sm md:text-base table-auto rounded-xl shadow border border-[#695aa6]/20">
        <thead className="bg-[#f9f7ff] sticky top-0 z-10 border-b border-[#695aa6]/30">
          <tr>
            <th className="py-3 px-4 text-[#695aa6] font-semibold text-left">Title</th>
            <th className="py-3 px-4 text-[#695aa6] font-semibold text-left">Provider</th>
            <th className="py-3 px-4 text-[#695aa6] font-semibold text-left">Category</th>
            <th className="py-3 px-4 text-[#695aa6] font-semibold text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr
              key={s._id}
              className="even:bg-gray-50 hover:bg-[#f3f0fa] border-b border-gray-200"
            >
              <td className="py-2 px-4">{s.title}</td>
              <td className="py-2 px-4">
                {s.provider || s.provider_name || s.provider_id?.name || 'N/A'}
              </td>
              <td className="py-2 px-4">{s.category}</td>
              <td className="py-2 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    s.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : s.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
