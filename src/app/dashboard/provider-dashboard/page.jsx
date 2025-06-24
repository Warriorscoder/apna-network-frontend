"use client";
import { useState, useRef, useEffect } from "react";
import { Star, Bell, TrendingUp, Users, MessageCircle, Award, Phone, Mail } from "lucide-react";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import Footer from "@/app/Footer";

const dummyRequests = [
  { id: 1, title: "Fix kitchen sink", status: "Pending", customer: "Amit", date: "2025-06-18" },
  { id: 2, title: "Install ceiling fan", status: "Completed", customer: "Priya", date: "2025-06-17" }, 
];

export default function ProviderDashboard({ userName = "Rishabh" }) {
  return (
    <>
      <ConditionalNavbar showProfile={true} userName={userName} />
      <main className="relative min-h-screen w-full">
        {/* Main content section with scenic background */}
        <div 
          className="relative w-full pt-32 pb-16 min-h-screen"
          style={{
            background: "linear-gradient(180deg, #c4b5f0 0%, #b8a7e8 30%, #a395d4 70%, #8b7cc8 100%)",
          }}
        >
          {/* Layered Mountain Background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute bottom-0 left-0 right-0 h-[60vh]">
              <svg viewBox="0 0 1200 500" className="w-full h-full" preserveAspectRatio="none">
                {/* Back mountains - lightest */}
                <path
                  d="M0,200 L150,80 L300,140 L450,60 L600,120 L750,40 L900,100 L1050,20 L1200,80 L1200,500 L0,500 Z"
                  fill="rgba(255,255,255,0.2)"
                />
                {/* Middle mountains */}
                <path
                  d="M0,250 L100,150 L250,200 L400,120 L550,180 L700,100 L850,160 L1000,80 L1200,140 L1200,500 L0,500 Z"
                  fill="rgba(255,255,255,0.15)"
                />
                {/* Front mountains - darkest */}
                <path
                  d="M0,300 L120,220 L280,280 L440,200 L600,260 L760,180 L920,240 L1080,160 L1200,220 L1200,500 L0,500 Z"
                  fill="rgba(105,90,166,0.3)"
                />
                
                {/* Ground/Field layer */}
                <path d="M0,370 L1200,360 L1200,500 L0,500 Z" fill="rgba(105,90,166,0.4)" />
                
                {/* Simple elements matching reference - positioned higher */}
                {/* Trees */}
                <circle cx="180" cy="340" r="18" fill="#4a5d23" />
                <rect x="177" y="340" width="6" height="25" fill="#8B4513" />
                
                <circle cx="380" cy="330" r="15" fill="#4a5d23" />
                <rect x="377" y="330" width="6" height="20" fill="#8B4513" />
                
                <circle cx="580" cy="340" r="20" fill="#4a5d23" />
                <rect x="577" y="340" width="6" height="30" fill="#8B4513" />
                
                {/* Simple house */}
                <rect x="750" y="315" width="50" height="40" fill="#8B4513" />
                <path d="M742,315 L775,290 L808,315 Z" fill="#CD853F" />
                
                {/* Pole/Mast */}
                <rect x="950" y="280" width="4" height="80" fill="#8B4513" />
              </svg>
            </div>
          </div>

          {/* Content with proper z-index */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 space-y-10">
            {/* Welcome Section */}
            <div className="relative min-h-[35vh] md:min-h-[45vh] flex flex-col justify-center items-center">
              {/* Notification badge absolute top right */}
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-3 bg-white/30 backdrop-blur-sm rounded-lg px-6 py-4 shadow border border-white/30">
                  <Bell className="w-5 h-5 text-[#695aa6]" />
                  <span className="text-sm text-gray-700">You have 2 new requests</span>
                </div>
              </div>
              {/* Welcome message centered */}
              <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-2">
                  Welcome back, {userName}!
                </h1>
                <p className="text-2xl text-white/90 my-4">
                  Ready to serve your community today?
                </p>
              </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/25 backdrop-blur-sm rounded-xl shadow p-10 border border-white/30 flex flex-col items-center text-center">
                <h2 className="text-2xl font-semibold mb-5" style={{ color: "#695aa6" }}>Your Services</h2>
                <p className="text-gray-700 mb-8">View and edit the services you offer.</p>
                <button className="px-6 py-3 rounded-md font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(to right, #695aa6, #5a4d8a)" }}>
                  Manage Services
                </button>
              </div>
              <div className="bg-white/25 backdrop-blur-sm rounded-xl shadow p-10 border border-white/30 flex flex-col items-center text-center">
                <h2 className="text-2xl font-semibold mb-5" style={{ color: "#695aa6" }}>Requests</h2>
                <p className="text-gray-700 mb-8">See new service requests from users.</p>
                <button className="px-6 py-3 rounded-md font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(to right, #695aa6, #5a4d8a)" }}>
                  View Requests
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Grow Your Business Section - separate from scenic background */}
        <div 
          className="shadow-2xl border border-[#7c6fc7] min-h-96"
          style={{ 
            background: "linear-gradient(135deg, rgba(103,90,166,0.95) 0%, rgba(90,77,138,0.95) 100%)" 
          }}
        >
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6 text-white">
                Grow Your Business with Apna Network
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
                Transform your local service business with our comprehensive platform. Get more customers, 
                manage requests efficiently, and build lasting relationships in your community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Increase Revenue</h3>
                <p className="text-white/80 text-sm">Get more customers through our platform</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Build Network</h3>
                <p className="text-white/80 text-sm">Connect with verified customers in your area</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Build Reputation</h3>
                <p className="text-white/80 text-sm">Customer reviews and ratings boost your credibility</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-12 items-center">

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                <h3 className="text-2xl font-semibold text-white mb-6 text-center">Need Help?</h3>
                
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-white/90 mb-4">
                      Our support team is here to help you succeed. Get assistance with:
                    </p>
                    <ul className="text-white/80 text-sm space-y-2  flex justify-evenly">
                      <li>• Setting up your profile and services</li>
                      <li>• Managing customer requests</li>
                      <li>• Optimizing your business listing</li>
                    </ul>
                  </div>

                  <div className="border-t border-white/20 pt-6">
                    <button className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 rounded-lg p-3 transition text-white mt-4">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm font-medium">Email: support@apnanetwork.com</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          /* Remove unused animation styles */
        `}</style>
      </main>
    </>
  );
}