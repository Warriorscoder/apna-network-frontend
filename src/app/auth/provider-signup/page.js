"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const servicesList = [
  'Plumber', 'Electrician', 'Painter', 'Carpenter', 'Construction Worker',
  'Photographer', 'Welder', 'Tailor', 'Cook', 'Gardener',
  'House Keeper / House Helper', 'Barber', 'Driver', 'Dry Cleaner',
  'Interior Designer', 'Other',
];

const educationOptions = [
  '10th', '+2', 'ITI Diploma', 'Graduation', 'Other',
];

const providerInitial = {
  name: '', fatherName: '', dob: '', gender: '', aadhar: '',
  village: '', panchayat: '', tehsil: '', district: '',
  education: '', educationOther: '', services: [],
  servicesOther: '', experience: '', updates: '',
  referredBy: '', declaration: false, password: '',
};

const providerSteps = [
  'Personal Details', 'Address', 'Education & Services', 'Confirmation'
];

export default function ServiceProviderSignUp({ onSuccess }) {
  const [formData, setFormData] = useState(providerInitial);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(0);
  const router = useRouter();

  const validate = () => {
    const newErrors = {};
    const trimmed = Object.fromEntries(
      Object.entries(formData).map(([k, v]) =>
        typeof v === 'string' ? [k, v.trim()] : [k, v]
      )
    );
    if (step === 0) {
      if (!trimmed.name) newErrors.name = 'Name is required';
      if (!trimmed.fatherName) newErrors.fatherName = "Father's Name is required";
      if (!trimmed.dob) newErrors.dob = 'Date of Birth is required';
      if (!trimmed.gender) newErrors.gender = 'Gender is required';
      if (!/^\d{12}$/.test(trimmed.aadhar)) newErrors.aadhar = 'Enter a valid 12-digit Aadhar number';
    }
    if (step === 1) {
      if (!trimmed.village) newErrors.village = 'Village is required';
      if (!trimmed.panchayat) newErrors.panchayat = 'Panchayat/Ward is required';
      if (!trimmed.tehsil) newErrors.tehsil = 'Tehsil is required';
      if (!trimmed.district) newErrors.district = 'District is required';
    }
    if (step === 2) {
      if (!trimmed.education) newErrors.education = 'Select educational qualification';
      if (trimmed.education === 'Other' && !trimmed.educationOther) newErrors.educationOther = 'Please specify your education';
      if (!formData.services.length) newErrors.services = 'Select at least one service';
      if (formData.services.includes('Other') && !trimmed.servicesOther) newErrors.servicesOther = 'Please specify your service';
      if (!trimmed.experience) newErrors.experience = 'Experience is required';
      else if (isNaN(Number(trimmed.experience)) || Number(trimmed.experience) < 0 || Number(trimmed.experience) > 50)
        newErrors.experience = 'Experience must be between 0 and 50 years';
      if (!trimmed.updates) newErrors.updates = 'Please select updates preference';
    }
    if (step === 3) {
      if (!formData.declaration) newErrors.declaration = 'You must accept the declaration';
      if (!trimmed.password) newErrors.password = 'Password is required';
      else if (trimmed.password.length < 6)
        newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'declaration') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleServiceClick = (service) => {
    setFormData(prev => {
      const selected = prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service];
      return { ...prev, services: selected };
    });
  };

  const handleNext = () => {
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) setStep(step + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setIsSubmitting(true);

    
    const needsAdminVerification = formData.services.includes('Other') && formData.servicesOther.trim();

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  

    const res = await fetch(`${apiUrl}/providers/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
      ...formData,
      needsAdminVerification,
      }),
    });

  if (res.ok) {
    // Show admin review message if "Other" service is selected and custom service is entered
    if (formData.services.includes('Other') && formData.servicesOther.trim()) {
      alert('Registration successful! Your custom service will be reviewed by an admin.');
    } else {
      alert('Registration successful!');
    }
    // Redirect to dashboard after successful provider signup
    if (onSuccess) onSuccess();
    else router.push('/dashboard/service-dashboard'); 
  } else {
    const data = await res.json();
    alert(data.message || 'Registration failed');
  }
} catch {
  alert('Error submitting form');
} finally {
  setIsSubmitting(false);
}
  }

  const renderError = (field) =>
    errors[field] ? (
      <p className="text-red-600 text-xs mt-1" aria-live="polite">
        {errors[field]}
      </p>
    ) : null;

  const Label = ({ en, hi, htmlFor, required }) => (
    <label htmlFor={htmlFor} className="block text-[#695aa6] font-semibold mb-1">
      {en}{required && <span className="text-red-500">*</span>}
      <span className="block text-gray-500 font-normal">{hi}</span>
    </label>
  );
  return (
    <div className="min-h-screen flex items-center justify-center px-4
   bg-gradient-to-t from-white to-[rgba(105,90,166,0.99)]">
      <div className="rounded-[16px] shadow-[0_6px_24px_rgba(90,74,138,0.18)] p-8 w-full max-w-2xl bg-gradient-to-r from-purple-50 to-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#695aa6]">
          Service Provider Signup
        </h2>
        <div className="flex items-center justify-between mb-6">
          {providerSteps.map((label, idx) => (
            <div key={label} className="flex-1 flex flex-col items-center">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 font-bold
                ${step === idx ? 'bg-[#695aa6] text-white border-[#695aa6]' : 'bg-gray-200 text-[#695aa6] border-gray-200'}`}>
                {idx + 1}
              </div>
              <span className={`mt-1 text-xs text-center ${step === idx ? 'text-[#695aa6]' : 'text-gray-400'}`}>{label}</span>
              {idx < providerSteps.length - 1 && <div className="h-1 w-full bg-gray-200 mt-2"></div>}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Step 1: Personal Details */}
          {step === 0 && (
            <>
              <div>
                <Label en="Name of the Applicant" hi="नाम" htmlFor="input-name" required />
                <input
                  id="input-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                   className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                {renderError('name')}
              </div>
              <div>
                <Label en="Father's Name" hi="पिता का नाम" htmlFor="input-fatherName" required />
                <input
                  id="input-fatherName"
                  name="fatherName"
                  type="text"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                {renderError('fatherName')}
              </div>
              <div>
                <Label en="Date of Birth" hi="जन्म की तारीख" htmlFor="input-dob" required />
                <input
                  id="input-dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                {renderError('dob')}
              </div>
              <div>
                <Label en="Gender" hi="लिंग" htmlFor="input-gender" required />
                <div className="flex gap-6 mt-1">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <label key={g} className="font-medium text-[#695aa6] flex items-center gap-1">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={handleChange}
                        className="accent-[#695aa6]"
                      />
                      {g}
                      <span className="text-gray-400 font-normal text-s">
                        {g === 'Male' ? '/ पुरुष' : g === 'Female' ? '/ महिला' : '/ अन्य'}
                      </span>
                    </label>
                  ))}
                </div>
                {renderError('gender')}
              </div>
              <div>
                <Label en="Aadhar No." hi="आधार संख्या" htmlFor="input-aadhar" />
                <input
                  id="input-aadhar"
                  name="aadhar"
                  type="text"
                  pattern="[0-9]{12}"
                  inputMode="numeric"
                  value={formData.aadhar}
                  onChange={handleChange}
                  className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                {renderError('aadhar')}
              </div>
            </>
          )}
          {/* Step 2: Address */}
          {step === 1 && (
            <>
              <div>
                <Label en="Village" hi="गाँव" htmlFor="input-village" required />
                <input
                  id="input-village"
                  name="village"
                  type="text"
                  value={formData.village}
                  onChange={handleChange}
                  className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                {renderError('village')}
              </div>
              <div>
                <Label en="Panchayat / Municipal Ward" hi="पंचायत / शहरी निकाय वार्ड" htmlFor="input-panchayat" required />
                <input
                  id="input-panchayat"
                  name="panchayat"
                  type="text"
                  value={formData.panchayat}
                  onChange={handleChange}
                  className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                {renderError('panchayat')}
              </div>
              <div>
                <Label en="Tehsil" hi="तहसील" htmlFor="input-tehsil" required />
                <input
                  id="input-tehsil"
                  name="tehsil"
                  type="text"
                  value={formData.tehsil}
                  onChange={handleChange}
                  className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                {renderError('tehsil')}
              </div>
              <div>
                <Label en="District" hi="जिला" htmlFor="input-district" required />
                <input
                  id="input-district"
                  name="district"
                  type="text"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                {renderError('district')}
              </div>
            </>
          )}
          {/* Step 3: Education & Services */}
          {step === 2 && (
            <>
              <div>
                <Label en="Educational Qualification" hi="शैक्षिक योग्यता" htmlFor="input-education" required />
                <select
                  id="input-education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="">Select</option>
                  {educationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === 'Other' ? 'Other' : option}
                    </option>
                  ))}
                </select>
                {formData.education === 'Other' && (
                  <input
                    id="input-educationOther"
                    name="educationOther"
                    type="text"
                    placeholder="Please specify"
                    value={formData.educationOther}
                    onChange={handleChange}
                    className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                )}
                {renderError('education')}
                {renderError('educationOther')}
              </div>
              <div>
                <Label en="What kind of services do you provide?" hi="आप किस प्रकार की सेवाएं प्रदान करते हैं?" htmlFor="input-services" required />
                <div className="flex flex-wrap gap-2 mb-2">
                  {servicesList.map((service) => (
                    <span
                      key={service}
                      className={`px-3 py-1 rounded-full cursor-pointer border transition-all text-sm ${
                        formData.services.includes(service)
                          ? 'bg-[#695aa6] text-white border-[#695aa6]'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-[#e5e0f3]'
                      }`}
                      onClick={() => handleServiceClick(service)}
                      tabIndex={0}
                      onKeyDown={e => {
                        if (e.key === ' ' || e.key === 'Enter') handleServiceClick(service);
                      }}
                      role="button"
                      aria-pressed={formData.services.includes(service)}
                    >
                      {service}
                    </span>
                  ))}
                </div>
                {formData.services.includes('Other') && (
                  <input
                    id="input-servicesOther"
                    name="servicesOther"
                    type="text"
                    placeholder="Please specify"
                    value={formData.servicesOther}
                    onChange={handleChange}
                    className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                )}
                {renderError('services')}
                {renderError('servicesOther')}
              </div>
              <div>
                <Label en="Work Experience" hi="कार्य अनुभव" htmlFor="input-experience" required />
                <input
                  id="input-experience"
                  name="experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  min={0}
                  max={50}
                />
                {renderError('experience')}
              </div>
              <div>
                <Label en="Would you like to receive updates?" hi="क्या आप अपडेट प्राप्त करना चाहेंगे?" htmlFor="input-updates" required />
                <select
                  id="input-updates"
                  name="updates"
                  value={formData.updates}
                  onChange={handleChange}
                  className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes / हाँ</option>
                  <option value="No">No / नहीं</option>
                </select>
                {renderError('updates')}
              </div>
              <div>
                <Label en="Referred By (if any)" hi="किसके द्वारा भेजा गया (यदि कोई हो)" htmlFor="input-referredBy" />
                <input
                  id="input-referredBy"
                  name="referredBy"
                  type="text"
                  value={formData.referredBy}
                  onChange={handleChange}
                  className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                {renderError('referredBy')}
              </div>
            </>
          )}
          {/* Step 4: Confirmation */}
          {step === 3 && (
            <>
              <div>
                <label className="flex items-center gap-2 text-[#695aa6] font-semibold">
                  <input
                    id="input-declaration"
                    name="declaration"
                    type="checkbox"
                    checked={formData.declaration}
                    onChange={handleChange}
                    className="accent-[#695aa6]"
                  />
                  I declare that the above information is correct / मैं घोषणा करता/करती हूँ कि उपरोक्त जानकारी सही है।
                </label>
                {renderError('declaration')}
              </div>
              
            </>
          )}
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 rounded bg-gray-200 text-[#695aa6] font-semibold"
              >
                Back
              </button>
            )}
            {step < providerSteps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto px-4 py-2 rounded bg-[#695aa6] text-white font-semibold"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-auto px-4 py-2 rounded bg-[#695aa6] text-white font-semibold"
              >
                {isSubmitting ? 'Registering...' : 'Submit'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
