'use client';
import React, { useEffect, useState } from "react";

// Simulated API fetch functions (replace with real API calls)
async function fetchBlogs() {
  // Replace with fetch('/api/blogs') or your data fetching logic
  return [
    { id: 1, title: "How to Find the Best Plumber", author: "Admin", date: "2025-06-25", featured: true },
    { id: 2, title: "Village Success in Handicrafts", author: "Admin", date: "2025-06-22", featured: false },
  ];
}

async function fetchSuccessStories() {
  // Replace with fetch('/api/success-stories') or your data fetching logic
  return [
    { id: 1, title: "Ravi's Success", user: "Ravi Kumar", date: "2025-06-20", featured: true },
    { id: 2, title: "Sita's Journey", user: "Sita Devi", date: "2025-06-18", featured: false },
  ];
}

export default function FeaturedContentPage() {
  const [blogs, setBlogs] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [blogsData, storiesData] = await Promise.all([fetchBlogs(), fetchSuccessStories()]);
      setBlogs(blogsData);
      setStories(storiesData);
      setLoading(false);
    }
    loadData();
  }, []);

  // Get all featured blogs and stories
  const featuredBlogs = blogs.filter(b => b.featured);
  const featuredStories = stories.filter(s => s.featured);

  if (loading) return <div className="text-center py-10">Loading featured content...</div>;

  return (
    <main className="max-w-3xl mx-auto py-10 px-4 space-y-12">
      {/* Featured Blogs */}
      {featuredBlogs.length > 0 ? (
        <section>
          <h2 className="text-3xl font-bold text-[#695aa6] mb-6">Featured Blogs</h2>
          {featuredBlogs.map(blog => (
            <article key={blog.id} className="mb-6 p-6 bg-white rounded-xl shadow border-l-4 border-[#695aa6]">
              <h3 className="text-xl font-semibold">{blog.title}</h3>
              <p className="text-gray-600 mb-1">By {blog.author} on {blog.date}</p>
              {/* Add blog summary or content preview here if available */}
            </article>
          ))}
        </section>
      ) : (
        <p className="text-gray-400">No featured blogs at the moment.</p>
      )}

      {/* Featured Success Stories */}
      {featuredStories.length > 0 ? (
        <section>
          <h2 className="text-3xl font-bold text-yellow-600 mb-6">Featured Success Stories</h2>
          {featuredStories.map(story => (
            <article key={story.id} className="mb-6 p-6 bg-white rounded-xl shadow border-l-4 border-yellow-400">
              <h3 className="text-xl font-semibold">{story.title}</h3>
              <p className="text-gray-600 mb-1">By {story.user} on {story.date}</p>
              {/* Add story summary or content preview here if available */}
            </article>
          ))}
        </section>
      ) : (
        <p className="text-gray-400">No featured success stories at the moment.</p>
      )}
    </main>
  );
}
