'use client';

export default function ComplaintsTable({ complaints = [] }) {
  if (!complaints.length) return <div className="text-gray-400 text-center py-4">No complaints found.</div>;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left bg-white rounded-xl shadow border border-[#695aa6]/10">
        <thead>
          <tr>
            <th className="py-2 px-3 font-semibold text-[#695aa6]">Title</th>
            <th className="py-2 px-3 font-semibold text-[#695aa6]">User</th>
            <th className="py-2 px-3 font-semibold text-[#695aa6]">Provider</th>
            <th className="py-2 px-3 font-semibold text-[#695aa6]">Status</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c.id} className="border-t hover:bg-[#f3f0fa]">
              <td className="py-2 px-3">{c.title}</td>
              <td className="py-2 px-3">{c.user}</td>
              <td className="py-2 px-3">{c.provider}</td>
              <td className="py-2 px-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  c.status === "Resolved"
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
