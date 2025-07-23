import React from "react";
import { Briefcase, ListTodo } from "lucide-react";
import { useDummyAPI } from "@/app/hooks/useDummyAPI";
// import { useDummyAPI } from "./useDummyAPI";

export default function DashboardPanel({ setActiveView }) {
 const { user } = useDummyAPI();

  return (
    <div className="space-y-6">
      {/* Main Action Cards Grid - Similar to Provider Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Browse Services Card */}
        <div className="bg-white/70 rounded-xl shadow-lg p-8 border border-white/30 flex flex-col items-center text-center transition hover:shadow-xl backdrop-blur-sm">
          <Briefcase className="w-12 h-12 text-[#695aa6] mb-4" />
          <h2 className="text-xl font-semibold mb-3 text-[#695aa6]">
            Browse Services
          </h2>
          <p className="text-gray-700 mb-6">
            Explore and find local service providers in your area.
          </p>
          <button
            onClick={() => setActiveView("services")}
            className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-[#695aa6] to-[#5a4d8a] hover:opacity-90 transition shadow-lg"
          >
            Find Services
          </button>
        </div>

        {/* My Requests Card */}
        <div className="bg-white/70 rounded-xl shadow-lg p-8 border border-white/30 flex flex-col items-center text-center transition hover:shadow-xl backdrop-blur-sm">
          <ListTodo className="w-12 h-12 text-[#695aa6] mb-4" />
          <h2 className="text-xl font-semibold mb-3 text-[#695aa6]">
            My Service Requests
          </h2>
          <p className="text-gray-700 mb-6">
            Track and manage your service requests and bookings.
          </p>
          <button
            onClick={() => setActiveView("requests")}
            className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-[#695aa6] to-[#5a4d8a] hover:opacity-90 transition shadow-lg"
          >
            View Requests
          </button>
        </div>
      </div>
    </div>
  );
}
