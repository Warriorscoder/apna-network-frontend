'use client';
import React, { useState, useEffect, useRef } from "react";
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function AddServiceModal({ open, onClose, onAdd }) {
  const [serviceTitle, setServiceTitle] = useState("");
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setServiceTitle("");
      setAdded(false);
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serviceTitle.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/services/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: serviceTitle }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) throw new Error(result.message || "Failed to add service");

      if (onAdd) {
        onAdd(result.data); 
      }

      setAdded(true);
      setTimeout(() => {
        setServiceTitle("");
        setAdded(false);
        onClose();
      }, 900);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#695aa6] focus:outline-none text-2xl"
          aria-label="Close"
        >&times;</button>

        <div className="flex flex-col items-center mb-4">
          <div className="bg-[#695aa6]/10 rounded-full p-4 mb-2">
            <svg className="w-8 h-8 text-[#695aa6]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#695aa6] mb-1">Add New Service</h2>
          <p className="text-gray-500 text-sm">Enter the name of the service you want to add.</p>
        </div>

        {added ? (
          <div className="flex flex-col items-center py-8 animate-fadeIn">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mb-2 animate-bounceIn" />
            <div className="text-green-600 font-semibold text-lg">Service Added!</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                ref={inputRef}
                name="title"
                placeholder="e.g. Plumbing, Carpentry"
                value={serviceTitle}
                onChange={(e) => setServiceTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#695aa6]/30 rounded-lg outline-none focus:border-[#695aa6] transition-all shadow-sm focus:shadow-lg text-lg"
                required
                maxLength={40}
                aria-label="Service Title"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                {serviceTitle.length}/40
              </span>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
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
                disabled={!serviceTitle.trim() || loading}
              >
                {loading ? "Adding..." : "Add Service"}
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
          from { opacity: 0; transform: translateY(24px);}
          to { opacity: 1; transform: none;}
        }
        .animate-bounceIn {
          animation: bounceIn 0.6s;
        }
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0;}
          50% { transform: scale(1.05);}
          70% { transform: scale(0.95);}
          100% { transform: scale(1); opacity: 1;}
        }
      `}</style>
    </div>
  );
}