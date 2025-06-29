'use client';
import React, { useEffect, useState, useRef } from "react";

export default function UserModal({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(initialData || { name: "", email: "", role: "Provider" });
  const inputRef = useRef(null);

  useEffect(() => {
    setForm(initialData || { name: "", email: "", role: "Provider" });
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open, initialData]);

  if (!open) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#695aa6] focus:outline-none text-2xl"
          aria-label="Close"
        >&times;</button>
        <h2 className="text-2xl font-bold text-[#695aa6] mb-4">
          {initialData ? "Edit" : "Add"} {form.role}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            ref={inputRef}
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-[#695aa6]/30 rounded-lg outline-none focus:border-[#695aa6] transition-all shadow-sm focus:shadow-lg text-lg"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-[#695aa6]/30 rounded-lg outline-none focus:border-[#695aa6] transition-all shadow-sm focus:shadow-lg text-lg"
            required
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-[#695aa6]/30 rounded-lg outline-none focus:border-[#695aa6] text-lg"
          >
            <option value="Provider">Provider</option>
            <option value="User">User</option>
          </select>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#695aa6] text-white rounded hover:bg-[#57468b] transition font-semibold shadow"
            >
              {initialData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px);}
          to { opacity: 1; transform: none;}
        }
      `}</style>
    </div>
  );
}
