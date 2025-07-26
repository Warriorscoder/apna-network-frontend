import React from "react";
import { Briefcase, ListTodo } from "lucide-react";
import { useDummyAPI } from "@/app/hooks/useDummyAPI";

export default function DashboardPanel({ setActiveView }) {
 const { user } = useDummyAPI();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Browse Services Card */}
        <div className="bg-white/70 rounded-xl shadow-lg p-6 md:p-8 border border-white/30 flex flex-col items-center text-center transition hover:shadow-xl backdrop-blur-sm">
          <Briefcase className="w-10 h-10 md:w-12 md:h-12 text-[#695aa6] mb-4" />
          <h2 className="text-lg md:text-xl font-semibold mb-2 text-[#695aa6]">
            Browse Services
          </h2>
          <p className="text-gray-700 mb-6 text-sm md:text-base">
            Explore and find local service providers in your area.
          </p>
          <button
            onClick={() => setActiveView("services")}
            className="px-5 py-2.5 md:px-6 md:py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-[#695aa6] to-[#5a4d8a] hover:opacity-90 transition shadow-lg text-sm md:text-base"
          >
            Find Services
          </button>
        </div>

        {/* My Requests Card */}
        <div className="bg-white/70 rounded-xl shadow-lg p-6 md:p-8 border border-white/30 flex flex-col items-center text-center transition hover:shadow-xl backdrop-blur-sm">
          <ListTodo className="w-10 h-10 md:w-12 md:h-12 text-[#695aa6] mb-4" />
          <h2 className="text-lg md:text-xl font-semibold mb-2 text-[#695aa6]">
            My Service Requests
          </h2>
          <p className="text-gray-700 mb-6 text-sm md:text-base">
            Track and manage your service requests and bookings.
          </p>
          <button
            onClick={() => setActiveView("requests")}
            className="px-5 py-2.5 md:px-6 md:py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-[#695aa6] to-[#5a4d8a] hover:opacity-90 transition shadow-lg text-sm md:text-base"
          >
            View Requests
          </button>
        </div>
      </div>
    </div>
  );
}