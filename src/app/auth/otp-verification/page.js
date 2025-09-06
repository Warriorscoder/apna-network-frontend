"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import OtpInput from '../../../components/OtpInput';
export default function OtpPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'user';
  const identifier = searchParams.get('identifier') || '';
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const otpString = otp.join('');
    if (otpString.length !== 6 || !/^\d+$/.test(otpString)) {
      setError('Please enter a valid 6-digit OTP'); 
      setIsLoading(false);
      return;
    }
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${role}s/verifyOTP`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp: otpString }),
      });
      const data = await res.json();

      if (res.ok) {
        if (data.needsSignup) {
          if (role === 'user') {
            router.push('/auth/user-signup');
          } else if (role === 'provider') {
            router.push('/auth/provider-signup');
          }
        } else if (role === 'admin') {
          router.push(`/auth/reset-password?identifier=${identifier}`);
        } else {
          router.push(`/dashboard/${role}-dashboard`);
        }
      } else {
        setError(data.message || 'Failed to verify OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(to top, #fff 0%, rgba(105, 90, 166, 0.99) 100%, rgba(105, 90, 166, 0.5) 100%)' }}>
      <div className="p-8 rounded-xl w-full max-w-[32rem] bg-white/95 backdrop-blur-sm" style={{ boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)' }}>
        <h1 className="text-3xl font-bold text-center text-[#695aa6] mb-8">OTP Verification</h1>
        {error && <p className="mb-4 text-center text-red-600">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 text-md font-medium text-gray-800">Enter 6-digit OTP</label>
            <OtpInput otp={otp} setOtp={setOtp} length={6} />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 rounded-lg font-semibold transition-all bg-[#695aa6] hover:bg-[#5a4d8a] text-white"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </div>
    </div>
  );
}
