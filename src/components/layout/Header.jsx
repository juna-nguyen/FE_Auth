import React, { useState, useRef, useEffect } from "react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export function Header({
  currentPath = "/dashboard",
  onNavigate,
  user,
  isAuthenticated,
  onLogout,
  onRequireAuthNotice,
}) {
  const [profileDropdown, setProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.name || "Anonymous User";
  const displayEmail = user?.email || "";
  const isAdmin = user?.role === "admin";
  const userInitials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AS";

  const handleTabClick = (path, requiresAuth = false) => {
    if (requiresAuth && !isAuthenticated) {
      if (onRequireAuthNotice) {
        onRequireAuthNotice("Vui lòng đăng nhập để truy cập tính năng này!");
      }
      onNavigate?.("/auth");
      return;
    }
    onNavigate?.(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-[#FFFFFF]/90 backdrop-blur-xl border-b border-[#FAD6DF] px-4 sm:px-6 flex items-center justify-between shadow-[0_4px_20px_rgba(233,114,150,0.05)]">
      {/* Brand & Status */}
      <div className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate?.(isAuthenticated ? "/dashboard" : "/auth")}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF8DA1] to-[#FF69B4] flex items-center justify-center shadow-[0_4px_12px_rgba(255,105,180,0.35)] group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-white text-[20px]">shield</span>
          </div>
          <span className="font-headline font-bold text-base tracking-tight text-[#4A353A]">
            AuthShield
          </span>
        </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Navigation Switcher Pills */}
        <div className="hidden sm:flex items-center gap-1 bg-[#FFF0F5] p-1 rounded-2xl border border-[#FAD6DF]">
          <button
            onClick={() => handleTabClick("/auth", false)}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all cursor-pointer ${
              currentPath === "/auth"
                ? "bg-gradient-to-r from-[#FF8DA1] to-[#FF69B4] text-white font-semibold shadow-xs"
                : "text-[#7D676E] hover:text-[#D84A75] hover:bg-[#FFFFFF]"
            }`}
          >
            Auth View
          </button>
          <button
            onClick={() => handleTabClick("/dashboard", true)}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1 ${
              currentPath === "/dashboard"
                ? "bg-gradient-to-r from-[#FF8DA1] to-[#FF69B4] text-white font-semibold shadow-xs"
                : "text-[#7D676E] hover:text-[#D84A75] hover:bg-[#FFFFFF]"
            }`}
          >
            {!isAuthenticated && <span className="material-symbols-outlined text-[13px]">lock</span>}
            Dashboard
          </button>
          <button
            onClick={() => handleTabClick("/users", true)}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1 ${
              currentPath === "/users"
                ? "bg-gradient-to-r from-[#FF8DA1] to-[#FF69B4] text-white font-semibold shadow-xs"
                : "text-[#7D676E] hover:text-[#D84A75] hover:bg-[#FFFFFF]"
            }`}
          >
            {!isAuthenticated && <span className="material-symbols-outlined text-[13px]">lock</span>}
            RBAC
          </button>
          <button
            onClick={() => handleTabClick("/profile", true)}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1 ${
              currentPath === "/profile"
                ? "bg-gradient-to-r from-[#FF8DA1] to-[#FF69B4] text-white font-semibold shadow-xs"
                : "text-[#7D676E] hover:text-[#D84A75] hover:bg-[#FFFFFF]"
            }`}
          >
            {!isAuthenticated && <span className="material-symbols-outlined text-[13px]">lock</span>}
            Profile
          </button>
        </div>

        {/* Unauthenticated: Guest Mode / Sign In button */}
        {!isAuthenticated ? (
          <Button
              size="sm"
              variant="primary"
              onClick={() => onNavigate?.("/auth")}
              icon={<span className="material-symbols-outlined text-[16px]">login</span>}
            >
              Sign In / Register
            </Button>
        ) : (
          /* Authenticated: User Info & Dropdown */
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdown(!profileDropdown)}
              className="flex items-center gap-2.5 p-1.5 pl-3 rounded-2xl bg-[#FFF0F5] hover:bg-[#FFEBF1] border border-[#FAD6DF] transition-all cursor-pointer shadow-2xs"
            >
              <div className="text-left hidden md:block leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#4A353A] max-w-[120px] truncate">
                    {displayName}
                  </span>
                  <Badge variant={isAdmin ? "admin" : "user"} className="text-[10px] px-1.5 py-0">
                    {isAdmin ? "ADMIN" : "USER"}
                  </Badge>
                </div>
                <p className="text-[10px] text-[#7D676E] truncate max-w-[140px] font-mono">
                  {displayEmail}
                </p>
              </div>

              {/* Avatar */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF8DA1] to-[#E8A0BF] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {userInitials}
              </div>

              <span className="material-symbols-outlined text-[16px] text-[#967C84]">
                {profileDropdown ? "expand_less" : "expand_more"}
              </span>
            </button>

            {/* Dropdown Menu */}
            {profileDropdown && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#FFFFFF] border border-[#FAD6DF] shadow-[0_12px_32px_rgba(233,114,150,0.18)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 border-b border-[#FAD6DF]/60 mb-1 bg-[#FFF0F5] rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#4A353A]">{displayName}</span>
                    <Badge variant={isAdmin ? "admin" : "user"} className="text-[9px] px-1 py-0">
                      {isAdmin ? "SUPERUSER" : "STANDARD"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#7D676E] truncate font-mono mt-0.5">{displayEmail}</p>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setProfileDropdown(false);
                      onNavigate?.("/profile");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#4A353A] hover:bg-[#FFF0F5] hover:text-[#D84A75] transition-colors cursor-pointer text-left"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#FF8DA1]">account_circle</span>
                    Profile & Security Settings
                  </button>

                  <button
                    onClick={() => {
                      setProfileDropdown(false);
                      onNavigate?.("/dashboard");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#4A353A] hover:bg-[#FFF0F5] hover:text-[#D84A75] transition-colors cursor-pointer text-left"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#FF8DA1]">analytics</span>
                    Access Dashboard
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setProfileDropdown(false);
                        onNavigate?.("/users");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#4A353A] hover:bg-[#FFF0F5] hover:text-[#D84A75] transition-colors cursor-pointer text-left"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#E8A0BF]">admin_panel_settings</span>
                      IAM & RBAC Roles
                    </button>
                  )}

                  <div className="border-t border-[#FAD6DF]/60 my-1 pt-1" />

                  <button
                    onClick={() => {
                      setProfileDropdown(false);
                      onLogout?.();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#C8234D] hover:bg-[#FFEBF0] transition-colors cursor-pointer text-left"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#C8234D]">logout</span>
                    Đăng xuất (Logout)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;