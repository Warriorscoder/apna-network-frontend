'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CategoriesTable() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/categories");
        setCategories(response.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Unable to load categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <div className="text-gray-500 text-center py-4">Loading categories...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;
  if (!categories.length) return <div className="text-gray-400 text-center py-4">No categories found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-300 rounded-xl overflow-hidden text-sm">
        <thead className="bg-[#f9f7ff] sticky top-0 z-10 border-b border-gray-300">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-[#695aa6]">Name</th>
            <th className="px-4 py-3 text-left font-semibold text-[#695aa6]">Description</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr
              key={c._id}
              className="even:bg-gray-50 hover:bg-[#f3f0fa] border-b border-gray-200"
            >
              <td className="px-4 py-2">{c.name}</td>
              <td className="px-4 py-2">{c.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
