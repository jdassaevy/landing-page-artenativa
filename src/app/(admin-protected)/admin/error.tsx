"use client";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="rounded-[2rem] border border-[var(--sand-200)] bg-[var(--warm-white)] p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brown-700)]">Painel administrativo</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold">Não foi possível carregar esta área.</h1>
        <p className="mt-4 text-sm leading-7 text-[var(--brown-700)]">Tente novamente. Se o problema continuar, volte ao painel principal e repita a operação.</p>
        <button type="button" onClick={reset} className="mt-7 min-h-11 rounded-full bg-[var(--brown-900)] px-5 text-sm font-bold text-[var(--warm-white)]">Tentar novamente</button>
      </div>
    </main>
  );
}
