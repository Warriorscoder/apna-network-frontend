'use client';

export default function TestimonialsTable({ testimonials = [] }) {
  if (!testimonials.length) return <div className="text-gray-400 text-center py-4">No testimonials found.</div>;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left bg-white rounded-xl shadow border border-[#695aa6]/10">
        <thead>
          <tr>
            <th className="py-2 px-3 font-semibold text-[#695aa6]">User</th>
            <th className="py-2 px-3 font-semibold text-[#695aa6]">Message</th>
            <th className="py-2 px-3 font-semibold text-[#695aa6]">Status</th>
          </tr>
        </thead>
        <tbody>
          {testimonials.map((t) => (
            <tr key={t.id} className="border-t hover:bg-[#f3f0fa]">
              <td className="py-2 px-3">{t.user}</td>
              <td className="py-2 px-3">{t.message}</td>
              <td className="py-2 px-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                  {t.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
