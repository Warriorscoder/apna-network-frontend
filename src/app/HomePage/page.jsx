"use client";
import { useAuth } from "../context/Authcontext";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import About from "@/components/Landing/About";
import Blog from "@/components/Landing/Blog";
import CTA from "@/components/Landing/CTA";
import FeaturedServices from "@/components/Landing/FeaturedServices";
import HeroSection from "@/components/Landing/HeroSection";
import Offers from "@/components/Landing/Offers";
import StatCounter from "@/components/Landing/StatCounter";
import Testimonial from "@/components/Landing/Testimonial";
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
      <Blog />
      <section id="contact">
        <CTA />
      </section>
    </>
  );
}
