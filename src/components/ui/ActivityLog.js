'use client';

import { useEffect, useState } from 'react';
import { User, Briefcase, Clock } from 'lucide-react'; // icons
import { motion } from 'framer-motion'; // for smooth animations

export default function ActivityLog() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/activity`);

        if (!res.ok) throw new Error('Failed to fetch activity log');

        const data = await res.json();
        setActivity(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500 py-6 animate-pulse">Loading activity...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-6 font-medium">⚠️ Error: {error}</div>;
  }

  if (!activity.length) {
    return <div className="text-gray-400 text-center py-6 italic">No activity yet.</div>;
  }

  // helper to detect type
  const getLogStyle = (message) => {
    if (message.toLowerCase().includes("provider signed up")) {
      return {
        icon: <Briefcase className="w-5 h-5 text-green-500" />,
        color: "text-green-700",
        bg: "bg-green-50",
      };
    }
    if (message.toLowerCase().includes("user signed up")) {
      return {
        icon: <User className="w-5 h-5 text-blue-500" />,
        color: "text-blue-700",
        bg: "bg-blue-50",
      };
    }
    return {
      icon: <Clock className="w-5 h-5 text-gray-400" />,
      color: "text-gray-600",
      bg: "bg-gray-50",
    };
  };

  return (
    <ul className="space-y-3">
      {activity.map((a, i) => {
        const { icon, color, bg } = getLogStyle(a.message);
        return (
          <motion.li
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className={`p-4 rounded-xl shadow-sm border ${bg} flex items-center justify-between`}
          >
            <span className="flex items-center gap-3 text-sm">
              <span className="p-2 rounded-full bg-white shadow">{icon}</span>
              <span className={`font-medium ${color}`}>{a.message}</span>
            </span>
            <span className="text-xs text-gray-500 sm:text-right whitespace-nowrap">
              {new Date(a.date).toLocaleString()}
            </span>
          </motion.li>
        );
      })}
    </ul>
  );
}
