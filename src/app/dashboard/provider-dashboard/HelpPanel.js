const HelpPanel = () => (
  <div className="max-w-2xl mx-auto bg-white/70 p-6 rounded-lg shadow border border-white/40 backdrop-blur-sm">
    <h2 className="text-2xl font-bold text-[#695aa6] mb-4">Need Help?</h2>
    <p className="mb-4 text-gray-800">
      Here are a few tips to get started:
    </p>
    <ul className="list-disc list-inside text-gray-700 space-y-2">
      <li>Make sure your services are up to date so customers can find you.</li>
      <li>Check new requests often to avoid missing opportunities.</li>
      <li>Contact support if you&apos;re having issues with your profile or requests.</li>
    </ul>
    <div className="mt-6">
      <p className="text-gray-700">
        Need to speak with someone? Email us at{" "}
        <a href="mailto:support@apnanetwork.com" className="text-[#695aa6] font-semibold underline">
          support@apnanetwork.com
        </a>
      </p>
    </div>
  </div>
);

export default HelpPanel;
