import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Sparkles } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";

const schedulePlaceholders = [
  { icon: CalendarDays, eyebrow: "Programação", title: "Dias da semana", body: "As aulas ativas serão organizadas de segunda a domingo, em ordem de horário." },
  { icon: Sparkles, eyebrow: "Modalidades", title: "Encontre sua dança", body: "Cada turma será apresentada pela própria modalidade, sem etiquetas extras de nível." },
  { icon: MapPin, eyebrow: "Locais", title: "Chegue com facilidade", body: "Endereço e rota ficam sempre disponíveis, mesmo se o mapa não carregar." },
];

export default function HomePage() {
  return (
    <main id="conteudo" className="overflow-hidden">
      <section className="relative isolate min-h-[78svh] border-b border-[var(--sand-200)]">
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[linear-gradient(115deg,var(--brown-900)_0%,var(--brown-700)_48%,#8b654d_100%)]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-35 [background-image:radial-gradient(circle_at_70%_30%,rgba(252,250,246,0.32),transparent_24rem),linear-gradient(120deg,transparent_0_58%,rgba(252,250,246,0.08)_58%_60%,transparent_60%)]" />

        <div className="mx-auto grid min-h-[78svh] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <Reveal className="max-w-3xl text-[var(--warm-white)]">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.26em] text-[var(--sand-200)]">Tradição que se vive em movimento</p>
            <h1 className="font-serif text-[clamp(3.8rem,10vw,7.4rem)] font-semibold leading-[0.82] tracking-[-0.045em]">
              A cultura ganha vida quando a gente dança junto.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--offwhite-100)]/88 sm:text-lg">
              Um novo espaço digital para descobrir aulas, acompanhar eventos e se aproximar da comunidade Arte Nativa.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="#aulas" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--warm-white)] px-6 py-3 text-sm font-bold text-[var(--brown-900)] transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[var(--offwhite-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--warm-white)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brown-900)]">
                Ver aulas e horários <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link href="/eventos" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-[var(--warm-white)] transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--warm-white)]">
                Próximos eventos
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="relative mx-auto w-full max-w-xl lg:mx-0 lg:justify-self-end">
            <div className="aspect-[4/5] overflow-hidden rounded-[2.4rem] border border-white/15 bg-[linear-gradient(155deg,rgba(252,250,246,0.18),rgba(252,250,246,0.04))] p-4 shadow-[0_30px_90px_rgba(28,15,9,0.35)] backdrop-blur-sm">
              <div className="grid h-full place-items-end rounded-[1.9rem] border border-white/10 bg-[radial-gradient(circle_at_35%_28%,rgba(252,250,246,0.28),transparent_23%),linear-gradient(155deg,#9e765c_0%,#5b3b2b_62%,#2d1b12_100%)] p-6 sm:p-8">
                <div className="w-full rounded-3xl border border-white/15 bg-black/15 p-5 text-[var(--warm-white)] backdrop-blur-md">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--sand-200)]">Imagem institucional</p>
                  <p className="mt-2 font-serif text-3xl font-semibold leading-tight">A fotografia oficial entra aqui sem sacrificar o LCP.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="aulas" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <div className="grid gap-6 border-b border-[var(--sand-200)] pb-10 md:grid-cols-[0.75fr_1.25fr] md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brown-700)]">Aulas e horários</p>
              <h2 className="mt-3 font-serif text-5xl font-semibold leading-none tracking-[-0.035em] sm:text-6xl">Sua semana começa aqui.</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-[var(--brown-700)] md:justify-self-end">
              Este bloco será alimentado pelo painel administrativo. A estrutura já prioriza leitura rápida no celular e ordenação natural de segunda a domingo.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {schedulePlaceholders.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <Card className="h-full p-6 sm:p-7">
                <item.icon className="size-5 text-[var(--brown-700)]" aria-hidden="true" />
                <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[var(--brown-700)]">{item.eyebrow}</p>
                <h3 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.02em]">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--brown-700)]">{item.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 flex justify-end">
          <Link href="/aulas" className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-[var(--brown-900)] transition-colors hover:bg-[var(--offwhite-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brown-700)]">
            Explorar todas as aulas <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </section>

      <section className="border-y border-[var(--sand-200)] bg-[var(--offwhite-100)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-24">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--brown-700)]">Próximos passos</p>
            <h2 className="mt-3 max-w-xl font-serif text-5xl font-semibold leading-[0.95] tracking-[-0.035em]">Conteúdo vivo, administrado sem mexer em código.</h2>
          </Reveal>
          <Reveal delay={0.06} className="grid gap-5 self-end text-[var(--brown-700)]">
            <p className="leading-8">Na sequência, o Supabase entra como fonte para aulas, locais e eventos, com histórico trimestral e RLS protegendo toda mutação.</p>
            <p className="leading-8">Enquanto isso, a fundação visual já estabelece o ritmo: editorial, acolhedor, responsivo e com motion sutil.</p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
