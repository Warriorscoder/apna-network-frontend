"use client"

import { useState, useEffect } from "react"
import { Briefcase, Users, MapPin, Star } from "lucide-react"

const StatCard = ({ icon: Icon, value, label, suffix = "+" }) => {
  return (
    <div className="text-center group">
      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300 text-violet-300">
        {value.toLocaleString()}
        {suffix}
      </div>
      <div className="text-white flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-sm sm:text-base md:text-lg">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "rgba(105, 90, 166, 0.8)" }} />
        <span className="text-center">{label}</span>
      </div>
    </div>
  )
}

const StatCounter = () => {
  const [stats, setStats] = useState({
    jobsDone: 0,
    providers: 0,
    communities: 0,
    satisfaction: 0,
  })

  useEffect(() => {
    const targets = { jobsDone: 1000, providers: 200, communities: 150, satisfaction: 95 }
    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps

      setStats({
        jobsDone: Math.floor(targets.jobsDone * progress),
        providers: Math.floor(targets.providers * progress),
        communities: Math.floor(targets.communities * progress),
        satisfaction: Math.floor(targets.satisfaction * progress),
      })

      if (step >= steps) clearInterval(timer)
    }, stepDuration)

    return () => clearInterval(timer)
  }, [])

  return (
    <section
      className="py-12 sm:py-16 md:py-20 text-white relative overflow-hidden"
      style={{ backgroundColor: "#695aa6" }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(105, 90, 166, 0.1)" }}></div>
      <div className="absolute inset-0">
        <div
          className="absolute top-5 sm:top-10 left-5 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 rounded-full blur-xl animate-pulse"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
        ></div>
        <div
          className="absolute bottom-5 sm:bottom-10 right-10 sm:right-20 w-24 h-24 sm:w-40 sm:h-40 rounded-full blur-xl animate-pulse"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-64 sm:h-64 rounded-full blur-2xl"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white">Our Impact</h2>
          <p className="text-base sm:text-lg md:text-xl text-white opacity-80">
            Making a difference across communities
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          <StatCard icon={Briefcase} value={stats.jobsDone} label="Jobs Completed" />
          <StatCard icon={Users} value={stats.providers} label="Service Providers" />
          <StatCard icon={MapPin} value={stats.communities} label="Communities Served" />
          <StatCard icon={Star} value={stats.satisfaction} label="Satisfaction Rate" suffix="%" />
        </div>
      </div>
    </section>
  )
}

export default StatCounter
