"use client";
import React, { useState, useEffect } from "react";
import ContentModal from "./ContentModal";

const API_BASE = "http://localhost:8000/api/success";

export default function SuccessStoriesManager() {
  const [stories, setStories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchStories = async () => {
    try {
      const res = await fetch(
        `${API_BASE}${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`
      );
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setStories(data.data);
      } else {
        console.error("Unexpected response:", data);
      }
    } catch (err) {
      console.error("Failed to fetch stories:", err);
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
        throw new Error(`Update failed: ${errorRes.message || res.statusText}`);
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
    <div>
      <div className="flex gap-2 mb-4">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1 rounded ${
              statusFilter === status
                ? "bg-yellow-500 text-white font-semibold"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto max-h-[500px] border rounded-xl border-yellow-400/20 shadow">
        <table className="min-w-full text-left bg-white">
          <thead className="sticky top-0 bg-yellow-50 z-10 border-b">
            <tr>
              <th className="py-2 px-3 font-semibold text-yellow-600">Title</th>
              <th className="py-2 px-3 font-semibold text-yellow-600">User</th>
              <th className="py-2 px-3 font-semibold text-yellow-600">Provider</th>
              <th className="py-2 px-3 font-semibold text-yellow-600">Date</th>
              <th className="py-2 px-3 font-semibold text-yellow-600">Status</th>
              <th className="py-2 px-3 font-semibold text-yellow-600">Featured</th>
              <th className="py-2 px-3 font-semibold text-yellow-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stories.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-gray-400 py-4 text-center">
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
                      {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
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
                      {s.featured ? "Featured" : "Set as Featured"}
                    </button>
                  </td>
                  <td className="py-2 px-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleEdit(s)}
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                    {s.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(s._id)}
                          className="px-2 py-1 bg-green-500 text-white rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(s._id)}
                          className="px-2 py-1 bg-yellow-500 text-white rounded"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
