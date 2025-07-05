'use client';

import NotificationBadge from "./NotificationBadge";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const toggleDropdown = () => setShowMenu((prev) => !prev);

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow flex items-center justify-between px-8 py-4 border-b">
     
      <h1 className="text-2xl font-bold text-[#695aa6] tracking-tight">
        Admin Dashboard
      </h1>

     
      <div className="flex items-center gap-6 relative" ref={menuRef}>
        <NotificationBadge />

    
        <div
          onClick={toggleDropdown}
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition"
        >
          <span className="text-xl">👤</span>
          <span className="text-[#695aa6] font-medium"> Admin Name</span>
        </div>

        {showMenu && (
          <div className="absolute right-0 top-16 bg-white border border-gray-200 rounded shadow-md z-50 w-40">
            <ul className="flex flex-col py-2 text-sm text-gray-700">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                View Profile
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
