import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";

import { loginAdmin } from "@/lib/actions/admin/auth";

export const metadata: Metadata = {
  title: "Administração",
  robots: { index: false, follow: false },
};

const errorMessages: Record<string, string> = {
  campos: "Preencha e-mail e senha corretamente.",
  credenciais: "Não foi possível entrar com essas credenciais.",
  acesso: "Esta conta não possui acesso administrativo.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const params = await searchParams;
  const message = params.erro ? errorMessages[params.erro] : null;

  return (
    <main className="min-h-screen bg-[var(--offwhite-100)] px-4 py-12 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brown-700)] hover:text-[var(--brown-900)]">
          <ArrowLeft className="size-4" aria-hidden="true" /> Voltar ao site
        </Link>

        <section className="mt-8 rounded-[2rem] border border-[var(--sand-200)] bg-[var(--warm-white)] p-6 shadow-[0_24px_70px_rgba(58,36,24,0.08)] sm:p-8">
          <div className="grid size-12 place-items-center rounded-2xl bg-[var(--brown-900)] text-[var(--warm-white)]">
            <LockKeyhole className="size-5" aria-hidden="true" />
          </div>
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-[var(--brown-700)]">Área administrativa</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.03em]">Entrar no painel</h1>
          <p className="mt-3 text-sm leading-7 text-[var(--brown-700)]">Acesso exclusivo para contas administrativas da Arte Nativa.</p>

          {message ? (
            <div role="alert" className="mt-6 rounded-2xl border border-[var(--beige-400)] bg-[var(--offwhite-100)] px-4 py-3 text-sm text-[var(--brown-900)]">{message}</div>
          ) : null}

          <form action={loginAdmin} className="mt-7 grid gap-5">
            <label className="grid gap-2 text-sm font-semibold">
              E-mail
              <input name="email" type="email" autoComplete="email" required className="min-h-12 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none transition focus:border-[var(--brown-700)] focus:ring-2 focus:ring-[var(--beige-400)]/40" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Senha
              <input name="password" type="password" autoComplete="current-password" required className="min-h-12 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none transition focus:border-[var(--brown-700)] focus:ring-2 focus:ring-[var(--beige-400)]/40" />
            </label>
            <button type="submit" className="min-h-12 rounded-full bg-[var(--brown-900)] px-6 text-sm font-bold text-[var(--warm-white)] transition hover:bg-[var(--brown-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brown-700)] focus-visible:ring-offset-2">Entrar</button>
          </form>

          <Link href="/admin/recuperar-senha" className="mt-6 inline-block text-sm font-semibold text-[var(--brown-700)] underline-offset-4 hover:underline">Esqueci minha senha</Link>
        </section>
      </div>
    </main>
  );
}
