'use client';

import React from 'react';
import { Users, Search } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-20 text-white" style={{backgroundColor: '#695aa6'}}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Community?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Join thousands of service providers and community members who are already making a difference
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            className="px-8 py-4 bg-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2 hover:opacity-90"
            style={{color: '#695aa6'}}
          >
            <Users className="w-5 h-5" />
            Register as Provider
          </button>
          <button 
            className="px-8 py-4 border-2 text-white rounded-xl hover:bg-white transition-all font-semibold flex items-center justify-center gap-2"
            style={{borderColor: '#fff'}}
            onMouseEnter={(e) => e.target.style.color = '#695aa6'}
            onMouseLeave={(e) => e.target.style.color = 'white'}
          >
            <Search className="w-5 h-5" />
            Find Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;