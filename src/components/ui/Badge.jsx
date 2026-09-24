import React from "react";

export function Badge({ variant = "default", children, className = "", icon = null }) {
  const variants = {
    default: "bg-[#222a3d] text-[#dae2fd] border border-[#464554]/40",
    primary: "bg-[#8083ff]/15 text-[#c0c1ff] border border-[#8083ff]/30",
    admin: "bg-[#571bc1]/40 text-[#d0bcff] border border-[#8083ff]/40 shadow-sm",
    user: "bg-[#171f33] text-[#dae2fd] border border-[#464554]/60",
    success: "bg-[#00885d]/20 text-[#4edea3] border border-[#4edea3]/30",
    warning: "bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/30",
    danger: "bg-[#93000a]/30 text-[#ffb4ab] border border-[#ffb4ab]/40",
    outline: "border border-[#464554] text-[#dae2fd]",
    cluster: "bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/30",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {icon && <span className="text-[14px] leading-none">{icon}</span>}
      {children}
    </span>
  );
}

export default Badge;
