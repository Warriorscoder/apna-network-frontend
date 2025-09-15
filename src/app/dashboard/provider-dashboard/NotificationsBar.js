// import { Bell } from "lucide-react";

const NotificationsBar = () => (
    <div className="px-4 sm:px-6 lg:px-8 mb-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/30 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg border border-white/30 flex items-center justify-center gap-3">
          {/* <Bell className="w-5 h-5 text-[#695aa6] flex-shrink-0" /> */}
          <span className="text-sm sm:text-base text-gray-700 font-medium text-center">
            🎉 Welcome to your dashboard! Explore and manage
            your requests easily.
          </span>
        </div>
      </div>
    </div>
            
);

export default NotificationsBar;
