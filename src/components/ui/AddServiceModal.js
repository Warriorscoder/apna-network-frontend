'use client';
import React, { useState, useEffect, useRef } from "react";
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import axios from "axios";
import { toast } from "react-toastify";

export default function AddCategoryModal({ open, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    key: "",
    title: "",
    subtitle: "",
    image: ""
  });

  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const keyRef = useRef(null);

  useEffect(() => {
    if (open) {
      setFormData({ key: "", title: "", subtitle: "", image: "" });
      setAdded(false);
      setError(null);
      setTimeout(() => keyRef.current?.focus(), 100);
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.key.trim() || !formData.title.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/`,
        formData
      );

      const result = res.data;

      if (!result.success) {
        throw new Error(result.message || "Failed to add category");
      }

      if (onAdd) onAdd(result.data);

      setAdded(true);
      toast.success("Category added successfully!");

      setTimeout(() => {
        setFormData({ key: "", title: "", subtitle: "", image: "" });
        setAdded(false);
        onClose();
      }, 900);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#695aa6] focus:outline-none text-2xl"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="flex flex-col items-center mb-4">
          <div className="bg-[#695aa6]/10 rounded-full p-4 mb-2">
            <svg className="w-8 h-8 text-[#695aa6]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#695aa6] mb-1">Add New Category</h2>
          <p className="text-gray-500 text-sm">Fill in the details to create a new category.</p>
        </div>

        {added ? (
          <div className="flex flex-col items-center py-8 animate-fadeIn">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mb-2 animate-bounceIn" />
            <div className="text-green-600 font-semibold text-lg">Category Added!</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Key */}
            <div className="relative">
              <input
                ref={keyRef}
                name="key"
                placeholder="Unique Key (e.g. plumbing)"
                value={formData.key}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-[#695aa6]/30 rounded-lg outline-none focus:border-[#695aa6] transition-all shadow-sm focus:shadow-lg text-lg"
                required
                maxLength={40}
              />
            </div>

            {/* Title */}
            <div className="relative">
              <input
                name="title"
                placeholder="Category Title (e.g. Plumbing)"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-[#695aa6]/30 rounded-lg outline-none focus:border-[#695aa6] transition-all shadow-sm focus:shadow-lg text-lg"
                required
                maxLength={40}
              />
            </div>

            {/* Subtitle */}
            <div className="relative">
              <input
                name="subtitle"
                placeholder="Subtitle (optional)"
                value={formData.subtitle}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-[#695aa6]/30 rounded-lg outline-none focus:border-[#695aa6] transition-all shadow-sm focus:shadow-lg text-lg"
              />
            </div>

            {/* Image */}
            <div className="relative">
              <input
                name="image"
                placeholder="Image URL (optional)"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-[#695aa6]/30 rounded-lg outline-none focus:border-[#695aa6] transition-all shadow-sm focus:shadow-lg text-lg"
              />
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="flex justify-end gap-2 pt-2">
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
                disabled={!formData.key.trim() || !formData.title.trim() || loading}
              >
                {loading ? "Adding..." : "Add Category"}
              </button>
            </div>
          </form>
        )}
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: none; }
        }
        .animate-bounceIn {
          animation: bounceIn 0.6s;
        }
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

