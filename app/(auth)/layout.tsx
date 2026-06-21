"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && user && pathname !== '/reset-password') {
      router.replace("/");
    }
  }, [user, loading, router, pathname]);

  if (loading) return null;
  if (user && pathname !== '/reset-password') return null;

  return <>{children}</>;
}
