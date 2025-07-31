'use client';

import { useEffect, useState } from 'react';

export default function ActivityLog() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/activity`);

        if (!res.ok) {
          throw new Error('Failed to fetch activity log');
        }

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
    return <div className="text-center text-gray-500 py-4">Loading activity...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  }

  if (!activity.length) {
    return <div className="text-gray-400 text-center py-4">No activity yet.</div>;
  }

  return (
    <ul className="divide-y divide-gray-200">
      {activity.map((a, i) => (
        <li key={i} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <span className="text-gray-700 text-sm">{a.message}</span>
          <span className="text-xs text-gray-500 sm:text-right">{new Date(a.date).toLocaleString()}</span>
        </li>
      ))}
    </ul>
  );
}
