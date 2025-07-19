"use client";

import { Suspense } from "react";
import ServiceTakerSignUp from "./ServiceTakerSignUp"; 

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServiceTakerSignUp />
    </Suspense>
  );
}
