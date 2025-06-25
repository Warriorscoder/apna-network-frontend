import HeroSection from '@/components/Landing/HeroSection';
import FeaturedServices from '@/components/Landing/FeaturedServices';
import StatCounter from '@/components/Landing/StatCounter';
import Testimonial from '@/components/Landing/Testimonial';
import Blog from '@/components/Landing/Blog';
import CTA from '@/components/Landing/CTA';
import Footer from '@/app/Footer';
import About from '@/components/Landing/About';
import Offers from '@/components/Landing/Offers';
// import Partners from '@/components/Partners';
export default function Home() {
  return (
    <>
       <HeroSection />
       <section id='about'>
        <About />
       </section>
        <Offers />
        <section id='services'>
        <FeaturedServices />
        </section>
        <StatCounter />
       {/* <Partners /> */}
      <Testimonial />
      <Blog />
      <section id='contact'>
      <CTA />
      </section>
      <Footer />
       
    </>
  );
}