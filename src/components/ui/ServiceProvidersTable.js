'use client';
import React, { useEffect, useState } from 'react';

export default function ServiceProvidersTable() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/providers`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProviders(data.data || []);
        else setProviders([]);
      })
      .catch((err) => console.error('Failed to load providers:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-500 py-4 text-sm sm:text-base">
        Loading providers...
      </p>
    );

  if (!providers.length)
    return (
      <p className="text-center text-gray-400 py-4 text-sm sm:text-base">
        No providers found.
      </p>
    );

  return (
    <div className="w-full overflow-x-auto px-2 sm:px-4">
      <table className="min-w-full table-auto border border-gray-300 rounded-xl text-xs sm:text-sm md:text-base">
        <thead className="bg-[#f9f7ff] sticky top-0 z-10 border-b border-gray-300">
          <tr>
            <th className="py-3 px-4 text-left font-semibold text-[#695aa6]">Name</th>
            <th className="py-3 px-4 text-left font-semibold text-[#695aa6]">Phone</th>
            <th className="py-3 px-4 text-left font-semibold text-[#695aa6]">Village</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((p) => (
            <tr
              key={p._id}
              className="even:bg-gray-50 hover:bg-[#f3f0fa] border-b border-gray-200"
            >
              <td className="py-2 px-4">{p.name}</td>
              <td className="py-2 px-4">{p.phone}</td>
              <td className="py-2 px-4">{p.village}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
