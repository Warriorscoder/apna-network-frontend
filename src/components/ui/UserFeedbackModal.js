"use client";
import React, { useState } from "react";
import { Star, X } from "lucide-react";
import axios from "axios";

const TAG_OPTIONS = ["on-time", "polite", "skilled", "clean", "friendly", "efficient"];

const UserFeedbackModal = ({ isOpen, onClose, onSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [tags, setTags] = useState([]);
  const [recommend, setRecommend] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!rating) return alert("Rating is required.");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8000/api/feedback/user",
        {
          rating,
          feedbackText,
          tags,
          recommend,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Feedback submitted:", response.data);
      onSubmitted?.(response.data);
      setRating(0);
      setFeedbackText("");
      setTags([]);
      setRecommend(null);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to submit feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold text-[#695aa6] mb-4">
          Share your feedback
        </h2>

        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <button
              key={i}
              onClick={() => setRating(i + 1)}
              className="focus:outline-none"
            >
              <Star
                className={`w-6 h-6 ${
                  i < rating ? "text-yellow-400" : "text-gray-300"
                }`}
                fill={i < rating ? "#facc15" : "none"}
              />
            </button>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          rows="4"
          placeholder="Write your feedback here..."
          className="w-full border border-gray-300 rounded-lg p-2 resize-none focus:outline-[#695aa6] text-sm mb-4"
        />

        {/* Tags */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-1">Describe your experience:</p>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  tags.includes(tag)
                    ? "bg-[#695aa6] text-white border-[#695aa6]"
                    : "bg-gray-100 text-gray-800 border-gray-300"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Recommend */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-1">Would you recommend us?</p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="recommend"
                checked={recommend === true}
                onChange={() => setRecommend(true)}
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="recommend"
                checked={recommend === false}
                onChange={() => setRecommend(false)}
              />
              <span>No</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm bg-[#695aa6] text-white rounded-md hover:bg-[#5a4d8a]"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFeedbackModal;
