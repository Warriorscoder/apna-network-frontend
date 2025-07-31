'use client';
import React, { useEffect, useState } from 'react';

export default function ServiceTakersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUsers(data.data || []);
        else setUsers([]);
      })
      .catch((err) => console.error('Failed to load users:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-center text-gray-500 py-4">Loading users...</p>;
  if (!users.length)
    return <p className="text-center text-gray-400 py-4">No service takers found.</p>;

  return (
    <div className="w-full">
      <h3 className="font-semibold text-lg mb-3 text-blue-600">Service Takers</h3>
      <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-200">
        <table className="min-w-full text-left text-sm sm:text-base">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 whitespace-nowrap">Name</th>
              <th className="py-3 px-4 whitespace-nowrap">Email</th>
              <th className="py-3 px-4 whitespace-nowrap">Phone</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{u.name || "N/A"}</td>
                <td className="py-2 px-4">{u.email || "N/A"}</td>
                <td className="py-2 px-4">{u.phone || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
