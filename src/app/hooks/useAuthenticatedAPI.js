import { useCallback } from "react";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useAuthenticatedAPI = () => {
  const makeRequest = useCallback(async (url, options = {}) => {
    try {
      return await axios({
        url: `${API_BASE}${url}`,
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  }, []);

  const mockProvider = {
    _id: "demo-provider-id",
    name: "Demo Provider",
    services: ["Plumbing", "Electrical"],
    location: { address: "123 Main St" },
    experience: 3,
  };

  return {
    makeRequest,
    isReady: true,
    providerId: mockProvider._id,
    provider: mockProvider,
  };
};
