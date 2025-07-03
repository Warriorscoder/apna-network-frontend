"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordRules, setPasswordRules] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");
  const identifier = searchParams.get("identifier") || phone;

  const checkPasswordRules = (password) => {
    setPasswordRules({
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    checkPasswordRules(value);
  };


  const handleSubmit = async (e)=>{
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const allRulesMet = Object.values(passwordRules).every(Boolean);
    if (!allRulesMet) {
      setError("Password does not meet all requirements");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/resetPassword`;
      const res = await axios.post(endpoint,{phone ,newPassword})
      const data = res.data;
      console.log('Reset password response:', data);
      if (res.data.success) {
        router.push("/login");
        toast.success(" Password reset successfully. Please log in with your new password.");
      } else {
        setError(res.data.message || "Failed to reset password");
        toast.error(res.data.message || " Failed to reset password");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Network error. Please try again.");
      toast.error(err.response?.data?.message || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setError("");

  //   if (newPassword !== confirmPassword) {
  //     setError("Passwords do not match");
  //     setIsLoading(false);
  //     return;
  //   }

  //   const allRulesMet = Object.values(passwordRules).every(Boolean);
  //   if (!allRulesMet) {
  //     setError("Password does not meet all requirements");
  //     setIsLoading(false);
  //     return;
  //   }

  //   try {
  //     const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/resetpassword`;
  //     const body = { newPassword, confirmPassword };
  //     if (identifier) body.identifier = identifier;

  //     const res = await fetch(endpoint, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(body),
  //     });
  //     const data = await res.json();

  //     if (res.ok) {
  //       router.push("/auth/login");
  //     } else {
  //       setError(data.message || "Failed to reset password");
  //     }
  //   } catch {
  //     setError("Network error. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-t from-white to-[rgba(105,90,166,0.99)]">
      <div className="p-8 rounded-xl w-full max-w-[32rem] bg-white/95 backdrop-blur-sm shadow-lg">
        <h1 className="text-3xl font-bold text-center text-[#695aa6] mb-8">Reset Password</h1>
        {error && <p className="mb-4 text-center text-red-600">{error}</p>}
        {identifier && (
          <p className="mb-4 text-center text-gray-600">
            Resetting password for: {identifier}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">Enter New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
            <div className="text-sm text-gray-600 mt-2 mb-4">
              <ul className="list-disc pl-5">
                <li className={passwordRules.minLength ? "text-green-600" : "text-grey-700"}>
                  At least 8 characters
                </li>
                <li className={passwordRules.hasNumber ? "text-green-600" : "text-grey-700"}>
                  Contains a number
                </li>
                <li className={passwordRules.hasSpecialChar ? "text-green-600" : "text-grey-700"}>
                  Contains a special character
                </li>
              </ul>
            </div>
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 rounded-[6px] bg-white border border-gray-300 text-gray-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 rounded-lg font-semibold transition-all bg-[#695aa6] hover:bg-[#5a4d8a] text-white"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
