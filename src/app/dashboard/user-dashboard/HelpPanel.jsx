import React from "react";
import { HelpCircle, Mail, Phone, MessageCircle } from "lucide-react";

export default function HelpPanel() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" 
            style={{ textShadow: "0 4px 24px rgba(60,50,100,0.65), 0 2px 4px rgba(0,0,0,0.3)" }}>
          Help & Support
        </h1>
        <p className="text-white/90 text-lg" 
           style={{ textShadow: "0 2px 12px rgba(60,50,100,0.45), 0 1px 2px rgba(0,0,0,0.3)" }}>
          We're here to help you every step of the way
        </p>
      </div>

      <div className="bg-white/70 rounded-xl shadow-lg p-4 sm:p-6 border border-white/30 backdrop-blur-sm hover:shadow-xl transition-all">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-[#695aa6] flex items-center">
          <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          Need Help?
        </h2>

        <div className="space-y-4 text-sm sm:text-base">
          <p className="text-gray-700">
            Our support team is here to help you find the best service providers in
            your area.
          </p>

          <ul className="text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-[#695aa6] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              How to search and filter services
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-[#695aa6] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Making service requests and communicating with providers
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-[#695aa6] rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Managing your profile and preferences
            </li>
          </ul>

          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Quick Tips</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Use specific keywords when searching for services.</li>
              <li>• Check provider ratings and reviews before requesting.</li>
              <li>• Be detailed in your service request descriptions.</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button className="flex items-center justify-center gap-2 bg-[#695aa6] hover:bg-[#5a4d8a] rounded-lg p-2.5 sm:p-3 text-white transition">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">Email Support</span>
            </button>
          </div>

          <div className="text-center text-xs sm:text-sm text-gray-500 pt-2">
            <p>Email: support@apnanetwork.com</p>
            <p>Phone: +91 1234567890</p>
          </div>
        </div>
      </div>
    </div>
  );
}
