"use client";

import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();

  // Navigation handlers
  const handleJoinUs = () => {
    router.push("/login");
  };

  const handleFindServices = () => {
    router.push("/all-services");
  };

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: `
          linear-gradient(to top, #fff 0%, rgba(105,90,166,0.35) 99%, rgba(105,90,166,0.5) 100%), center bottom / cover no-repeat
        `,
      }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute top-20 left-10 w-32 h-32 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"
            style={{ backgroundColor: "rgba(105, 90, 166, 0.6)" }}
          ></div>
          <div
            className="absolute top-40 right-20 w-40 h-40 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"
            style={{ backgroundColor: "rgba(105, 90, 166, 0.5)" }}
          ></div>
          <div
            className="absolute bottom-20 left-1/3 w-36 h-36 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"
            style={{ backgroundColor: "rgba(105, 90, 166, 0.7)" }}
          ></div>
        </div>

        {/* Rural Landscape Illustration */}
        <div className="absolute bottom-0 left-0 right-0 h-2/3">
          <svg viewBox="0 0 1200 400" className="w-full h-full">
            {/* Mountains */}
            <path
              d="M0,200 L200,80 L400,120 L600,60 L800,100 L1000,40 L1200,80 L1200,400 L0,400 Z"
              fill="#695aa6"
              opacity="0.2"
            />
            <path
              d="M0,240 L150,140 L350,180 L550,120 L750,160 L950,100 L1200,140 L1200,400 L0,400 Z"
              fill="#695aa6"
              opacity="0.3"
            />

            {/* Fields */}
            <path
              d="M0,280 L1200,260 L1200,400 L0,400 Z"
              fill="rgba(105, 90, 166, 0.4)"
            />
            <path
              d="M0,320 L1200,300 L1200,400 L0,400 Z"
              fill="rgba(105, 90, 166, 0.3)"
            />

            {/* House */}
            <rect x="800" y="240" width="60" height="40" fill="#8B4513" />
            <path d="M790,240 L830,210 L870,240 Z" fill="#CD853F" />

            {/* Windmill */}
            <rect x="1020" y="200" width="4" height="80" fill="#8B4513" />
            <g
              transform="translate(1022,210) rotate(45)"
              className="animate-spin"
              style={{ animationDuration: "3s" }}
            >
              <rect x="-20" y="-2" width="40" height="4" fill="#8B4513" />
              <rect x="-2" y="-20" width="4" height="40" fill="#8B4513" />
            </g>

            {/* Trees */}
            <circle cx="200" cy="260" r="15" fill="#10b981" />
            <rect x="198" y="260" width="4" height="20" fill="#8B4513" />
            <circle cx="400" cy="270" r="12" fill="#10b981" />
            <rect x="398" y="270" width="4" height="15" fill="#8B4513" />
            <circle cx="600" cy="250" r="18" fill="#10b981" />
            <rect x="598" y="250" width="4" height="25" fill="#8B4513" />
          </svg>
        </div>
      </div>

      {/* Content Container */}
      <div className="w-full px-6 sm:px-6 max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight animate-fade-in">
          <span
            style={{
              background: "linear-gradient(to right, #695aa6, #5a4d8a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Welcome to
          </span>
          <br />
          <span
            style={{
              background: "linear-gradient(to right, #5a4d8a, #4a3f73)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Apna Network
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
          Apna Network bridges the gap between skilled service providers and
          those seeking services in rural areas, fostering economic growth and
          community development.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleJoinUs}
            className="px-8 py-4 text-white rounded-lg hover:shadow-xl transition-all transform hover:scale-105 text-lg font-medium shadow-lg cursor-pointer"
            style={{
              background: "linear-gradient(to right, #695aa6, #5a4d8a)",
            }}
            onMouseEnter={(e) => {
              e.target.style.background =
                "linear-gradient(to right, #5a4d8a, #4a3f73)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background =
                "linear-gradient(to right, #695aa6, #5a4d8a)";
            }}
          >
            Feel Free to join us
          </button>
          <button
            onClick={handleFindServices}
            className="px-8 py-4 bg-white border-2 rounded-lg transition-all transform hover:scale-105 text-lg font-medium shadow-lg cursor-pointer"
            style={{
              color: "#695aa6",
              borderColor: "#695aa6",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#695aa6";
              e.target.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "white";
              e.target.style.color = "#695aa6";
            }}
          >
            Find Services
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.1);
          }
        }
        .animate-pulse {
          animation: pulse 6s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fade-in {
          animation: fadeIn 1.2s ease forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
        @media (max-width: 640px) {
          button {
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
