'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import ContentModal from "./ContentModal";

const API_BASE = "http://localhost:5000/api/blogs";

export default function BlogsManager() {
  const [blogs, setBlogs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/`);
      if (res.data.success && Array.isArray(res.data.data)) {
        setBlogs(res.data.data);
      } else {
        console.error("Unexpected response format:", res.data);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err.message);
    }
  };

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (blog) => {
    setEditing(blog);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/delete/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await axios.put(`${API_BASE}/update/${editing._id}`, data);
      } else {
        await axios.post(`${API_BASE}/create`, data);
      }
      setModalOpen(false);
      setEditing(null);
      fetchBlogs();
    } catch (err) {
      console.error("Save error:", err.message);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(`${API_BASE}/approve/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error("Approve error:", err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(`${API_BASE}/reject/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error("Reject error:", err.message);
    }
  };

  const handleFeature = async (id) => {
    try {
      await axios.patch(`${API_BASE}/feature/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error("Feature error:", err.message);
    }
  };

  const filteredBlogs = blogs.filter((b) =>
    statusFilter === "all" ? true : b.status === statusFilter
  );

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              statusFilter === status
                ? "bg-[#695aa6] text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

     
      <button
        onClick={handleAdd}
        className="mb-4 bg-[#695aa6] text-white px-4 py-2 rounded font-semibold shadow hover:bg-[#57468b] transition"
      >
        + Add Blog
      </button>

     
      <div className="overflow-x-auto rounded-xl shadow border border-[#695aa6]/20">
        <table className="min-w-full text-left bg-white rounded-xl overflow-hidden">
          <thead className="sticky top-0 z-10 bg-[#f3f0fa] border-b border-[#695aa6]/20">
            <tr className="text-[#695aa6]">
              <th className="py-2 px-3 font-semibold">Title</th>
              <th className="py-2 px-3 font-semibold">Author</th>
              <th className="py-2 px-3 font-semibold">Date</th>
              <th className="py-2 px-3 font-semibold">Tags</th>
              <th className="py-2 px-3 font-semibold">Status</th>
              <th className="py-2 px-3 font-semibold">Feature</th>
              <th className="py-2 px-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-4">
                  No blogs found.
                </td>
              </tr>
            ) : (
              filteredBlogs.map((b) => (
                <tr key={b._id} className="border-t hover:bg-[#f9f8fd]">
                  <td className="py-2 px-3">{b.title || "Untitled"}</td>
                  <td className="py-2 px-3">{b.author || "Unknown"}</td>
                  <td className="py-2 px-3">
                    {b.date ? new Date(b.date).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="py-2 px-3">{b.tags?.join(", ") || "-"}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        b.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : b.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => handleFeature(b._id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        b.featured
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                      disabled={b.featured}
                    >
                      {b.featured ? "Featured" : "Set as Featured"}
                    </button>
                  </td>
                  <td className="py-2 px-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleEdit(b)}
                      className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                    >
                      Delete
                    </button>
                    {b.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(b._id)}
                          className="px-2 py-1 bg-green-500 text-white rounded text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(b._id)}
                          className="px-2 py-1 bg-yellow-500 text-white rounded text-sm"
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
        type="blog"
        initialData={editing}
      />
    </div>
  );
}