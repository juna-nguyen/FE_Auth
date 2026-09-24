import React, { forwardRef } from "react";

export const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    iconLeft,
    iconRight,
    className = "",
    containerClassName = "",
    type = "text",
    id,
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-bold uppercase tracking-wider text-[#4A353A] select-none flex items-center justify-between"
        >
          <span>{label}</span>
          {hint && <span className="text-[11px] font-normal lowercase text-[#7D676E]">{hint}</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {iconLeft && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-[#967C84]">
            {iconLeft}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`w-full bg-[#FFFFFF] border border-[#FAD6DF] rounded-xl text-sm text-[#4A353A] placeholder-[#B89CA4] transition-all duration-200 focus:outline-none focus:border-[#FF8DA1] focus:ring-3 focus:ring-[#FF8DA1]/20 ${
            iconLeft ? "pl-10" : "pl-3.5"
          } ${iconRight ? "pr-10" : "pr-3.5"} py-2.5 shadow-2xs ${
            error ? "border-[#E63946] focus:border-[#E63946] focus:ring-[#E63946]/20" : ""
          } ${className}`}
          {...props}
        />

        {iconRight && (
          <div className="absolute right-3.5 flex items-center text-[#967C84]">
            {iconRight}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-[#E63946] font-medium flex items-center gap-1 mt-0.5">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;