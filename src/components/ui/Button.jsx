import React from "react";

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  icon = null,
  iconRight = null,
  disabled = false,
  isLoading = false,
  type = "button",
  onClick,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none outline-none focus:ring-2 focus:ring-[#FF8DA1]/50 focus:ring-offset-2 focus:ring-offset-[#FFF0F5] shadow-xs active:scale-[0.98]";

  const sizes = {
    sm: "text-xs px-3 py-1.5 rounded-xl gap-1.5",
    md: "text-sm px-4 py-2.5 rounded-xl gap-2",
    lg: "text-base px-6 py-3 rounded-2xl gap-2.5",
    icon: "p-2.5 rounded-xl",
  };

  const variants = {
    primary:
      "bg-gradient-to-r from-[#FF8DA1] to-[#FF69B4] text-white font-semibold hover:from-[#FF69B4] hover:to-[#E05297] shadow-[0_4px_14px_rgba(255,105,180,0.35)] hover:shadow-[0_6px_20px_rgba(255,105,180,0.45)]",
    secondary:
      "bg-[#FFFFFF] text-[#4A353A] border border-[#FAD6DF] hover:bg-[#FFF0F5] hover:border-[#FFB6C1] hover:text-[#D84A75] shadow-sm",
    admin:
      "bg-gradient-to-r from-[#FF8DA1] via-[#E8A0BF] to-[#C77DFF] text-white font-semibold hover:opacity-95 shadow-[0_4px_14px_rgba(232,160,191,0.45)]",
    danger:
      "bg-[#FFEBF0] text-[#C8234D] border border-[#FFCCD7] hover:bg-[#FFD4DE] hover:border-[#FFA8BC]",
    ghost:
      "bg-transparent text-[#7D676E] hover:bg-[#FFEBF1] hover:text-[#D84A75] shadow-none",
    outline:
      "bg-[#FFFFFF] border border-[#FAD6DF] text-[#4A353A] hover:bg-[#FFEBF1] hover:border-[#FF8DA1] hover:text-[#D84A75]",
  };

  const isButtonDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isButtonDisabled}
      onClick={onClick}
      className={`${baseStyles} ${sizes[size] || sizes.md} ${
        variants[variant] || variants.primary
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
      {!isLoading && iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
}

export default Button;