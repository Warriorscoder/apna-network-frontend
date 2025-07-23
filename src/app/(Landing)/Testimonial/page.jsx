"use client"

import { useState, useEffect } from "react"

const Testimonial = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Bareilly, UP",
      role: "Electrician",
      text: "Apna Network transformed my business. I now serve 5 villages and my income has tripled!",
    },
    {
      name: "Priya Sharma",
      location: "Sitapur, UP",
      role: "Seamstress",
      text: "Through this platform, I found consistent work and learned new skills. My family's life has improved significantly.",
    },
    {
      name: "Mohammad Ali",
      location: "Hardoi, UP",
      role: "Farmer",
      text: "The agricultural consultancy services helped me increase my crop yield by 40%. Truly game-changing!",
    },
  ]

  // Auto-slide testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  return (
    <section
      className="py-12 sm:py-16"
      style={{
        backgroundImage: "linear-gradient(to top, #fff 0%, rgba(105, 90, 166, 0.35) 99%, rgba(105, 90, 166, 0.5) 100%)",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4" style={{ color: "#695aa6" }}>
            Success Stories
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600">Real people, real impact, real change</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg"
            style={{ borderColor: "#695aa6", borderWidth: "1px" }}
          >
            <div className="text-center">
              <blockquote className="text-base sm:text-lg md:text-xl text-gray-700 mb-4 sm:mb-6 italic leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              <div>
                <div className="font-semibold text-gray-800 text-base sm:text-lg">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="font-medium text-sm sm:text-base" style={{ color: "#695aa6" }}>
                  {testimonials[currentTestimonial].role}
                </div>
                <div className="text-gray-500 text-xs sm:text-sm">{testimonials[currentTestimonial].location}</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors duration-300 ${
                  index === currentTestimonial ? "hover:opacity-80" : "bg-gray-300 hover:bg-gray-400"
                }`}
                style={{ backgroundColor: index === currentTestimonial ? "#695aa6" : undefined }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonial
