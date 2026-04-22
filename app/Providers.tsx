"use client";

import { AuthProvider } from "@/context/AuthContext";
import { AnalyticsProvider } from "@/context/AnalyticsContext";
import { SiteProvider } from "@/context/SiteContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ANALYTICS_CONFIG } from "@/config/analyticsConfig";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={ANALYTICS_CONFIG.CLIENT_ID}>
      <AuthProvider>
        <SiteProvider>
          <AnalyticsProvider>
            {children}
          </AnalyticsProvider>
        </SiteProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
