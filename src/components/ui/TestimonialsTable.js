'use client';

import { useEffect, useState } from 'react';

export default function TestimonialsTable() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/reviews');
        const json = await res.json();
        if (json.success) {
          setTestimonials(json.data);
        } else {
          setError(json.message || "Failed to load testimonials");
        }
      } catch (err) {
        console.error("Failed to fetch testimonials", err);
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading)
    return <div className="text-center text-gray-400 py-4">Loading testimonials...</div>;
  if (error)
    return <div className="text-center text-red-500 py-4">{error}</div>;
  if (!testimonials.length)
    return <div className="text-center text-gray-400 py-4">No testimonials found.</div>;

  return (
    <div className="overflow-x-auto max-h-[400px] border rounded-xl border-[#695aa6]/10 shadow">
      <table className="min-w-full text-left bg-white">
        <thead className="sticky top-0 bg-[#f3f0fa] z-10 border-b border-[#695aa6]/10">
          <tr>
            <th className="py-2 px-3 font-semibold text-[#695aa6]">User</th>
            <th className="py-2 px-3 font-semibold text-[#695aa6]">Message</th>
            <th className="py-2 px-3 font-semibold text-[#695aa6]">Status</th>
          </tr>
        </thead>
        <tbody>
          {testimonials.map((t) => (
            <tr key={t._id} className="border-t hover:bg-[#f9f7fd]">
              <td className="py-2 px-3">{t.user || t.name || 'Anonymous'}</td>
              <td className="py-2 px-3">{t.message || t.text || '-'}</td>
              <td className="py-2 px-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  t.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : t.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {t.status || "pending"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
