// app/otp-verification/page.jsx
"use client";

import { Suspense } from 'react';
import OtpPage from './OtpPage'; 

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtpPage />
    </Suspense>
  );
}
