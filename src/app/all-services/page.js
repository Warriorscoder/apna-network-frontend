"use client";
import AllServicesComponent from "@/components/AllServicesComponent";

export default function AllServicesPage() {
  return (
    <AllServicesComponent 
      openInNewPage={false} 
      showBackButton={false}
      showNavbar={true}
    />
  );
}
