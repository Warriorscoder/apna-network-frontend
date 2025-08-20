"use client";
import React, { useState } from "react";
import { X, Star } from "lucide-react";

const FeedbackModal = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleRatingClick = (index) => {
    setRating(index + 1);
  };

  const handleSubmit = () => {
    if (!rating || !message.trim()) {
      alert("Please provide both rating and feedback message.");
      return;
    }
    onSubmit({ rating, message });
    setRating(0);
    setMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold text-[#695aa6] mb-4">
          We value your feedback!
        </h2>

        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <button
              key={i}
              onClick={() => handleRatingClick(i)}
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

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="4"
          placeholder="Write your feedback here..."
          className="w-full border border-gray-300 rounded-lg p-2 resize-none focus:outline-[#695aa6] text-sm"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-[#695aa6] text-white rounded-md hover:bg-[#5a4d8a]"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
