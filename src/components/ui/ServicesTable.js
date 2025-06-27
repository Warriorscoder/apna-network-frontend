'use client';

export default function ServicesTable({ services = [] }) {
  if (!services.length) return <div className="text-gray-400 text-center py-4">No services found.</div>;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left bg-white rounded-xl shadow border border-[#695aa6]/10">
        <thead>
          <tr>
            <th className="py-2 px-3 font-semibold text-[#695aa6]">Title</th>
            <th className="py-2 px-3 font-semibold text-[#695aa6]">Provider</th>
            <th className="py-2 px-3 font-semibold text-[#695aa6]">Category</th>
            <th className="py-2 px-3 font-semibold text-[#695aa6]">Status</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.id} className="border-t hover:bg-[#f3f0fa]">
              <td className="py-2 px-3">{s.title}</td>
              <td className="py-2 px-3">{s.provider}</td>
              <td className="py-2 px-3">{s.category}</td>
              <td className="py-2 px-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  s.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
