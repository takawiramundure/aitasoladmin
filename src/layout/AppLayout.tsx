import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { useAuth } from "../context/AuthContext";
import { AlertTriangleIcon } from "lucide-react";
import Button from "../components/ui/button/Button";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { isImpersonating, profile, stopImpersonation } = useAuth();

  return (
    <div className="min-h-screen xl:flex flex-col">
      {/* Global Impersonation Banner */}
      {isImpersonating && (
        <div className="sticky top-0 z-[60] bg-blue-600 text-white px-4 py-3 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangleIcon className="text-yellow-300" size={20} />
            <div>
              <p className="font-bold text-sm">Viewing as {profile?.email}</p>
              <p className="text-xs opacity-90">You are seeing the portal exactly as this user sees it.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-blue-700 hover:bg-blue-50 border-none"
              onClick={() => window.location.href = '/'}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-red-500 text-white hover:bg-red-600 border-none"
              onClick={() => {
                stopImpersonation();
                setTimeout(() => window.location.reload(), 100);
              }}
            >
              Exit View
            </Button>
          </div>
        </div>
      )}

      <div className="xl:flex flex-1">
        <div>
          <AppSidebar />
          <Backdrop />
        </div>
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
            } ${isMobileOpen ? "ml-0" : ""}`}
        >
          <AppHeader />
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
            <Outlet />
          </div>
          <footer className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Digital Maples Labs CMS 1.3.0
          </footer>
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
