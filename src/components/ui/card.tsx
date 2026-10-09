import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-[1.5rem] bg-[var(--warm-white)] shadow-[0_0_0_1px_rgba(58,36,24,0.06),0_12px_40px_rgba(58,36,24,0.06)] ${className}`.trim()}
      {...props}
    />
  );
}
