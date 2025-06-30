'use client'

import { Eye, RefreshCw, TrendingUp, Zap } from "lucide-react"

const offers = [
  {
    icon: <Eye className="w-12 h-12" />,
    title: "Employment/Work Opportunities",
    description: "Connecting skilled workers with employment opportunities",
  },
  {
    icon: <RefreshCw className="w-12 h-12" />,
    title: "Reskilling",
    description: "Upgrading skills to meet modern market demands and grow",
  },
  {
    icon: <TrendingUp className="w-12 h-12" />,
    title: "Skill Development",
    description: "Comprehensive training programs for professional growth",
  },
  {
    icon: <Zap className="w-12 h-12" />,
    title: "Career Opportunities",
    description: "Opening doors to new career paths and advancement",
  },
]

const Offers = () => (
  <section 
    className="py-20"
    style={{
      background: 'linear-gradient(to top, #fff 0%, rgba(105, 90, 166, 0.15) 99%, rgba(105, 90, 166, 0.25) 100%)'
    }}
  >
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 
          className="text-5xl font-bold mb-6"
          style={{ color: '#695aa6' }}
        >
          What We Offer
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {offers.map((offer, index) => (
          <div
            key={index}
            className="bg-white border rounded-xl p-8 flex flex-col justify-between items-center text-center h-full min-h-[340px] transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:border-[#695aa6]"
            style={{ borderColor: 'rgba(105, 90, 166, 0.3)' }}
          >
            {/* Icon and Title */}
            <div className="flex flex-col items-center" style={{ minHeight: 120 }}>
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(105, 90, 166, 0.1), rgba(105, 90, 166, 0.2))'
                }}
              >
                <div style={{ color: '#695aa6' }}>{offer.icon}</div>
              </div>
              <h3 
                className="text-xl font-semibold"
                style={{ color: '#695aa6' }}
              >
                {offer.title}
              </h3>
            </div>
            {/* Description */}
            <p className="text-gray-600 leading-relaxed mt-6">
              {offer.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default Offers