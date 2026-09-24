import React, { useEffect } from "react";

export function Modal({ isOpen, onClose, title, subtitle, children, footer, maxWidth = "max-w-lg" }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) onClose?.();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060e20]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative w-full ${maxWidth} rounded-2xl bg-[#131b2e] border border-[#464554]/60 shadow-2xl p-6 z-10 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#464554]/30">
          <div>
            {title && <h3 className="text-lg font-bold text-[#dae2fd] font-headline">{title}</h3>}
            {subtitle && <p className="text-xs text-[#c7c4d7] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#908fa0] hover:text-[#dae2fd] hover:bg-[#222a3d] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="py-4 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && <div className="pt-4 border-t border-[#464554]/30 flex items-center justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
