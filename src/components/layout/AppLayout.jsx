import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export function AppLayout({
  currentPath,
  onNavigate,
  user,
  isAuthenticated,
  onLogout,
  onRequireAuthNotice,
  children,
  hideSidebar = false,
}) {
  return (
    <div className="min-h-screen bg-[#FFF0F5] text-[#4A353A]">
      <Header
        currentPath={currentPath}
        onNavigate={onNavigate}
        user={user}
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
        onRequireAuthNotice={onRequireAuthNotice}
      />
      {!hideSidebar && (
        <Sidebar
          currentPath={currentPath}
          onNavigate={onNavigate}
          isAuthenticated={isAuthenticated}
          user={user}
          onRequireAuthNotice={onRequireAuthNotice}
        />
      )}
      <main
        className={`pt-16 min-h-screen ${
          !hideSidebar ? "md:pl-64" : ""
        } transition-all duration-200`}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

export default AppLayout;