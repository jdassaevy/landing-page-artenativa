import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Music2 } from "lucide-react";

const cards = [
  { href: "/admin/aulas", title: "Aulas", description: "Organize períodos, modalidades, dias e horários.", icon: Music2 },
  { href: "/admin/locais", title: "Locais", description: "Gerencie endereços e imagens dos espaços.", icon: MapPin },
  { href: "/admin/eventos", title: "Eventos", description: "Cadastre divulgação, ingressos e reservas.", icon: CalendarDays },
];

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brown-700)]">Painel administrativo</p>
      <h1 className="mt-2 font-serif text-5xl font-semibold tracking-[-0.035em]">Conteúdo da Arte Nativa</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--brown-700)]">A base segura do painel está pronta. As próximas etapas conectam cada módulo às ações de criação, edição e publicação.</p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {cards.map(({ href, title, description, icon: Icon }) => (
          <Link key={href} href={href} className="group rounded-[1.75rem] border border-[var(--sand-200)] bg-[var(--warm-white)] p-6 shadow-[0_16px_50px_rgba(58,36,24,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(58,36,24,0.09)]">
            <Icon className="size-5 text-[var(--brown-700)]" aria-hidden="true" />
            <h2 className="mt-8 font-serif text-3xl font-semibold">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--brown-700)]">{description}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold">Abrir <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span>
          </Link>
        ))}
      </div>
    </main>
  );
}
