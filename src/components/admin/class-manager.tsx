"use client";

import { Copy, Plus, Power, X } from "lucide-react";
import { FormEvent, useMemo, useState, useTransition } from "react";

import { WEEKDAY_LABELS, type Weekday } from "@/types/domain";

export interface AdminClassRecord {
  id: string;
  period_id: string;
  location_id: string;
  modality: string;
  weekday: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export interface AdminPeriodSummary {
  id: string;
  name: string;
  starts_at: string;
  ends_at: string;
  is_current: boolean;
}

export interface AdminLocationSummary {
  id: string;
  name: string;
  is_active: boolean;
}

type MaybePromise<T> = T | Promise<T>;

type ActionResult = {
  ok?: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
} | void;

interface ClassManagerProps {
  classes: readonly AdminClassRecord[];
  periods: readonly AdminPeriodSummary[];
  locations: readonly AdminLocationSummary[];
  onCreate: (input: Record<string, unknown>) => MaybePromise<ActionResult>;
  onDuplicate: (id: string) => MaybePromise<ActionResult>;
  onToggleActive: (id: string, active: boolean) => MaybePromise<ActionResult>;
}

function formatTime(value: string) {
  return value.slice(0, 5);
}

function sortClasses(classes: readonly AdminClassRecord[]) {
  return [...classes].sort((a, b) => {
    if (a.weekday !== b.weekday) return a.weekday - b.weekday;
    return a.start_time.localeCompare(b.start_time);
  });
}

function resultMessage(result: ActionResult, fallback: string) {
  if (result && typeof result === "object" && typeof result.message === "string") {
    return result.message;
  }
  return fallback;
}

export function ClassManager({
  classes,
  periods,
  locations,
  onCreate,
  onDuplicate,
  onToggleActive,
}: ClassManagerProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const sortedClasses = useMemo(() => sortClasses(classes), [classes]);
  const periodById = useMemo(() => new Map(periods.map((period) => [period.id, period])), [periods]);
  const locationById = useMemo(() => new Map(locations.map((location) => [location.id, location])), [locations]);
  const activeLocations = locations.filter((location) => location.is_active);

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      period_id: String(data.get("period_id") ?? ""),
      location_id: String(data.get("location_id") ?? ""),
      modality: String(data.get("modality") ?? ""),
      weekday: Number(data.get("weekday")),
      start_time: String(data.get("start_time") ?? ""),
      end_time: String(data.get("end_time") ?? ""),
      is_active: true,
    };

    startTransition(async () => {
      const result = await onCreate(payload);
      const succeeded = !result || !(typeof result === "object" && result.ok === false);
      setFeedback(resultMessage(result, succeeded ? "Aula criada com sucesso." : "Não foi possível criar a aula."));
      if (succeeded) {
        form.reset();
        setShowCreate(false);
      }
    });
  }

  function runRowAction(action: () => MaybePromise<ActionResult>, fallback: string) {
    startTransition(async () => {
      const result = await action();
      setFeedback(resultMessage(result, fallback));
    });
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-[var(--brown-700)]">
            {classes.length} {classes.length === 1 ? "aula cadastrada" : "aulas cadastradas"}
          </p>
          {periods.find((period) => period.is_current) ? (
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--brown-700)]">
              Período atual: {periods.find((period) => period.is_current)?.name}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => setShowCreate((value) => !value)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--brown-900)] px-5 py-2.5 text-sm font-bold text-[var(--warm-white)] transition hover:bg-[var(--brown-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brown-700)] focus-visible:ring-offset-2"
        >
          {showCreate ? <X className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
          {showCreate ? "Fechar formulário" : "Nova aula"}
        </button>
      </div>

      {feedback ? (
        <div className="mt-5 rounded-2xl border border-[var(--sand-200)] bg-[var(--offwhite-100)] px-4 py-3 text-sm font-semibold text-[var(--brown-900)]" role="status">
          {feedback}
        </div>
      ) : null}

      {showCreate ? (
        <form onSubmit={handleCreate} className="mt-6 rounded-[1.75rem] border border-[var(--sand-200)] bg-[var(--warm-white)] p-5 shadow-[0_16px_50px_rgba(58,36,24,0.05)] sm:p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">
              Modalidade
              <input name="modality" required maxLength={120} className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)] focus:ring-2 focus:ring-[var(--beige-400)]/40" />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">
              Dia da semana
              <select name="weekday" required defaultValue="1" className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)] focus:ring-2 focus:ring-[var(--beige-400)]/40">
                {Object.entries(WEEKDAY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">
              Período
              <select name="period_id" required defaultValue={periods.find((period) => period.is_current)?.id ?? periods[0]?.id ?? ""} className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)] focus:ring-2 focus:ring-[var(--beige-400)]/40">
                {periods.map((period) => <option key={period.id} value={period.id}>{period.name}{period.is_current ? " — atual" : ""}</option>)}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">
              Local
              <select name="location_id" required defaultValue={activeLocations[0]?.id ?? ""} className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)] focus:ring-2 focus:ring-[var(--beige-400)]/40">
                {activeLocations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">
              Horário inicial
              <input type="time" name="start_time" required className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)] focus:ring-2 focus:ring-[var(--beige-400)]/40" />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">
              Horário final
              <input type="time" name="end_time" required className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)] focus:ring-2 focus:ring-[var(--beige-400)]/40" />
            </label>
          </div>

          <div className="mt-6 flex justify-end">
            <button disabled={isPending || !periods.length || !activeLocations.length} type="submit" className="min-h-11 rounded-full bg-[var(--brown-900)] px-6 py-2.5 text-sm font-bold text-[var(--warm-white)] transition hover:bg-[var(--brown-700)] disabled:cursor-not-allowed disabled:opacity-50">
              {isPending ? "Salvando…" : "Salvar aula"}
            </button>
          </div>
        </form>
      ) : null}

      <div className="mt-8 grid gap-4">
        {sortedClasses.map((item) => {
          const period = periodById.get(item.period_id);
          const location = locationById.get(item.location_id);
          const weekday = item.weekday as Weekday;

          return (
            <article
              key={item.id}
              data-testid="admin-class-row"
              data-class-id={item.id}
              className="grid gap-5 rounded-[1.75rem] border border-[var(--sand-200)] bg-[var(--warm-white)] p-5 shadow-[0_12px_35px_rgba(58,36,24,0.04)] md:grid-cols-[minmax(0,1fr)_auto] md:items-center sm:p-6"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[var(--offwhite-100)] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[var(--brown-700)]">
                    {WEEKDAY_LABELS[weekday] ?? "Dia"} · {formatTime(item.start_time)}–{formatTime(item.end_time)}
                  </span>
                  <span className={item.is_active ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800" : "rounded-full bg-stone-200 px-3 py-1 text-xs font-bold text-stone-700"}>
                    {item.is_active ? "Ativa" : "Inativa"}
                  </span>
                </div>
                <h2 className="mt-3 font-serif text-3xl font-semibold text-[var(--brown-900)]">{item.modality}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--brown-700)]">
                  {period?.name ?? "Período não encontrado"} · {location?.name ?? "Local não encontrado"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 md:justify-end">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => runRowAction(() => onDuplicate(item.id), "Aula duplicada.")}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--sand-200)] px-4 py-2 text-sm font-bold text-[var(--brown-900)] transition hover:bg-[var(--offwhite-100)] disabled:opacity-50"
                >
                  <Copy className="size-4" aria-hidden="true" /> Duplicar
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => runRowAction(() => onToggleActive(item.id, !item.is_active), item.is_active ? "Aula desativada." : "Aula ativada.")}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--sand-200)] px-4 py-2 text-sm font-bold text-[var(--brown-900)] transition hover:bg-[var(--offwhite-100)] disabled:opacity-50"
                >
                  <Power className="size-4" aria-hidden="true" /> {item.is_active ? "Desativar" : "Ativar"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {!sortedClasses.length ? (
        <div className="mt-8 rounded-[1.75rem] border border-dashed border-[var(--beige-400)] bg-[var(--offwhite-100)] p-8 text-center">
          <p className="font-serif text-3xl font-semibold text-[var(--brown-900)]">Nenhuma aula cadastrada.</p>
          <p className="mt-2 text-sm text-[var(--brown-700)]">Crie a primeira aula para começar a programação.</p>
        </div>
      ) : null}
    </div>
  );
}
