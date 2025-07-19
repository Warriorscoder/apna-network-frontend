import React from 'react'

const SearchBar = () => {
  return (
    <section className="max-w-2xl mx-auto mb-12 px-4">
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search for services or providers" 
          className="w-full p-4 pl-12 text-gray-700 bg-white rounded-lg shadow-md focus:ring-2 focus:outline-none border border-gray-200 transition-colors"
          style={{
            '--tw-ring-color': 'rgba(105, 90, 166, 0.5)',
            borderColor: 'rgba(105, 90, 166, 0.3)'
          }}
          onFocus={(e) => e.target.style.borderColor = '#695aa6'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(105, 90, 166, 0.3)'}
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6" style={{color: '#695aa6'}}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
      </div>
      <div className="text-center text-gray-500 text-sm mt-2">
        Search for services, providers, or topics of interest
      </div>
    </section>
  )
}

export default SearchBar;