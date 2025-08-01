import React from "react";
import { HelpCircle, Mail, Phone, MessageCircle, Users, Briefcase } from "lucide-react";

export default function HelpPanel() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" 
            style={{ textShadow: "0 4px 24px rgba(60,50,100,0.65), 0 2px 4px rgba(0,0,0,0.3)" }}>
          Provider Help & Support
        </h1>
        <p className="text-white/90 text-lg" 
           style={{ textShadow: "0 2px 12px rgba(60,50,100,0.45), 0 1px 2px rgba(0,0,0,0.3)" }}>
          Get the help you need to grow your service business
        </p>
      </div>

      <div className="bg-white/70 rounded-xl shadow-lg p-4 sm:p-6 border border-white/30 backdrop-blur-sm hover:shadow-xl transition-all">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-[#695aa6] flex items-center">
          <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          Need Help?
        </h2>

        <div className="space-y-4 text-sm sm:text-base">
          <p className="text-gray-700">
            Our provider support team is here to help you manage your services, 
            connect with customers, and grow your business successfully.
          </p>

          <ul className="text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-[#695aa6] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Setting up and managing your service listings
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-[#695aa6] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Responding to customer requests and inquiries
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-[#695aa6] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Managing your availability and pricing
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-[#695aa6] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Understanding payment processes and policies
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-[#695aa6] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Building your profile and gaining customer trust
            </li>
          </ul>

          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-[#695aa6]" />
              Provider Success Tips
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Complete your profile with detailed service descriptions and photos.</li>
              <li>• Respond to customer inquiries promptly and professionally.</li>
              <li>• Maintain competitive pricing while ensuring quality service.</li>
              <li>• Collect and showcase positive customer reviews and ratings.</li>
              <li>• Keep your availability calendar updated to avoid conflicts.</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 gap-3 pt-2">
            <button className="flex items-center justify-center gap-2 bg-[#695aa6] hover:bg-[#5a4d8a] rounded-lg p-2.5 sm:p-3 text-white transition">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">Email Support</span>
            </button>
          </div>

          <div className="text-center text-xs sm:text-sm text-gray-500 pt-2">
            <p className="flex items-center justify-center gap-1 mb-1">
              <Mail className="w-3 h-3" />
              Email: providers@apnanetwork.com
            </p>
            <p className="flex items-center justify-center gap-1">
              <Phone className="w-3 h-3" />
              Phone: +91 1234567890 (Provider Support)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
