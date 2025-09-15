'use client';

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Image from "next/image";
import { useToast } from "@/components/ui/ToastProvider";
import { services as defaultServices } from "@/data/services"; // ✅ default (non-deletable) categories source

// Inline SVG data URI placeholder
const PLACEHOLDER_DATA_URI =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
      <rect width="100%" height="100%" rx="8" fill="#ede9fe"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-size="12" fill="#695aa6" font-family="Arial, sans-serif">No Img</text>
    </svg>`
  );

// Build immutable default categories from data/services.js
const buildDefaultCategories = () =>
  (defaultServices || []).map(s => ({
    _id: `default-${s.serviceKey}`,          // synthetic id (stable)
    title: s.title,
    subtitle: s.subtitle,
    image: s.image,
    key: s.serviceKey,
    isProtected: true,
    source: "default"
  }));

// Validate image src
const getSafeImageSrc = (raw) => {
  if (!raw || typeof raw !== "string") return PLACEHOLDER_DATA_URI;
  const t = raw.trim();
  if (t.startsWith("http://") || t.startsWith("https://") || t.startsWith("/") || t.startsWith("data:"))
    return t;
  return PLACEHOLDER_DATA_URI;
};

function CategoryImage({ cat }) {
  const src = getSafeImageSrc(cat.image || cat.icon || cat.logo);
  return (
    <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
      <Image
        src={src}
        alt={cat.title || cat.name || "Category"}
        fill
        sizes="40px"
        className="object-cover text-[10px]"
        onError={(e) => {
          const container = e.currentTarget.parentElement;
          if (container) {
            container.innerHTML =
              '<span class="text-[10px] text-[#695aa6] font-medium">No Img</span>';
          }
        }}
      />
    </div>
  );
}

export default function CategoriesTable() {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Full list shown in table (default + backend non-default)
  const [categories, setCategories] = useState([]);

  // Delete modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Build defaults once
  const defaultCategories = useMemo(buildDefaultCategories, []);
  const defaultKeysSet = useMemo(
    () => new Set(defaultCategories.map(c => c.key)),
    [defaultCategories]
  );

  // Fetch backend categories (only admin-added / non-default)
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`);
        const backendRaw = res.data?.data || [];

        // Keep only backend categories whose key is NOT in default keys
        const custom = backendRaw
          .filter(c => !defaultKeysSet.has(c.key))
          .map(c => ({
            ...c,
            isProtected: !!c.isDefault, // backend may mark some as default
            source: c.isDefault ? "default-backend" : "backend"
          }));

        // Merge: defaults always first
        setCategories([...defaultCategories, ...custom]);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Unable to load categories.");
        // Still show defaults if backend fails
        setCategories(defaultCategories);
      } finally {
        setLoading(false);
      }
    })();
  }, [defaultCategories, defaultKeysSet]);

  const openConfirm = (cat) => {
    if (cat.isProtected || cat.source === "default" || cat.source === "default-backend") {
      showToast("Default categories cannot be removed", "error");
      return;
    }
    setSelectedCategory(cat);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setSelectedCategory(null);
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    // Still block default / protected categories
    if (
      selectedCategory.isProtected ||
      selectedCategory.source === "default" ||
      selectedCategory.source === "default-backend"
    ) {
      showToast("Default categories cannot be deleted", "error");
      closeConfirm();
      return;
    }

    setDeleting(true);

    // Frontend-only removal (no backend call)
    setTimeout(() => {
      setCategories(prev => prev.filter(c => c._id !== selectedCategory._id));
      showToast("Category removed locally (not persisted)", "success");
      setDeleting(false);
      closeConfirm();
    }, 250); // tiny delay to show loading state
  };

  if (loading)
    return <div className="text-gray-500 text-center py-4">Loading categories...</div>;
  if (error)
    return <div className="text-red-500 text-center py-4">{error}</div>;
  if (!categories.length)
    return <div className="text-gray-400 text-center py-4">No categories found.</div>;

  return (
    <div className="w-full">
      {/* Mobile */}
      <div className="sm:hidden space-y-3">
        {categories.map(cat => (
          <div key={cat._id} className="bg-white border rounded-lg p-4 text-xs shadow-sm">
            <div className="flex items-center gap-3">
              <CategoryImage cat={cat} />
              <div className="flex-1">
                <h3 className="font-semibold text-[#695aa6]">{cat.title}</h3>
                <p className="text-gray-500 text-[11px]">{cat.subtitle}</p>
              </div>
              {(cat.isProtected || cat.source?.startsWith("default")) && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#695aa6]/10 text-[#695aa6] font-semibold">
                  Default
                </span>
              )}
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-gray-500 text-[11px]">{cat.key}</span>
              <button
                onClick={() => openConfirm(cat)}
                disabled={cat.isProtected || cat.source?.startsWith("default")}
                className={`text-[11px] px-2 py-1 rounded ${
                  cat.isProtected || cat.source?.startsWith("default")
                    ? "bg-gray-300 text-gray-600"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                {cat.isProtected || cat.source?.startsWith("default") ? "Locked" : "Remove"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="overflow-x-auto hidden sm:block w-full max-w-full">
        <table className="min-w-full table-auto border border-gray-300 rounded-xl overflow-hidden text-sm">
          <thead className="bg-[#f9f7ff] sticky top-0 z-10 border-b border-gray-300">
            <tr>
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-[#695aa6]">Title</th>
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-[#695aa6]">Subtitle</th>
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-[#695aa6]">Image</th>
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-[#695aa6]">Key</th>
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold text-[#695aa6]">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr
                key={cat._id}
                className="even:bg-gray-50 hover:bg-[#f3f0fa] border-b border-gray-200"
              >
                <td className="px-3 py-2 sm:px-4">{cat.title}</td>
                <td className="px-3 py-2 sm:px-4">{cat.subtitle}</td>
                <td className="py-2 px-4">
                  <div className="flex items-center gap-3">
                    <CategoryImage cat={cat} />
                    <span className="font-medium text-gray-800 truncate max-w-[160px]">
                      {cat.title || cat.name || "Untitled"}
                    </span>
                    {(cat.isProtected || cat.source === "default" || cat.source === "default-backend") && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#695aa6]/10 text-[#695aa6] font-semibold">
                        Default
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 sm:px-4 text-gray-500 text-xs">{cat.key}</td>
                <td className="px-3 py-2 sm:px-4">
                  <button
                    onClick={() => openConfirm(cat)}
                    disabled={
                      deleting ||
                      cat.isProtected ||
                      cat.source === "default" ||
                      cat.source === "default-backend"
                    }
                    className={`px-3 py-1 rounded text-xs sm:text-sm transition ${
                      (cat.isProtected || cat.source === "default" || cat.source === "default-backend")
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                    title={
                      (cat.isProtected || cat.source === "default" || cat.source === "default-backend")
                        ? "Default category cannot be removed"
                        : "Remove category"
                    }
                  >
                    {(cat.isProtected || cat.source === "default" || cat.source === "default-backend")
                      ? "Locked"
                      : "Remove"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Delete Category
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-medium text-[#695aa6]">
                {selectedCategory.title}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeConfirm}
                className="px-4 py-2 text-sm rounded border hover:bg-gray-50"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
