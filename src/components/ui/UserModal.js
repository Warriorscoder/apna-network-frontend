'use client';
import React, { useState, useEffect, useRef } from "react";

export default function UserModal({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(initialData || { name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setForm(initialData || { name: "", email: "" });
    setError("");
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (role) => {
    try {
      setSubmitting(true);

      const endpoint =
        role === "Provider"
          ? initialData
            ? `http://localhost:8000/api/providers/update/${initialData._id}`
            : "http://localhost:8000/api/providers/create"
          : initialData
            ? `http://localhost:8000/api/users/update/${initialData._id}`
            : "http://localhost:8000/api/users/create";

      const method = initialData ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role }),
      });

      const result = await res.json();

      if (result.success) {
        onSubmit(result.data);
        onClose();
      } else {
        setError(result.message || "Failed to save data");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while saving.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md max-h-screen overflow-y-auto relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#695aa6] focus:outline-none text-2xl"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-[#695aa6] mb-4">
          {initialData ? "Edit Entry" : "Add Entry"}
        </h2>

        {error && <div className="text-red-500 mb-2">{error}</div>}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <input
            ref={inputRef}
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-[#695aa6]/30 rounded-lg outline-none focus:border-[#695aa6] transition-all shadow-sm focus:shadow-lg text-base"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-[#695aa6]/30 rounded-lg outline-none focus:border-[#695aa6] transition-all shadow-sm focus:shadow-lg text-base"
            required
          />

          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <button
              type="button"
              onClick={() => handleSubmit("Provider")}
              className="flex-1 px-4 py-2 bg-[#695aa6] text-white rounded hover:bg-[#57468b] transition font-semibold shadow disabled:opacity-50"
              disabled={submitting}
            >
              {initialData ? "Update Provider" : "Add Provider"}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("User")}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold shadow disabled:opacity-50"
              disabled={submitting}
            >
              {initialData ? "Update User" : "Add User"}
            </button>
          </div>

          <div className="text-right mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 text-sm text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
