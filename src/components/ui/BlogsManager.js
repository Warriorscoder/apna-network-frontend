'use client';
import React, { useState } from "react";
import ContentModal from "./ContentModal";

const initialBlogs = [
  { id: 1, title: "How to Find the Best Plumber", author: "Admin", date: "2025-06-25", featured: true },
  { id: 2, title: "Village Success in Handicrafts", author: "Admin", date: "2025-06-22", featured: false },
];

export default function BlogsManager() {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

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
      setBlogs([...blogs, { ...data, id: Date.now(), featured: false }]);
    }
    setModalOpen(false); setEditing(null);
  };

  return (
    <div>
      <button onClick={handleAdd} className="mb-4 bg-[#695aa6] text-white px-4 py-2 rounded">+ Add Blog</button>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left bg-white rounded-xl shadow border border-[#695aa6]/10">
          <thead>
            <tr>
              <th className="py-2 px-3 font-semibold text-[#695aa6]">Title</th>
              <th className="py-2 px-3 font-semibold text-[#695aa6]">Author</th>
              <th className="py-2 px-3 font-semibold text-[#695aa6]">Date</th>
              <th className="py-2 px-3 font-semibold text-[#695aa6]">Feature</th>
              <th className="py-2 px-3 font-semibold text-[#695aa6]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-gray-400 py-4 text-center">No blogs found.</td>
              </tr>
            ) : (
              blogs.map((b) => (
                <tr key={b.id} className="border-t hover:bg-[#f3f0fa]">
                  <td className="py-2 px-3">{b.title}</td>
                  <td className="py-2 px-3">{b.author}</td>
                  <td className="py-2 px-3">{b.date}</td>
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
