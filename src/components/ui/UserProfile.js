'use client';

export default function UserProfile() {
  return (
    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap max-w-full">
      <span className="font-medium text-gray-800 truncate max-w-[100px] sm:max-w-none">
        Admin
      </span>
      <div
        className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center"
        aria-label="User avatar"
      >
        <svg
          className="w-4 h-4 text-[#695aa6]"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
        </svg>
      </div>
    </div>
  );
}
