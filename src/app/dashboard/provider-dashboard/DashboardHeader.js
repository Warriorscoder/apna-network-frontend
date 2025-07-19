import { UserCircle } from "lucide-react";

const DashboardHeader = ({ provider }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[50vh] py-12 z-10 w-full">
      <UserCircle className="w-20 h-20 text-white drop-shadow-lg bg-gradient-to-br from-[#695aa6] to-[#b8a7e8] rounded-full p-2 mb-4" />
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white text-center">
        {getGreeting()}, {provider.name || "Provider"}! 👋
      </h1>
      <p className="text-lg md:text-xl text-white max-w-xl mx-auto mb-2 text-center">
        Grow Your Business with Apna Network
      </p>
    </div>
  );
};

export default DashboardHeader;
