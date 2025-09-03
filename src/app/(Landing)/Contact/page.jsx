"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Phone, Mail, Clock, Send, ArrowRight, CheckCircle, ChevronDown, ChevronUp } from "lucide-react"
import ConditionalNavbar from "@/components/ConditionalNavbar"
import axios from "axios"
import { toast } from "react-toastify"

const ContactPage = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    serviceType: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [openFAQ, setOpenFAQ] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const companyEmail = process.env.NEXT_PUBLIC_EMAIL;

    if (!companyEmail) {
      console.error("Error: NEXT_PUBLIC_EMAIL environment variable is not set.");
      toast.error("Server configuration error. Please contact support.");
      setIsSubmitting(false);
      return;
    }

    const emailPayload = {
      ...formData,
      companyEmail: companyEmail,
      userEmail: formData.email,
    };

    try {
      const response = await axios.post(`${process.env.  NEXT_PUBLIC_API_BASE_URL}/contact`, emailPayload);

      if (response.status === 200) {
        console.log("Contact form submitted successfully:", formData);
        setSubmitStatus("success");
        toast.success("Your message has been sent successfully!");

        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          serviceType: "",
        });
      } else {
        throw new Error(response.data.message || 'An unexpected error occurred.');
      }
    } catch (error) {
      console.error("Submission failed:", error?.response?.data || error.message);
      setSubmitStatus("error");
      toast.error("Failed to send your message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const serviceTypes = [
    "General Inquiry",
    "Service Provider Registration",
    "Customer Support",
    "Business Partnership",
    "Technical Support",
    "Feedback & Suggestions",
    "Other",
  ]

  const faqs = [
    {
      question: "How do I register as a service provider?",
      answer:
        "You can register as a service provider by clicking on 'Join Now' and selecting the provider option. Fill out your details, verify your credentials, and start receiving service requests.",
    },
    {
      question: "How do you verify service providers?",
      answer:
        "All service providers undergo thorough background verification including identity verification, skill assessment, and reference checks to ensure quality and safety.",
    },
    {
      question: "What if I'm not satisfied with a service?",
      answer: "We have a comprehensive customer support system. You can rate and review services, report issues.",
    },
    {
      question: "Is there any registration fee?",
      answer:
        "No, registration is completely free for both service providers and customers. We believe in making quality services accessible to everyone.",
    },
  ]

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{
        background: `
        linear-gradient(to top, #fff 0%, rgba(105,90,166,0.35) 99%, rgba(105,90,166,0.5) 100%), center bottom / cover no-repeat
      `,
      }}
    >
      <ConditionalNavbar />

      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-4 tracking-tight"
              style={{
                background: "linear-gradient(to right, #695aa6, #5a4d8a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Contact Us
            </h1>
            <div className="h-1 w-16 sm:w-24 mx-auto bg-[#695aa6] rounded-full mb-4 sm:mb-6 shadow-md"></div>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto text-gray-600 px-2">
              Get in touch with us. We're here to help you connect with the right services
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 tracking-tight text-[#695aa6]">
              Send us a Message
            </h2>
            <div className="h-1 w-12 sm:w-16 mx-auto bg-[#695aa6] rounded-full mb-3 sm:mb-4"></div>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              Fill out the form below and we'll get back to you as soon as possible. Our team is ready to assist you
              with any questions or concerns.
            </p>
          </div>

          <div className="space-y-8 sm:space-y-12">
            {/* Contact Form */}
            <div className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 bg-white shadow-2xl border border-[#695aa6]/20 max-w-4xl mx-auto transition-all duration-300">
              {submitStatus === "success" && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 border border-green-200 rounded-lg flex items-center gap-2 sm:gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <p className="text-sm sm:text-base text-green-800 font-medium">
                    Message sent successfully! We'll get back to you soon.
                  </p>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm sm:text-base text-red-800 font-medium">
                    Failed to send message. Please try again.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent transition-all bg-gray-50 text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent transition-all bg-gray-50 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 12345 67890"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent transition-all bg-gray-50 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                      Inquiry Type
                    </label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent transition-all bg-gray-50 text-sm sm:text-base"
                    >
                      <option value="">Select inquiry type</option>
                      {serviceTypes.map((type, index) => (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Brief subject of your message"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent transition-all bg-gray-50 text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#695aa6] focus:border-transparent transition-all resize-none bg-gray-50 text-sm sm:text-base"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#695aa6] to-[#5a4d8a] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      Send Email
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Contact Card */}
            <div className="bg-gradient-to-br from-[#695aa6] to-[#5a4d8a] rounded-2xl p-6 sm:p-8 text-white max-w-4xl mx-auto">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Need Immediate Help?</h3>
              <p className="mb-4 sm:mb-6 opacity-90 text-sm sm:text-base">
                For urgent inquiries, call us directly or visit our office during business hours.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">+91 12345 67890</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">info@apnanetwork.com</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Mon-Fri 9AM-6PM</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/all-services")}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white text-[#695aa6] rounded-lg font-semibold hover:bg-gray-100 transition-all text-sm sm:text-base"
              >
                Browse Services
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        className="py-12 sm:py-16 md:py-20"
        style={{
          background:
            "linear-gradient(135deg, rgba(105, 90, 166, 0.8) 0%, rgba(90, 77, 138, 0.85) 50%, rgba(74, 63, 115, 0.9) 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white/90">
              Quick answers to common questions about our services
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-white/5 transition-all duration-200"
                >
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white pr-4">{faq.question}</h3>
                  <div className="flex-shrink-0">
                    {openFAQ === index ? (
                      <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    ) : (
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    )}
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openFAQ === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                    <div className="h-px bg-white/20 mb-3 sm:mb-4"></div>
                    <p className="text-sm sm:text-base text-white/80 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
