// "use client";
// import axios from 'axios';
// import { useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import OtpInput from '../../../components/OtpInput';
// import { toast } from 'react-toastify';


// import {  useEffect} from 'react';




// export default function OtpPage() {
//   const searchParams = useSearchParams();
//   const role = searchParams.get('role') || 'user';
//   const phone = searchParams.get('phone') || '';
//   const [otp, setOtp] = useState(new Array(6).fill(''));
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const router = useRouter();


  
// const [counter, setCounter] = useState(30);
// const [canResend, setCanResend] = useState(false);

// useEffect(() => {
//   let timer;
//   if (counter > 0) {
//     timer = setTimeout(() => setCounter(counter - 1), 1000);
//   } else {
//     setCanResend(true);
//   }
//   return () => clearTimeout(timer);
// }, [counter]);


// const handleResendOTP = async () => {
//   try {
//     setCanResend(false);
//     setCounter(30); // restart timer

//     const password = sessionStorage.getItem('password'); 

//     const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${role}/create`, {
//       phone,
//       password
//     });

//     if (res.data.success) {
//       toast.success("OTP resent successfully!");
//       setOtp(new Array(6).fill('')); // reset input fields
//       sessionStorage.removeItem('password'); // clear password from session storage
      
//     } else {
//       toast.error(res.data.message || "Failed to resend OTP");
//     }
//   } catch (err) {
//     toast.error(err.response?.data?.message || "Network error");
//   }
// };



//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setIsLoading(true);
//   setError('');


//   const getVerifyOTPEndpoint = ()=>{
//     switch(role){
//       case 'users':
//         return '/users/verifyOTP';
//       case 'providers':
//         return '/providers/verifyOTP';
//       case 'admin':
//         return '/admin/verifyOTP';
//       case 'adminReset':
//         return '/admin/verifyResetOTP';

//     }
//   }

//   try {
//     const enteredotp= otp.join('');
//     const endpoint = getVerifyOTPEndpoint(role);
//     const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
//       phone,
//       otp:enteredotp,
      
//     });
    
    

    
//     const data = res.data;
//     console.log(data);

//     console.log(data.success , data.message);
    
    
 

//     if (data.success && data.existing && role === 'providers') {
//       // Redirect or show success
//       // router.push('/dashboard/user-dashboard');
//        localStorage.setItem('token', data.token); // Store token in local storage
//       // localStorage.setItem('provider', JSON.stringify(data.provider)); // Store user data in local
//       router.push('/dashboard/provider-dashboard');
//       toast.success(' OTP verified successfully.Login Successful');
      
//      }
     
//     else if (data.newUser &&  role === 'providers') {
//       // Redirect or show success
//       // router.push('/dashboard/user-dashboard');
//       router.push(`/provider-signup?phone=${phone}&role=${role}`);
//       toast.success(' OTP verified successfully.Login Successful');
      
//      }
//     else if (data.success && data.existing && role === 'users') {
//       toast.success(' OTP verified successfully');
//       localStorage.setItem('token', data.token); // Store token in local storage
//       // localStorage.setItem('user', JSON.stringify(data.user)); // Store user data in local
//       router.push('/dashboard/user-dashboard');
//     }
//      else if (data.newUser && role === 'users') {
//       toast.success(' OTP verified successfully. Please complete Signup');
//       router.push(`/register?phone=${phone}&role=${role}`);
//     }
//     else if (data.success && role === 'admin') {
//       router.push('/dashboard/admin-dashboard');
//       toast.success(' OTP verified successfully');
//       // localStorage.setItem('admin', JSON.stringify(data.admin)); 
//       localStorage.setItem('token', data.token);

//     }
    
//     else if (data.success && role === 'adminReset') {
//       toast.success(' OTP verified successfully');
//         router.push(`/reset-password?phone=${phone}&role=${role}`);
      

//     }

    
    

     
//     // } else {
//     //   setError(data.message || 'OTP verification failed');
//     // }
//   } catch (err) {
//     console.error('OTP verification error:', err);
    
//     toast.error(err.response?.data?.message || 'Something went wrong');
  
//   } finally {
//     setIsLoading(false);
//   }
// };


//   return (
//     <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(to top, #fff 0%, rgba(105, 90, 166, 0.99) 100%, rgba(105, 90, 166, 0.5) 100%)' }}>
//       <div className="p-8 rounded-xl w-full max-w-[32rem] bg-white/95 backdrop-blur-sm" style={{ boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)' }}>
//         <h1 className="text-3xl font-bold text-center text-[#695aa6] mb-8">OTP Verification</h1>
//         {error && <p className="mb-4 text-center text-red-600">{error}</p>}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-6">
//             <label className="block mb-2 text-md text-center font-medium text-gray-800">Enter 6-digit OTP</label>
//             <OtpInput otp={otp} setOtp={setOtp} canResend={canResend} counter={counter} length={6} handleResendOTP={handleResendOTP} />
//           </div>
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full p-3 rounded-lg font-semibold transition-all bg-[#695aa6] hover:bg-[#5a4d8a] text-white"
//           >
//             {isLoading ? 'Verifying...' : 'Verify OTP'}
//           </button   >
//         </form>
//       </div>
//     </div>
//   );
// }


"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OtpInput from "../../../components/OtpInput";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/Authcontext";

export default function OtpPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "user";
  const phone = searchParams.get("phone") || "";

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [counter, setCounter] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const { loginWithToken } = useAuth(); // ✅ get from context

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
      const password = sessionStorage.getItem("password");

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${role}/create`, {
        phone,
        password,
      });

      if (res.data.success) {
        toast.success("OTP resent successfully!");
        setOtp(new Array(6).fill(""));
        sessionStorage.removeItem("password");
      } else {
        toast.error(res.data.message || "Failed to resend OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Network error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const getVerifyOTPEndpoint = () => {
      switch (role) {
        case "users":
          return "/users/verifyOTP";
        case "providers":
          return "/providers/verifyOTP";
        case "admin":
          return "/admin/verifyOTP";
        case "adminReset":
          return "/admin/verifyResetOTP";
        default:
          return "/";
      }
    };

    try {
      const enteredotp = otp.join("");
      const endpoint = getVerifyOTPEndpoint(role);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
        phone,
        otp: enteredotp,
      });

      const data = res.data;
      console.log("OTP Response:", data);

      // ✅ Handle user flows
      if (data.success && data.existing && role === "providers") {
        const result = loginWithToken(data.token); // ✅ use context
        console.log(result)
        if (result.success) {
          toast.success("OTP verified. Login successful");
          router.push("/dashboard/provider-dashboard");
        } else {
          toast.error(result.message || "Login failed");
        }
      } else if (data.newUser && role === "providers") {
        toast.success("OTP verified. Please complete signup");
        router.push(`/provider-signup?phone=${phone}&role=${role}`);
      } else if (data.success && data.existing && role === "users") {
        const result = loginWithToken(data.token); // ✅ use context
        if (result.success) {
          toast.success("OTP verified. Login successful");
          router.push("/dashboard/user-dashboard");
        } else {
          toast.error(result.message || "Login failed");
        }
      } else if (data.newUser && role === "users") {
        toast.success("OTP verified. Please complete signup");
        router.push(`/register?phone=${phone}&role=${role}`);
      } else if (data.success && role === "admin") {
        const result = loginWithToken(data.token); // ✅ use context
        if (result.success) {
          toast.success("Admin OTP verified");
          router.push("/dashboard/admin-dashboard");
          
        } else {
          toast.error(result.message || "Login failed");
        }
      } else if (data.success && role === "adminReset") {
        toast.success("OTP verified");
        router.push(`/reset-password?phone=${phone}&role=${role}`);
      } else {
        setError(data.message || "OTP verification failed");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(to top, #fff 0%, rgba(105, 90, 166, 0.99) 100%)",
      }}
    >
      <div className="p-8 rounded-xl w-full max-w-[32rem] bg-white/95 backdrop-blur-sm shadow-lg">
        <h1 className="text-3xl font-bold text-center text-[#695aa6] mb-8">OTP Verification</h1>
        {error && <p className="mb-4 text-center text-red-600">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 text-md text-center font-medium text-gray-800">
              Enter 6-digit OTP
            </label>
            <OtpInput
              otp={otp}
              setOtp={setOtp}
              canResend={canResend}
              counter={counter}
              length={6}
              handleResendOTP={handleResendOTP}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 rounded-lg font-semibold transition-all bg-[#695aa6] hover:bg-[#5a4d8a] text-white"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
