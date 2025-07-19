'use client';
import React, { useEffect, useState } from "react";
import ContentModal from "./ContentModal";
import axios from "axios";

const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/newsletter`;


export default function NewsletterManager() {
  const [newsletters, setNewsletters] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      const res = await axios.get(API_BASE);
      if (res.data.success && Array.isArray(res.data.data)) {
        setNewsletters(res.data.data);
      } else {
        console.error("Unexpected response format:", res.data);
      }
    } catch (err) {
      console.error("Failed to fetch newsletters", err);
    }
  };

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditing(item);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/delete/${id}`);
      fetchNewsletters();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editing?._id) {
        await axios.put(`${API_BASE}/update/${editing._id}`, data);
      } else {
        await axios.post(`${API_BASE}/create`, data);
      }
      fetchNewsletters();
    } catch (err) {
      console.error("Submit failed", err);
    }
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <div>
      <button
        onClick={handleAdd}
        className="mb-4 bg-sky-400 text-white px-4 py-2 rounded font-semibold shadow hover:bg-sky-500 transition"
      >
        + Add Newsletter
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left bg-white rounded-xl shadow border border-sky-400/10">
          <thead className="sticky top-0 bg-sky-50 z-10 border-b">
            <tr>
              <th className="py-2 px-3 font-semibold text-sky-600">Image</th>
              <th className="py-2 px-3 font-semibold text-sky-600">Category</th>
              <th className="py-2 px-3 font-semibold text-sky-600">Title</th>
              <th className="py-2 px-3 font-semibold text-sky-600">Date</th>
              <th className="py-2 px-3 font-semibold text-sky-600">Site URL</th>
              <th className="py-2 px-3 font-semibold text-sky-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {newsletters.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-gray-400 py-4 text-center">No newsletters found.</td>
              </tr>
            ) : (
              newsletters.map((n) => (
                <tr key={n._id} className="border-t hover:bg-sky-50">
                  <td className="py-2 px-3">
                    <img src={n.image_url} alt={n.title} className="w-12 h-12 object-cover rounded" />
                  </td>
                  <td className="py-2 px-3">{n.category}</td>
                  <td className="py-2 px-3">{n.title}</td>
                  <td className="py-2 px-3">{new Date(n.date).toLocaleDateString()}</td>
                  <td className="py-2 px-3">
                    <a href={n.site_url} target="_blank" rel="noopener noreferrer" className="text-sky-600 underline">
                      {n.site_url}
                    </a>
                  </td>
                  <td className="py-2 px-3 flex gap-2">
                    <button onClick={() => handleEdit(n)} className="px-2 py-1 bg-blue-500 text-white rounded">Edit</button>
                    <button onClick={() => handleDelete(n._id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
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
        type="newsletter"
        initialData={editing}
      />
    </div>
  );
}