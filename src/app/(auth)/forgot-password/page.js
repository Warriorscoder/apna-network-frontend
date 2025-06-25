"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminForgot26Password() { // Remove '26' in your actual code
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validation, setValidation] = useState({
    isMobile: false,
    isEmail: false,
    isValid: false,
  });

  const router = useRouter();

  useEffect(() => {
    const isMobile = /^\d{10}$/.test(identifier);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    setValidation({
      isMobile,
      isEmail,
      isValid: isMobile || isEmail,
    });
  }, [identifier]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!validation.isValid) {
      setError('Please enter a valid 10-digit mobile number or email address');
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/forgotpassword`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, isMobile: validation.isMobile }),
      });
      const data = await res.json();

      if (res.ok) {
        router.push(`/auth/otp-verification?identifier=${identifier}&role=admin`);
      } else {
        setError(data.message || 'Failed to request password reset');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const { isMobile, isEmail, isValid } = validation;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-t from-white to-[rgba(105,90,166,0.99)]">
      <div className="p-8 rounded-xl w-full max-w-[32rem] bg-white/95 backdrop-blur-sm shadow-lg">
        <h1 className="text-3xl font-bold text-center text-[#695aa6] mb-8">Forgot Password</h1>
        {error && <p className="mb-4 text-center text-red-600">{error}</p>}
        {success && <p className="mb-4 text-center text-green-600">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">Mobile Number or Email</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Enter your mobile number or email"
              required
            />
            <div className="mt-2 text-sm text-gray-600" >
              {identifier && !isValid && (
                <p className="text-red-500">Please enter a valid 10-digit mobile number or email address</p>
              )}
              {isMobile && (
                <p className="text-green-600">Valid mobile number</p>
              )}
              {isEmail && (
                <p className="text-green-600">Valid email address</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || !isValid}
            className="w-full p-3 rounded-lg font-semibold transition-all bg-[#695aa6] hover:bg-[#5a4d8a] text-white"
          >
            {isLoading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          <button
            type="button"
            onClick={() => router.push('/auth/login')}
            className="text-[#695aa6] hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
