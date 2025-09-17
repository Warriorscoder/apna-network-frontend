'use client';
import React, { useState, useEffect } from "react";
import ContentModal from "./ContentModal";

const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/success`;

export default function SuccessStoriesManager() {
  const [stories, setStories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const query = statusFilter === "all" ? "" : `?status=${statusFilter}`;
      const res = await fetch(`${API_BASE}${query}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setStories(data.data);
      } else {
        console.error("Unexpected response:", data);
      }
    } catch (err) {
      console.error("Failed to fetch stories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [statusFilter]);

  const handleSubmit = async (data) => {
    try {
      const formattedData = {
        title: data.title,
        user: data.user,
        provider: data.provider,
        date: data.date,
        content: data.content,
        tags: data.tags?.length ? data.tags : [],
        images: data.images?.length ? data.images : [],
      };
      const url = `${API_BASE}/update/${editing._id}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });
      if (!res.ok) {
        const errorRes = await res.json();
        throw new Error(errorRes.message || "Update failed");
      }
      setModalOpen(false);
      setEditing(null);
      fetchStories();
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleApprove = async (id) => {
    await fetch(`${API_BASE}/approve/${id}`, { method: "PATCH" });
    fetchStories();
  };

  const handleReject = async (id) => {
    await fetch(`${API_BASE}/reject/${id}`, { method: "PATCH" });
    fetchStories();
  };

  const handleFeature = async (id) => {
    await fetch(`${API_BASE}/feature/${id}`, { method: "PATCH" });
    fetchStories();
  };

  const handleDelete = async (id) => {
    await fetch(`${API_BASE}/delete/${id}`, { method: "DELETE" });
    fetchStories();
  };

  const handleEdit = (story) => {
    setEditing(story);
    setModalOpen(true);
  };

  return (
    <div className="w-full">
      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1 rounded text-sm transition ${
              statusFilter === status
                ? "bg-yellow-500 text-white font-semibold"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
        <button
          onClick={fetchStories}
          className="ml-auto px-3 py-1 rounded text-sm bg-gray-100 hover:bg-gray-200"
        >
          Refresh
        </button>
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto border rounded-xl border-yellow-400/20 shadow max-h-[500px] hidden md:block">
        <table className="min-w-[880px] text-left bg-white text-sm">
          <thead className="sticky top-0 bg-yellow-50 z-10 border-b text-yellow-600">
            <tr>
              <th className="py-2 px-3 font-semibold">Title</th>
              <th className="py-2 px-3 font-semibold">User</th>
              <th className="py-2 px-3 font-semibold">Provider</th>
              <th className="py-2 px-3 font-semibold">Date</th>
              <th className="py-2 px-3 font-semibold">Status</th>
              <th className="py-2 px-3 font-semibold">Featured</th>
              <th className="py-2 px-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : stories.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-gray-400 py-6 text-center">
                  No success stories found.
                </td>
              </tr>
            ) : (
              stories.map((s) => (
                <tr key={s._id} className="border-t hover:bg-yellow-50">
                  <td className="py-2 px-3">{s.title}</td>
                  <td className="py-2 px-3">{s.user}</td>
                  <td className="py-2 px-3">{s.provider}</td>
                  <td className="py-2 px-3">
                    {s.date ? new Date(s.date).toLocaleDateString() : "-"}
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        s.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : s.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => handleFeature(s._id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        s.featured
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                      disabled={s.featured}
                    >
                      {s.featured ? "Featured" : "Set Featured"}
                    </button>
                  </td>
                  <td className="py-2 px-3 flex flex-wrap gap-2">
                    {s.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(s._id)}
                          className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(s._id)}
                          className="px-2 py-1 bg-yellow-500 text-white rounded text-xs"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleEdit(s)}
                      className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {loading && (
          <div className="text-gray-500 py-4 text-center bg-white rounded-xl border border-yellow-400/20">
            Loading...
          </div>
        )}
        {!loading && stories.length === 0 && (
          <div className="text-gray-400 py-4 text-center bg-white rounded-xl border border-yellow-400/20">
            No success stories found.
          </div>
        )}
        {stories.map((s) => (
          <div
            key={s._id}
            className="bg-white rounded-xl border border-yellow-400/20 p-4 shadow-sm space-y-3"
          >
            <div className="flex justify-between items-start gap-3">
              <div>
                <h3 className="font-semibold text-sm text-yellow-700">
                  {s.title}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  User: {s.user} • Provider: {s.provider}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded text-[10px] font-bold ${
                  s.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : s.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {s.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {s.status === "pending" && (
                <>
                  <button
                    onClick={() => handleApprove(s._id)}
                    className="px-3 py-1 bg-green-500 text-white rounded text-xs"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(s._id)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded text-xs"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => handleEdit(s)}
                className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(s._id)}
                className="px-3 py-1 bg-red-500 text-white rounded text-xs"
              >
                Delete
              </button>
              <button
                onClick={() => handleFeature(s._id)}
                disabled={s.featured}
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  s.featured
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {s.featured ? "Featured" : "Feature"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <ContentModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        type="story"
        initialData={editing}
      />
    </div>
  );
}
