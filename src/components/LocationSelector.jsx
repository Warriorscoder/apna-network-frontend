import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';


const API_KEY = process.env.NEXT_PUBLIC_LOCATION_API;
const BASE_URL = 'https://api.countrystatecity.in/v1';
const INDIA_ISO2 = 'IN';

const LocationSelector = ({
  selectedState,
  selectedCity,
  onStateChange,
  onCityChange,
}) => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState({ states: false, cities: false });

  useEffect(() => {
    setLoading((prev) => ({ ...prev, states: true }));
    fetch(`${BASE_URL}/countries/${INDIA_ISO2}/states`, {
      headers: { 'X-CSCAPI-KEY': API_KEY },
    })
      .then((res) => res.json())
      .then((data) => setStates(data || []))
      .catch((err) => console.error('Error fetching states:', err))
      .finally(() => setLoading((prev) => ({ ...prev, states: false })));
  }, []);

  useEffect(() => {
    if (selectedState) {
      setLoading((prev) => ({ ...prev, cities: true }));
      fetch(`${BASE_URL}/countries/${INDIA_ISO2}/states/${selectedState}/cities`, {
        headers: { 'X-CSCAPI-KEY': API_KEY },
      })
        .then((res) => res.json())
        .then((data) => setCities(data || []))
        .catch((err) => console.error('Error fetching cities:', err))
        .finally(() => setLoading((prev) => ({ ...prev, cities: false })));
    } else {
      setCities([]);
    }

    if (onCityChange) onCityChange('');
  }, [selectedState, onCityChange]);

  const handleStateChange = (e) => onStateChange?.(e.target.value);
  const handleCityChange = (e) => onCityChange?.(e.target.value);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      {/* State Selector */}
      <div className="relative w-full sm:w-1/2">
        <select
          className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#695aa6] focus:outline-none text-sm bg-white"
          value={selectedState}
          onChange={handleStateChange}
          disabled={loading.states}
        >
          <option value="">
            {loading.states ? 'Loading states...' : 'Select State'}
          </option>
          {states.map((state) => (
            <option key={state.iso2} value={state.iso2}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      {/* City Selector */}
      <div className="relative w-full sm:w-1/2">
        <select
          className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#695aa6] focus:outline-none text-sm bg-white"
          value={selectedCity}
          onChange={handleCityChange}
          disabled={!selectedState || loading.cities}
        >
          <option value="">
            {loading.cities ? 'Loading cities...' : 'Select City'}
          </option>
          {cities.map((city) => (
            <option key={city.id} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LocationSelector;
