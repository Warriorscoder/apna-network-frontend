'use client'

import { Eye, RefreshCw, TrendingUp, Zap } from "lucide-react"

const Offers = () => {
  const offers = [
    {
      icon: <Eye className="w-12 h-12" />,
      title: "Employment/Work Opportunities",
      description: "Connecting skilled workers with employment opportunities",
    },
    {
      icon: <RefreshCw className="w-12 h-12" />,
      title: "Reskilling",
      description: "Upgrading skills to meet modern market demands",
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: "Skill Development",
      description: "Comprehensive training programs for professional growth",
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Carrier Opportunities",
      description: "Opening doors to new career paths and advancement",
    },
  ]

  return (
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
              className="bg-white border rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
              style={{ 
                borderColor: 'rgba(105, 90, 166, 0.3)',
                '&:hover': {
                  borderColor: '#695aa6',
                  boxShadow: '0 10px 25px rgba(105, 90, 166, 0.15)'
                }
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#695aa6';
                e.target.style.boxShadow = '0 10px 25px rgba(105, 90, 166, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'rgba(105, 90, 166, 0.3)';
                e.target.style.boxShadow = '';
              }}
            >
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(105, 90, 166, 0.1), rgba(105, 90, 166, 0.2))'
                }}
              >
                <div style={{ color: '#695aa6' }}>{offer.icon}</div>
              </div>
              <h3 
                className="text-xl font-semibold mb-4"
                style={{ color: '#695aa6' }}
              >
                {offer.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{offer.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Offers