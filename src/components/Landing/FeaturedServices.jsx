'use client'

import { useState } from 'react';

const ServiceCard = ({ service }) => {
  const [hovered, setHovered] = useState(false);

  const handleCardClick = () => {
    if (hovered && service.link && service.link !== '#') {
      window.location.href = service.link;
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleCardClick}
      className="bg-white border rounded-xl p-4 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(105,90,166,0.15)] flex flex-col items-center justify-center h-56 cursor-pointer relative overflow-hidden"
      style={{ borderColor: '#a99fd4' }} // Softer lavender tone
    >
      <div
        className={`transition-all duration-300 ease-in-out flex flex-col items-center ${
          hovered ? 'translate-y-[-40%]' : 'translate-y-0'
        }`}
      >
        <img
          src={service.image}
          alt={service.title}
          className="w-16 h-16 mb-2 object-contain"
        />
        <h3 className="text-xl font-bold text-[#695aa6]">{service.title}</h3>
      </div>

      <div
        className={`absolute bottom-4 px-2 text-xs text-gray-600 text-center transition-all duration-300 ease-in-out ${
          hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <p className="mb-1 text-sm">{service.subtitle}</p>
        {service.link === '#' && (
          <p className="text-[10px] text-red-400 italic">Coming Soon</p>
        )}
      </div>
    </div>
  );
};

const FeaturedServices = () => {
  const services = [
    { 
      image: "/imgs/Car.jpg", 
      title: "Carpenters", 
      subtitle: "Click here to get your all kind of wooden works done",
      link: "carpenter.html"
    },
    { 
      image: "/imgs/plumber 2.jpg", 
      title: "Plumbers", 
      subtitle: "Click here to get your all kind of pipeline and fitting works done",
      link: "plumber.html"
    },
    { 
      image: "/imgs/mason.jpg", 
      title: "Construction Workers", 
      subtitle: "Click here to build your dreams",
      link: "constructionworkers.html"
    },
    { 
      image: "/imgs/electrician.jpg", 
      title: "Electricians", 
      subtitle: "Click here to get your wirings fixed",
      link: "electrician.html"
    },
    { 
      image: "/imgs/painter.jpg", 
      title: "Painters", 
      subtitle: "Click here to get your walls painted and decorate",
      link: "painter.html"
    },
    { 
      image: "/imgs/welder.jpg", 
      title: "Welders", 
      subtitle: "Here are some welders of your area",
      link: "welder.html"
    },
    { 
      image: "/imgs/tailor.jpg", 
      title: "Tailors", 
      subtitle: "Click here to get outfit done",
      link: "tailors.html"
    },
    { 
      image: "/imgs/cook.jpg", 
      title: "Cooks", 
      subtitle: "Click here to taste the delicious food items",
      link: "cook.html"
    },
    { 
      image: "/imgs/gardner.jpg", 
      title: "Gardeners", 
      subtitle: "Click here to keep your gardens green forever",
      link: "gardner.html"
    },
    { 
      image: "/imgs/housekeeper.jpg", 
      title: "House Keepers", 
      subtitle: "Click here to keep your house clean",
      link: "housekeeper.html"
    },
    { 
      image: "/imgs/barber.jpg", 
      title: "Barbers", 
      subtitle: "Click here to get you hairs style done",
      link: "barber.html"
    },
    { 
      image: "/imgs/driver.jpg", 
      title: "Drivers", 
      subtitle: "Click here if you wanna go on long drive",
      link: "driver.html"
    },
    { 
      image: "/imgs/drycleaner.jpg", 
      title: "Dry Cleaners", 
      subtitle: "Click here to keep your clothes neat and cleaned",
      link: "drycleaner.html"
    },
    { 
      image: "/imgs/Photographer.jpg", 
      title: "Photographers", 
      subtitle: "Tap here to click special moments of your life",
      link: "photographer.html"
    },
    { 
      image: "/imgs/pandit.jpg", 
      title: "Astrologers", 
      subtitle: "Tap here to talk to astrologer",
      link: "pandit.html"
    },
    { 
      image: "/imgs/interior designer.jpg", 
      title: "Interior Designer", 
      subtitle: "Contact Interior Designer",
      link: "#"
    },
    { 
      image: "/imgs/4.png", 
      title: "Other Services", 
      subtitle: "Explore additional services we offer",
      link: "Other.html"
    }
  ]

  return (
    <section className="py-20" 
             style={{
               background: 'linear-gradient(to top, #fff 0%, rgba(105, 90, 166, 0.35) 99%, rgba(105, 90, 166, 0.5) 100%)'
             }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{color: '#695aa6'}}>Services We Offer</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedServices