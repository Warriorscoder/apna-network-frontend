"use client"

import { Eye, RefreshCw, TrendingUp, Zap } from "lucide-react"

const offers = [
  {
    icon: <Eye className="w-8 h-8 sm:w-10 md:w-12 lg:h-12" />,
    title: "Employment/Work Opportunities",
    description: "Connecting skilled workers with employment opportunities",
  },
  {
    icon: <RefreshCw className="w-8 h-8 sm:w-10 md:w-12 lg:h-12" />,
    title: "Reskilling",
    description: "Upgrading skills to meet modern market demands and grow",
  },
  {
    icon: <TrendingUp className="w-8 h-8 sm:w-10 md:w-12 lg:h-12" />,
    title: "Skill Development",
    description: "Comprehensive training programs for professional growth",
  },
  {
    icon: <Zap className="w-8 h-8 sm:w-10 md:w-12 lg:h-12" />,
    title: "Career Opportunities",
    description: "Opening doors to new career paths and advancement",
  },
]

const Offers = () => (
  <section
    className="py-12 sm:py-16 md:py-20"
    style={{
      background: "linear-gradient(to top, #fff 0%, rgba(105, 90, 166, 0.15) 99%, rgba(105, 90, 166, 0.25) 100%)",
    }}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-8 sm:mb-12 md:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6" style={{ color: "#695aa6" }}>
          What We Offer
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {offers.map((offer, index) => (
          <div
            key={index}
            className="bg-white border rounded-xl p-4 sm:p-6 md:p-8 flex flex-col items-center text-center h-full min-h-[240px] sm:min-h-[320px] md:min-h-[340px] transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:border-[#695aa6]"
            style={{ borderColor: "rgba(105, 90, 166, 0.3)" }}
          >
            {/* Icon */}
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mb-3 sm:mb-4 md:mb-6"
              style={{
                background: "linear-gradient(135deg, rgba(105, 90, 166, 0.1), rgba(105, 90, 166, 0.2))",
              }}
            >
              <div style={{ color: "#695aa6" }}>{offer.icon}</div>
            </div>

            {/* Title */}
            <h3
              className="text-base sm:text-lg md:text-xl font-semibold text-center leading-tight mb-2 sm:mb-3 md:mb-4"
              style={{ color: "#695aa6" }}
            >
              {offer.title}
            </h3>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed flex-1 flex items-center">
              {offer.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default Offers
