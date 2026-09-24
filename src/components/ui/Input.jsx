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
          className="text-xs font-semibold uppercase tracking-wider text-[#dae2fd]/80 select-none flex items-center justify-between"
        >
          <span>{label}</span>
          {hint && <span className="text-[11px] font-normal lowercase text-[#908fa0]">{hint}</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {iconLeft && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-[#908fa0]">
            {iconLeft}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`w-full bg-[#060e20]/70 border border-[#464554]/50 rounded-lg text-sm text-[#dae2fd] placeholder-[#908fa0]/60 transition-all duration-200 focus:outline-none focus:border-[#8083ff] focus:ring-2 focus:ring-[#8083ff]/20 ${
            iconLeft ? "pl-10" : "pl-3.5"
          } ${iconRight ? "pr-10" : "pr-3.5"} py-2.5 ${
            error ? "border-[#ffb4ab] focus:border-[#ffb4ab] focus:ring-[#ffb4ab]/20" : ""
          } ${className}`}
          {...props}
        />

        {iconRight && (
          <div className="absolute right-3.5 flex items-center text-[#908fa0]">
            {iconRight}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-[#ffb4ab] flex items-center gap-1">{error}</p>}
    </div>
  );
});

export default Input;
