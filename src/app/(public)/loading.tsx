export default function PublicLoading() {
  return (
    <main id="conteudo" aria-busy="true" aria-label="Carregando conteúdo">
      <section className="min-h-[55svh] animate-pulse bg-[var(--brown-900)]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="h-3 w-44 rounded-full bg-white/15" />
          <div className="mt-7 h-16 max-w-3xl rounded-3xl bg-white/10 sm:h-24" />
          <div className="mt-4 h-16 max-w-xl rounded-3xl bg-white/10" />
          <div className="mt-8 h-12 w-48 rounded-full bg-white/15" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl animate-pulse px-4 py-20 sm:px-6 lg:px-8">
        <div className="h-3 w-36 rounded-full bg-[var(--sand-200)]" />
        <div className="mt-4 h-12 max-w-xl rounded-2xl bg-[var(--sand-200)]" />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-56 rounded-[1.75rem] bg-[var(--offwhite-100)]" />
          ))}
        </div>
      </section>
    </main>
  );
}
