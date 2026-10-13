import Link from "next/link";
import { Menu } from "lucide-react";

const navigation = [
  { href: "/", label: "Início" },
  { href: "/aulas", label: "Aulas" },
  { href: "/locais", label: "Locais" },
  { href: "/eventos", label: "Eventos" },
  { href: "/sobre", label: "Sobre" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--sand-200)]/75 bg-[color:var(--warm-white)]/88 backdrop-blur-xl">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group inline-flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brown-700)] focus-visible:ring-offset-4">
          <span aria-hidden="true" className="grid size-10 place-items-center rounded-full border border-[var(--beige-400)] bg-[var(--offwhite-100)] font-serif text-xl font-semibold text-[var(--brown-900)] transition-transform duration-200 group-hover:-translate-y-0.5">A</span>
          <span className="leading-none">
            <span className="block font-serif text-xl font-semibold tracking-[0.02em] text-[var(--brown-900)]">Arte Nativa</span>
            <span className="mt-1 block text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--brown-700)]">dança & tradição</span>
          </span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--brown-700)] transition-colors duration-200 hover:bg-[var(--offwhite-100)] hover:text-[var(--brown-900)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brown-700)]">
              {item.label}
            </Link>
          ))}
          <Link href="/#contato" className="ml-2 rounded-full bg-[var(--brown-900)] px-5 py-2.5 text-sm font-semibold text-[var(--warm-white)] transition-colors duration-200 hover:bg-[var(--brown-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brown-700)] focus-visible:ring-offset-2">
            Fale conosco
          </Link>
        </nav>

        <details className="relative md:hidden">
          <summary className="grid size-11 cursor-pointer list-none place-items-center rounded-full border border-[var(--sand-200)] bg-[var(--offwhite-100)] text-[var(--brown-900)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brown-700)] [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Abrir menu</span>
            <Menu className="size-5" aria-hidden="true" />
          </summary>
          <nav aria-label="Navegação móvel" className="absolute right-0 mt-3 min-w-56 rounded-3xl border border-[var(--sand-200)] bg-[var(--warm-white)] p-2 shadow-[0_20px_60px_rgba(58,36,24,0.14)]">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="block rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--brown-700)] hover:bg-[var(--offwhite-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brown-700)]">
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
