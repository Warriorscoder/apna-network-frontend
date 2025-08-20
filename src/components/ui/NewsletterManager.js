"use client";
import React, { useState } from "react";
import ContentModal from "./ContentModal";

const initialNewsletters = [
  {
    id: 1,
    image_url: "https://example.com/image1.jpg",
    category: "Community",
    title: "June Newsletter",
    content: "Our latest updates and stories.",
    date: "2025-06-01",
    site_url: "https://example.com/news/june",
  },
  {
    id: 2,
    image_url: "https://example.com/image2.jpg",
    category: "Events",
    title: "Special Event",
    content: "Join our upcoming event!",
    date: "2025-06-15",
    site_url: "https://example.com/news/event",
  },
];

export default function NewsletterManager() {
  const [newsletters, setNewsletters] = useState(initialNewsletters);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditing(item);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setNewsletters(newsletters.filter((n) => n.id !== id));
  };

  const handleSubmit = (data) => {
    if (editing) {
      setNewsletters(
        newsletters.map((n) =>
          n.id === editing.id ? { ...n, ...data } : n
        )
      );
    } else {
      setNewsletters([
        ...newsletters,
        { ...data, id: Date.now() },
      ]);
    }
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
        <h2 className="text-xl font-semibold text-sky-700">
          Newsletters
        </h2>
        <button
          onClick={handleAdd}
          className="bg-sky-500 text-white px-4 py-2 rounded-md font-medium shadow hover:bg-sky-600 transition text-sm"
        >
          + Add Newsletter
        </button>
      </div>

      <div className="w-full overflow-x-auto rounded-md shadow-sm border border-sky-100">
        <table className="min-w-[600px] w-full bg-white">
          <thead className="bg-sky-50 text-sky-600 text-sm border-b">
            <tr>
              <th className="py-2 px-3 text-left font-medium">Image</th>
              <th className="py-2 px-3 text-left font-medium">Category</th>
              <th className="py-2 px-3 text-left font-medium">Title</th>
              <th className="py-2 px-3 text-left font-medium">Date</th>
              <th className="py-2 px-3 text-left font-medium">Site URL</th>
              <th className="py-2 px-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {newsletters.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-gray-400 text-center py-6 text-sm"
                >
                  No newsletters found.
                </td>
              </tr>
            ) : (
              newsletters.map((n) => (
                <tr
                  key={n.id}
                  className="hover:bg-sky-50 text-sm border-t"
                >
                  <td className="py-2 px-3">
                    <img
                      src={n.image_url}
                      alt={n.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="py-2 px-3">{n.category}</td>
                  <td className="py-2 px-3">{n.title}</td>
                  <td className="py-2 px-3">
                    {n.date?.slice(0, 10)}
                  </td>
                  <td className="py-2 px-3 max-w-[160px] truncate">
                    <a
                      href={n.site_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-600 underline"
                    >
                      {n.site_url}
                    </a>
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEdit(n)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
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
        type="newsletter"
        initialData={editing}
      />
    </div>
  );
}
