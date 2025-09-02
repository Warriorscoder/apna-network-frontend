'use client';
import React, { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/ToastProvider";

export default function ServiceProvidersTable() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const { showToast } = useToast();

  const fetchProviders = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/providers`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProviders(data.providers || []);
        else setProviders([]);
      })
      .catch((err) => console.error('Failed to load providers:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleRemove = async () => {
    if (!selectedProvider) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/providers/delete/${selectedProvider._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setProviders((prev) => prev.filter((p) => p._id !== selectedProvider._id));
        showToast("Provider removed successfully", "success");
      } else {
        showToast("Failed to remove provider", "error");
      }
    } catch (err) {
      console.error("Error deleting provider:", err);
      showToast("Something went wrong", "error");
    } finally {
      setConfirmOpen(false);
      setSelectedProvider(null);
    }
  };

  if (loading)
    return <p className="text-center text-gray-500 py-4 text-sm sm:text-base">Loading providers...</p>;

  if (!providers.length)
    return <p className="text-center text-gray-400 py-4 text-sm sm:text-base">No providers found.</p>;

  return (
    <div className="w-full overflow-x-auto px-2 sm:px-4">
      <table className="min-w-full table-auto border border-gray-300 rounded-xl text-xs sm:text-sm md:text-base">
        <thead className="bg-[#f9f7ff] sticky top-0 z-10 border-b border-gray-300">
          <tr>
            <th className="py-3 px-4 text-left font-semibold text-[#695aa6]">Name</th>
            <th className="py-3 px-4 text-left font-semibold text-[#695aa6]">Phone</th>
            <th className="py-3 px-4 text-left font-semibold text-[#695aa6]">Village</th>
            <th className="py-3 px-4 text-left font-semibold text-[#695aa6]">Action</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((p) => (
            <tr key={p._id} className="even:bg-gray-50 hover:bg-[#f3f0fa] border-b border-gray-200">
              <td className="py-2 px-4">{p.name}</td>
              <td className="py-2 px-4">{p.phone}</td>
              <td className="py-2 px-4">{p.village}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => {
                    setSelectedProvider(p);
                    setConfirmOpen(true);
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation popup */}
      {confirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Remove Provider</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to remove <b>{selectedProvider?.name}</b>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
