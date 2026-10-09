import type { ButtonHTMLAttributes } from "react";

const baseClassName =
  "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-[background-color,color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--beige-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--warm-white)] disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary:
    "bg-[var(--brown-900)] text-[var(--warm-white)] shadow-[0_8px_24px_rgba(58,36,24,0.14)] hover:bg-[var(--brown-700)] active:translate-y-px",
  secondary:
    "bg-[var(--offwhite-100)] text-[var(--brown-900)] shadow-[inset_0_0_0_1px_rgba(58,36,24,0.12)] hover:bg-[var(--sand-200)] active:translate-y-px",
} as const;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function Button({
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${baseClassName} ${variants[variant]} ${className}`.trim()}
      {...props}
    />
  );
}
