"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/Navbar";
import { useAuth } from "@/app/context/Authcontext";

export default function ConditionalNavbar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const isServicePage = pathname.startsWith("/service/");
  const isAuthPage = pathname.startsWith("/auth/");

  // Don't render navbar on service or auth pages
  if (isServicePage || isAuthPage) {
    return null;
  }

  return <Navbar showProfile={!!user} userName={user?.name || ""} />;
}
