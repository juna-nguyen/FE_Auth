import React, { useState } from "react";
import AppLayout from "./components/layout/AppLayout";
import AuthPage from "./pages/Auth";
import DashboardPage from "./pages/Dashboard";
import UserManagementPage from "./pages/UserManagement";
import ProfileSecurityPage from "./pages/ProfileSecurity";
import Toast from "./components/ui/Toast";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";

function MainApp() {
  const { user, isAuthenticated, isInitializing, logout, updateUser } = useAuth();
  const [currentPath, setCurrentPath] = useState("/dashboard");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info");
  const [showToast, setShowToast] = useState(false);

  const showNotification = (msg, type = "info") => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const effectivePath = isInitializing
    ? "/auth"
    : !isAuthenticated && currentPath !== "/auth"
    ? "/auth"
    : currentPath;

  const handleNavigate = (path) => {
    const isProtected = path === "/dashboard" || path === "/users" || path === "/profile";
    if (isProtected && !isAuthenticated) {
      showNotification("Vui lòng đăng nhập để truy cập tính năng này!", "warning");
      setCurrentPath("/auth");
      return;
    }

    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoginSuccess = () => {
    showNotification("Đăng nhập thành công! Chào mừng trở lại.", "success");
    setCurrentPath("/dashboard");
  };

  const handleLogout = async () => {
    await logout();
    showNotification("Đã đăng xuất tài khoản an toàn.", "info");
    setCurrentPath("/auth");
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#FFF0F5] flex flex-col items-center justify-center text-[#4A353A] space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF8DA1] to-[#FF69B4] flex items-center justify-center shadow-[0_8px_24px_rgba(255,105,180,0.35)] animate-pulse">
          <span className="material-symbols-outlined text-white text-[32px]">shield</span>
        </div>
        <p className="font-mono text-xs font-semibold text-[#D84A75] animate-pulse">
          Authenticating Pastel Identity Session...
        </p>
      </div>
    );
  }

  const isAuthView = effectivePath === "/auth" && !isAuthenticated;

  const renderContent = () => {
    switch (effectivePath) {
      case "/auth":
        return <AuthPage onLoginSuccess={handleLoginSuccess} />;
      case "/dashboard":
      case "/dashboard#logs":
      case "/dashboard#api":
        return <DashboardPage user={user} onNavigate={handleNavigate} />;
      case "/users":
        return <UserManagementPage currentUser={user} />;
      case "/profile":
        return (
          <ProfileSecurityPage
            user={user}
            onUserUpdate={updateUser}
            onLogout={handleLogout}
          />
        );
      default:
        return isAuthenticated ? (
          <DashboardPage user={user} onNavigate={handleNavigate} />
        ) : (
          <AuthPage onLoginSuccess={handleLoginSuccess} />
        );
    }
  };

  return (
    <AppLayout
      currentPath={effectivePath}
      onNavigate={handleNavigate}
      user={user}
      isAuthenticated={isAuthenticated}
      onLogout={handleLogout}
      onRequireAuthNotice={(msg) => showNotification(msg, "warning")}
      hideSidebar={isAuthView}
    >
      {renderContent()}
      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </AppLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}