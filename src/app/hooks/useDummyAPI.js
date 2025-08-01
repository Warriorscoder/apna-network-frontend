// hooks/useDummyAPI.js
import { useCallback } from "react";
import axios from "axios";

const dummyUser = {
  _id: "dummy-user-id",
  name: "John Doe",
  email: "john@example.com",
  role: "user",
};

export const useDummyAPI = () => {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const makeRequest = useCallback(async (url, options = {}) => {
    return await axios({
      url: `${API_BASE}${url}`,
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
  }, [API_BASE]);

  const makePostRequest = useCallback(async (url, data, options = {}) => {
    return await axios.post(`${API_BASE}${url}`, data, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  }, [API_BASE]);

  return {
    makeRequest,
    makePostRequest,
    userId: dummyUser._id,
    user: dummyUser,
    isReady: true,
  };
};
