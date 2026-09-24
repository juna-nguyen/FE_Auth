import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export function AppLayout({
  currentPath,
  onNavigate,
  user,
  onLogout,
  children,
  hideSidebar = false,
}) {
  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd]">
      <Header
        currentPath={currentPath}
        onNavigate={onNavigate}
        user={user}
        onLogout={onLogout}
      />
      {!hideSidebar && <Sidebar currentPath={currentPath} onNavigate={onNavigate} />}
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
