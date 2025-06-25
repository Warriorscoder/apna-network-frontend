"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function ServiceTakerSignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    address: "",

  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
  const newErrors = {};
  if (!formData.name.trim()) newErrors.name = "Name is required";
  if (!formData.gender.trim()) newErrors.gender = "Gender is required";
  if (!formData.address.trim()) newErrors.address = "Address is required";
  // Add validation for more fields if needed
  return newErrors;
};

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Form submission started");

  const validationErrors = validate();
  setErrors(validationErrors);
  console.log("Validation Errors:", validationErrors);

  if (Object.keys(validationErrors).length > 0) {
    console.log("Form validation failed. Aborting submission.");
    return;
  }

  setIsSubmitting(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    console.log("API URL:", apiUrl);
    console.log("Form Data being submitted:", formData);

    const res = await axios.post(`${apiUrl}/users/create`, formData);
    console.log("Server Response:", res);

    if (res.status === 201 || res.status === 200) {
      console.log("Registration successful!");
      router.push("/dashboard/user-dashboard");
    } else {
      console.log("Unexpected server response status:", res.status);
      console.log("Server message:", res.data.message || "Registration failed");
    }

  } catch (err) {
    console.error("Error occurred during form submission:", err);

    if (err.response) {
      console.log("Server responded with error:", err.response.data.message);
    } else if (err.request) {
      console.log("No response received from server. Possible network error.");
    } else {
      console.log("Client-side error:", err.message);
    }
  } finally {
    setIsSubmitting(false);
    console.log("Form submission ended");
  }
};


  const renderError = (field) =>
    errors[field] ? (
      <p className="text-red-600 text-xs mt-1">{errors[field]}</p>
    ) : null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-t from-white to-[rgba(105,90,166,0.99)]">
      <div className="p-8 rounded-xl w-full max-w-[32rem] bg-white/95 backdrop-blur-sm shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#695aa6]">
          Sign-Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            {renderError("name")}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {renderError("gender")}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            {renderError("address")}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-2 rounded-[6px] text-white font-semibold transition-colors"
            style={{
              background: "#695aa6",
              boxShadow: "0 2px 8px rgba(90, 74, 138, 0.12)",
            }}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>

          <div className="mt-6 text-center text-sm text-gray-700">
            Already have an account?{' '}
              <button
                className="text-[#695aa6] hover:underline font-medium"
              >
            <Link href={'/login'}>
                Click here to Login
            </Link>
              </button>
          </div>
        </form>

      </div>
    </div>
  );
}
