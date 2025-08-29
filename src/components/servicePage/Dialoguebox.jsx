import React, { useState, useEffect, use } from "react";
import {
  User,
  Star,
  MapPin,
  Clock,
  Award,
  Phone,
  MessageSquare,
  ChevronRight,
  ThumbsUp,
  Calendar,
  ArrowLeft,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "@/app/context/Authcontext";
import { useRouter } from "next/navigation";

const Dialoguebox = ({ data, isOpen, onClose }) => {
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  // console.log("user ",user)
  // console.log("data from dialoguebox ",data)
  // Sample reviews data (you can replace this with API call)
  const sampleReviews = [
    {
      id: 1,
      userName: "Rajesh Kumar",
      rating: 5,
      comment:
        "Excellent service! Very professional and completed work on time. Highly recommended for carpentry work.",
      date: "2024-01-15",
      serviceType: "Furniture Making",
      helpful: 12,
    },
    {
      id: 2,
      userName: "Priya Sharma",
      rating: 4,
      comment:
        "Good quality work. Clean and efficient. Only minor delay in completion but overall satisfied.",
      date: "2024-01-10",
      serviceType: "Cabinet Installation",
      helpful: 8,
    },
    {
      id: 3,
      userName: "Amit Singh",
      rating: 5,
      comment:
        "Amazing craftsmanship! Built a beautiful wooden dining table. Worth every rupee spent.",
      date: "2024-01-05",
      serviceType: "Custom Furniture",
      helpful: 15,
    },
    {
      id: 4,
      userName: "Sunita Devi",
      rating: 3,
      comment:
        "Average service. Work was okay but could have been better. Communication was lacking.",
      date: "2023-12-28",
      serviceType: "Door Repair",
      helpful: 3,
    },
    {
      id: 5,
      userName: "Vikram Yadav",
      rating: 5,
      comment:
        "Outstanding! Fixed all my wooden furniture issues. Very reasonable pricing and excellent quality.",
      date: "2023-12-20",
      serviceType: "Furniture Repair",
      helpful: 20,
    },
  ];

  // Load reviews when reviews section is opened
  useEffect(() => {
    if (showReviews && data?.provider_id) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setReviews(sampleReviews);
        setLoading(false);
      }, 500);
    }
  }, [showReviews, data?.provider_id]);

  // Calculate average rating and total reviews
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : data?.rating || "N/A";

  const totalReviews = reviews.length;

  // Rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    stars: rating,
    count: reviews.filter((review) => review.rating === rating).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((review) => review.rating === rating).length /
            reviews.length) *
          100
        : 0,
  }));

  // Render star rating - Mobile optimized
  const renderStars = (rating, size = "w-3 h-3 sm:w-4 sm:h-4") => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle back to profile
  const handleBackToProfile = () => {
    setShowReviews(false);
  };

  // email code

  const sendEmailNotification = async ({
    name,
    phone,
    email,
    userEmail,
    category,
    now,
  }) => {
    console.log(
      "name",
      name,
      " email ",
      email,
      " phone ",
      phone,
      " category ",
      category,
      " now ",
      now,
      " userEmail ",
      userEmail
    );

    if (
      !name ||
      !phone ||
      !email ||
      !userEmail ||
      !category ||
      !now ||
      !validateEmail(email) ||
      !validateEmail(userEmail)
    ) {
      toast.error("Missing or invalid input fields");
      return;
    }

    try {
      setIsSending(true);

      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notify`, {
        name,
        phone,
        email, // provider email
        userEmail, // client email
        category,
        now,
      });

      toast.success("Email sent successfully!");
    } catch (error) {
      console.error(
        "Email send failed:",
        error?.response?.data || error.message
      );
      toast.error("Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // request code

  const createServiceRequest = async ({ user_id, provider_id, service_id }) => {
    // if (!user_id || !provider_id || !service_id) {
    //   toast.error("Missing user or service information");
    //   return;
    // }
    if(user.role === 'not logged in'){
      toast.error("Please login to request a service");
      router.push('/login');
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/service-requests/`,
        {
          user_id,
          provider_id,
          service_id,
        }
      );

      if (response.data.message) {
        toast.warn(response.data.message);
      } else {
        toast.success("Sercvice request made successfully!!");
        sendEmailNotification({
          name: user?.name,
          phone: user?.phone,
          email: data?.email || "gammingab752@gmail.com",
          userEmail: user?.email || "codeaniket123@gmail.com",
          category: data?.category,
          now: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error(
        "Service request failed:",
        error?.response?.data || error.message
      );
      toast.error("Failed to submit service request");
    }
  };

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="p-3 sm:p-6">
          {/* Reviews Only View */}
          {showReviews ? (
            <>
              {/* Mobile-Optimized Reviews Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <button
                    onClick={handleBackToProfile}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <div
                      className="w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "#695aa6" }}
                    >
                      <User className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-base sm:text-xl font-bold text-gray-800 truncate">
                        {data.name} - Reviews
                      </h2>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs sm:text-sm text-gray-600 font-medium">
                          {averageRating} ({totalReviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Mobile-Optimized Reviews Content */}
              <div className="space-y-4 sm:space-y-6">
                {loading ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-[#695aa6] mx-auto mb-3 sm:mb-4"></div>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Loading reviews...
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                    {/* Mobile-First Rating Summary - Shows at TOP on mobile */}
                    <div className="lg:col-span-1 order-1 lg:order-1">
                      <div className="bg-gray-50 rounded-lg p-4 sm:p-6 lg:sticky lg:top-0">
                        <div className="text-center mb-4 sm:mb-6">
                          <div className="text-2xl sm:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
                            {averageRating}
                          </div>
                          {renderStars(
                            Math.round(averageRating),
                            "w-4 h-4 sm:w-6 sm:h-6"
                          )}
                          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                            Based on {totalReviews} reviews
                          </p>
                        </div>

                        {/* Mobile-Optimized Rating Distribution */}
                        <div className="space-y-2 sm:space-y-3">
                          <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">
                            Rating Distribution
                          </h4>
                          {ratingDistribution.map((rating) => (
                            <div
                              key={rating.stars}
                              className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
                            >
                              <span className="w-2 sm:w-3 text-gray-600 text-xs sm:text-sm">
                                {rating.stars}
                              </span>
                              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                              <div className="flex-1 bg-gray-200 rounded-full h-1.5 sm:h-2">
                                <div
                                  className="bg-yellow-400 h-1.5 sm:h-2 rounded-full transition-all"
                                  style={{ width: `${rating.percentage}%` }}
                                ></div>
                              </div>
                              <span className="w-6 sm:w-8 text-gray-600 text-right text-xs sm:text-sm">
                                {rating.count}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Mobile-Optimized Reviews List - Shows at BOTTOM on mobile */}
                    <div className="lg:col-span-3 order-2 lg:order-2">
                      {/* Mobile Reviews Header */}
                      <div className="mb-3 sm:mb-4 lg:hidden">
                        <h3 className="text-base font-semibold text-gray-800">
                          Customer Reviews ({totalReviews})
                        </h3>
                      </div>

                      <div className="space-y-3 sm:space-y-4 max-h-[40vh] lg:max-h-[60vh] overflow-y-auto pr-1 sm:pr-2">
                        {reviews.map((review) => (
                          <div
                            key={review.id}
                            className="border border-gray-200 rounded-lg p-3 sm:p-6 hover:shadow-md transition-shadow"
                          >
                            {/* Mobile-Optimized Review Header */}
                            <div className="flex items-start justify-between mb-3 sm:mb-4">
                              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#695aa6] to-[#5a4d8a] rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs sm:text-sm font-medium text-white">
                                    {review.userName.charAt(0)}
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                                    {review.userName}
                                  </p>
                                  <div className="flex items-center space-x-1 sm:space-x-2 mt-0.5 sm:mt-1">
                                    {renderStars(review.rating)}
                                    <span className="text-xs text-gray-500">
                                      •
                                    </span>
                                    <span className="text-xs text-gray-500 capitalize truncate">
                                      {review.serviceType}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1 text-gray-500 flex-shrink-0">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="text-xs sm:text-sm">
                                  {formatDate(review.date)}
                                </span>
                              </div>
                            </div>

                            {/* Review Content */}
                            <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                              {review.comment}
                            </p>

                            {/* Mobile-Optimized Review Footer */}
                            <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100">
                              <button className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-[#695aa6] transition-colors">
                                <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="text-xs sm:text-sm">
                                  Helpful ({review.helpful})
                                </span>
                              </button>
                              <div className="flex items-center space-x-2 sm:space-x-3 text-xs text-gray-400">
                                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                  Verified
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}

                        {reviews.length === 0 && (
                          <div className="text-center py-8 sm:py-12 text-gray-500">
                            <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" />
                            <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">
                              No reviews yet
                            </h3>
                            <p className="text-xs sm:text-sm">
                              Be the first to leave a review for {data.name}!
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Mobile-Optimized Main Profile View */}
              {/* Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <div
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#695aa6" }}
                  >
                    <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">
                      {data.name}
                    </h2>
                    <div className="flex items-center space-x-2 sm:space-x-4 mt-1">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-gray-600 font-medium text-sm sm:text-base">
                          {averageRating}
                        </span>
                      </div>
                      <button
                        onClick={() => setShowReviews(true)}
                        className="flex items-center space-x-1 text-[#695aa6] hover:text-[#5a4d8a] transition-colors"
                      >
                        <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm font-medium">
                          {totalReviews} Reviews
                        </span>
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Service Details Section */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                  Service Details
                </h3>

                {/* Service Title */}
                <div className="mb-3">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-1">
                    Service Title
                  </h4>
                  <p className="text-gray-700 text-sm sm:text-base">
                    {data?.title || "Professional service provider"}
                  </p>
                </div>

                {/* Service Description */}
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">
                    Service Description
                  </h4>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {(() => {
                      const category = data?.category?.toLowerCase() || "";
                      const title = data?.title?.toLowerCase() || "";

                      if (
                        category.includes("plumber") ||
                        title.includes("plumber")
                      ) {
                        return "Professional plumbing services including pipe installation, repair, water heater services, bathroom fittings, kitchen plumbing, and emergency leak repairs. Experienced in both residential and commercial plumbing work with quality materials and reliable service.";
                      } else if (
                        category.includes("electrician") ||
                        title.includes("electrician")
                      ) {
                        return "Expert electrical services covering house wiring, electrical panel installation, ceiling fan and light fixture installation, electrical repairs, and safety inspections. Licensed electrician with experience in modern electrical systems and emergency electrical services.";
                      } else if (
                        category.includes("carpenter") ||
                        title.includes("carpenter")
                      ) {
                        return "Skilled carpentry services including custom furniture making, door and window installation, kitchen cabinets, wooden flooring, furniture repair, and interior woodwork. Quality craftsmanship with attention to detail and durable materials.";
                      } else if (
                        category.includes("painter") ||
                        title.includes("painter")
                      ) {
                        return "Professional painting services for interior and exterior walls, texture painting, wall putty work, color consultation, and protective coatings. Using premium quality paints and modern techniques for long-lasting and beautiful finishes.";
                      } else if (
                        category.includes("mason") ||
                        title.includes("mason")
                      ) {
                        return "Expert masonry services including brickwork, stone work, concrete construction, plastering, tiling, and structural repairs. Experienced in both traditional and modern construction techniques with quality materials.";
                      } else if (
                        category.includes("mechanic") ||
                        title.includes("mechanic")
                      ) {
                        return "Reliable automotive repair services including engine diagnostics, brake services, transmission repair, electrical system repair, and routine maintenance. Experienced with all vehicle types and committed to quality repairs.";
                      } else if (
                        category.includes("ac") ||
                        category.includes("air conditioning") ||
                        title.includes("ac")
                      ) {
                        return "Professional AC services including installation, repair, maintenance, gas refilling, and cleaning services. Expert in all AC brands and types with quick response time and genuine spare parts.";
                      } else if (
                        category.includes("cleaning") ||
                        title.includes("cleaning")
                      ) {
                        return "Comprehensive cleaning services for homes and offices including deep cleaning, regular maintenance cleaning, carpet cleaning, and specialized cleaning services. Using eco-friendly products and professional cleaning equipment.";
                      } else if (
                        category.includes("gardening") ||
                        title.includes("gardening")
                      ) {
                        return "Professional gardening and landscaping services including garden design, plant care, lawn maintenance, tree pruning, and seasonal garden care. Creating beautiful and sustainable outdoor spaces.";
                      } else if (
                        category.includes("security") ||
                        title.includes("security")
                      ) {
                        return "Reliable security services including security guard services, surveillance system installation, access control systems, and security consultations. Ensuring safety and peace of mind for residential and commercial properties.";
                      } else {
                        return `Professional ${
                          data?.category || "service"
                        } provider offering quality services with experienced professionals. Committed to customer satisfaction, timely completion, and competitive pricing. Contact for detailed consultation and customized service solutions.`;
                      }
                    })()}
                  </p>
                </div>
              </div>

              {/* Mobile-Optimized Contact & Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                    Contact Information
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm sm:text-base break-words">
                        {data.address || "Address not provided"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-600 text-sm sm:text-base">
                        {data.availability}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                    Experience Details
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center space-x-2">
                      <Award
                        className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                        style={{ color: "#695aa6" }}
                      />
                      <span className="text-gray-600 text-sm sm:text-base">
                        {`${data.experience} years` ||
                          "Experience not specified"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600 capitalize px-2 py-1 rounded bg-gray-100 text-xs sm:text-sm">
                        {data?.category || "Unknown category"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile-Optimized Service Tags */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                  Service Tags
                </h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {data?.tags?.length ? (
                    data.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                        style={{ backgroundColor: "#695aa6" }}
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-600 text-sm">
                      No tags available
                    </span>
                  )}
                </div>
              </div>

              {/* Mobile-Optimized Contact Buttons */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => {
                    createServiceRequest({
                      user_id: user.id,
                      provider_id: data.provider_id,
                      service_id: data.serviceId,
                    });
                  }}
                  disabled={isSending}
                  className={`flex-1 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base ${
                    isSending ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  style={{ backgroundColor: "#695aa6" }}
                  onMouseEnter={(e) => {
                    if (!isSending) e.target.style.backgroundColor = "#5a4a96";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSending) e.target.style.backgroundColor = "#695aa6";
                  }}
                >
                  {isSending ? "Loading..." : "Send Email"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dialoguebox;
