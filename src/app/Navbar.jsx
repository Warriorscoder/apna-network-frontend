'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const navLinks = [
  { href: '#', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#contact', label: 'Contact' },
];

const HamburgerIcon = ({ open }) => (
  <svg
    className="w-7 h-7 text-gray-800 transition-transform duration-200 ease-in-out"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    {open ? (
      <path d="M6 18L18 6M6 6l12 12" />
    ) : (
      <path d="M4 6h16M4 12h16m-7 6h7" />
    )}
  </svg>
);

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (href) => {
    setIsMobileMenuOpen(false);
    router.push(href);
  };

  const isActive = (href) => pathname === href;

  return (
    <header
      className={`border-b-1 fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ease-in-out 
      ${
        scrolled || isMobileMenuOpen
          ? 'bg-white backdrop-blur-lg shadow border-b border-gray-200'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <button
            onClick={() => handleNavigate('/')}
            className="text-4xl font-bold transition-transform hover:scale-105"
            style={{ 
              background: 'linear-gradient(to right, #695aa6, #5a4d8a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Apna Network
          </button>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-base font-semibold transition-all px-3 py-2 rounded-md 
                  ${
                    isActive(href)
                      ? 'border-transparent'
                      : 'text-gray-700 border-transparent hover:text-gray-900'
                  }`}
                style={isActive(href) ? {
                  color: '#695aa6',
                  backgroundColor: 'rgba(105, 90, 166, 0.1)',
                  borderColor: '#695aa6'
                } : {}}
                onMouseEnter={(e) => {
                  if (!isActive(href)) {
                    e.target.style.color = '#695aa6';
                    e.target.style.backgroundColor = 'rgba(105, 90, 166, 0.05)';
                    e.target.style.borderColor = '#695aa6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(href)) {
                    e.target.style.color = '#374151';
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.borderColor = 'transparent';
                  }
                }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/auth/login"
              className="text-base px-5 py-2 rounded-md font-semibold border transition-all hover:text-white"
              style={{ borderColor: '#695aa6', color: '#695aa6' }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#695aa6';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#695aa6';
              }}
            >
              Login
            </Link>
            <Link
              href="/auth/user-signup"
              className="text-base px-5 py-2 rounded-md font-semibold text-white transition-all transform hover:scale-105"
              style={{ 
                background: 'linear-gradient(to right, #695aa6, #5a4d8a)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(to right, #5a4d8a, #4a3f73)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(to right, #695aa6, #5a4d8a)';
              }}
            >
              Register
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-md transition"
              style={{
                '&:hover': {
                  backgroundColor: 'rgba(105, 90, 166, 0.1)'
                }
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(105, 90, 166, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
              aria-label="Toggle menu"
            >
              <HamburgerIcon open={isMobileMenuOpen} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-200">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map(({ href, label }) => (
              <button
                key={href}
                onClick={() => handleNavigate(href)}
                className={`block w-full text-left px-4 py-2 rounded-md text-lg font-semibold border-b-2 transition
                  ${
                    isActive(href)
                      ? 'text-gray-700 border-transparent'
                      : 'text-gray-700 border-transparent'
                  }`}
                style={isActive(href) ? {
                  backgroundColor: 'rgba(105, 90, 166, 0.1)',
                  color: '#695aa6',
                  borderColor: '#695aa6'
                } : {}}
                onMouseEnter={(e) => {
                  if (!isActive(href)) {
                    e.target.style.color = '#695aa6';
                    e.target.style.backgroundColor = 'rgba(105, 90, 166, 0.05)';
                    e.target.style.borderColor = '#695aa6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(href)) {
                    e.target.style.color = '#374151';
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.borderColor = 'transparent';
                  }
                }}
              >
                {label}
              </button>
            ))}
            <div className="border-t pt-3 space-y-2">
              <button
                onClick={() => handleNavigate('/auth/login')}
                className="w-full text-left px-4 py-2 rounded-md font-semibold text-lg transition"
                style={{ color: '#695aa6' }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(105, 90, 166, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                Login
              </button>
              <button
                onClick={() => handleNavigate('/auth/user-signup')}
                className="w-full text-left px-4 py-2 rounded-md font-semibold text-lg text-white"
                style={{ background: 'linear-gradient(to right, #695aa6, #5a4d8a)' }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(to right, #5a4d8a, #4a3f73)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(to right, #695aa6, #5a4d8a)';
                }}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}