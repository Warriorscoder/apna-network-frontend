'use client';

import { useState, useEffect } from 'react';

export default function NotificationBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/count`)
      .then((res) => res.json())
      .then((data) => setCount(data.count || 0))
      .catch(() => setCount(0));
  }, []);

  return (
    <div className="relative">
      <button
        aria-label="Notifications"
        className="p-2 rounded-full hover:bg-purple-50 transition-colors"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-[#695aa6]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full min-w-[20px] h-5 text-[10px] sm:text-xs px-1 flex items-center justify-center leading-none">
            {count}
          </span>
        )}
      </button>
    </div>
  );
}
