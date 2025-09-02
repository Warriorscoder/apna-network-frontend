'use client';
import React, { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/ToastProvider";

export default function ServiceTakersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchUsers = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUsers(data.data || []);
        else setUsers([]);
      })
      .catch((err) => console.error('Failed to load users:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRemove = async (userId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/delete/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        showToast("User removed successfully", "success");
      } else {
        showToast("Failed to remove user.", "error");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      showToast("Something went wrong", "error");
    }
  };

  if (loading) return <p className="text-center text-gray-500 py-4">Loading users...</p>;
  if (!users.length) return <p className="text-center text-gray-400 py-4">No service takers found.</p>;

  return (
    <div className="w-full">
      <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-200">
        <table className="min-w-full text-left text-sm sm:text-base">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 whitespace-nowrap">Name</th>
              <th className="py-3 px-4 whitespace-nowrap">Email</th>
              <th className="py-3 px-4 whitespace-nowrap">Phone</th>
              <th className="py-3 px-4 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{u.name || "N/A"}</td>
                <td className="py-2 px-4">{u.email || "N/A"}</td>
                <td className="py-2 px-4">{u.phone || "N/A"}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleRemove(u._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
