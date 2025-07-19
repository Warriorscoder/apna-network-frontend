import { Bell } from "lucide-react";

const NotificationsBar = ({ pendingRequests = 2 }) => (
  <div className="flex items-center gap-3 bg-white/30 backdrop-blur-sm rounded-lg px-4 py-3 shadow border border-white/30 mb-8 max-w-md mx-auto z-10">
    <Bell className="w-5 h-5 text-[#695aa6]" />
    <span className="text-sm text-gray-700">
      {pendingRequests} new service request{pendingRequests !== 1 ? "s" : ""} pending.
    </span>
  </div>
);

export default NotificationsBar;
