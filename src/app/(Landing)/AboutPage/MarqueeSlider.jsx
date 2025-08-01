"use client"

const logos = [
  { src: "/imgs/SF.png", name: "Swabhiman Foundation" },
  { src: "/imgs/SUI.png", name: "Startup India" },
  { src: "/imgs/AKAM.png", name: "Azadi Ka Amrit Mahotsav" },
  { src: "/imgs/IEDUP.jpeg", name: "IdeaUp" },
  { src: "/imgs/mcm.jpeg", name: "MCM" },
  { src: "/imgs/PSA.jpeg", name: "TPSDM" },
  { src: "/imgs/MSME.png", name: "MSME" },
  { src: "/imgs/MII.png", name: "Make In India" },
]

const LogoItem = ({ logo, keyPrefix }) => {
  const handleImageError = (e) => {
    const initials = logo.name
      .split(" ")
      .map((w) => w[0])
      .join("")

    // Create a fallback div element
    const fallbackDiv = document.createElement("div")
    fallbackDiv.className = "w-full h-full flex items-center justify-center"
    fallbackDiv.innerHTML = `
      <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl bg-gradient-to-br from-purple-600 to-purple-800">
        ${initials}
      </div>
    `

    // Replace the image with the fallback
    e.target.parentNode.replaceChild(fallbackDiv, e.target)
  }

  return (
    <div className="flex-shrink-0 mx-5 sm:mx-8">
      <div className="flex items-center justify-center w-34 h-34 sm:w-32 sm:h-32">
        <img
          src={logo.src || "/placeholder.svg"}
          alt={logo.name}
          className="max-w-full max-h-full object-contain filter hover:scale-135 transition-transform duration-300 opacity-80 hover:opacity-100"
          style={{
            maxWidth: "90px",
            maxHeight: "90px",
          }}
          onError={handleImageError}
        />
      </div>
    </div>
  )
}

const MarqueeSlider = () => {
  return (
    <div className="relative overflow-hidden py-6 sm:py-8 bg-white">
      {/* Left blur gradient */}
      <div className="absolute left-0 top-0 w-16 sm:w-24 h-full bg-gradient-to-r from-white via-white/90 to-transparent z-10 pointer-events-none"></div>

      {/* Right blur gradient */}
      <div className="absolute right-0 top-0 w-16 sm:w-24 h-full bg-gradient-to-l from-white via-white/90 to-transparent z-10 pointer-events-none"></div>

      <div className="flex animate-marquee">
        {/* First set of logos */}
        {logos.map((logo, i) => (
          <LogoItem key={`first-${i}`} logo={logo} keyPrefix="first" />
        ))}

        {/* Second set of logos for seamless loop */}
        {logos.map((logo, i) => (
          <LogoItem key={`second-${i}`} logo={logo} keyPrefix="second" />
        ))}

        {/* Third set for extra smoothness */}
        {logos.map((logo, i) => (
          <LogoItem key={`third-${i}`} logo={logo} keyPrefix="third" />
        ))}
      </div>

      {/* Enhanced animations and styles */}
      <style jsx>{`
        .animate-marquee {
          display: flex;
          animation: marquee 15s linear infinite;
          width: max-content;
        }

        @keyframes marquee {
          0% { 
            transform: translateX(0); 
          }
          100% { 
            transform: translateX(calc(-100% / 3)); 
          }
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }

        /* Remove the pseudo-elements that were causing issues */
      `}</style>
    </div>
  )
}

export default MarqueeSlider
