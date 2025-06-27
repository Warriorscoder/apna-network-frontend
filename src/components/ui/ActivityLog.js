'use client';

export default function ActivityLog({ activity = [] }) {
  if (!activity.length) return <div className="text-gray-400 text-center py-4">No activity yet.</div>;
  return (
    <ul className="divide-y divide-gray-200">
      {activity.map((a, i) => (
        <li key={i} className="py-2 flex items-center justify-between">
          <span className="text-gray-700">{a.message}</span>
          <span className="text-xs text-gray-400">{a.date}</span>
        </li>
      ))}
    </ul>
  );
}
