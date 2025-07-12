'use client';

export default function ServicesTable({ services = [] }) {
  if (!services.length)
    return <div className="text-gray-400 text-center py-4">No services found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left bg-white rounded-xl shadow border border-[#695aa6]/20">
        <thead className="bg-[#f9f7ff] sticky top-0 z-10 border-b border-[#695aa6]/30">
          <tr>
            <th className="py-3 px-4 text-[#695aa6] font-semibold">Title</th>
            <th className="py-3 px-4 text-[#695aa6] font-semibold">Provider</th>
            <th className="py-3 px-4 text-[#695aa6] font-semibold">Category</th>
            <th className="py-3 px-4 text-[#695aa6] font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s._id} className="even:bg-gray-50 border-t border-gray-200 hover:bg-[#f3f0fa]">
              <td className="py-2 px-4">{s.title}</td>
              <td className="py-2 px-4">
                {s.provider || s.provider_name || s.provider_id?.name || "N/A"}
              </td>
              <td className="py-2 px-4">{s.category}</td>
              <td className="py-2 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    s.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : s.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
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