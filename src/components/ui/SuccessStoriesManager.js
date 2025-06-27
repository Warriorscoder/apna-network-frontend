'use client';
import React, { useState } from "react";
import ContentModal from "./ContentModal";

const initialStories = [
  { id: 1, title: "Ravi's Success", user: "Ravi Kumar", date: "2025-06-20", featured: true },
  { id: 2, title: "Sita's Journey", user: "Sita Devi", date: "2025-06-18", featured: false },
];

export default function SuccessStoriesManager() {
  const [stories, setStories] = useState(initialStories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Only one story can be featured at a time
  const handleFeature = (id) => {
    setStories(stories.map(s => ({ ...s, featured: s.id === id })));
  };

  const handleAdd = () => { setEditing(null); setModalOpen(true); };
  const handleEdit = (story) => { setEditing(story); setModalOpen(true); };
  const handleDelete = (id) => { setStories(stories.filter(s => s.id !== id)); };
  const handleSubmit = (data) => {
    if (editing) {
      setStories(stories.map(s => s.id === editing.id ? { ...s, ...data } : s));
    } else {
      setStories([...stories, { ...data, id: Date.now(), featured: false }]);
    }
    setModalOpen(false); setEditing(null);
  };

  return (
    <div>
      <button
        onClick={handleAdd}
        className="mb-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded font-semibold shadow hover:bg-yellow-500 transition"
      >
        + Add Success Story
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left bg-white rounded-xl shadow border border-yellow-400/10">
          <thead>
            <tr>
              <th className="py-2 px-3 font-semibold text-yellow-600">Title</th>
              <th className="py-2 px-3 font-semibold text-yellow-600">User</th>
              <th className="py-2 px-3 font-semibold text-yellow-600">Date</th>
              <th className="py-2 px-3 font-semibold text-yellow-600">Feature</th>
              <th className="py-2 px-3 font-semibold text-yellow-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stories.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-gray-400 py-4 text-center">No success stories found.</td>
              </tr>
            ) : (
              stories.map((s) => (
                <tr key={s.id} className="border-t hover:bg-yellow-50">
                  <td className="py-2 px-3">{s.title}</td>
                  <td className="py-2 px-3">{s.user}</td>
                  <td className="py-2 px-3">{s.date}</td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => handleFeature(s.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${s.featured ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                      disabled={s.featured}
                    >
                      {s.featured ? "Featured" : "Set as Featured"}
                    </button>
                  </td>
                  <td className="py-2 px-3 flex gap-2">
                    <button onClick={() => handleEdit(s)} className="px-2 py-1 bg-blue-500 text-white rounded">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
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
        type="story"
        initialData={editing}
      />
    </div>
  );
}
