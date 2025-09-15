"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/app/context/Authcontext"; // ✅ use central auth

// Simple local-only modal (no backend connection)
function SuccessStoryModal({ open, onClose, onSubmitted }) {
  const [form, setForm] = useState({
    title: "",
    date: new Date().toISOString().slice(0, 10),
    content: "",
    tags: "",
    images: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and Story are required.");
      return;
    }
    setLoading(true);
    await new Promise((res) => setTimeout(res, 600)); // simulate
    console.log("Simulated Success Story payload:", {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      images: form.images
        .split(",")
        .map((u) => u.trim())
        .filter(Boolean),
    });
    setLoading(false);
    onSubmitted && onSubmitted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100 text-gray-500"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-semibold mb-4 text-[#695aa6]">
          Submit Success Story
        </h3>
        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent text-sm"
              placeholder="Eg. How I grew my local service"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date *</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Story *</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent text-sm resize-y"
              placeholder="Share your journey, challenges, impact, growth..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Tags (comma separated)
            </label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent text-sm"
              placeholder="growth, electrician, rural"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Image URLs (comma separated)
            </label>
            <input
              name="images"
              value={form.images}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent text-sm"
              placeholder="https://..., https://..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg border hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold rounded-lg text-white bg-[#695aa6] hover:bg-[#5a4d8a] disabled:opacity-60"
            >
              {loading ? "Saving..." : "Submit"}
            </button>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            This is a preview submission (not yet sent to backend).
          </p>
        </form>
      </div>
    </div>
  );
}

const Testimonial = () => {
  const { authInitialized, isAuthenticated, getUserRole } = useAuth();
  const [isProvider, setIsProvider] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Determine provider role (fallback to localStorage if needed)
  useEffect(() => {
    if (!authInitialized) return;
    let role = getUserRole?.();
    if (!role && typeof window !== "undefined") {
      role = (localStorage.getItem("role") || "").toLowerCase();
    }
    setIsProvider(isAuthenticated() && role === "provider");
  }, [authInitialized, isAuthenticated, getUserRole]);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Bareilly, UP",
      role: "Electrician",
      text: "Apna Network transformed my business. I now serve 5 villages and my income has tripled!",
    },
    {
      name: "Priya Sharma",
      location: "Sitapur, UP",
      role: "Seamstress",
      text: "Through this platform, I found consistent work and learned new skills. My family's life has improved significantly.",
    },
    {
      name: "Mohammad Ali",
      location: "Hardoi, UP",
      role: "Farmer",
      text: "The agricultural consultancy services helped me increase my crop yield by 40%. Truly game-changing!",
    },
  ];

  return (
    <section
      className="py-12 sm:py-16"
      style={{
        backgroundImage:
          "linear-gradient(to top, #fff 0%, rgba(105, 90, 166, 0.35) 99%, rgba(105, 90, 166, 0.5) 100%)",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4"
            style={{ color: "#695aa6" }}
          >
            Success Stories
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600">
            Real people, real impact, real change
          </p>
          {isProvider && (
            <div className="mt-5">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#695aa6] text-white text-sm font-semibold shadow hover:bg-[#5a4d8a] transition"
              >
                <span>➕</span> Submit Your Success Story
              </button>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          <div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border"
            style={{ borderColor: "#695aa6" }}
          >
            <div className="text-center">
              <blockquote className="text-base sm:text-lg md:text-xl text-gray-700 mb-4 sm:mb-6 italic leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              <div>
                <div className="font-semibold text-gray-800 text-base sm:text-lg">
                  {testimonials[currentTestimonial].name}
                </div>
                <div
                  className="font-medium text-sm sm:text-base"
                  style={{ color: "#695aa6" }}
                >
                  {testimonials[currentTestimonial].role}
                </div>
                <div className="text-gray-500 text-xs sm:text-sm">
                  {testimonials[currentTestimonial].location}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors duration-300 ${
                  index === currentTestimonial
                    ? "hover:opacity-80"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                style={{
                  backgroundColor:
                    index === currentTestimonial ? "#695aa6" : undefined,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <SuccessStoryModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmitted={() => {
          console.log("Local success story simulated.");
        }}
      />
    </section>
  );
};

export default Testimonial;
