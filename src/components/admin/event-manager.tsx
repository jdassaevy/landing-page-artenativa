"use client";

import { Copy, Edit3, Plus, Radio, X } from "lucide-react";
import { FormEvent, useState, useTransition } from "react";

export interface AdminEventRecord {
  id: string;
  title: string;
  slug: string;
  cover_path: string | null;
  description: string | null;
  event_date: string;
  venue_name: string | null;
  venue_address: string | null;
  venue_city: string | null;
  venue_state: string | null;
  maps_url: string | null;
  latitude: number | null;
  longitude: number | null;
  whatsapp_phone: string | null;
  reservation_message: string | null;
  ticket_message: string | null;
  status: string;
  show_on_home: boolean;
  show_as_popup: boolean;
  promotion_starts_at: string | null;
  promotion_ends_at: string | null;
  created_at: string;
  updated_at: string;
}

type MaybePromise<T> = T | Promise<T>;
type ActionResult = { ok?: boolean; message?: string; fieldErrors?: Record<string, string[]> } | void;

interface EventManagerProps {
  events: readonly AdminEventRecord[];
  onCreate: (input: Record<string, unknown>) => MaybePromise<ActionResult>;
  onUpdate: (id: string, input: Record<string, unknown>) => MaybePromise<ActionResult>;
  onDuplicate: (id: string) => MaybePromise<ActionResult>;
  onSetStatus: (id: string, status: string) => MaybePromise<ActionResult>;
  onSetFeatured: (id: string) => MaybePromise<ActionResult>;
}

function resultMessage(result: ActionResult, fallback: string) {
  return result && typeof result === "object" && typeof result.message === "string"
    ? result.message
    : fallback;
}

function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

function toDateTimeLocal(value: string | null) {
  if (!value) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "America/Sao_Paulo",
  }).formatToParts(new Date(value));
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
}

function statusLabel(status: string) {
  if (status === "published") return "Publicado";
  if (status === "archived") return "Arquivado";
  return "Rascunho";
}

function formPayload(form: HTMLFormElement, coverPath: string | null) {
  const data = new FormData(form);
  return {
    title: String(data.get("title") ?? ""),
    slug: String(data.get("slug") ?? ""),
    cover_path: coverPath ?? "",
    description: String(data.get("description") ?? ""),
    event_date: String(data.get("event_date") ?? ""),
    venue_name: String(data.get("venue_name") ?? ""),
    venue_address: String(data.get("venue_address") ?? ""),
    venue_city: String(data.get("venue_city") ?? ""),
    venue_state: String(data.get("venue_state") ?? ""),
    maps_url: String(data.get("maps_url") ?? ""),
    latitude: String(data.get("latitude") ?? ""),
    longitude: String(data.get("longitude") ?? ""),
    whatsapp_phone: String(data.get("whatsapp_phone") ?? ""),
    reservation_message: String(data.get("reservation_message") ?? ""),
    ticket_message: String(data.get("ticket_message") ?? ""),
    status: String(data.get("status") ?? "draft"),
    show_on_home: data.get("show_on_home") === "on",
    show_as_popup: data.get("show_as_popup") === "on",
    promotion_starts_at: String(data.get("promotion_starts_at") ?? ""),
    promotion_ends_at: String(data.get("promotion_ends_at") ?? ""),
  };
}

export function EventManager({
  events,
  onCreate,
  onUpdate,
  onDuplicate,
  onSetStatus,
  onSetFeatured,
}: EventManagerProps) {
  const [mode, setMode] = useState<"closed" | "create" | "edit">("closed");
  const [editing, setEditing] = useState<AdminEventRecord | null>(null);
  const [coverPath, setCoverPath] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function closeForm() {
    setMode("closed");
    setEditing(null);
    setCoverPath(null);
  }

  function openCreate() {
    if (mode === "create") closeForm();
    else {
      setEditing(null);
      setCoverPath(null);
      setFeedback(null);
      setMode("create");
    }
  }

  function openEdit(event: AdminEventRecord) {
    setEditing(event);
    setCoverPath(event.cover_path);
    setFeedback(null);
    setMode("edit");
  }

  function handleSubmit(submitEvent: FormEvent<HTMLFormElement>) {
    submitEvent.preventDefault();
    const form = submitEvent.currentTarget;
    const payload = formPayload(form, coverPath);

    startTransition(async () => {
      const result = editing
        ? await onUpdate(editing.id, payload)
        : await onCreate(payload);
      const succeeded = !result || !(typeof result === "object" && result.ok === false);
      setFeedback(
        resultMessage(
          result,
          succeeded
            ? editing
              ? "Evento atualizado com sucesso."
              : "Evento criado com sucesso."
            : "Não foi possível salvar o evento.",
        ),
      );
      if (succeeded) closeForm();
    });
  }

  function runAction(action: () => MaybePromise<ActionResult>, fallback: string) {
    startTransition(async () => {
      const result = await action();
      setFeedback(resultMessage(result, fallback));
    });
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-[var(--brown-700)]">{events.length} {events.length === 1 ? "evento cadastrado" : "eventos cadastrados"}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--brown-700)]">Rascunhos ficam no painel; somente publicados aparecem no site</p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--brown-900)] px-5 py-2.5 text-sm font-bold text-[var(--warm-white)] transition hover:bg-[var(--brown-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brown-700)]">
          {mode === "create" ? <X className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
          {mode === "create" ? "Fechar formulário" : "Novo evento"}
        </button>
      </div>

      {feedback ? <div role="status" className="mt-5 rounded-2xl border border-[var(--sand-200)] bg-[var(--offwhite-100)] px-4 py-3 text-sm font-semibold text-[var(--brown-900)]">{feedback}</div> : null}

      {mode !== "closed" ? (
        <form onSubmit={handleSubmit} className="mt-6 rounded-[1.75rem] border border-[var(--sand-200)] bg-[var(--warm-white)] p-5 shadow-[0_16px_45px_rgba(58,36,24,0.05)] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--brown-700)]">{mode === "edit" ? "Editar evento" : "Novo evento"}</p><h2 className="mt-2 font-serif text-3xl font-semibold text-[var(--brown-900)]">{editing?.title ?? "Criar evento"}</h2></div>
            {mode === "edit" ? <button type="button" onClick={closeForm} aria-label="Fechar edição" className="grid size-10 place-items-center rounded-full hover:bg-[var(--offwhite-100)]"><X className="size-4" /></button> : null}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)] md:col-span-2">Título
              <input name="title" required defaultValue={editing?.title ?? ""} className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)]" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">Slug
              <input name="slug" required defaultValue={editing?.slug ?? ""} placeholder="baile-arte-nativa" className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)]" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">Data e horário
              <input type="datetime-local" name="event_date" required defaultValue={toDateTimeLocal(editing?.event_date ?? null)} className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)]" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">Status
              <select name="status" defaultValue={editing?.status ?? "draft"} className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)]"><option value="draft">Rascunho</option><option value="published">Publicado</option><option value="archived">Arquivado</option></select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">Nome do local
              <input name="venue_name" defaultValue={editing?.venue_name ?? ""} className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)]" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)] md:col-span-2">Endereço
              <input name="venue_address" defaultValue={editing?.venue_address ?? ""} className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)]" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">Cidade
              <input name="venue_city" defaultValue={editing?.venue_city ?? ""} className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)]" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">Estado
              <input name="venue_state" maxLength={2} defaultValue={editing?.venue_state ?? "SC"} className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 uppercase outline-none focus:border-[var(--brown-700)]" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">URL do Google Maps
              <input type="url" name="maps_url" defaultValue={editing?.maps_url ?? ""} className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)]" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">Latitude
              <input type="number" step="any" name="latitude" defaultValue={editing?.latitude ?? ""} className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)]" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">Longitude
              <input type="number" step="any" name="longitude" defaultValue={editing?.longitude ?? ""} className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)]" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">WhatsApp
              <input name="whatsapp_phone" defaultValue={editing?.whatsapp_phone ?? ""} placeholder="5548999999999" className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)]" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)] md:col-span-2 xl:col-span-3">Descrição
              <textarea name="description" rows={5} defaultValue={editing?.description ?? ""} className="rounded-2xl border border-[var(--sand-200)] bg-white px-4 py-3 outline-none focus:border-[var(--brown-700)]" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)] md:col-span-2">Mensagem para reserva de mesa
              <textarea name="reservation_message" rows={3} defaultValue={editing?.reservation_message ?? ""} className="rounded-2xl border border-[var(--sand-200)] bg-white px-4 py-3 outline-none focus:border-[var(--brown-700)]" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)] md:col-span-2">Mensagem para ingresso
              <textarea name="ticket_message" rows={3} defaultValue={editing?.ticket_message ?? ""} className="rounded-2xl border border-[var(--sand-200)] bg-white px-4 py-3 outline-none focus:border-[var(--brown-700)]" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">Início da promoção
              <input type="datetime-local" name="promotion_starts_at" defaultValue={toDateTimeLocal(editing?.promotion_starts_at ?? null)} className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)]" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">Fim da promoção
              <input type="datetime-local" name="promotion_ends_at" defaultValue={toDateTimeLocal(editing?.promotion_ends_at ?? null)} className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)]" />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <label className="flex min-h-11 items-center gap-3 rounded-2xl border border-[var(--sand-200)] px-4 text-sm font-semibold text-[var(--brown-900)]"><input type="checkbox" name="show_on_home" defaultChecked={editing?.show_on_home ?? false} className="size-4 accent-[var(--brown-900)]" /> Mostrar na Home</label>
            <label className="flex min-h-11 items-center gap-3 rounded-2xl border border-[var(--sand-200)] px-4 text-sm font-semibold text-[var(--brown-900)]"><input type="checkbox" name="show_as_popup" defaultChecked={editing?.show_as_popup ?? false} className="size-4 accent-[var(--brown-900)]" /> Usar como popup</label>
          </div>

          <input type="hidden" name="cover_path" value={coverPath ?? ""} readOnly />
          <div className="mt-7 flex justify-end"><button disabled={isPending} className="min-h-11 rounded-full bg-[var(--brown-900)] px-6 text-sm font-bold text-[var(--warm-white)] transition hover:bg-[var(--brown-700)] disabled:opacity-50">{isPending ? "Salvando…" : mode === "edit" ? "Salvar alterações" : "Criar evento"}</button></div>
        </form>
      ) : null}

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {events.map((event) => (
          <article key={event.id} className="rounded-[1.75rem] border border-[var(--sand-200)] bg-[var(--warm-white)] p-5 shadow-[0_12px_35px_rgba(58,36,24,0.04)] sm:p-6">
            <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[var(--offwhite-100)] px-3 py-1 text-xs font-bold text-[var(--brown-900)]">{statusLabel(event.status)}</span>{event.show_on_home ? <span className="rounded-full bg-[var(--sand-200)] px-3 py-1 text-xs font-bold text-[var(--brown-900)]">Na Home</span> : null}{event.show_as_popup ? <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">Popup ativo</span> : null}</div>
            <h2 className="mt-4 font-serif text-3xl font-semibold text-[var(--brown-900)]">{event.title}</h2>
            <p className="mt-2 text-sm text-[var(--brown-700)]">{formatEventDate(event.event_date)} · {event.venue_name || "Local a confirmar"}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <button type="button" aria-label={`Editar ${event.title}`} onClick={() => openEdit(event)} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--sand-200)] px-4 text-sm font-bold text-[var(--brown-900)] hover:bg-[var(--offwhite-100)]"><Edit3 className="size-4" /> Editar</button>
              <button type="button" disabled={isPending} onClick={() => runAction(() => onDuplicate(event.id), "Evento duplicado.")} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--sand-200)] px-4 text-sm font-bold text-[var(--brown-900)] hover:bg-[var(--offwhite-100)] disabled:opacity-50"><Copy className="size-4" /> Duplicar</button>
              {event.status !== "published" ? <button type="button" disabled={isPending} onClick={() => runAction(() => onSetStatus(event.id, "published"), "Evento publicado.")} className="min-h-10 rounded-full border border-[var(--sand-200)] px-4 text-sm font-bold text-[var(--brown-900)] hover:bg-[var(--offwhite-100)] disabled:opacity-50">Publicar</button> : <button type="button" disabled={isPending} onClick={() => runAction(() => onSetStatus(event.id, "archived"), "Evento arquivado.")} className="min-h-10 rounded-full border border-[var(--sand-200)] px-4 text-sm font-bold text-[var(--brown-900)] hover:bg-[var(--offwhite-100)] disabled:opacity-50">Arquivar</button>}
              {event.status === "published" && !event.show_as_popup ? <button type="button" disabled={isPending} onClick={() => runAction(() => onSetFeatured(event.id), "Popup atualizado.")} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--beige-400)] px-4 text-sm font-bold text-[var(--brown-900)] hover:bg-[var(--offwhite-100)] disabled:opacity-50"><Radio className="size-4" /> Destacar popup</button> : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
