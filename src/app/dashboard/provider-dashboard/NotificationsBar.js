import { Bell } from "lucide-react";

const NotificationsBar = ({ pendingRequests }) => (
  <div className="w-full px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
    <div className="max-w-7xl mx-auto">
      <div className="bg-white/30 backdrop-blur-sm rounded-xl px-4 sm:px-6 py-3 sm:py-4 shadow-lg border border-white/30 flex items-center justify-center gap-3">
        <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#695aa6] flex-shrink-0" />
        <span className="text-xs sm:text-sm lg:text-base text-gray-700 font-medium text-center">
          {pendingRequests > 0 
            ? `🔔 You have ${pendingRequests} pending request${pendingRequests > 1 ? 's' : ''} to review!`
            : "✅ All caught up! No pending requests at the moment."
          }
        </span>
      </div>
    </div>
  </div>
);

export default NotificationsBar;
