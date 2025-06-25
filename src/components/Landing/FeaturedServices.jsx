"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const ServiceCard = ({ service, onClick }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="bg-white border rounded-xl p-4 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(105,90,166,0.15)] flex flex-col items-center justify-center h-56 relative overflow-hidden cursor-pointer"
      style={{ borderColor: "#a99fd4" }}
    >
      <div
        className={`transition-all duration-300 ease-in-out flex flex-col items-center ${
          hovered ? "translate-y-[-40%]" : "translate-y-0"
        }`}
      >
        <img
          src={service.image || "/placeholder.svg?height=64&width=64"}
          alt={service.title}
          className="w-16 h-16 mb-2 object-contain"
        />
        <h3 className="text-xl font-bold text-[#695aa6]">{service.title}</h3>
      </div>
      <div
        className={`absolute bottom-4 px-2 text-xs text-gray-600 text-center transition-all duration-300 ease-in-out ${
          hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <p className="mb-1 text-sm">{service.subtitle}</p>
      </div>
    </div>
  )
}

const services = [
  {
    image: "/imgs/Car.jpg",
    title: "Carpenters",
    subtitle: "Click here to get your all kind of wooden works done",
    serviceKey: "carpenters",
  },
  {
    image: "/imgs/plumber 2.jpg",
    title: "Plumbers",
    subtitle: "Click here to get your all kind of pipeline and fitting works done",
    serviceKey: "plumbers",
  },
  {
    image: "/imgs/mason.jpg",
    title: "Construction Workers",
    subtitle: "Click here to build your dreams",
    serviceKey: "construction-workers",
  },
  {
    image: "/imgs/electrician.jpg",
    title: "Electricians",
    subtitle: "Click here to get your wirings fixed",
    serviceKey: "electricians",
  },
  {
    image: "/imgs/painter.jpg",
    title: "Painters",
    subtitle: "Click here to get your walls painted and decorate",
    serviceKey: "painters",
  },
  {
    image: "/imgs/welder.jpg",
    title: "Welders",
    subtitle: "Here are some welders of your area",
    serviceKey: "welders",
  },
  {
    image: "/imgs/tailor.jpg",
    title: "Tailors",
    subtitle: "Click here to get outfit done",
    serviceKey: "tailors",
  },
  {
    image: "/imgs/cook.jpg",
    title: "Cooks",
    subtitle: "Click here to taste the delicious food items",
    serviceKey: "cooks",
  },
  {
    image: "/imgs/gardner.jpg",
    title: "Gardeners",
    subtitle: "Click here to keep your gardens green forever",
    serviceKey: "gardeners",
  },
  {
    image: "/imgs/housekeeper.jpg",
    title: "House Keepers",
    subtitle: "Click here to keep your house clean",
    serviceKey: "housekeepers",
  },
  {
    image: "/imgs/barber.jpg",
    title: "Barbers",
    subtitle: "Click here to get you hairs style done",
    serviceKey: "barbers",
  },
  {
    image: "/imgs/driver.jpg",
    title: "Drivers",
    subtitle: "Click here if you wanna go on long drive",
    serviceKey: "drivers",
  },
  {
    image: "/imgs/drycleaner.jpg",
    title: "Dry Cleaners",
    subtitle: "Click here to keep your clothes neat and cleaned",
    serviceKey: "dry-cleaners",
  },
  {
    image: "/imgs/Photographer.jpg",
    title: "Photographers",
    subtitle: "Tap here to click special moments of your life",
    serviceKey: "photographers",
  },
  {
    image: "/imgs/pandit.jpg",
    title: "Astrologers",
    subtitle: "Tap here to talk to astrologer",
    serviceKey: "astrologers",
  },
  {
    image: "/imgs/interior designer.jpg",
    title: "Interior Designer",
    subtitle: "Contact Interior Designer",
    serviceKey: "interior-designer",
  },
  {
    image: "/imgs/4.png",
    title: "Other Services",
    subtitle: "Explore additional services we offer",
    serviceKey: "other-services",
  },
];

const LoginModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
      <h2 className="text-2xl font-bold mb-4 text-[#695aa6]">Login Required</h2>
      <p className="mb-6 text-gray-700">Please log in or register to view service providers.</p>
      <a
        href="/login"
        className="block w-full py-3 rounded-lg font-semibold text-white bg-[#695aa6] hover:bg-[#5a4d8a] transition mb-3"
      >
        Login
      </a>
      <a
        href="/register"
        className="block w-full py-2 rounded-lg font-semibold text-[#695aa6] bg-gray-100 hover:bg-gray-200 transition"
      >
        Register
      </a>
      <button
        className="w-full py-2 rounded-lg font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 transition mt-2"
        onClick={onClose}
      >
        Cancel
      </button>
    </div>
  </div>
);

const FeaturedServices = ({ user }) => {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);

  const handleServiceClick = (serviceKey) => {
    if (!user) {
      setShowLogin(true);
    } else {
      router.push(`/service/${serviceKey}`);
    }
  };

  return (
    <section
      className="py-20"
      style={{
        background: "linear-gradient(to top, #fff 0%, rgba(105, 90, 166, 0.35) 99%, rgba(105, 90, 166, 0.5) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: "#695aa6" }}>
            Services We Offer
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {services.map((service, index) => (
            <ServiceCard
              key={service.serviceKey || index}
              service={service}
              onClick={() => handleServiceClick(service.serviceKey)}
            />
          ))}
        </div>
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </section>
  );
};

export default FeaturedServices;