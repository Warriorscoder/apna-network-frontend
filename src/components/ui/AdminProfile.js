'use client';
import React, { useEffect, useState } from 'react';

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('admin');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAdmin(parsed);
      } catch (err) {
        console.error("Failed to parse admin data", err);
      }
    }
  }, []);

  if (!admin) {
    return (
      <div className="p-6 text-center text-gray-500">Loading profile...</div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 mt-10">
      <h2 className="text-2xl font-bold text-[#695aa6] mb-4">Admin Profile</h2>
      <div className="space-y-4 text-gray-800">
        <div><strong>Name:</strong> {admin.name}</div>
        <div><strong>Email:</strong> {admin.email}</div>
        {/* Add more fields as per your admin object */}
      </div>
    </div>
  );
}
