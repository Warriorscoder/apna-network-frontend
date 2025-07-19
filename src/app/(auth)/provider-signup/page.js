// app/otp-verification/page.jsx
"use client";

import { Suspense } from 'react';
import Providersignup from './Providersignup'; 

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Providersignup />
    </Suspense>
  );
}
