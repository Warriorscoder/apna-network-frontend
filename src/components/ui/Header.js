'use client';

export default function Header() {
  return (
    <header className="bg-white shadow flex items-center justify-between px-8 py-4 border-b">
      <h1 className="text-2xl font-bold text-[#695aa6] tracking-tight">Admin Dashboard</h1>
      <span className="bg-[#695aa6] text-white px-4 py-2 rounded-lg font-semibold">Admin</span>
    </header>
  );
}
