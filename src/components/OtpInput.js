"use client";

import { useRef } from 'react';

const OtpInput = ({ otp, setOtp, length = 6 }) => {
  const inputsRef = useRef([]);

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const regex = /^[0-9]$/;

    if (regex.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    } else {
      e.target.value = '';
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowRight' && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'Backspace') {
      if (e.currentTarget.value) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        e.currentTarget.value = '';
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const regex = /^[0-9]*$/;

    if (regex.test(paste)) {
      const newOtp = [...otp];
      const pasteChars = paste.split('');
      pasteChars.forEach((char, index) => {
        if (index < inputsRef.current.length) {
          if (inputsRef.current[index]) {
            inputsRef.current[index].value = char;
            newOtp[index] = char;
          }
        }
      });
      setOtp(newOtp);
      inputsRef.current[Math.min(pasteChars.length, inputsRef.current.length) - 1]?.focus();
    }
    e.preventDefault();
  };

  return (
    <div className="flex justify-center gap-2">
      {[...Array(length)].map((_, index) => (
        <input
          key={index}
          type="number"
          maxLength={1}
          ref={(el) => (inputsRef.current[index] = el)}
          value={otp[index] || ''}
          onChange={(e) => handleInputChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className="w-12 h-12 text-center text-lg border bg-gray-50 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#695aa6]/30 focus:border-[#695aa6] text-gray-900"
        />
      ))}
    </div>
  );
};

export default OtpInput;