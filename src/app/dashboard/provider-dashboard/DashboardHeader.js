import { UserCircle } from "lucide-react";

const DashboardHeader = ({ provider }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 w-full">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto bg-gradient-to-br from-[#695aa6] to-[#b8a7e8] rounded-full flex items-center justify-center shadow-2xl border-4 border-white/50 backdrop-blur-sm">
            <UserCircle className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white" />
          </div>
        </div>

        <h1
          className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white mb-3"
          style={{ textShadow: "0 4px 24px rgba(60,50,100,0.65), 0 2px 4px rgba(0,0,0,0.3)" }}
          suppressHydrationWarning={true}
        >
          {getGreeting()}, {provider?.name || "Provider"}! 👋
        </h1>
        
        <p
          className="text-sm sm:text-base lg:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed px-2"
          style={{ textShadow: "0 2px 12px rgba(60,50,100,0.45), 0 1px 2px rgba(0,0,0,0.3)" }}
        >
          Grow Your Business with Apna Network
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;
