

"use client";

import { useRef } from "react";

const OtpInput = ({ otp, setOtp, length = 6 , canResend, counter,handleResendOTP }) => {
  const inputsRef = useRef([]);

  const handleInputChange = (e, index) => {
    const value = e.target.value;

    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    } else if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (e, index) => {
    const key = e.key;

    if (key === "Backspace") {
      e.preventDefault();

      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputsRef.current[index - 1]?.focus();
      }
    } else if (key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
    } else if (key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pasted)) return;

    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className=" flex flex-col">
      <div className="flex justify-center  gap-2" >
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[index] || ""}
          onChange={(e) => handleInputChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          ref={(el) => (inputsRef.current[index] = el)}
          onFocus={(e) => e.target.setSelectionRange(0, 1)} // fixes backspace focus issue
          className="w-12 h-12 text-center text-lg border bg-gray-50 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 text-gray-900"
        />
       

      ))}
      </div>
       <div className=" mt-4">
  {canResend ? (
    <button
      type="button"
      onClick={handleResendOTP}
      className="text-sm font-medium tex hover:underline cursor-pointer"
    >
      Resend OTP
    </button>
  ) : (
    <p className="text-sm text-gray-500">Resend in {counter}s</p>
  )}
</div>
    </div>
  );
};

export default OtpInput;



