"use client";
import AllServicesComponent from "@/components/AllServicesComponent";

const FeaturedServices = ({ user, showBackButton = false }) => {
  return (
    <AllServicesComponent
      openInNewPage={true}
      showBackButton={showBackButton}
      showNavbar={false}
    />
  );
};

export default FeaturedServices;
