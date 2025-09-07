"use client";
import NotificationBadge from "./NotificationBadge";
import Link from "next/link";
import { useEffect, useState, useRef} from "react";
import { Bell, User, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header({ onToggleSidebar, onNavigate }) {
  const [showMenu, setShowMenu] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const menuRef = useRef(null);
  const router = useRouter();
  const toggleDropdown = () => setShowMenu((prev) => !prev);
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      try {
        const adminData = JSON.parse(storedAdmin);
        setAdminName(adminData?.name || "Admin");
      } catch {
        setAdminName("Admin");
      }
    }
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("admin");
    router.push("/");
  };
  
   const handleViewProfile = () => {
    router.push("/profile"); // Change route if needed
  };
  const navLinks = [
  { id: "home", name: "Home", path: "/" },
  { id: "about", name: "About", path: "/about" },
  { id: "services", name: "Services", path: "/services" },
  { id: "contact", name: "Contact", path: "/contact" },
];


  {/* Nav Links */}
        <ul className="hidden md:flex space-x-8 font-semibold">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/services">Services</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-purple-200 to-purple-300 shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Left - Logo */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-purple-900">Apna Network</h1>
        </div>

        {/* Center - Dynamic Nav Links */}
        <nav className="hidden md:flex gap-6 text-purple-900 font-medium">
          {navLinks.map((link) => (
            <span
              key={link.id}
              className="cursor-pointer hover:text-purple-700"
              onClick={() => {
                if (onNavigate) {
                  onNavigate(link.id); // Sidebar highlight + internal scroll if same page
                }
                router.push(link.path); // Always change page/URL
              }}
            >
              {link.name}
            </span>
          ))}
        </nav>

        {/* Right - Notifications & Profile */}
        <div className="flex items-center gap-6">
          <button className="relative hover:text-purple-700">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 bg-white text-purple-900 px-3 py-2 rounded-full shadow hover:shadow-md">
              <User className="w-5 h-5" />
              {adminName}
            </button>

            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <ul className="text-sm text-gray-700">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleViewProfile}
                >
                 View Profile
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
