"use client";
import { useState, useEffect } from "react";
import {
  Calendar,
  ExternalLink,
  ArrowRight,
  BookOpen,
  Clock,
} from "lucide-react";
import axios from "axios";

export default function Newsletter() {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/newsletter`
      );
      if (response.data.success) {
        setNewsletters(response.data.data.slice(0, 6));
      }
    } catch (err) {
      console.error("Failed to fetch newsletters:", err);
      setError("Failed to load newsletters");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateContent = (content, maxLength = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <section
        className="py-12 sm:py-16 md:py-20 relative overflow-hidden"
        style={{ backgroundColor: "#695aa6" }} 
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 mx-auto mb-4"
              style={{ borderColor: "#fff" }}
            ></div>
            <p className="text-white text-sm sm:text-lg">
              {" "}
              Loading newsletters...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error || newsletters.length === 0) {
    return (
      <section
        className="py-12 sm:py-16 md:py-20 relative overflow-hidden"
        style={{ backgroundColor: "#695aa6" }} // ✅ CHANGED: Purple background
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-white/70 mx-auto mb-4" />{" "}
            <p className="text-white text-sm sm:text-lg px-4">
              {" "}
              No newsletters available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-8 sm:py-12 md:py-16 relative overflow-hidden"
      style={{ backgroundColor: "#695aa6" }} // ✅ CHANGED: Purple background
    >
      {/* Subtle Background Decorations for Purple Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>{" "}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>{" "}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Header with White Text */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 md:mb-5 text-white">
            {" "}
            Latest Newsletters
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-xl mx-auto">
            {" "}
            Stay updated with our latest news and community stories
          </p>
        </div>

        <div className="overflow-x-auto md:overflow-x-visible">
          <div className="flex justify-center gap-3 sm:gap-4 pb-3 md:justify-start md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {newsletters.map((newsletter) => (
              <div
                key={newsletter._id}
                className="flex-shrink-0 w-80 sm:w-72 md:w-auto group bg-white rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" // ✅ CHANGED: Enhanced shadow and border for purple bg
              >
                <div className="md:block flex">
                  <div className="relative w-24 h-24 md:w-full md:h-36 overflow-hidden flex-shrink-0">
                    <img
                      src={
                        newsletter.image_url ||
                        "/imgs/newsletter-placeholder.jpg"
                      }
                      alt={newsletter.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x300/695aa6/ffffff?text=Newsletter";
                      }}
                      loading="lazy"
                    />
                    <div className="absolute top-1 left-1 md:top-2 md:left-2">
                      <span className="inline-flex items-center px-2 py-0.5 bg-gradient-to-r from-[#a99fd4] to-[#695aa6] text-white text-xs font-medium rounded-full shadow-sm">
                        {newsletter.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 md:p-4 flex-1">
                    <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(newsletter.date)}</span>
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#695aa6] transition-colors">
                      {newsletter.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2">
                      {truncateContent(newsletter.content, 100)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Button for Purple Background */}
        {newsletters.length > 0 && (
          <div className="text-center mt-6 sm:mt-8 md:mt-10">
            <button className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-[#695aa6] rounded-xl font-semibold text-base shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/95">
              {" "}
              <BookOpen className="w-5 h-5 group-hover:rotate-6 transition-transform duration-300" />
              <span>View All Newsletters</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300" />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
