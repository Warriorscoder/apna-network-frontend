'use client';
import React, { useState } from "react";
import ContentModal from "./ContentModal";

const initialSubscribers = [
  { id: 1, email: "user1@example.com", subscribedOn: "2025-06-01" },
  { id: 2, email: "user2@example.com", subscribedOn: "2025-06-15" },
];

export default function NewsletterManager() {
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleAdd = () => { setEditing(null); setModalOpen(true); };
  const handleEdit = (subscriber) => { setEditing(subscriber); setModalOpen(true); };
  const handleDelete = (id) => { setSubscribers(subscribers.filter(n => n.id !== id)); };
  const handleSubmit = (data) => {
    if (editing) {
      setSubscribers(subscribers.map(n => n.id === editing.id ? { ...n, ...data } : n));
    } else {
      setSubscribers([...subscribers, { ...data, id: Date.now() }]);
    }
    setModalOpen(false); setEditing(null);
  };

  return (
    <div>
      <button
        onClick={handleAdd}
        className="mb-4 bg-sky-400 text-white px-4 py-2 rounded font-semibold shadow hover:bg-sky-500 transition"
      >
        + Add Subscriber
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left bg-white rounded-xl shadow border border-sky-400/10">
          <thead>
            <tr>
              <th className="py-2 px-3 font-semibold text-sky-600">Email</th>
              <th className="py-2 px-3 font-semibold text-sky-600">Subscribed On</th>
              <th className="py-2 px-3 font-semibold text-sky-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-gray-400 py-4 text-center">No newsletter subscribers found.</td>
              </tr>
            ) : (
              subscribers.map((n) => (
                <tr key={n.id} className="border-t hover:bg-sky-50">
                  <td className="py-2 px-3">{n.email}</td>
                  <td className="py-2 px-3">{n.subscribedOn}</td>
                  <td className="py-2 px-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(n)}
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                    >Edit</button>
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >Delete</button>
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
