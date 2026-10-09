import { MessageCircle } from "lucide-react";

import { buildWhatsAppUrl } from "@/lib/domain/whatsapp";

interface WhatsAppCtaProps {
  phone: string | null;
  message: string | null;
  label: string;
  variant?: "primary" | "secondary";
}

export function WhatsAppCta({ phone, message, label, variant = "primary" }: WhatsAppCtaProps) {
  if (!phone || !message) return null;

  let href: string;
  try {
    href = buildWhatsAppUrl({ phone, message });
  } catch {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={variant === "primary"
        ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--brown-900)] px-6 py-3 text-sm font-bold text-[var(--warm-white)] transition hover:bg-[var(--brown-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brown-700)] focus-visible:ring-offset-2"
        : "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--beige-400)] px-6 py-3 text-sm font-bold text-[var(--brown-900)] transition hover:bg-[var(--offwhite-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brown-700)]"}
    >
      <MessageCircle className="size-4" aria-hidden="true" /> {label}
    </a>
  );
}
