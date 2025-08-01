"use client";

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
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-semibold text-sky-700">Newsletters</h2>
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
                  key={n._id}
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
                    {new Date(n.date).toLocaleDateString()}
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
                        onClick={() => handleDelete(n._id)}
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
