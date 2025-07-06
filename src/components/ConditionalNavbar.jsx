"use client";

import { useAuth } from "../app/context/Authcontext";
import Navbar from "../app/Navbar";

export default function ConditionalNavbar() {
  const {
    user,
    provider,
    admin,
    isAuthenticated,
    loading,
    getCurrentUser,
    getUserRole,
  } = useAuth();

  // Show nothing while loading
  if (loading) {
    return null;
  }

  // Get current user data
  const authenticatedUser = getCurrentUser();
  const userRole = getUserRole();
  const isAuth = isAuthenticated();

  console.log("🧭 ConditionalNavbar state:", {
    authenticatedUser,
    userRole,
    isAuth,
  });

  return (
    <Navbar
      user={authenticatedUser}
      isAuthenticated={isAuth}
      userRole={userRole}
    />
  );
}
