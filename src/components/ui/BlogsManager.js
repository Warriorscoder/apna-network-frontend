'use client';
import React, { useState } from "react";
import ContentModal from "./ContentModal";

// Initial blogs with all required fields
const initialBlogs = [
  {
    id: 1,
    title: "How to Find the Best Plumber",
    content: "A guide to finding skilled plumbers in your village.",
    author: "Admin",
    date: "2025-06-25",
    featured: true,
    status: "approved",
    tags: ["plumbing", "tips"],
    images: [],
  },
  {
    id: 2,
    title: "Village Success in Handicrafts",
    content: "Read how local artisans are transforming their lives.",
    author: "Admin",
    date: "2025-06-22",
    featured: false,
    status: "pending",
    tags: ["handicrafts", "success"],
    images: [],
  },
];

export default function BlogsManager() {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // Only one blog can be featured at a time
  const handleFeature = (id) => {
    setBlogs(blogs.map(b => ({ ...b, featured: b.id === id })));
  };

  const handleAdd = () => { setEditing(null); setModalOpen(true); };
  const handleEdit = (blog) => { setEditing(blog); setModalOpen(true); };
  const handleDelete = (id) => { setBlogs(blogs.filter(b => b.id !== id)); };
  const handleSubmit = (data) => {
    if (editing) {
      setBlogs(blogs.map(b => b.id === editing.id ? { ...b, ...data } : b));
    } else {
      setBlogs([...blogs, { ...data, id: Date.now(), featured: false, status: "pending" }]);
    }
    setModalOpen(false); setEditing(null);
  };

  // Admin approval workflow
  const handleApprove = (id) => {
    setBlogs(blogs.map(b => b.id === id ? { ...b, status: "approved" } : b));
  };
  const handleReject = (id) => {
    setBlogs(blogs.map(b => b.id === id ? { ...b, status: "rejected" } : b));
  };

  // Filter blogs by status
  const filteredBlogs = blogs.filter(b =>
    statusFilter === "all" ? true : b.status === statusFilter
  );

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setStatusFilter("all")} className={statusFilter === "all" ? "font-bold underline" : ""}>All</button>
        <button onClick={() => setStatusFilter("pending")} className={statusFilter === "pending" ? "font-bold underline" : ""}>Pending</button>
        <button onClick={() => setStatusFilter("approved")} className={statusFilter === "approved" ? "font-bold underline" : ""}>Approved</button>
        <button onClick={() => setStatusFilter("rejected")} className={statusFilter === "rejected" ? "font-bold underline" : ""}>Rejected</button>
      </div>
      <button onClick={handleAdd} className="mb-4 bg-[#695aa6] text-white px-4 py-2 rounded">+ Add Blog</button>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left bg-white rounded-xl shadow border border-[#695aa6]/10">
          <thead>
            <tr>
              <th className="py-2 px-3 font-semibold text-[#695aa6]">Title</th>
              <th className="py-2 px-3 font-semibold text-[#695aa6]">Author</th>
              <th className="py-2 px-3 font-semibold text-[#695aa6]">Date</th>
              <th className="py-2 px-3 font-semibold text-[#695aa6]">Tags</th>
              <th className="py-2 px-3 font-semibold text-[#695aa6]">Status</th>
              <th className="py-2 px-3 font-semibold text-[#695aa6]">Feature</th>
              <th className="py-2 px-3 font-semibold text-[#695aa6]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-gray-400 py-4 text-center">No blogs found.</td>
              </tr>
            ) : (
              filteredBlogs.map((b) => (
                <tr key={b.id} className="border-t hover:bg-[#f3f0fa]">
                  <td className="py-2 px-3">{b.title}</td>
                  <td className="py-2 px-3">{b.author}</td>
                  <td className="py-2 px-3">{b.date}</td>
                  <td className="py-2 px-3">{b.tags?.join(", ")}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      b.status === "approved" ? "bg-green-100 text-green-700"
                        : b.status === "pending" ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => handleFeature(b.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${b.featured ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                      disabled={b.featured}
                    >
                      {b.featured ? "Featured" : "Set as Featured"}
                    </button>
                  </td>
                  <td className="py-2 px-3 flex gap-2">
                    <button onClick={() => handleEdit(b)} className="px-2 py-1 bg-blue-500 text-white rounded">Edit</button>
                    <button onClick={() => handleDelete(b.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                    {b.status === "pending" && (
                      <>
                        <button onClick={() => handleApprove(b.id)} className="px-2 py-1 bg-green-500 text-white rounded">Approve</button>
                        <button onClick={() => handleReject(b.id)} className="px-2 py-1 bg-yellow-500 text-white rounded">Reject</button>
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
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
        type="blog"
        initialData={editing}
      />
    </div>
  );
}
