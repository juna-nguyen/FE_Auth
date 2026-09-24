import React from "react";

export function Badge({ variant = "default", children, className = "", icon = null }) {
  const variants = {
    default: "bg-[#FFF0F5] text-[#7D676E] border border-[#FAD6DF]",
    primary: "bg-[#FFEBF1] text-[#D84A75] border border-[#FAD6DF]",
    admin: "bg-gradient-to-r from-[#FF8DA1]/20 to-[#E8A0BF]/30 text-[#9C2755] border border-[#FF8DA1]/40 shadow-xs font-semibold",
    user: "bg-[#FAF0F2] text-[#634E55] border border-[#FAD6DF]",
    success: "bg-[#E8F8F5] text-[#1B7A5C] border border-[#B9ECE1]",
    warning: "bg-[#FFF8E6] text-[#B45309] border border-[#FDE68A]",
    danger: "bg-[#FFEBF0] text-[#C8234D] border border-[#FFCCD7]",
    outline: "border border-[#FAD6DF] text-[#4A353A] bg-[#FFFFFF]",
    cluster: "bg-[#D4F1F4] text-[#0E6251] border border-[#A2D9CE] font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {icon && <span className="text-[14px] leading-none shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

export default Badge;