'use client';
import React, { useEffect, useState } from 'react';

function SingleStatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 sm:p-6 flex items-center justify-between border border-gray-100 hover:shadow-md transition-all duration-200">
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-2xl font-bold text-[#695aa6] mt-1">{value}</div>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  );
}

export default function StatCard() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stats`);
        const result = await res.json();
        const data = result.data;

        setStats([
          { label: "Total Users", value: data.totalUsers, icon: "👥" },
          { label: "Total Service Providers", value: data.totalProviders, icon: "🛠️" },
          { label: "Total Services", value: data.totalServices, icon: "📦" },
          { label: "Pending Services", value: data.pendingServices, icon: "⏳" },
        
          { label: " Success Stories", value: data.approvedStories, icon: "🌟" },
         
          { label: "Total Blogs", value: data.totalBlogs, icon: "📝" },
          { label: "Total Newsletters", value: data.totalNewsletters, icon: "📬" },
        ]);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2 sm:px-4">
      {stats.map((stat) => (
        <SingleStatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
