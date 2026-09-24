import React from "react";

export function Toast({ show, message, type = "success", onClose }) {
  if (!show) return null;

  const typeConfig = {
    success: {
      icon: "check_circle",
      bg: "bg-[#FFFFFF] border-[#B9ECE1] text-[#1B7A5C] shadow-[0_10px_30px_rgba(27,122,92,0.15)]",
      iconColor: "text-[#1B7A5C]",
      accent: "bg-[#E8F8F5]",
    },
    error: {
      icon: "error",
      bg: "bg-[#FFFFFF] border-[#FFCCD7] text-[#C8234D] shadow-[0_10px_30px_rgba(200,35,77,0.18)]",
      iconColor: "text-[#C8234D]",
      accent: "bg-[#FFEBF0]",
    },
    info: {
      icon: "info",
      bg: "bg-[#FFFFFF] border-[#FAD6DF] text-[#4A353A] shadow-[0_10px_30px_rgba(233,114,150,0.18)]",
      iconColor: "text-[#D84A75]",
      accent: "bg-[#FFEBF1]",
    },
    warning: {
      icon: "warning",
      bg: "bg-[#FFFFFF] border-[#FDE68A] text-[#B45309] shadow-[0_10px_30px_rgba(180,83,9,0.15)]",
      iconColor: "text-[#B45309]",
      accent: "bg-[#FFF8E6]",
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300 max-w-md">
      <div
        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border backdrop-blur-xl ${config.bg}`}
      >
        <div className={`p-1.5 rounded-xl ${config.accent} shrink-0`}>
          <span className={`material-symbols-outlined text-[20px] ${config.iconColor}`}>{config.icon}</span>
        </div>
        <span className="text-sm font-semibold flex-1 leading-snug">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-[#967C84] hover:text-[#4A353A] hover:bg-[#FAF0F2] rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default Toast;