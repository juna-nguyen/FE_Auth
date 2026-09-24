import React from "react";

export function Toast({ show, message, type = "success", onClose }) {
  if (!show) return null;

  const typeConfig = {
    success: {
      icon: "check_circle",
      bg: "bg-[#00885d]/90 border-[#4edea3]/40 text-[#ffffff]",
      iconColor: "text-[#4edea3]",
    },
    error: {
      icon: "error",
      bg: "bg-[#93000a]/90 border-[#ffb4ab]/40 text-[#ffffff]",
      iconColor: "text-[#ffb4ab]",
    },
    info: {
      icon: "info",
      bg: "bg-[#171f33]/95 border-[#8083ff]/40 text-[#dae2fd]",
      iconColor: "text-[#c0c1ff]",
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl ${config.bg}`}
      >
        <span className={`material-symbols-outlined ${config.iconColor}`}>{config.icon}</span>
        <span className="text-sm font-medium">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 text-[#dae2fd]/60 hover:text-[#dae2fd] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default Toast;
