'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useToast } from "@/components/ui/ToastProvider";

export default function ServiceProvidersTable() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [providerServicesMap, setProviderServicesMap] = useState({});
  const [servicesLoading, setServicesLoading] = useState(false);

  const [servicesModalOpen, setServicesModalOpen] = useState(false);
  const [servicesModalProvider, setServicesModalProvider] = useState(null);

  const [deletingServiceId, setDeletingServiceId] = useState(null);

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

  const fetchServicesForProviders = async () => {
    setServicesLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/services`);
      const data = await res.json();
      if (data.success) {
        const all = data.services || data.data || [];
        const map = {};
        all.forEach(s => {
          const pid = s.provider_id?._id || s.provider_id || s.provider || s.providerId;
            if (!pid) return;
            if (!map[pid]) map[pid] = [];
            map[pid].push({
              _id: s._id,
              title: s.title,
              category: s.category,
              status: s.status
            });
        });
        setProviderServicesMap(map);
      } else {
        setProviderServicesMap({});
      }
    } catch (e) {
      console.error("Failed to fetch services:", e);
    } finally {
      setServicesLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    if (providers.length) {
      fetchServicesForProviders();
    }
  }, [providers]);

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

  const handleDeleteService = async (serviceId, providerId) => {
    if (!serviceId) return;
    setDeletingServiceId(serviceId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/services/delete/${serviceId}`,
        { method: "DELETE" }
      );
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success !== false) {
        setProviderServicesMap(prev => {
          const copy = { ...prev };
            copy[providerId] = (copy[providerId] || []).filter(s => s._id !== serviceId);
          return copy;
        });
        showToast("Service removed", "success");
      } else {
        showToast(data.message || "Failed to remove service", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Error deleting service", "error");
    } finally {
      setDeletingServiceId(null);
    }
  };

  const filteredProviders = useMemo(() => {
    if (!searchTerm.trim()) return providers;
    const q = searchTerm.toLowerCase();
    return providers.filter(p => {
      const basicMatch =
        (p.name || "").toLowerCase().includes(q) ||
        (p.phone || "").toString().toLowerCase().includes(q) ||
        (p.village || "").toLowerCase().includes(q);
      if (basicMatch) return true;
      const services = providerServicesMap[p._id] || [];
      return services.some(s =>
        (s.title || "").toLowerCase().includes(q) ||
        (s.category || "").toLowerCase().includes(q)
      );
    });
  }, [providers, searchTerm, providerServicesMap]);

  const openServicesModal = (provider) => {
    setServicesModalProvider(provider);
    setServicesModalOpen(true);
  };

  const closeServicesModal = () => {
    setServicesModalOpen(false);
    setServicesModalProvider(null);
  };

  if (loading)
    return <p className="text-center text-gray-500 py-4 text-sm sm:text-base">Loading providers...</p>;

  if (!providers.length)
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#695aa6] focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-500">Showing 0 / 0</div>
        </div>
        <p className="text-center text-gray-400 py-4 text-sm sm:text-base">No providers found.</p>
      </div>
    );

  return (
    <div className="w-full overflow-x-auto px-2 sm:px-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex-1 max-w-xs">
          <input
            type="text"
            placeholder="Search name, phone, village, service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#695aa6] focus:border-transparent"
          />
        </div>
        <div className="text-sm text-gray-500">
          Showing {filteredProviders.length} / {providers.length}
        </div>
      </div>

      <table className="min-w-full table-auto border border-gray-300 rounded-xl text-xs sm:text-sm md:text-base bg-white">
        <thead className="bg-[#f9f7ff] sticky top-0 z-10 border-b border-gray-300">
          <tr>
            <th className="py-3 px-4 text-left font-semibold text-[#695aa6]">Name</th>
            <th className="py-3 px-4 text-left font-semibold text-[#695aa6]">Phone</th>
            <th className="py-3 px-4 text-left font-semibold text-[#695aa6]">Village</th>
            <th className="py-3 px-4 text-left font-semibold text-[#695aa6]">Services</th>
            <th className="py-3 px-4 text-left font-semibold text-[#695aa6]">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProviders.length ? (
            filteredProviders.map((p) => {
              const services = providerServicesMap[p._id] || [];
              const firstTwo = services.slice(0, 2).map(s => s.title).join(", ");
              const remaining = services.length - 2;
              return (
                <tr key={p._id} className="even:bg-gray-50 hover:bg-[#f3f0fa] border-b border-gray-200">
                  <td className="py-2 px-4">{p.name}</td>
                  <td className="py-2 px-4">{p.phone}</td>
                  <td className="py-2 px-4">{p.village || "—"}</td>
                  <td className="py-2 px-4">
                    {servicesLoading ? (
                      <span className="text-gray-400 text-xs">Loading...</span>
                    ) : services.length === 0 ? (
                      <span className="text-gray-400 text-xs">None</span>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs">
                          {firstTwo}
                          {remaining > 0 && (
                            <span className="text-gray-500">
                              {" "}+{remaining} more
                            </span>
                          )}
                        </span>
                        <button
                          onClick={() => openServicesModal(p)}
                          className="text-[11px] text-[#695aa6] hover:underline self-start"
                        >
                          View all
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedProvider(p);
                          setConfirmOpen(true);
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-red-600 transition"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => openServicesModal(p)}
                        className="bg-[#695aa6] text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-[#5a4d8a] transition"
                      >
                        Services
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={5}
                className="py-6 px-4 text-center text-gray-400"
              >
                No providers match "{searchTerm}"
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {confirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Remove Provider</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to remove <b>{selectedProvider?.name}</b>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setConfirmOpen(false);
                  setSelectedProvider(null);
                }}
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

      {servicesModalOpen && servicesModalProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Services by {servicesModalProvider.name}
              </h3>
              <button
                onClick={closeServicesModal}
                className="text-gray-500 text-sm hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-5 overflow-y-auto">
              {servicesLoading ? (
                <p className="text-sm text-gray-500">Loading services...</p>
              ) : (
                <>
                  {(providerServicesMap[servicesModalProvider._id] || []).length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No services listed for this provider.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {providerServicesMap[servicesModalProvider._id].map(s => (
                        <li
                          key={s._id}
                          className="border rounded-lg px-3 py-2 flex items-center justify-between bg-gray-50"
                        >
                          <div className="pr-3 flex-1">
                            <p className="text-sm font-medium text-gray-800">{s.title}</p>
                            <p className="text-[11px] text-gray-500">
                              {s.category || "—"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDeleteService(s._id, servicesModalProvider._id)}
                              disabled={deletingServiceId === s._id}
                              className="text-[10px] px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                              title="Remove service"
                            >
                              {deletingServiceId === s._id ? "..." : "Delete"}
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
            <div className="px-5 py-3 border-t flex justify-end">
              <button
                onClick={closeServicesModal}
                className="px-4 py-2 text-sm rounded-md border hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
