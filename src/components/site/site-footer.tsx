import Link from "next/link";

export function SiteFooter() {
  return (
    <footer id="contato" className="border-t border-[var(--sand-200)] bg-[var(--brown-900)] text-[var(--offwhite-100)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div>
          <p className="font-serif text-3xl font-semibold">Arte Nativa</p>
          <p className="mt-3 max-w-lg text-sm leading-7 text-[var(--sand-200)]">
            Tradição, convivência e dança em uma experiência feita para aproximar pessoas e manter a cultura viva.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <p className="font-semibold text-[var(--warm-white)]">Navegue</p>
            <div className="mt-3 grid gap-2 text-[var(--sand-200)]">
              <Link href="/aulas">Aulas</Link>
              <Link href="/locais">Locais</Link>
              <Link href="/eventos">Eventos</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold text-[var(--warm-white)]">Arte Nativa</p>
            <div className="mt-3 grid gap-2 text-[var(--sand-200)]">
              <Link href="/sobre">Sobre</Link>
              <a href="#top">Voltar ao topo</a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-[var(--beige-400)]">
        © {new Date().getFullYear()} Arte Nativa. Todos os direitos reservados.
      </div>
    </footer>
  );
}
