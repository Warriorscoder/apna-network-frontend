"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-toastify';


export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async(e)=>{
    e.preventDefault();
    setIsLoading(true)
    setError('');


    if(role === 'admin' && !password) {
      setError('Password is required for admin');
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${role}/create`,{phone ,password})
      const data = res.data;
      console.log(data);
      if(data.success){
        toast.success(' Otp sent successfully');
        sessionStorage.setItem('password', password); // Store password in session storage
        router.push(`/otp-verification?phone=${phone}&role=${role}`);


      }
      else if(data.success === false){
        toast.error(' Login failed');
      }

     
      
      
    } catch (error) {
      console.error('Error during login:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
     
      
    }
    finally {
    setIsLoading(false); 
  }
   


  }


  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-t from-white to-[rgba(105,90,166,0.99)]">
      <div className="p-8 rounded-xl w-full max-w-[32rem] bg-white/95 backdrop-blur-sm shadow-lg">
        <h1 className="text-3xl font-bold text-center text-[#695aa6] mb-8">Login</h1>
        {error && <p className="mb-4 text-center text-red-600">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">Mobile Number or Email</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Enter your mobile number or email"
              required
            />
          </div>

          {role === 'admin' && (
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#695aa6]/30 focus:border-[#695aa6] text-gray-900"
                placeholder="Enter your password"
                required
              />
            </div>
          )}

          {role === 'admin' && (
            <div className="mb-6 text-center text-sm">
              <button
                type="button"
                onClick={() => router.push('/forgot-password')}
                className="text-[#695aa6] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">Login as</label>
            <div className="flex gap-4 flex-wrap">
              {['users', 'providers', 'admin'].map((r) => (
                <label
                  key={r}
                  className={`flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer transition-all border border-gray-200
                ${role === r ? 'bg-[#695aa6] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={role === r}
                    onChange={() => setRole(r)}
                    className="hidden"
                  />
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 rounded-lg font-semibold transition-all bg-[#695aa6] hover:bg-[#5a4d8a] text-white"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>


        <div className="mt-6 text-center text-sm text-gray-700">
          Don’t have an account?{' '}
            <button
              className="text-[#695aa6] hover:underline font-medium"
            >
          <Link href={'/register'}>
              Click here to register
          </Link>
            </button>
        </div>
      </div>
    </div>

  );
}
