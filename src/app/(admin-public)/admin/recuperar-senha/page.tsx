import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { Suspense } from "react";

import { requestAdminPasswordReset } from "@/lib/actions/admin/auth";

export const metadata: Metadata = {
  title: "Recuperar acesso",
  robots: { index: false, follow: false },
};

async function RecoveryMessage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; enviado?: string }>;
}) {
  const params = await searchParams;

  if (params.enviado === "1") {
    return (
      <div role="status" className="mt-6 rounded-2xl border border-[var(--sand-200)] bg-[var(--offwhite-100)] px-4 py-3 text-sm leading-6">
        Se o e-mail estiver habilitado para recuperação, você receberá as instruções.
      </div>
    );
  }

  if (params.erro === "email") {
    return (
      <div role="alert" className="mt-6 rounded-2xl border border-[var(--beige-400)] bg-[var(--offwhite-100)] px-4 py-3 text-sm">
        Informe um e-mail válido.
      </div>
    );
  }

  return null;
}

export default function RecoverAdminPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; enviado?: string }>;
}) {
  return (
    <main className="min-h-screen bg-[var(--offwhite-100)] px-4 py-12 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <Link href="/admin/login" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brown-700)] hover:text-[var(--brown-900)]">
          <ArrowLeft className="size-4" aria-hidden="true" /> Voltar ao login
        </Link>
        <section className="mt-8 rounded-[2rem] border border-[var(--sand-200)] bg-[var(--warm-white)] p-6 shadow-[0_24px_70px_rgba(58,36,24,0.08)] sm:p-8">
          <div className="grid size-12 place-items-center rounded-2xl bg-[var(--brown-900)] text-[var(--warm-white)]"><Mail className="size-5" aria-hidden="true" /></div>
          <h1 className="mt-7 font-serif text-4xl font-semibold tracking-[-0.03em]">Recuperar acesso</h1>
          <p className="mt-3 text-sm leading-7 text-[var(--brown-700)]">Informe o e-mail usado no painel administrativo.</p>

          <Suspense
            fallback={
              <div
                aria-hidden="true"
                className="mt-6 h-14 animate-pulse rounded-2xl bg-[var(--offwhite-100)]"
              />
            }
          >
            <RecoveryMessage searchParams={searchParams} />
          </Suspense>

          <form action={requestAdminPasswordReset} className="mt-7 grid gap-5">
            <label className="grid gap-2 text-sm font-semibold">
              E-mail
              <input name="email" type="email" autoComplete="email" required className="min-h-12 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none transition focus:border-[var(--brown-700)] focus:ring-2 focus:ring-[var(--beige-400)]/40" />
            </label>
            <button type="submit" className="min-h-12 rounded-full bg-[var(--brown-900)] px-6 text-sm font-bold text-[var(--warm-white)] transition hover:bg-[var(--brown-700)]">Enviar instruções</button>
          </form>
        </section>
      </div>
    </main>
  );
}
