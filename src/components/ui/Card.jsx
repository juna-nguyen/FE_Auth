import React from "react";

export function Card({ children, className = "", hover = false, ...props }) {
  return (
    <div
      className={`rounded-2xl bg-[#FFFFFF] border border-[#FAD6DF] shadow-[0_8px_24px_rgba(233,114,150,0.08)] p-6 transition-all duration-300 ${
        hover ? "hover:border-[#FFB6C1] hover:shadow-[0_12px_28px_rgba(233,114,150,0.14)] hover:-translate-y-0.5" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`flex items-center justify-between pb-4 border-b border-[#FAD6DF]/60 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return <h3 className={`text-lg font-bold text-[#4A353A] tracking-tight font-headline ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = "" }) {
  return <p className={`text-xs text-[#7D676E] mt-1 ${className}`}>{children}</p>;
}

export function CardContent({ children, className = "" }) {
  return <div className={`pt-4 ${className}`}>{children}</div>;
}

export default Card;