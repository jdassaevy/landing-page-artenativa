export default function AdminLoading() {
  return (
    <main className="mx-auto max-w-6xl animate-pulse px-4 py-8 sm:px-6 lg:px-10 lg:py-12" aria-busy="true" aria-label="Carregando painel">
      <div className="h-3 w-32 rounded-full bg-[var(--sand-200)]" />
      <div className="mt-4 h-12 w-full max-w-md rounded-2xl bg-[var(--sand-200)]" />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => <div key={item} className="h-56 rounded-[1.75rem] bg-[var(--sand-200)]" />)}
      </div>
    </main>
  );
}
