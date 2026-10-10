"use client";

import { CalendarRange, Copy, Plus, Star, X } from "lucide-react";
import { FormEvent, useState, useTransition } from "react";

export interface AdminPeriodRecord {
  id: string;
  name: string;
  starts_at: string;
  ends_at: string;
  is_current: boolean;
}

type MaybePromise<T> = T | Promise<T>;
type ActionResult = { ok?: boolean; message?: string } | void;

interface PeriodManagerProps {
  periods: readonly AdminPeriodRecord[];
  onCreate: (input: Record<string, unknown>) => MaybePromise<ActionResult>;
  onDuplicate: (input: Record<string, unknown>) => MaybePromise<ActionResult>;
  onSetCurrent: (id: string) => MaybePromise<ActionResult>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeZone: "UTC" }).format(
    new Date(`${value}T00:00:00Z`),
  );
}

function resultMessage(result: ActionResult, fallback: string) {
  return result && typeof result === "object" && typeof result.message === "string"
    ? result.message
    : fallback;
}

export function PeriodManager({ periods, onCreate, onDuplicate, onSetCurrent }: PeriodManagerProps) {
  const [mode, setMode] = useState<"closed" | "create" | "duplicate">("closed");
  const [source, setSource] = useState<AdminPeriodRecord | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function closeForms() {
    setMode("closed");
    setSource(null);
  }

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    startTransition(async () => {
      const result = await onCreate({
        name: String(data.get("name") ?? ""),
        starts_at: String(data.get("starts_at") ?? ""),
        ends_at: String(data.get("ends_at") ?? ""),
        is_current: data.get("is_current") === "on",
      });
      const succeeded = !result || !(typeof result === "object" && result.ok === false);
      setFeedback(resultMessage(result, succeeded ? "Período criado com sucesso." : "Não foi possível criar o período."));
      if (succeeded) closeForms();
    });
  }

  function handleDuplicate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!source) return;
    const data = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await onDuplicate({
        source_period_id: source.id,
        new_name: String(data.get("new_name") ?? ""),
        new_starts_at: String(data.get("new_starts_at") ?? ""),
        new_ends_at: String(data.get("new_ends_at") ?? ""),
      });
      const succeeded = !result || !(typeof result === "object" && result.ok === false);
      setFeedback(resultMessage(result, succeeded ? "Período e aulas duplicados." : "Não foi possível duplicar o período."));
      if (succeeded) closeForms();
    });
  }

  function activate(id: string) {
    startTransition(async () => {
      const result = await onSetCurrent(id);
      setFeedback(resultMessage(result, "Período atual alterado."));
    });
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-[var(--brown-700)]">
          Períodos preservam o histórico das turmas. Duplicar cria uma nova etapa com novas aulas, sem alterar a origem.
        </p>
        <button
          type="button"
          onClick={() => setMode((current) => current === "create" ? "closed" : "create")}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--brown-900)] px-5 py-2.5 text-sm font-bold text-[var(--warm-white)] transition hover:bg-[var(--brown-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brown-700)]"
        >
          {mode === "create" ? <X className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
          {mode === "create" ? "Fechar formulário" : "Novo período"}
        </button>
      </div>

      {feedback ? <div role="status" className="mt-5 rounded-2xl border border-[var(--sand-200)] bg-[var(--offwhite-100)] px-4 py-3 text-sm font-semibold text-[var(--brown-900)]">{feedback}</div> : null}

      {mode === "create" ? (
        <form onSubmit={handleCreate} className="mt-6 rounded-[1.75rem] border border-[var(--sand-200)] bg-[var(--warm-white)] p-5 sm:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)] md:col-span-3">Nome
              <input name="name" required maxLength={120} placeholder="Ex.: 2º trimestre 2027" className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)] focus:ring-2 focus:ring-[var(--beige-400)]/40" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">Data inicial
              <input type="date" name="starts_at" required className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)]" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">Data final
              <input type="date" name="ends_at" required className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)]" />
            </label>
            <label className="flex min-h-11 items-center gap-3 rounded-2xl border border-[var(--sand-200)] px-4 text-sm font-semibold text-[var(--brown-900)]">
              <input type="checkbox" name="is_current" className="size-4 accent-[var(--brown-900)]" /> Tornar este período atual
            </label>
          </div>
          <div className="mt-6 flex justify-end"><button disabled={isPending} className="min-h-11 rounded-full bg-[var(--brown-900)] px-6 text-sm font-bold text-[var(--warm-white)] disabled:opacity-50">{isPending ? "Salvando…" : "Criar período"}</button></div>
        </form>
      ) : null}

      {mode === "duplicate" && source ? (
        <form onSubmit={handleDuplicate} className="mt-6 rounded-[1.75rem] border border-[var(--beige-400)] bg-[var(--offwhite-100)] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--brown-700)]">Duplicar período e aulas</p><h2 className="mt-2 font-serif text-3xl font-semibold text-[var(--brown-900)]">Criar uma nova etapa a partir da atual</h2></div>
            <button type="button" onClick={closeForms} aria-label="Fechar duplicação" className="grid size-10 place-items-center rounded-full hover:bg-[var(--sand-200)]"><X className="size-4" /></button>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">Período de origem
              <input readOnly value={source.name} className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-[var(--sand-200)]/35 px-4 text-[var(--brown-700)]" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">Novo nome
              <input name="new_name" required placeholder="Ex.: 3º trimestre 2027" className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)]" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">Nova data inicial
              <input type="date" name="new_starts_at" required className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)]" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">Nova data final
              <input type="date" name="new_ends_at" required className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)]" />
            </label>
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--brown-700)]">As aulas serão copiadas com novos IDs. O período e as aulas de origem permanecem intactos.</p>
          <div className="mt-6 flex justify-end"><button disabled={isPending} className="min-h-11 rounded-full bg-[var(--brown-900)] px-6 text-sm font-bold text-[var(--warm-white)] disabled:opacity-50">{isPending ? "Duplicando…" : "Duplicar período"}</button></div>
        </form>
      ) : null}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {periods.map((period) => (
          <article key={period.id} className="rounded-[1.75rem] border border-[var(--sand-200)] bg-[var(--warm-white)] p-5 shadow-[0_12px_35px_rgba(58,36,24,0.04)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div><CalendarRange className="size-5 text-[var(--brown-700)]" aria-hidden="true" /><h2 className="mt-4 font-serif text-3xl font-semibold text-[var(--brown-900)]">{period.name}</h2></div>
              {period.is_current ? <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">Atual</span> : null}
            </div>
            <p className="mt-3 text-sm text-[var(--brown-700)]">{formatDate(period.starts_at)} — {formatDate(period.ends_at)}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <button type="button" aria-label={`Duplicar ${period.name}`} onClick={() => { setSource(period); setMode("duplicate"); }} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--sand-200)] px-4 text-sm font-bold text-[var(--brown-900)] hover:bg-[var(--offwhite-100)]"><Copy className="size-4" aria-hidden="true" /> Duplicar</button>
              {!period.is_current ? <button disabled={isPending} type="button" aria-label={`Tornar atual ${period.name}`} onClick={() => activate(period.id)} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--sand-200)] px-4 text-sm font-bold text-[var(--brown-900)] hover:bg-[var(--offwhite-100)] disabled:opacity-50"><Star className="size-4" aria-hidden="true" /> Tornar atual</button> : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
