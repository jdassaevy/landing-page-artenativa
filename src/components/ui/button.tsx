import type { ButtonHTMLAttributes, ReactNode } from "react";

import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ children, className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-[background-color,color,border-color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brown-700)] focus-visible:ring-offset-2 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-[var(--brown-900)] text-[var(--warm-white)] hover:bg-[var(--brown-700)]",
        variant === "secondary" && "border border-[var(--beige-400)] bg-[var(--warm-white)] text-[var(--brown-900)] hover:bg-[var(--offwhite-100)]",
        variant === "ghost" && "text-[var(--brown-900)] hover:bg-[var(--sand-200)]/55",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
