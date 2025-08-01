"use client"
import { Users, Search } from "lucide-react"

const CTA = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 text-white" style={{ backgroundColor: "#695aa6" }}>
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
          Ready to Transform Your Community?
        </h2>
        <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90 px-2">
          Join thousands of service providers and community members who are already making a difference
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2 hover:opacity-90"
            style={{ color: "#695aa6" }}
          >
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Register as Provider</span>
          </button>
          <button
            onClick={() => (window.location.href = "/all-services")}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 text-white rounded-xl hover:bg-white transition-all font-semibold flex items-center justify-center gap-2"
            style={{ borderColor: "#fff" }}
            onMouseEnter={(e) => (e.target.style.color = "#695aa6")}
            onMouseLeave={(e) => (e.target.style.color = "white")}
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Find Services</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default CTA
