"use client";
import { useAuth } from "../context/Authcontext";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import About from "@/app/(Landing)/About/page";
import Blog from "@/app/(Landing)/Blog/page";
import CTA from "@/app/(Landing)/CTA/page";
import FeaturedServices from "@/app/(Landing)/FeaturedServices/page";
import HeroSection from "@/app/(Landing)/HeroSection/page";
import Newsletter from "@/app/(Landing)/Newsletter/page"; // ✅ ADDED: Newsletter import
import Offers from "@/app/(Landing)/Offers/page";
import StatCounter from "@/app/(Landing)/StatCounter/page";
import Testimonial from "@/app/(Landing)/Testimonial/page";
import React from "react";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <>
      <ConditionalNavbar />
      <HeroSection />
      <section id="about">
        <About />
      </section>
      <Offers />
      <section id="services">
        <FeaturedServices user={user} />
      </section>
      <StatCounter />
      <Testimonial />
      <Newsletter /> 
      <Blog />
      <section id="contact">
        <CTA />
      </section>
    </>
  );
}
