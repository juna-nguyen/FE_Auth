import React from "react";

export function Card({ children, className = "", hover = false, ...props }) {
  return (
    <div
      className={`rounded-xl bg-[#131b2e]/90 border border-[#464554]/30 backdrop-blur-md p-5 shadow-lg ${
        hover ? "hover:border-[#8083ff]/40 hover:-translate-y-0.5 transition-all duration-300" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`flex items-center justify-between pb-3 border-b border-[#464554]/20 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return <h3 className={`text-lg font-semibold text-[#dae2fd] tracking-tight font-headline ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = "" }) {
  return <p className={`text-xs text-[#c7c4d7] mt-0.5 ${className}`}>{children}</p>;
}

export function CardContent({ children, className = "" }) {
  return <div className={`pt-4 ${className}`}>{children}</div>;
}

export default Card;
