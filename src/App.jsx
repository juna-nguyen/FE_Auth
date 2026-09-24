import React, { useState, useEffect } from "react";
import AppLayout from "./components/layout/AppLayout";
import AuthPage from "./pages/Auth";
import DashboardPage from "./pages/Dashboard";
import UserManagementPage from "./pages/UserManagement";
import ProfileSecurityPage from "./pages/ProfileSecurity";
import { authApi } from "./services/api/apiUser";
import { getToken, getStoredUser, clearAuth } from "./services/api";

export default function App() {
  const [currentPath, setCurrentPath] = useState("/auth");
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [isInitializing, setIsInitializing] = useState(true);

  // T? d?ng ki?m tra JWT token vÃƒÂ  fetch thÃƒÂ´ng tin ngu?i dÃƒÂ¹ng t? /api/auth/me khi t?i ?ng d?ng
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      if (!token) {
        setIsInitializing(false);
        setCurrentPath("/auth");
        return;
      }

      try {
        const data = await authApi.getMe();
        if (data?.user) {
          setCurrentUser(data.user);
          setCurrentPath("/dashboard");
        } else {
          clearAuth();
          setCurrentUser(null);
          setCurrentPath("/auth");
        }
      } catch (err) {
        console.warn("Session expired or invalid:", err);
        clearAuth();
        setCurrentUser(null);
        setCurrentPath("/auth");
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  const handleNavigate = (path) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoginSuccess = (data) => {
    if (data?.user) {
      setCurrentUser(data.user);
    }
    setCurrentPath("/dashboard");
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error("Logout request error:", e);
    } finally {
      clearAuth();
      setCurrentUser(null);
      setCurrentPath("/auth");
    }
  };

  const handleUserUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#0b1326] flex flex-col items-center justify-center text-[#dae2fd] space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8083ff] to-[#571bc1] flex items-center justify-center shadow-[0_0_25px_rgba(128,131,255,0.5)] animate-pulse">
          <span className="material-symbols-outlined text-white text-[28px]">shield</span>
        </div>
        <p className="font-mono text-xs text-[#c0c1ff] animate-pulse">
          Authenticating Zero-Trust Session...
        </p>
      </div>
    );
  }

  const isAuthView = currentPath === "/auth" && !currentUser;

  const renderContent = () => {
    switch (currentPath) {
      case "/auth":
        return <AuthPage onLoginSuccess={handleLoginSuccess} />;
      case "/dashboard":
      case "/dashboard#logs":
      case "/dashboard#api":
        return <DashboardPage user={currentUser} onNavigate={handleNavigate} />;
      case "/users":
        return <UserManagementPage currentUser={currentUser} />;
      case "/profile":
        return (
          <ProfileSecurityPage
            user={currentUser}
            onUserUpdate={handleUserUpdate}
            onLogout={handleLogout}
          />
        );
      default:
        return currentUser ? (
          <DashboardPage user={currentUser} onNavigate={handleNavigate} />
        ) : (
          <AuthPage onLoginSuccess={handleLoginSuccess} />
        );
    }
  };

  return (
    <AppLayout
      currentPath={currentPath}
      onNavigate={handleNavigate}
      user={currentUser}
      onLogout={handleLogout}
      hideSidebar={isAuthView}
    >
      {renderContent()}
    </AppLayout>
  );
}
