"use client"

import { useRouter } from "next/navigation"
import { Users, Briefcase, TrendingUp, Target, Heart, Award, CheckCircle } from "lucide-react"
import ConditionalNavbar from "@/components/ConditionalNavbar"
import MarqueeSlider from "./MarqueeSlider"

const AboutPage = () => {
  const router = useRouter()

  const handleBackToHome = () => {
    router.push("/")
  }

  const gradientText = "bg-gradient-to-r from-[#695aa6] to-[#5a4d8a] bg-clip-text text-transparent"

  const sectionBoxStyle =
    "bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-[#695aa6]/20"

  const features = [
    {
      icon: <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />,
      title: "Verified Professionals",
      description: "All service providers are verified and background checked for your safety and peace of mind.",
    },
    {
      icon: <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />,
      title: "Community Focused",
      description: "Built specifically for rural and semi-urban communities to access essential services easily.",
    },
    {
      icon: <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white" />,
      title: "Quality Assured",
      description: "We ensure quality service delivery through our rating and feedback system.",
    },
    {
      icon: <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />,
      title: "Local Network",
      description: "Connect with service providers in your immediate vicinity for quick and efficient service.",
    },
    {
      icon: <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />,
      title: "Economic Empowerment",
      description: "Supporting local economy by providing platform for skilled professionals to grow their business.",
    },
    {
      icon: <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />,
      title: "Social Impact",
      description: "Contributing to social development by bridging the gap between service providers and receivers.",
    },
  ]

  return (
    <div
      className="min-h-screen"
      style={{
        background: `
      linear-gradient(to top, #fff 0%, rgba(105,90,166,0.35) 99%, rgba(105,90,166,0.5) 100%), center bottom / cover no-repeat
    `,
      }}
    >
      <ConditionalNavbar />

      {/* About Description & Features */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20">
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
            {/* Apna Network Card - Now centered with other cards */}
            <div className="relative order-1 flex items-center">
              <div
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border w-full"
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
                  Cooks, Gardeners, House Keepers, Maids / House Helpers and so on. Also, the Service Receivers face a
                  lot of difficulty in reaching such Service Providers when needed in their near reach. Hence, Apna
                  Network will act as a platform to overcome these hurdles. It is being 'Marketed' and 'Managed' by
                  'Maple Innovative Solutions'
                </p>
              </div>
            </div>

            {/* Feature Cards - Now properly aligned */}
            <div className="space-y-4 sm:space-y-6 order-2 flex flex-col justify-center">
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

      {/* Mission & Vision */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-t from-white via-[#695aa6]/10 to-[#695aa6]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 ${gradientText}`}>
            Our Mission & Vision
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
            {[
              {
                icon: <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />,
                title: "Our Mission",
                desc: "To empower rural and urban communities by connecting them with verified skilled professionals and essential services.",
              },
              {
                icon: <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />,
                title: "Our Vision",
                desc: "To be the leading platform transforming access to services, economic upliftment, and social development.",
              },
            ].map((item, i) => (
              <div key={i} className={sectionBoxStyle}>
                <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-0 sm:mr-4 bg-gradient-to-r from-[#695aa6] to-[#5a4d8a]">
                    {item.icon}
                  </div>
                  <h3 className={`text-xl sm:text-2xl font-bold text-center sm:text-left ${gradientText}`}>
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed text-center sm:text-left">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-t from-white via-[#695aa6]/10 to-[#695aa6]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 ${gradientText}`}>
            Why Choose Apna Network?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {features.map((f, i) => (
              <div key={i} className={sectionBoxStyle}>
                <div className="flex flex-col sm:flex-row items-center sm:items-start mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 bg-gradient-to-r from-[#695aa6] to-[#5a4d8a]">
                    {f.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center sm:text-left">{f.title}</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600 text-center sm:text-left">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 ${gradientText}`}>
            We Work With
          </h2>
          <MarqueeSlider />
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-[#695aa6] to-[#5a4d8a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Join Our Network Today
          </h2>
          <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 px-2">
            Whether you're a provider looking to grow or a community member in need, Apna Network is your gateway to
            trusted services.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <button
              onClick={() => router.push("/all-services")}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-white text-[#695aa6] rounded-lg font-semibold hover:bg-gray-100 shadow-md text-sm sm:text-base"
            >
              Explore Services
            </button>
            <button
              onClick={() => router.push("/register")}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#695aa6] transition text-sm sm:text-base"
            >
              Join as Provider
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
