import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, LayoutDashboard, LogOut, MapPin, Music2 } from "lucide-react";
import { redirect } from "next/navigation";

import { logoutAdmin } from "@/lib/actions/admin/auth";
import { AdminAuthorizationError, requireAdmin } from "@/lib/auth/require-admin";

export const metadata: Metadata = {
  title: { default: "Painel", template: "%s | Arte Nativa Admin" },
  robots: { index: false, follow: false },
};

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/aulas", label: "Aulas", icon: Music2 },
  { href: "/admin/locais", label: "Locais", icon: MapPin },
  { href: "/admin/eventos", label: "Eventos", icon: CalendarDays },
];

export default async function ProtectedAdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let admin;
  try {
    admin = await requireAdmin();
  } catch (error) {
    if (error instanceof AdminAuthorizationError) redirect("/admin/login");
    throw error;
  }

  return (
    <div className="min-h-screen bg-[var(--offwhite-100)] text-[var(--brown-900)] md:grid md:grid-cols-[17rem_1fr]">
      <aside className="border-b border-[var(--sand-200)] bg-[var(--brown-900)] p-4 text-[var(--warm-white)] md:min-h-screen md:border-b-0 md:border-r md:p-6">
        <div className="flex items-center justify-between gap-4 md:block">
          <div>
            <p className="font-serif text-2xl font-semibold">Arte Nativa</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--beige-400)]">Administração</p>
          </div>
          <form action={logoutAdmin} className="md:hidden">
            <button className="grid size-11 place-items-center rounded-full border border-white/15" type="submit"><span className="sr-only">Sair</span><LogOut className="size-4" /></button>
          </form>
        </div>
        <nav className="mt-5 flex gap-2 overflow-x-auto md:mt-10 md:grid" aria-label="Navegação administrativa">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="inline-flex min-h-11 shrink-0 items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold text-[var(--offwhite-100)] transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--beige-400)]">
              <Icon className="size-4" aria-hidden="true" /> {label}
            </Link>
          ))}
        </nav>
        <div className="mt-10 hidden border-t border-white/10 pt-5 md:block">
          <p className="truncate text-xs text-[var(--sand-200)]">{admin.email ?? "Conta administrativa"}</p>
          <form action={logoutAdmin} className="mt-3">
            <button type="submit" className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold hover:bg-white/10"><LogOut className="size-4" aria-hidden="true" /> Sair</button>
          </form>
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
