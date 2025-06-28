'use client';

export default function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg p-6 flex flex-col items-start border border-[#695aa6]/10">
      <span className="text-3xl mb-2">{icon}</span>
      <div className="text-gray-500 font-medium">{label}</div>
      <div className="text-2xl font-bold text-[#695aa6]">{value}</div>
    </div>
  );
}
