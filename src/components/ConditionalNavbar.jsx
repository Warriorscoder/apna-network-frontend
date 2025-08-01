"use client";

import { useAuth } from "../app/context/Authcontext";
import Navbar from "../app/Navbar";

export default function ConditionalNavbar() {
  const {
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

  return (
    <Navbar
      user={authenticatedUser}
      isAuthenticated={isAuth}
      userRole={userRole}
    />
  );
}
