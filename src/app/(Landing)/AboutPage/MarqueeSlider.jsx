import React from "react";

const logos = [
  { src: "/imgs/SF.png", name: "Swabhiman Foundation" },
  { src: "/imgs/SUI.png", name: "Startup India" },
  { src: "/imgs/AKAM.png", name: "Azadi Ka Amrit Mahotsav" },
  { src: "/imgs/IEDUP.jpeg", name: "IdeaUp" },
  { src: "/imgs/mcm.jpeg", name: "MCM" },
  { src: "/imgs/PSA.jpeg", name: "TPSDM" },
  { src: "/imgs/MSME.png", name: "MSME" },
  { src: "/imgs/MII.png", name: "Make In India" },
];

const MarqueeSlider = () => {
  return (
    <div className="relative overflow-hidden py-8 bg-white">
      {/* Left blur gradient */}
      <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-white via-white/90 to-transparent z-10 pointer-events-none"></div>

      {/* Right blur gradient */}
      <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-white via-white/90 to-transparent z-10 pointer-events-none"></div>

      <div
        className="flex animate-marquee"
        style={{
          animation: "marquee 25s linear infinite",
          width: "calc(200% + 2rem)",
        }}
      >
        {/* First set of logos */}
        {logos.map((logo, i) => (
          <div key={`first-${i}`} className="flex-shrink-0 mx-4">
            <div
              className="bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 p-4 hover:border-[#695aa6]/40 group"
              style={{ width: "120px", height: "120px" }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="max-w-full max-h-full object-contain filter group-hover:scale-105 transition-transform duration-300"
                  style={{ maxWidth: "80px", maxHeight: "80px" }}
                  onError={(e) => {
                    console.log(`Failed to load image: ${logo.src}`);
                    // Create fallback with company initials
                    const initials = logo.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("");
                    e.target.outerHTML = `
                      <div class="w-full h-full flex items-center justify-center">
                        <div class="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg" style="background: linear-gradient(135deg, #695aa6, #5a4d8a);">
                          ${initials}
                        </div>
                      </div>
                    `;
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Second set of logos for seamless loop */}
        {logos.map((logo, i) => (
          <div key={`second-${i}`} className="flex-shrink-0 mx-4">
            <div
              className="bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 p-4 hover:border-[#695aa6]/40 group"
              style={{ width: "120px", height: "120px" }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="max-w-full max-h-full object-contain filter group-hover:scale-105 transition-transform duration-300"
                  style={{ maxWidth: "80px", maxHeight: "80px" }}
                  onError={(e) => {
                    console.log(`Failed to load image: ${logo.src}`);
                    // Create fallback with company initials
                    const initials = logo.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("");
                    e.target.outerHTML = `
                      <div class="w-full h-full flex items-center justify-center">
                        <div class="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg" style="background: linear-gradient(135deg, #695aa6, #5a4d8a);">
                          ${initials}
                        </div>
                      </div>
                    `;
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced animations and styles */}
      <style>{`
        @keyframes marquee {
          0% { 
            transform: translateX(0); 
          }
          100% { 
            transform: translateX(-50%); 
          }
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }

        /* Additional blur for better edge effect */
        .animate-marquee::before {
          content: '';
          position: absolute;
          left: -30px;
          top: 0;
          width: 60px;
          height: 100%;
          background: linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0));
          z-index: 2;
        }

        .animate-marquee::after {
          content: '';
          position: absolute;
          right: -30px;
          top: 0;
          width: 60px;
          height: 100%;
          background: linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0));
          z-index: 2;
        }
      `}</style>
    </div>
  );
};

export default MarqueeSlider;
