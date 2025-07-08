import React from 'react';
import { User, Star, MapPin, Clock, Award, Phone } from 'lucide-react';

const Dialoguebox = ({ data, isOpen, onClose }) => {
  if (!isOpen || !data) return null;
  console.log("Dialoguebox props:", { data });
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#695aa6" }}
              >
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{data.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-600">{data.rating || "N/A"}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>

          {/* About */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-gray-600">
              {data?.title || "Professional data data"}
            </p>
          </div>

          {/* Contact & Experience */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                  <span className="text-gray-600">{data.address || "Address not provided"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">{data.availability}</span>
                </div>
                <div className="flex items-center space-x-2">
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Experience Details</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5" style={{ color: "#695aa6" }} />
                  <span className="text-gray-600">{data.experience || "Experience not specified"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 capitalize px-2 py-1 rounded bg-gray-100">
                    {data?.category || "Unknown category"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* data Tags */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">data Tags</h3>
            <div className="flex flex-wrap gap-2">
              {data?.tags?.length ? (
                data.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-white px-3 py-1 rounded-full text-sm"
                    style={{ backgroundColor: "#695aa6" }}
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-gray-600">No tags available</span>
              )}
            </div>
          </div>

          {/* Image */}
          {/* {data?.images?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">data Image</h3>
              <img
                src={data.images[0]}
                alt="data"
                className="w-full rounded-lg border border-gray-200"
              />
            </div>
          )} */}

          {/* Contact Button */}
          <div className="flex space-x-3">
            <button
              onClick={() => window.open(`sms:${data?.contact}`)}
              className="flex-1 text-white border py-3 px-6 rounded-lg transition-colors duration-200 font-medium"
              style={{ backgroundColor: "#695aa6" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#5a4a96")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#695aa6")}
            >
              Send SMS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialoguebox;
