'use client';
import React from 'react';

export default function AdminProfile() {
  const admin = {
    name: "Raj Kumar",
    email: "admin@example.com",
    phone: "+91 9999999999",
    role: "Administrator",
    joined: "01 Jan 2024",
    location: "Hyderabad, India",
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-200 p-6 sm:p-10">
        <header className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
            Admin Profile
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            View and manage your account information
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-gray-800">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Personal Details</h2>
            <div>
              <span className="block text-sm font-medium text-gray-500">Full Name</span>
              <p className="text-base">{admin.name}</p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-500">Email</span>
              <p className="text-base break-words">{admin.email}</p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-500">Phone</span>
              <p className="text-base">{admin.phone}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Professional Info</h2>
            <div>
              <span className="block text-sm font-medium text-gray-500">Role</span>
              <p className="text-base">{admin.role}</p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-500">Joined On</span>
              <p className="text-base">{admin.joined}</p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-500">Location</span>
              <p className="text-base">{admin.location}</p>
            </div>
          </div>
        </section>

        <footer className="mt-10 border-t pt-4 text-sm text-gray-400 text-center sm:text-right">
          Last updated on 20 July 2025
        </footer>
      </div>
    </div>
  );
}
