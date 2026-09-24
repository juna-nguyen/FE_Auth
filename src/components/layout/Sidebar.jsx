import React from "react";

export function Sidebar({
  currentPath = "/dashboard",
  onNavigate,
  isAuthenticated = true,
  user,
  onRequireAuthNotice,
}) {
  const isAdmin = user?.role === "admin";

  const handleNavClick = (path, requiresAuth = false) => {
    if (requiresAuth && !isAuthenticated) {
      if (onRequireAuthNotice) {
        onRequireAuthNotice("Vui lòng đăng nhập để mở khóa tính năng này!");
      }
      onNavigate?.("/auth");
      return;
    }
    onNavigate?.(path);
  };

  const navSections = [
    {
      label: "Authentication & Identity",
      items: [
        {
          title: "Auth Gateway",
          icon: "login",
          path: "/auth",
          badge: !isAuthenticated ? "ACTIVE" : null,
          requiresAuth: false,
        },
        {
          title: "Identity Profile",
          icon: "badge",
          path: "/profile",
          badge: isAuthenticated ? "VERIFIED" : "LOCK",
          requiresAuth: true,
        },
      ],
    },
    {
      label: "Telemetry & Logs",
      items: [
        {
          title: "Access Dashboard",
          icon: "dashboard",
          path: "/dashboard",
          badge: isAuthenticated ? "LIVE" : "LOCK",
          requiresAuth: true,
        },
        {
          title: "Audit Logs",
          icon: "history",
          path: "/dashboard#logs",
          badge: null,
          requiresAuth: true,
        },
      ],
    },
    {
      label: "Access Governance (RBAC)",
      items: [
        {
          title: "User Management",
          icon: "group",
          path: "/users",
          badge: isAdmin ? "ADMIN" : "RESTRICTED",
          requiresAuth: true,
        },
        {
          title: "API Integration Spec",
          icon: "api",
          path: "/dashboard#api",
          badge: "OpenAPI",
          requiresAuth: true,
        },
      ],
    },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-[#FFFFFF]/90 backdrop-blur-xl border-r border-[#FAD6DF] hidden md:flex flex-col justify-between p-4 z-30 shadow-[4px_0_24px_rgba(233,114,150,0.04)]">
      <div className="space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1.5">
            <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#967C84]">
              {section.label}
            </h4>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = currentPath === item.path;
                const isLocked = item.requiresAuth && !isAuthenticated;

                return (
                  <button
                    key={item.title}
                    onClick={() => handleNavClick(item.path, item.requiresAuth)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                      isActive
                        ? "bg-gradient-to-r from-[#FF8DA1]/15 to-[#FF69B4]/15 text-[#D84A75] border border-[#FF8DA1]/40 shadow-xs"
                        : "text-[#7D676E] hover:bg-[#FFF0F5] hover:text-[#4A353A]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          isActive
                            ? "text-[#D84A75]"
                            : isLocked
                            ? "text-[#D4A5B2]"
                            : "text-[#967C84]"
                        }`}
                      >
                        {isLocked ? "lock" : item.icon}
                      </span>
                      <span>{item.title}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          isActive
                            ? "bg-[#FF8DA1] text-white"
                            : isLocked
                            ? "bg-[#FAF0F2] text-[#967C84] border border-[#FAD6DF]"
                            : "bg-[#FFEBF1] text-[#D84A75]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Cluster Node Status Bottom Box */}
      <div className="p-3.5 rounded-2xl bg-[#FFF0F5] border border-[#FAD6DF] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#7D676E] font-medium">Cluster Region</span>
          <span className="flex items-center gap-1.5 text-[11px] font-mono text-[#1B7A5C] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#1B7A5C] animate-pulse" />
            us-east-vault-1
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#4A353A]">
          <span className="text-[#7D676E]">Enforcement</span>
          <span className="font-mono text-[#D84A75] font-semibold">mTLS Strict</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;