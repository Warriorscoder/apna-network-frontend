'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useToast } from "@/components/ui/ToastProvider";

export default function ServiceTakersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const q = searchTerm.toLowerCase();
    return users.filter(u =>
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.phone || "").toString().toLowerCase().includes(q)
    );
  }, [users, searchTerm]);

  if (loading) return <p className="text-center text-gray-500 py-4">Loading users...</p>;
  if (!users.length) return <p className="text-center text-gray-400 py-4">No service takers found.</p>;

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex-1 max-w-xs">
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#695aa6] focus:border-transparent"
          />
        </div>
        <div className="text-sm text-gray-500">
          Showing {filteredUsers.length} / {users.length}
        </div>
      </div>

      {/* Mobile card list */}
      <div className="grid gap-3 sm:hidden">
        {filteredUsers.length ? filteredUsers.map(u => (
          <div key={u._id} className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-[#695aa6] text-sm">{u.name || "N/A"}</h3>
              <button
                onClick={() => handleRemove(u._id)}
                className="text-[11px] bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
            <div className="mt-2 text-xs space-y-1 text-gray-600">
              <p><span className="font-medium">Email:</span> {u.email || "—"}</p>
              <p><span className="font-medium">Phone:</span> {u.phone || "—"}</p>
            </div>
          </div>
        )) : (
          <div className="text-center text-gray-400 text-sm py-4">
            {`No users match ${searchTerm}`}
          </div>
        )}
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-200 hidden sm:block">
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
            {filteredUsers.length ? (
              filteredUsers.map((u) => (
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
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-6 px-4 text-center text-gray-400">
                  {`No users match ${searchTerm}`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
