import type { Metadata } from "next";

import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a proposta da Arte Nativa e a tradição que ganha vida por meio da dança e da comunidade.",
};

export default function AboutPage() {
  return (
    <main id="conteudo">
      <section className="border-b border-[var(--sand-200)] bg-[var(--brown-900)] text-[var(--warm-white)]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <Reveal className="max-w-5xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--sand-200)]">Sobre a Arte Nativa</p>
            <h1 className="mt-4 font-serif text-6xl font-semibold leading-[0.88] tracking-[-0.045em] sm:text-7xl lg:text-8xl">Tradição, pertencimento e movimento.</h1>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-28">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brown-700)]">Nossa essência</p>
          <h2 className="mt-3 font-serif text-5xl font-semibold leading-[0.95] tracking-[-0.035em]">A dança como forma de manter a cultura perto.</h2>
        </Reveal>
        <Reveal delay={0.06} className="grid gap-5 self-end text-base leading-8 text-[var(--brown-700)]">
          <p>A Arte Nativa reúne pessoas em torno da dança, da convivência e das tradições que fazem parte da nossa identidade.</p>
          <p>Este novo espaço digital foi pensado para facilitar o acesso a aulas, horários, locais e eventos sem perder o acolhimento e a personalidade da comunidade.</p>
        </Reveal>
      </section>
    </main>
  );
}
