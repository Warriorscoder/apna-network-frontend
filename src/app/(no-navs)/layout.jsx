import React from "react";

// This layout should not have the AuthProvider, as it's now in the root layout.
export default function NoNavsLayout({ children }) {
  return <>{children}</>;
}
