'use client';

export default function UsersTable({ users = [] }) {
  if (!users.length) return <div className="text-gray-400 text-center py-4">No users found.</div>;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left bg-white rounded-xl shadow border border-[#695aa6]/10">
        <thead>
          <tr>
            <th className="py-2 px-3 font-semibold text-[#695aa6]">Name</th>
            <th className="py-2 px-3 font-semibold text-[#695aa6]">Email</th>
            <th className="py-2 px-3 font-semibold text-[#695aa6]">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t hover:bg-[#f3f0fa]">
              <td className="py-2 px-3">{u.name}</td>
              <td className="py-2 px-3">{u.email}</td>
              <td className="py-2 px-3">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
