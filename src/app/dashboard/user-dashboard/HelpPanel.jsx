import React from "react";
import { HelpCircle, Mail } from "lucide-react";

export default function HelpPanel() {
  return (
      <div className="bg-white/70 rounded-xl shadow-lg p-6 border border-white/30 backdrop-blur-sm hover:shadow-xl transition-all">
    <h2 className="text-2xl font-semibold mb-4 text-[#695aa6] flex items-center">
      <HelpCircle className="w-6 h-6 mr-2" />
      Need Help?
    </h2>

    <div className="space-y-4">
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
        <li className="flex items-start">
          <span className="w-2 h-2 bg-[#695aa6] rounded-full mt-2 mr-3 flex-shrink-0"></span>
          Payment and booking processes
        </li>
      </ul>

      <div className="bg-gray-50 rounded-lg p-4 mt-4">
        <h3 className="font-semibold text-gray-800 mb-2">Quick Tips</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Use specific keywords when searching for services</li>
          <li>• Check provider ratings and reviews before requesting</li>
          <li>• Be detailed in your service request descriptions</li>
          <li>• Save your favorite providers for quick access</li>
        </ul>
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <button className="flex items-center justify-center gap-2 bg-[#695aa6] hover:bg-[#5a4d8a] rounded-lg p-3 text-white transition">
          <Mail className="w-4 h-4" />
          <span className="font-medium">Contact Support</span>
        </button>

        <div className="text-center text-sm text-gray-500">
          Email: support@apnanetwork.com
        </div>
      </div>
    </div>
  </div>
  );
}
