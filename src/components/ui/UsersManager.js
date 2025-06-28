'use client';
import React, { useState, useEffect } from "react";

// Simulate fetching users from your backend
async function fetchUsers() {
  // Replace with your real API call
  return [
    { id: 1, name: "Ravi Kumar", email: "ravi@example.com", role: "Provider" },
    { id: 2, name: "Sita Devi", email: "sita@example.com", role: "User" },
  ];
}

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users on mount
  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
      setLoading(false);
    }
    load();
  }, []);

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user/provider?")) return;
    try {
      // Replace with your real API call
      await fetch(`/api/users/${id}`, { method: "DELETE" });
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      alert("Failed to delete. Please try again.");
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => window.open('/register', '_blank')}
          className="bg-[#695aa6] text-white px-4 py-2 rounded font-semibold shadow hover:bg-[#57468b] transition"
        >
          + Add User
        </button>
        <button
          onClick={() => window.open('/provider-signup', '_blank')}
          className="bg-[#695aa6] text-white px-4 py-2 rounded font-semibold shadow hover:bg-[#57468b] transition"
        >
          + Add Provider
        </button>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-gray-400 py-8 text-center">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-gray-400 py-8 text-center">No users or providers found.</div>
        ) : (
          <table className="min-w-full text-left bg-white rounded-xl shadow border border-[#695aa6]/10">
            <thead>
              <tr>
                <th className="py-2 px-3 font-semibold text-[#695aa6]">Name</th>
                <th className="py-2 px-3 font-semibold text-[#695aa6]">Email</th>
                <th className="py-2 px-3 font-semibold text-[#695aa6]">Role</th>
                <th className="py-2 px-3 font-semibold text-[#695aa6]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t hover:bg-[#f3f0fa]">
                  <td className="py-2 px-3">{u.name}</td>
                  <td className="py-2 px-3">{u.email}</td>
                  <td className="py-2 px-3">{u.role}</td>
                  <td className="py-2 px-3 flex gap-2">
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
