import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { TrackedClassesLink } from "@/components/site/tracked-classes-link";

export function Hero() {
  return (
    <section className="relative isolate min-h-[78svh] overflow-hidden border-b border-[var(--sand-200)]">
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[linear-gradient(115deg,var(--brown-900)_0%,var(--brown-700)_48%,#8b654d_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-35 [background-image:radial-gradient(circle_at_70%_30%,rgba(252,250,246,0.32),transparent_24rem),linear-gradient(120deg,transparent_0_58%,rgba(252,250,246,0.08)_58%_60%,transparent_60%)]" />

      <div className="mx-auto grid min-h-[78svh] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        <Reveal className="max-w-3xl text-[var(--warm-white)]">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.26em] text-[var(--sand-200)]">Tradição que se vive em movimento</p>
          <h1 className="font-serif text-[clamp(3.8rem,10vw,7.4rem)] font-semibold leading-[0.82] tracking-[-0.045em]">
            A cultura ganha vida quando a gente dança junto.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--offwhite-100)]/88 sm:text-lg">
            Descubra aulas, horários, locais e a programação da Arte Nativa em um espaço feito para aproximar a comunidade da dança e da tradição.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <TrackedClassesLink
              href="#aulas"
              source="home"
              showArrow
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--warm-white)] px-6 py-3 text-sm font-bold text-[var(--brown-900)] transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[var(--offwhite-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--warm-white)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brown-900)]"
            >
              Ver aulas e horários
            </TrackedClassesLink>
            <Link href="/eventos" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-[var(--warm-white)] transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--warm-white)]">
              Próximos eventos
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="relative mx-auto w-full max-w-xl lg:mx-0 lg:justify-self-end">
          <div className="aspect-[4/5] overflow-hidden rounded-[2.4rem] border border-white/15 bg-[linear-gradient(155deg,rgba(252,250,246,0.18),rgba(252,250,246,0.04))] p-4 shadow-[0_30px_90px_rgba(28,15,9,0.35)] backdrop-blur-sm">
            <div className="grid h-full place-items-end rounded-[1.9rem] border border-white/10 bg-[radial-gradient(circle_at_35%_28%,rgba(252,250,246,0.28),transparent_23%),linear-gradient(155deg,#9e765c_0%,#5b3b2b_62%,#2d1b12_100%)] p-6 sm:p-8">
              <div className="w-full rounded-3xl border border-white/15 bg-black/15 p-5 text-[var(--warm-white)] backdrop-blur-md">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--sand-200)]">Arte Nativa</p>
                <p className="mt-2 font-serif text-3xl font-semibold leading-tight">Dança, cultura e encontros que atravessam gerações.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
