import { Briefcase, ListTodo } from "lucide-react";

const DashboardOverview = ({ setActiveView }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {[ 
      {
        icon: Briefcase,
        title: "Your Services",
        desc: "View and edit the services you offer to customers.",
        btn: "Manage Services",
        action: () => setActiveView("services"),
      },
      {
        icon: ListTodo,
        title: "Service Requests",
        desc: "See and respond to new service requests from customers.",
        btn: "View Requests",
        action: () => setActiveView("requests"),
      }
    ].map(({ icon: Icon, title, desc, btn, action }, i) => (
      <div key={i} className="bg-white/70 rounded-xl shadow-lg p-8 border border-white/30 flex flex-col items-center text-center transition hover:shadow-xl backdrop-blur-sm">
        <Icon className="w-12 h-12 text-[#695aa6] mb-4" />
        <h2 className="text-xl font-semibold mb-3 text-[#695aa6]">{title}</h2>
        <p className="text-gray-700 mb-6">{desc}</p>
        <button
          onClick={action}
          className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-[#695aa6] to-[#5a4d8a] hover:opacity-90 transition shadow-lg"
        >
          {btn}
        </button>
      </div>
    ))}
  </div>
);

export default DashboardOverview;
