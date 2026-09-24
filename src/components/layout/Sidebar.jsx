import React from "react";

export function Sidebar({ currentPath = "/dashboard", onNavigate }) {
  const navItems = [
    {
      label: "Control Plane",
      items: [
        {
          title: "Admin Dashboard",
          path: "/dashboard",
          icon: "dashboard",
          badge: "Live",
        },
        {
          title: "Identity & RBAC",
          path: "/users",
          icon: "shield_person",
          badge: "12.4k",
        },
      ],
    },
    {
      label: "Account & Access",
      items: [
        {
          title: "Profile & Security",
          path: "/profile",
          icon: "manage_accounts",
        },
        {
          title: "Sign In / Register",
          path: "/auth",
          icon: "lock_open",
        },
      ],
    },
    {
      label: "System Infrastructure",
      items: [
        {
          title: "Telemetry & Logs",
          path: "/dashboard#logs",
          icon: "terminal",
          disabled: false,
        },
        {
          title: "API Endpoints (v3.1)",
          path: "/dashboard#api",
          icon: "api",
        },
      ],
    },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-[#060e20] border-r border-[#464554]/30 p-4 flex flex-col justify-between z-30 hidden md:flex">
      <div className="space-y-6">
        {navItems.map((section, idx) => (
          <div key={idx} className="space-y-1.5">
            <h4 className="px-3 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#908fa0]">
              {section.label}
            </h4>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => onNavigate?.(item.path)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? "bg-[#8083ff]/15 text-[#c0c1ff] border border-[#8083ff]/30 shadow-sm"
                        : "text-[#c7c4d7] hover:bg-[#131b2e] hover:text-[#dae2fd]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          isActive ? "text-[#8083ff]" : "text-[#908fa0]"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span>{item.title}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                          isActive
                            ? "bg-[#8083ff]/30 text-[#ffffff]"
                            : "bg-[#171f33] text-[#908fa0]"
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
      <div className="p-3 rounded-xl bg-[#131b2e] border border-[#464554]/30 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#908fa0]">Cluster Region</span>
          <span className="flex items-center gap-1 text-[11px] font-mono text-[#4edea3]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse" />
            us-east-vault-1
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#c7c4d7]">
          <span>Enforcement</span>
          <span className="font-mono text-[#8083ff]">mTLS Strict</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
