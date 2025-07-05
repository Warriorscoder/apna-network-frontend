"use client";
import React, { useEffect, useState, useRef } from "react";

const icons = {
  newsletter: (
    <svg className="w-8 h-8 text-[#38bdf8]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 4H8m8-8H8m12 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h8l6 6z" />
    </svg>
  ),
  blog: (
    <svg className="w-8 h-8 text-[#695aa6]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m-4 4h10M5 6v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2 2H7a2 2 0 00-2 2z" />
    </svg>
  ),
  story: (
    <svg className="w-8 h-8 text-[#eab308]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.75l-6.172 3.245 1.179-6.873L2 9.635l6.908-1.004L12 2.5l3.092 6.131L22 9.635l-5.007 4.487 1.179 6.873z" />
    </svg>
  ),
};

const descriptions = {
  blog: "Share a new blog post with your users.",
  story: "Highlight a user's journey or achievement.",
  newsletter: "Add a new newsletter issue.",
};

export default function ContentModal({ open, onClose, onSubmit, type, initialData }) {
  const defaultForm = {
    image_url: "",
    category: "",
    title: "",
    content: "",
    date: "",
    site_url: "",
    author: "",
    tags: "",
    images: "",
    message: "",
    name: "",
    service: "",
    state: "",
    city: "",
    user_id: "",
    provider_id: "",
  };

  const [form, setForm] = useState(defaultForm);
  const [added, setAdded] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    let data = { ...defaultForm };

    if (type === "newsletter") {
      data = {
        ...data,
        image_url: initialData?.image_url || "",
        category: initialData?.category || "",
        title: initialData?.title || "",
        content: initialData?.content || "",
        date: initialData?.date ? new Date(initialData.date).toISOString().slice(0, 10) : "",
        site_url: initialData?.site_url || "",
      };
    } else if (type === "blog") {
      data = {
        ...data,
        title: initialData?.title || "",
        image_url: initialData?.image_url || "",
        category: initialData?.category || "",
        content: initialData?.content || "",
        author: initialData?.author || "",
        date: initialData?.date ? new Date(initialData.date).toISOString().slice(0, 10) : "",
        tags: initialData?.tags?.join(", ") || "",
        images: initialData?.images?.join(", ") || "",
      };
    } else if (type === "story") {
      data = {
        ...data,
        message: initialData?.content || "",
        name: initialData?.title?.split(" - ")[0] || "",
        service: initialData?.title?.split(" - ")[1] || "",
        state: initialData?.state || "",
        city: initialData?.city || "",
        user_id: initialData?.user || "",
        provider_id: initialData?.provider || "",
        date: initialData?.date ? new Date(initialData.date).toISOString().slice(0, 10) : "",
        tags: initialData?.tags?.join(", ") || "",
        images: initialData?.images?.join(", ") || "",
      };
    }

    setForm(data);
    setAdded(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [open, initialData, type]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value ?? "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAdded(true);
    setTimeout(() => {
      if (type === "newsletter") {
        onSubmit({
          image_url: form.image_url,
          category: form.category,
          title: form.title,
          content: form.content,
          date: form.date ? new Date(form.date) : null,
          site_url: form.site_url,
        });
      } else if (type === "blog") {
        onSubmit({
          title: form.title,
          image_url: form.image_url,
          category: form.category,
          content: form.content,
          author: form.author || "Admin",
          date: form.date ? new Date(form.date) : new Date(),
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          images: form.images.split(",").map((i) => i.trim()).filter(Boolean),
        });
      } else if (type === "story") {
        onSubmit({
          title: `${form.name} - ${form.service}`,
          content: form.message,
          user: form.user_id,       
          provider: form.provider_id, 
          date: form.date ? new Date(form.date) : null,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          images: form.images.split(",").map((i) => i.trim()).filter(Boolean),
        });
      }

      setAdded(false);
      onClose();
    }, 900);
  };

  const fields = {
    story: (
      <>
        <input ref={inputRef} name="name" placeholder="Name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-yellow-400/30 rounded-lg outline-none focus:border-yellow-400 text-lg" />
        <textarea name="message" placeholder="Message" value={form.message} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-yellow-400/30 rounded-lg outline-none focus:border-yellow-400 text-lg min-h-[100px]" />
        <input name="service" placeholder="Service" value={form.service} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-yellow-400/30 rounded-lg outline-none focus:border-yellow-400 text-lg" />
        <div className="grid grid-cols-2 gap-4">
          <input name="state" placeholder="State" value={form.state} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-yellow-400/30 rounded-lg outline-none focus:border-yellow-400 text-lg" />
          <input name="city" placeholder="City" value={form.city} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-yellow-400/30 rounded-lg outline-none focus:border-yellow-400 text-lg" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input name="user_id" placeholder="User ID" value={form.user_id} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-yellow-400/30 rounded-lg outline-none focus:border-yellow-400 text-lg" />
          <input name="provider_id" placeholder="Provider ID" value={form.provider_id} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-yellow-400/30 rounded-lg outline-none focus:border-yellow-400 text-lg" />
        </div>
        <input name="date" type="date" value={form.date} onChange={handleChange} required className="w-full px-4 py-3 border-2 border-yellow-400/30 rounded-lg outline-none focus:border-yellow-400 text-lg" />
      </>
    ),
    newsletter: (
      <>
        <input
          ref={inputRef}
          name="image_url"
          placeholder="Image URL"
          value={form.image_url}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border-2 border-sky-400/30 rounded-lg outline-none focus:border-sky-400 text-lg"
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border-2 border-sky-400/30 rounded-lg outline-none focus:border-sky-400 text-lg"
        />
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border-2 border-sky-400/30 rounded-lg outline-none focus:border-sky-400 text-lg"
        />
        <textarea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border-2 border-sky-400/30 rounded-lg outline-none focus:border-sky-400 text-lg min-h-[100px]"
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border-2 border-sky-400/30 rounded-lg outline-none focus:border-sky-400 text-lg"
        />
        <input
          name="site_url"
          placeholder="Site URL"
          value={form.site_url}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border-2 border-sky-400/30 rounded-lg outline-none focus:border-sky-400 text-lg"
        />
      </>
    ),
    blog: (
      <>
        <input
          ref={inputRef}
          name="title"
          placeholder="Blog Title"
          value={form.title}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-[#695aa6]/30 rounded-lg outline-none focus:border-[#695aa6] text-lg"
          required
          maxLength={60}
        />
        <input
          name="image_url"
          placeholder="Image URL"
          value={form.image_url}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-[#695aa6]/30 rounded-lg outline-none focus:border-[#695aa6] text-lg"
          required
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-[#695aa6]/30 rounded-lg outline-none focus:border-[#695aa6] text-lg"
          required
        />
        <textarea
          name="content"
          placeholder="Blog Content"
          value={form.content}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-[#695aa6]/30 rounded-lg outline-none focus:border-[#695aa6] text-lg min-h-[100px]"
          required
          maxLength={4000}
        />
        <input
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-[#695aa6]/30 rounded-lg outline-none focus:border-[#695aa6] text-lg"
          maxLength={30}
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-[#695aa6]/30 rounded-lg outline-none focus:border-[#695aa6] text-lg"
        />
        <input
          name="tags"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-[#695aa6]/30 rounded-lg outline-none focus:border-[#695aa6] text-lg"
        />
        <input
          name="images"
          placeholder="Image URLs (comma separated)"
          value={form.images}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-[#695aa6]/30 rounded-lg outline-none focus:border-[#695aa6] text-lg"
        />
      </>
    ),
   
    
  };

 return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#695aa6] focus:outline-none text-2xl"
        >
          &times;
        </button>
        <div className="flex flex-col items-center mb-4">
          <div className="rounded-full p-4 mb-2 bg-gradient-to-tr from-white to-[#f3f0fa] shadow-inner">
            {icons[type]}
          </div>
          <h2 className="text-2xl font-bold text-[#695aa6] mb-1">
            {type === "story"
              ? initialData
                ? "Edit Success Story"
                : "Add Success Story"
              : type === "blog"
              ? "Add New Blog"
              : "Add Newsletter"}
          </h2>
          <p className="text-gray-500 text-sm">{descriptions[type]}</p>
        </div>
        {added ? (
          <div className="flex flex-col items-center py-8 animate-fadeIn">
            <svg className="w-16 h-16 text-green-500 mb-2 animate-bounceIn" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 13l3 3 7-7" />
            </svg>
            <div className="text-green-600 font-semibold text-lg">Updated!</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {fields[type]}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">
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
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-bounceIn {
          animation: bounceIn 0.6s;
        }
        @keyframes bounceIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
