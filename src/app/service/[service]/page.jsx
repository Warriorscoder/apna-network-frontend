"use client";

import React from "react";
import { useParams } from "next/navigation";
import AllServicesComponent from "@/components/AllServicesComponent";

export default function ServiceCategoryPage() {
  const params = useParams();
  const serviceKey = params?.service;

  return (
    <AllServicesComponent
      openInNewPage={false} // render provider list inline on this page
      showBackButton={true}
      showNavbar={false}
      initialServiceKey={serviceKey} // ✅ auto-open provider list for this service
      backBehavior="history" // ensures Back returns to Featured (previous page)
    />
  );
}
