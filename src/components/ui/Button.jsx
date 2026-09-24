import React from "react";

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  icon = null,
  iconRight = null,
  disabled = false,
  type = "button",
  onClick,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none outline-none focus:ring-2 focus:ring-[#8083ff]/50 focus:ring-offset-2 focus:ring-offset-[#0b1326]";

  const sizes = {
    sm: "text-xs px-2.5 py-1.5 rounded-lg gap-1.5",
    md: "text-sm px-4 py-2 rounded-lg gap-2",
    lg: "text-base px-5 py-2.5 rounded-xl gap-2.5",
    icon: "p-2 rounded-lg",
  };

  const variants = {
    primary:
      "bg-[#8083ff] text-[#0d0096] font-semibold hover:bg-[#c0c1ff] shadow-[0_0_15px_rgba(128,131,255,0.3)] active:scale-[0.98]",
    secondary:
      "bg-[#171f33] text-[#dae2fd] border border-[#464554]/60 hover:bg-[#222a3d] hover:border-[#908fa0]/40 active:scale-[0.98]",
    admin:
      "bg-gradient-to-r from-[#8083ff] to-[#571bc1] text-[#ffffff] font-semibold hover:opacity-90 shadow-[0_0_15px_rgba(87,27,193,0.35)] active:scale-[0.98]",
    danger:
      "bg-[#93000a]/20 text-[#ffb4ab] border border-[#ffb4ab]/30 hover:bg-[#93000a]/40 hover:border-[#ffb4ab]/60 active:scale-[0.98]",
    ghost:
      "bg-transparent text-[#c7c4d7] hover:bg-[#171f33] hover:text-[#dae2fd]",
    outline:
      "bg-transparent border border-[#464554] text-[#dae2fd] hover:bg-[#171f33] hover:border-[#8083ff]/50",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${sizes[size] || sizes.md} ${
        variants[variant] || variants.primary
      } ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
}

export default Button;
