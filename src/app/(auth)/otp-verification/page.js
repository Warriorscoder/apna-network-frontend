"use client";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import OtpInput from '../../../components/OtpInput';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/Authcontext';

export default function OtpPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'user';
  const phone = searchParams.get('phone') || '';
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { loginWithResponse } = useAuth();

  const [counter, setCounter] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer;
    if (counter > 0) {
      timer = setTimeout(() => setCounter(counter - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [counter]);

  const handleResendOTP = async () => {
    try {
      setCanResend(false);
      setCounter(30);

      const password = sessionStorage.getItem('password'); 
      const apiRole = role === 'user' ? 'users' : role === 'provider' ? 'providers' : role;

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${apiRole}/create`, {
        phone,
        password
      });

      if (res.data.success) {
        toast.success("OTP resent successfully!");
        setOtp(new Array(6).fill(''));
        sessionStorage.removeItem('password');
      } else {
        toast.error(res.data.message || "Failed to resend OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Network error");
    }
  };

  const getVerifyOTPEndpoint = () => {
    switch(role) {
      case 'user':
      case 'users':
        return '/users/verifyOTP';
      case 'provider':
      case 'providers':
        return '/providers/verifyOTP';
      case 'admin':
        return '/admin/verifyOTP';
      case 'adminReset':
        return '/admin/verifyResetOTP';
      default:
        return '/users/verifyOTP';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const enteredOtp = otp.join('');
      const endpoint = getVerifyOTPEndpoint();
      
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
        phone,
        otp: enteredOtp,
      });

      const data = res.data;

      // Handle Provider Flow
      if (role === 'provider' || role === 'providers') {
        if (data.success && data.provider) {
          // Existing provider - login successful
          const loginResult = await loginWithResponse({
            token: data.token,
            provider: data.provider
          });

          if (loginResult.success) {
            toast.success('OTP verified successfully. Login Successful');
            setTimeout(() => {
              router.push('/dashboard/provider-dashboard');
            }, 200); // Increased delay
          } else {
            throw new Error('Failed to process login');
          }
        } else if (data.newUser || data.success === false) {
          // New provider - redirect to signup
          toast.success('OTP verified successfully. Please complete your profile');
          router.push(`/provider-signup?phone=${phone}&role=${role}`);
        } else {
          throw new Error(data.message || 'OTP verification failed');
        }
      }

      // Handle User Flow
      else if (role === 'user' || role === 'users') {
        if (data.success && data.user) {
          // Existing user - login successful
          const loginResult = await loginWithResponse({
            token: data.token,
            user: data.user
          });

          if (loginResult.success) {
            toast.success('OTP verified successfully. Login Successful');
            setTimeout(() => {
              router.push('/dashboard/user-dashboard');
            }, 200); // Increased delay
          } else {
            throw new Error('Failed to process login');
          }
        } else if (data.newUser || data.success === false) {
          // New user - redirect to signup
          toast.success('OTP verified successfully. Please complete Signup');
          router.push(`/register?phone=${phone}&role=${role}`);
        } else {
          throw new Error(data.message || 'OTP verification failed');
        }
      }

      // Handle Admin Flow
      else if (role === 'admin') {
        if (data.success && data.admin) {
          const loginResult = await loginWithResponse({
            token: data.token,
            admin: data.admin
          });

          if (loginResult.success) {
            toast.success('OTP verified successfully');
            setTimeout(() => {
              router.push('/dashboard/admin-dashboard');
            }, 200); // Increased delay
          } else {
            throw new Error('Failed to process admin login');
          }
        } else {
          throw new Error(data.message || 'Admin OTP verification failed');
        }
      }

      // Handle Admin Reset Flow
      else if (role === 'adminReset') {
        if (data.success) {
          toast.success('OTP verified successfully');
          router.push(`/reset-password?phone=${phone}&role=${role}`);
        } else {
          throw new Error(data.message || 'Reset OTP verification failed');
        }
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Something went wrong';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(to top, #fff 0%, rgba(105, 90, 166, 0.99) 100%, rgba(105, 90, 166, 0.5) 100%)' }}>
      <div className="p-8 rounded-xl w-full max-w-[32rem] bg-white/95 backdrop-blur-sm" style={{ boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)' }}>
        <h1 className="text-3xl font-bold text-center text-[#695aa6] mb-8">OTP Verification</h1>
        <p className="text-center text-gray-600 mb-4">
          Verify OTP sent to <strong>{phone}</strong> for <strong>{role}</strong> account
        </p>
        {error && <p className="mb-4 text-center text-red-600">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 text-md text-center font-medium text-gray-800">Enter 6-digit OTP</label>
            <OtpInput otp={otp} setOtp={setOtp} canResend={canResend} counter={counter} length={6} handleResendOTP={handleResendOTP} />
          </div>
          <button
            type="submit"
            disabled={isLoading || otp.some(digit => digit === '')}
            className="w-full p-3 rounded-lg font-semibold transition-all bg-[#695aa6] hover:bg-[#5a4d8a] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </div>
    </div>
  );
}
