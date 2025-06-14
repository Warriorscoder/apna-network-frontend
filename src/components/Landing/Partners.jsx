const Partners = () => {
  const partners = [
    { name: 'ICUP', logo: '🏢' },
    { name: 'Partner 2', logo: '🤝' },
    { name: 'Partner 3', logo: '🌟' },
    { name: 'Partner 4', logo: '💼' },
    { name: 'Partner 5', logo: '🎯' },
    { name: 'Partner 6', logo: '🚀' },
    { name: 'ICUP', logo: '🏢' },
    { name: 'Partner 2', logo: '🤝' }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">
            We work with
          </h2>
        </div>
        
        {/* Sliding Partners */}
        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex animate-slide space-x-12">
              {[...partners, ...partners].map((partner, index) => (
                <div key={index} className="flex-shrink-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center hover:shadow-lg transition-all duration-300 group">
                  <div className="text-center">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{partner.logo}</div>
                    <div className="text-sm font-semibold text-gray-700">{partner.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
const WeWorkWithSection = () => {
  const partners = [
    { name: 'ICUP', logo: '🏢' },
    { name: 'Partner 2', logo: '🤝' },
    { name: 'Partner 3', logo: '🌟' },
    { name: 'Partner 4', logo: '💼' },
    { name: 'Partner 5', logo: '🎯' },
    { name: 'Partner 6', logo: '🚀' },
    { name: 'ICUP', logo: '🏢' },
    { name: 'Partner 2', logo: '🤝' }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">
            We work with
          </h2>
        </div>
        
        {/* Sliding Partners */}
        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex animate-slide space-x-12">
              {[...partners, ...partners].map((partner, index) => (
                <div key={index} className="flex-shrink-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center hover:shadow-lg transition-all duration-300 group">
                  <div className="text-center">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{partner.logo}</div>
                    <div className="text-sm font-semibold text-gray-700">{partner.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Partners;