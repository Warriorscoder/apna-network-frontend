'use client';

export default function CategoriesTable({ categories = [] }) {
  if (!categories.length) return <div className="text-gray-400 text-center py-4">No categories found.</div>;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left bg-white rounded-xl shadow border border-[#695aa6]/10">
        <thead>
          <tr>
            <th className="py-2 px-3 font-semibold text-[#695aa6]">Name</th>
            <th className="py-2 px-3 font-semibold text-[#695aa6]">Description</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="border-t hover:bg-[#f3f0fa]">
              <td className="py-2 px-3">{c.name}</td>
              <td className="py-2 px-3">{c.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
