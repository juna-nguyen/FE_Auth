import React, { useState } from "react";
import Badge from "../ui/Badge";

export function Header({
  currentPath = "/dashboard",
  onNavigate,
  user,
  onLogout,
}) {
  const [profileDropdown, setProfileDropdown] = useState(false);

  const displayName = user?.name || "Anonymous Principal";
  const displayEmail = user?.email || "unauthenticated@authshield.io";
  const isAdmin = user?.role === "admin";
  const userInitials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AS";

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-[#060e20]/80 backdrop-blur-xl border-b border-[#464554]/30 px-6 flex items-center justify-between">
      {/* Brand & Status */}
      <div className="flex items-center gap-6">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate?.(user ? "/dashboard" : "/auth")}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#8083ff] to-[#571bc1] flex items-center justify-center shadow-[0_0_15px_rgba(128,131,255,0.4)]">
            <span className="material-symbols-outlined text-[#ffffff] text-[20px]">shield</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-base tracking-tight text-[#dae2fd]">
              AuthShield
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#908fa0]">
              Identity Engine v2.4
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Badge variant="cluster" icon={<span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse inline-block" />}>
            CLUSTER ONLINE
          </Badge>
          <span className="text-xs font-mono text-[#908fa0] hidden lg:inline">
            TLS 1.3 Ã¢â‚¬Â¢ JWT Authentication
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Navigation Switcher Pills */}
        <div className="hidden sm:flex items-center gap-1 bg-[#131b2e] p-1 rounded-xl border border-[#464554]/30">
          <button
            onClick={() => onNavigate?.("/auth")}
            className={`px-3 py-1 text-xs rounded-lg transition-all ${
              currentPath === "/auth"
                ? "bg-[#8083ff] text-[#0d0096] font-semibold shadow"
                : "text-[#c7c4d7] hover:text-[#dae2fd]"
            }`}
          >
            Auth View
          </button>
          <button
            onClick={() => onNavigate?.("/dashboard")}
            className={`px-3 py-1 text-xs rounded-lg transition-all ${
              currentPath === "/dashboard"
                ? "bg-[#8083ff] text-[#0d0096] font-semibold shadow"
                : "text-[#c7c4d7] hover:text-[#dae2fd]"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate?.("/users")}
            className={`px-3 py-1 text-xs rounded-lg transition-all ${
              currentPath === "/users"
                ? "bg-[#8083ff] text-[#0d0096] font-semibold shadow"
                : "text-[#c7c4d7] hover:text-[#dae2fd]"
            }`}
          >
            RBAC
          </button>
          <button
            onClick={() => onNavigate?.("/profile")}
            className={`px-3 py-1 text-xs rounded-lg transition-all ${
              currentPath === "/profile"
                ? "bg-[#8083ff] text-[#0d0096] font-semibold shadow"
                : "text-[#c7c4d7] hover:text-[#dae2fd]"
            }`}
          >
            Profile
          </button>
        </div>

        {/* User Info & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdown(!profileDropdown)}
            className="flex items-center gap-3 p-1.5 pl-3 rounded-xl bg-[#131b2e] hover:bg-[#171f33] border border-[#464554]/40 transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-[#dae2fd]">{displayName}</p>
              <p className="text-[10px] font-mono text-[#4edea3]">
                {isAdmin ? "SUPERUSER Ã¢â‚¬Â¢ ADMIN" : user ? "STANDARD USER" : "UNAUTHENTICATED"}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#8083ff]/20 border border-[#8083ff]/40 flex items-center justify-center font-bold text-xs text-[#c0c1ff]">
              {userInitials}
            </div>
          </button>

          {profileDropdown && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-xl bg-[#131b2e] border border-[#464554]/60 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95"
              onClick={() => setProfileDropdown(false)}
            >
              <div className="p-2 border-b border-[#464554]/30">
                <p className="text-xs font-semibold text-[#dae2fd]">{displayName}</p>
                <p className="text-[10px] text-[#908fa0] truncate">{displayEmail}</p>
                <div className="mt-1">
                  <Badge variant={isAdmin ? "admin" : "user"}>
                    {user?.role ? user.role.toUpperCase() : "GUEST"}
                  </Badge>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => onNavigate?.("/profile")}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#c7c4d7] hover:bg-[#222a3d] hover:text-[#dae2fd] rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#c0c1ff]">manage_accounts</span>
                  Profile Security
                </button>
                <button
                  onClick={() => onNavigate?.("/dashboard")}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#c7c4d7] hover:bg-[#222a3d] hover:text-[#dae2fd] rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#c0c1ff]">dashboard</span>
                  Security Dashboard
                </button>
                <button
                  onClick={() => onNavigate?.("/users")}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#c7c4d7] hover:bg-[#222a3d] hover:text-[#dae2fd] rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#c0c1ff]">shield_person</span>
                  Identity & RBAC
                </button>
              </div>

              <div className="pt-1 border-t border-[#464554]/30">
                {user ? (
                  <button
                    onClick={() => onLogout?.()}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#ffb4ab] hover:bg-[#93000a]/20 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    Sign Out (POST /api/auth/logout)
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate?.("/auth")}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#c0c1ff] hover:bg-[#8083ff]/20 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">login</span>
                    Sign In / Register
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
