'use client';
import React, { useEffect, useState, useRef } from "react";

// Icon SVGs for each type
const icons = {
  blog: (
    <svg className="w-8 h-8 text-[#695aa6]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m-4 4h10M5 6v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
    </svg>
  ),
  story: (
    <svg className="w-8 h-8 text-[#eab308]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.75l-6.172 3.245 1.179-6.873L2 9.635l6.908-1.004L12 2.5l3.092 6.131L22 9.635l-5.007 4.487 1.179 6.873z" />
    </svg>
  ),
  newsletter: (
    <svg className="w-8 h-8 text-[#38bdf8]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 4H8m8-8H8m12 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h8l6 6z" />
    </svg>
  ),
};

const titles = {
  blog: "Add New Blog",
  story: "Add Success Story",
  newsletter: "Add Newsletter Subscriber"
};

const descriptions = {
  blog: "Share a new blog post with your users.",
  story: "Highlight a user's journey or achievement.",
  newsletter: "Add a new subscriber to the newsletter."
};

export default function ContentModal({ open, onClose, onSubmit, type, initialData }) {
  const [form, setForm] = useState(initialData || {});
  const [added, setAdded] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setForm(initialData || {});
    setAdded(false);
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open, initialData]);

  if (!open) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setAdded(true);
    setTimeout(() => {
      onSubmit(form);
      setForm({});
      setAdded(false);
      onClose();
    }, 900);
  };

  // Success animation
  const SuccessIcon = (
    <svg className="w-16 h-16 text-green-500 mb-2 animate-bounceIn" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 13l3 3 7-7" />
    </svg>
  );

  // Fields for each type
  const fields = {
    blog: (
      <>
        <div className="relative">
          <input
            ref={inputRef}
            name="title"
            placeholder="Blog Title"
            value={form.title || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-[#695aa6]/30 rounded-lg outline-none focus:border-[#695aa6] transition-all shadow-sm focus:shadow-lg text-lg"
            required
            maxLength={60}
          />
        </div>
        <div className="relative">
          <input
            name="author"
            placeholder="Author"
            value={form.author || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-[#695aa6]/30 rounded-lg outline-none focus:border-[#695aa6] transition-all shadow-sm focus:shadow-lg text-lg"
            required
            maxLength={30}
          />
        </div>
        <div className="relative">
          <input
            name="date"
            type="date"
            value={form.date || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-[#695aa6]/30 rounded-lg outline-none focus:border-[#695aa6] transition-all shadow-sm focus:shadow-lg text-lg"
            required
          />
        </div>
      </>
    ),
    story: (
      <>
        <div className="relative">
          <input
            ref={inputRef}
            name="title"
            placeholder="Story Title"
            value={form.title || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-yellow-400/30 rounded-lg outline-none focus:border-yellow-400 transition-all shadow-sm focus:shadow-lg text-lg"
            required
            maxLength={60}
          />
        </div>
        <div className="relative">
          <input
            name="user"
            placeholder="User"
            value={form.user || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-yellow-400/30 rounded-lg outline-none focus:border-yellow-400 transition-all shadow-sm focus:shadow-lg text-lg"
            required
            maxLength={30}
          />
        </div>
        <div className="relative">
          <input
            name="date"
            type="date"
            value={form.date || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-yellow-400/30 rounded-lg outline-none focus:border-yellow-400 transition-all shadow-sm focus:shadow-lg text-lg"
            required
          />
        </div>
      </>
    ),
    newsletter: (
      <>
        <div className="relative">
          <input
            ref={inputRef}
            name="email"
            placeholder="Subscriber Email"
            value={form.email || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-sky-400/30 rounded-lg outline-none focus:border-sky-400 transition-all shadow-sm focus:shadow-lg text-lg"
            required
            type="email"
            maxLength={50}
          />
        </div>
        <div className="relative">
          <input
            name="subscribedOn"
            type="date"
            value={form.subscribedOn || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-sky-400/30 rounded-lg outline-none focus:border-sky-400 transition-all shadow-sm focus:shadow-lg text-lg"
            required
          />
        </div>
      </>
    ),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className={`bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#695aa6] focus:outline-none text-2xl"
          aria-label="Close"
        >&times;</button>
        {/* Icon and Title */}
        <div className="flex flex-col items-center mb-4">
          <div className="rounded-full p-4 mb-2 bg-gradient-to-tr from-white to-[#f3f0fa] shadow-inner">
            {icons[type]}
          </div>
          <h2 className="text-2xl font-bold text-[#695aa6] mb-1">{titles[type]}</h2>
          <p className="text-gray-500 text-sm">{descriptions[type]}</p>
        </div>
        {/* Success Animation */}
        {added ? (
          <div className="flex flex-col items-center py-8 animate-fadeIn">
            {SuccessIcon}
            <div className="text-green-600 font-semibold text-lg">Added!</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {fields[type]}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded text-white font-semibold shadow transition
                  ${type === "blog" ? "bg-[#695aa6] hover:bg-[#57468b]" : ""}
                  ${type === "story" ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900" : ""}
                  ${type === "newsletter" ? "bg-sky-400 hover:bg-sky-500" : ""}
                `}
              >
                {initialData ? "Update" : "Add"}
              </button>
            </div>
          </form>
        )}
      </div>
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px);}
          to { opacity: 1; transform: none;}
        }
        .animate-bounceIn {
          animation: bounceIn 0.6s;
        }
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0;}
          50% { transform: scale(1.05);}
          70% { transform: scale(0.95);}
          100% { transform: scale(1); opacity: 1;}
        }
      `}</style>
    </div>
  );
}
