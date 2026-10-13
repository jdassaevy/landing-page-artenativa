import type { HTMLAttributes } from "react";

import { clsx } from "clsx";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-[1.75rem] border border-[var(--sand-200)] bg-[color:var(--warm-white)]/88 shadow-[0_18px_50px_rgba(58,36,24,0.06)] backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
}
