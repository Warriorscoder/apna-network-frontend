"use client";
import { useAuth } from '@/app/context/Authcontext';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const educationOptions = [
  '10th', '+2', 'ITI Diploma', 'Graduation', 'Other',
];

const providerInitial = {
  name: '', fatherName: '', email: '', dob: '', gender: '', aadhar: '',
  village: '', panchayat: '', tehsil: '', district: '',
  education: '', educationOther: '',
  availability: { from: '', to: '' },
  declaration: false
};


const providerSteps = [
  'Personal Details', 'Address', 'Education & Services', 'Confirmation'
];

export default function ServiceProviderSignUp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithToken } = useAuth();

  // CORRECTED: Directly get query parameters using useSearchParams.
  // This is the modern and correct way for the Next.js App Router.
  // No useEffect or local state (useState) is needed for these.
  const phone = searchParams.get('phone') || '';
  const role = searchParams.get('role') || '';

  // DEBUG: Add a useEffect to log the values once they are available.
  useEffect(() => {
    // This will run when the component mounts and searchParams are ready.
    console.log("DEBUG: Reading URL parameters -> Phone:", phone, "Role:", role);
  }, [phone, role]);
  
  const [formData, setFormData] = useState(providerInitial);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(0);

  // Load the Razorpay checkout script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
         document.body.removeChild(script);
      }
    };
  }, []);

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
      if (!trimmed.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(trimmed.email)) {
        newErrors.email = "Email address is invalid";
      }
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
        if (!formData.availability?.from) newErrors['availability.from'] = 'Please select availability (from)';
        if (!formData.availability?.to) newErrors['availability.to'] = 'Please select availability (to)';
    }
    if (step === 3) {
        if (!formData.declaration) newErrors.declaration = 'You must accept the declaration';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'declaration') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleNext = async () => {
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    if (step === 0) {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/providers/check-email`, {
                email: formData.email
            });
            if (!response.data.isUnique) {
                toast.error("An account with this email already exists.");
                setErrors(prev => ({ ...prev, email: "This email is already registered." }));
                return;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not verify email. Please try again.");
            return;
        }
    }
    setStep(prevStep => prevStep + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      const orderResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/create-order`);
      const { id: order_id, currency, amount } = orderResponse.data;
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount.toString(),
        currency: currency,
        name: "Apna Network",
        description: "Provider Registration Fee",
        order_id: order_id,
        handler: async function (response) {
          try {
            const verificationResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/verify-payment`, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              providerData: { ...formData, phone, role }
            });
            const { token } = verificationResponse.data;
            const result = loginWithToken(token);
            if (result.success) {
              router.push('/dashboard/provider-dashboard');
              toast.success('Payment successful! Your registration is complete.');
            } else {
              toast.error(result.message || "Login failed after payment.");
            }
          } catch (error) {
            toast.error(error.response?.data?.message || 'Payment verification failed.');
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: { name: formData.name, email: formData.email, contact: phone },
        theme: { color: '#695aa6' },
        modal: {
          ondismiss: function () {
            toast.info('Payment was cancelled.');
            setIsSubmitting(false);
          }
        }
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not initiate payment.');
      setIsSubmitting(false);
    }
  };

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
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-t from-white to-[rgba(105,90,166,0.99)]">
      <div className="rounded-[16px] shadow-[0_6px_24px_rgba(90,74,138,0.18)] p-8 w-full max-w-2xl bg-gradient-to-r from-purple-50 to-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#695aa6]">
          Service Provider Signup
        </h2>
        <div className="flex items-center justify-between mb-6">
          {providerSteps.map((label, idx) => (
            <div key={label} className="flex-1 flex flex-col items-center">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 font-bold ${step === idx ? 'bg-[#695aa6] text-white border-[#695aa6]' : 'bg-gray-200 text-[#695aa6] border-gray-200'}`}>
                {idx + 1}
              </div>
              <span className={`mt-1 text-xs text-center ${step === idx ? 'text-[#695aa6]' : 'text-gray-400'}`}>{label}</span>
              {idx < providerSteps.length - 1 && <div className="h-1 w-full bg-gray-200 mt-2"></div>}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }} className="space-y-4" noValidate>
          {step === 0 && (
             <>
               <Label en="Name of the Applicant" hi="नाम" htmlFor="input-name" required />
               <input id="input-name" name="name" type="text" value={formData.name} onChange={handleChange} className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
               {renderError('name')}
               <Label en="Father's Name" hi="पिता का नाम" htmlFor="input-fatherName" required />
               <input id="input-fatherName" name="fatherName" type="text" value={formData.fatherName} onChange={handleChange} className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
               {renderError('fatherName')}
               <Label en="Email" hi="ईमेल" htmlFor="input-email" required />
               <input id="input-email" name="email" type="email" value={formData.email} onChange={handleChange} className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
               {renderError('email')}
               <Label en="Date of Birth" hi="जन्म की तारीख" htmlFor="input-dob" required />
               <input id="input-dob" name="dob" type="date" value={formData.dob} onChange={handleChange} className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
               {renderError('dob')}
               <div>
                 <Label en="Gender" hi="लिंग" htmlFor="input-gender" required />
                 <div className="flex gap-6 mt-1">
                   {['Male', 'Female', 'Other'].map((g) => (
                     <label key={g} className="font-medium text-[#695aa6] flex items-center gap-1">
                       <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} className="accent-[#695aa6]" />
                       {g}
                       <span className="text-gray-400 font-normal text-s">
                         {g === 'Male' ? '/ पुरुष' : g === 'Female' ? '/ महिला' : '/ अन्य'}
                       </span>
                     </label>
                   ))}
                 </div>
                 {renderError('gender')}
               </div>
               <Label en="Aadhar No." hi="आधार संख्या" htmlFor="input-aadhar" required />
               <input id="input-aadhar" name="aadhar" type="text" pattern="[0-9]{12}" maxLength="12" inputMode="numeric" value={formData.aadhar} onChange={handleChange} className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
               {renderError('aadhar')}
             </>
           )}
          
          {step === 1 && (
            <>
              <Label en="Village" hi="गाँव" htmlFor="input-village" required />
              <input id="input-village" name="village" type="text" value={formData.village} onChange={handleChange} className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
              {renderError('village')}
              
              <Label en="Panchayat / Municipal Ward" hi="पंचायत / शहरी निकाय वार्ड" htmlFor="input-panchayat" required />
              <input id="input-panchayat" name="panchayat" type="text" value={formData.panchayat} onChange={handleChange} className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
              {renderError('panchayat')}
              
              <Label en="Tehsil" hi="तहसील" htmlFor="input-tehsil" required />
              <input id="input-tehsil" name="tehsil" type="text" value={formData.tehsil} onChange={handleChange} className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
              {renderError('tehsil')}
              
              <Label en="District" hi="जिला" htmlFor="input-district" required />
              <input id="input-district" name="district" type="text" value={formData.district} onChange={handleChange} className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
              {renderError('district')}
            </>
          )}

          {step === 2 && (
            <>
              <Label en="Educational Qualification" hi="शैक्षिक योग्यता" htmlFor="input-education" required />
              <select id="input-education" name="education" value={formData.education} onChange={handleChange} className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none">
                <option value="">Select</option>
                {educationOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {formData.education === 'Other' && (
                <input id="input-educationOther" name="educationOther" type="text" placeholder="Please specify" value={formData.educationOther} onChange={handleChange} className="w-full p-2 mt-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
              )}
              {renderError('education')}
              {renderError('educationOther')}

              <div className="mt-4">
                <Label en="Availability" hi="उपलब्धता" required />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="availability-from" className="block text-sm font-medium text-gray-700">From</label>
                    <input type="time" id="availability-from" name="availability.from" value={formData.availability.from} onChange={handleChange} className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"/>
                    {renderError('availability.from')}
                  </div>
                  <div>
                    <label htmlFor="availability-to" className="block text-sm font-medium text-gray-700">To</label>
                    <input type="time" id="availability-to" name="availability.to" value={formData.availability.to} onChange={handleChange} className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"/>
                    {renderError('availability.to')}
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Your Details</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Address:</strong> {formData.village}, {formData.panchayat}, {formData.tehsil}, {formData.district}</p>
                    <p><strong>Education:</strong> {formData.education === 'Other' ? formData.educationOther : formData.education}</p>
                  </div>
              </div>
              <div className="mt-4">
                <label className="flex items-center gap-2 text-[#695aa6] font-semibold">
                  <input id="input-declaration" name="declaration" type="checkbox" checked={formData.declaration} onChange={handleChange} className="accent-[#695aa6] h-4 w-4" />
                  I declare that the above information is correct / मैं घोषणा करता/करती हूँ कि उपरोक्त जानकारी सही है।
                </label>
                {renderError('declaration')}
              </div>
            </>
          )}

          <div className="flex justify-between mt-8">
            {step > 0 && (
              <button type="button" onClick={handleBack} className="px-4 py-2 rounded bg-gray-200 text-[#695aa6] font-semibold">
                Back
              </button>
            )}
            {step < providerSteps.length - 1 ? (
              <button type="button" onClick={handleNext} className="ml-auto px-4 py-2 rounded bg-[#695aa6] text-white font-semibold">
                Next
              </button>
            ) : (
              <button type="submit" disabled={isSubmitting || !formData.declaration} className="ml-auto px-4 py-2 rounded bg-[#695aa6] text-white font-semibold disabled:bg-gray-400">
                {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}


