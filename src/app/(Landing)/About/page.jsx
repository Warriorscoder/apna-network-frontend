"use client"

import { Users, Briefcase, TrendingUp } from "lucide-react"

const About = () => {
  return (
    <section
      className="py-12 sm:py-16 md:py-20"
      style={{
        background: "linear-gradient(to top, #fff 0%, rgba(105, 90, 166, 0.15) 99%, rgba(105, 90, 166, 0.25) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
            style={{
              background: "linear-gradient(to right, #695aa6, #5a4d8a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Who we are ?
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <div
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border"
              style={{ borderColor: "rgba(105, 90, 166, 0.2)" }}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4 sm:mb-6">
                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-0 sm:mr-4"
                  style={{
                    background: "linear-gradient(to right, #695aa6, #5a4d8a)",
                  }}
                >
                  <img src="/imgs/4.png" alt="" className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div
                  className="text-xl sm:text-2xl font-bold text-center sm:text-left"
                  style={{
                    background: "linear-gradient(to right, #695aa6, #5a4d8a)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  APNA NETWORK
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-center sm:text-left">
                'Apna Network' is a platform envisioned by 'Swabhiman Foundation' which acts as a Platform between the
                Service Providers and the Service Receivers. Post Covid 19 there has been a lot of crisis for the
                Service Providers of the basic services such as Plumbers, Electricians, Painters, Welders, Tailors,
                Cooks, Gardeners, House Keepers, Maids / House Helpers and so on. Also, the Service Receivers face a lot
                of difficulty in reaching such Service Providers when needed in their near reach. Hence, Apna Network
                will act as a platform to overcome these hurdles. It is being 'Marketed' and 'Managed' by 'Maple
                Innovative Solutions'
              </p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
            <div
              className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border"
              style={{ borderColor: "rgba(105, 90, 166, 0.2)" }}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-3 sm:mb-4">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-0 sm:mr-4"
                  style={{
                    background: "linear-gradient(to right, #695aa6, #5a4d8a)",
                  }}
                >
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center sm:text-left">
                  Professional Network
                </h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600 text-center sm:text-left">
                Connecting skilled professionals with communities that need their services.
              </p>
            </div>

            <div
              className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border"
              style={{ borderColor: "rgba(105, 90, 166, 0.2)" }}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-3 sm:mb-4">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-0 sm:mr-4"
                  style={{
                    background: "linear-gradient(to right, #695aa6, #5a4d8a)",
                  }}
                >
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center sm:text-left">
                  Economic Growth
                </h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600 text-center sm:text-left">
                Fostering economic development in rural areas through service connectivity.
              </p>
            </div>

            <div
              className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border"
              style={{ borderColor: "rgba(105, 90, 166, 0.2)" }}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-3 sm:mb-4">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-0 sm:mr-4"
                  style={{
                    background: "linear-gradient(to right, #5a4d8a, #4a3f73)",
                  }}
                >
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center sm:text-left">
                  Community Building
                </h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600 text-center sm:text-left">
                Strengthening communities by bridging the gap between service providers and receivers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
