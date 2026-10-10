"use client";

import { Edit3, MapPin, Plus, Power, X } from "lucide-react";
import { FormEvent, useState, useTransition } from "react";

export interface AdminLocationRecord {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  maps_url: string | null;
  latitude: number | null;
  longitude: number | null;
  image_path: string | null;
  is_active: boolean;
}

type MaybePromise<T> = T | Promise<T>;

type LocationActionResult = {
  ok?: boolean;
  message?: string;
  requiresConfirmation?: boolean;
  activeClassCount?: number;
} | void;

interface LocationManagerProps {
  locations: readonly AdminLocationRecord[];
  onCreate: (input: Record<string, unknown>) => MaybePromise<LocationActionResult>;
  onUpdate: (id: string, input: Record<string, unknown>) => MaybePromise<LocationActionResult>;
  onToggleActive: (
    id: string,
    active: boolean,
    force?: boolean,
  ) => MaybePromise<LocationActionResult>;
}

function resultMessage(result: LocationActionResult, fallback: string) {
  return result && typeof result === "object" && typeof result.message === "string"
    ? result.message
    : fallback;
}

function payloadFromForm(data: FormData, currentActive = true) {
  return {
    name: String(data.get("name") ?? ""),
    address: String(data.get("address") ?? ""),
    city: String(data.get("city") ?? ""),
    state: String(data.get("state") ?? ""),
    maps_url: String(data.get("maps_url") ?? ""),
    latitude: String(data.get("latitude") ?? ""),
    longitude: String(data.get("longitude") ?? ""),
    image_path: String(data.get("image_path") ?? ""),
    is_active: currentActive,
  };
}

export function LocationManager({
  locations,
  onCreate,
  onUpdate,
  onToggleActive,
}: LocationManagerProps) {
  const [mode, setMode] = useState<"closed" | "create" | "edit">("closed");
  const [editing, setEditing] = useState<AdminLocationRecord | null>(null);
  const [pendingDeactivation, setPendingDeactivation] = useState<AdminLocationRecord | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function closeForm() {
    setMode("closed");
    setEditing(null);
  }

  function openEdit(location: AdminLocationRecord) {
    setEditing(location);
    setMode("edit");
    setFeedback(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = payloadFromForm(
      new FormData(form),
      editing?.is_active ?? true,
    );

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
              ? "Local atualizado com sucesso."
              : "Local criado com sucesso."
            : "Não foi possível salvar o local.",
        ),
      );

      if (succeeded) {
        form.reset();
        closeForm();
      }
    });
  }

  function requestToggle(location: AdminLocationRecord) {
    const nextActive = !location.is_active;

    startTransition(async () => {
      const result = await onToggleActive(location.id, nextActive, false);

      if (
        !nextActive &&
        result &&
        typeof result === "object" &&
        result.requiresConfirmation
      ) {
        setPendingDeactivation(location);
        setConfirmationMessage(
          result.message ?? "Este local ainda está sendo usado por aulas ativas.",
        );
        return;
      }

      setFeedback(
        resultMessage(
          result,
          nextActive ? "Local ativado." : "Local desativado.",
        ),
      );
    });
  }

  function confirmDeactivation() {
    if (!pendingDeactivation) return;

    const location = pendingDeactivation;
    startTransition(async () => {
      const result = await onToggleActive(location.id, false, true);
      setFeedback(resultMessage(result, "Local desativado."));
      setPendingDeactivation(null);
      setConfirmationMessage(null);
    });
  }

  const formLocation = mode === "edit" ? editing : null;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-[var(--brown-700)]">
            {locations.length} {locations.length === 1 ? "local cadastrado" : "locais cadastrados"}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--brown-700)]">
            Endereço e rota pública permanecem disponíveis apenas para locais ativos
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (mode === "create") closeForm();
            else {
              setEditing(null);
              setMode("create");
              setFeedback(null);
            }
          }}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--brown-900)] px-5 py-2.5 text-sm font-bold text-[var(--warm-white)] transition hover:bg-[var(--brown-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brown-700)] focus-visible:ring-offset-2"
        >
          {mode === "create" ? (
            <X className="size-4" aria-hidden="true" />
          ) : (
            <Plus className="size-4" aria-hidden="true" />
          )}
          {mode === "create" ? "Fechar formulário" : "Novo local"}
        </button>
      </div>

      {feedback ? (
        <div
          role="status"
          className="mt-5 rounded-2xl border border-[var(--sand-200)] bg-[var(--offwhite-100)] px-4 py-3 text-sm font-semibold text-[var(--brown-900)]"
        >
          {feedback}
        </div>
      ) : null}

      {mode === "create" || mode === "edit" ? (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-[1.75rem] border border-[var(--sand-200)] bg-[var(--warm-white)] p-5 shadow-[0_16px_45px_rgba(58,36,24,0.05)] sm:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--brown-700)]">
                {mode === "edit" ? "Editar local" : "Novo local"}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-[var(--brown-900)]">
                {mode === "edit" ? formLocation?.name : "Cadastrar espaço"}
              </h2>
            </div>
            {mode === "edit" ? (
              <button
                type="button"
                onClick={closeForm}
                aria-label="Fechar edição"
                className="grid size-10 place-items-center rounded-full transition hover:bg-[var(--offwhite-100)]"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">
              Nome
              <input
                name="name"
                required
                maxLength={160}
                defaultValue={formLocation?.name ?? ""}
                className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)] focus:ring-2 focus:ring-[var(--beige-400)]/40"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)] md:col-span-2">
              Endereço
              <input
                name="address"
                required
                maxLength={240}
                defaultValue={formLocation?.address ?? ""}
                className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)] focus:ring-2 focus:ring-[var(--beige-400)]/40"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">
              Cidade
              <input
                name="city"
                required
                maxLength={120}
                defaultValue={formLocation?.city ?? ""}
                className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)] focus:ring-2 focus:ring-[var(--beige-400)]/40"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">
              Estado
              <input
                name="state"
                required
                maxLength={2}
                defaultValue={formLocation?.state ?? "SC"}
                className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 uppercase outline-none focus:border-[var(--brown-700)] focus:ring-2 focus:ring-[var(--beige-400)]/40"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">
              URL do Google Maps
              <input
                name="maps_url"
                type="url"
                defaultValue={formLocation?.maps_url ?? ""}
                className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)] focus:ring-2 focus:ring-[var(--beige-400)]/40"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">
              Latitude
              <input
                name="latitude"
                type="number"
                step="any"
                min={-90}
                max={90}
                defaultValue={formLocation?.latitude ?? ""}
                className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)]"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">
              Longitude
              <input
                name="longitude"
                type="number"
                step="any"
                min={-180}
                max={180}
                defaultValue={formLocation?.longitude ?? ""}
                className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)]"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[var(--brown-900)]">
              Caminho da imagem
              <input
                name="image_path"
                defaultValue={formLocation?.image_path ?? ""}
                placeholder="Opcional"
                className="min-h-11 rounded-2xl border border-[var(--sand-200)] bg-white px-4 outline-none focus:border-[var(--brown-700)]"
              />
            </label>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              disabled={isPending}
              className="min-h-11 rounded-full bg-[var(--brown-900)] px-6 py-2.5 text-sm font-bold text-[var(--warm-white)] transition hover:bg-[var(--brown-700)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending
                ? "Salvando…"
                : mode === "edit"
                  ? "Salvar alterações"
                  : "Criar local"}
            </button>
          </div>
        </form>
      ) : null}

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {locations.map((location) => (
          <article
            key={location.id}
            className="rounded-[1.75rem] border border-[var(--sand-200)] bg-[var(--warm-white)] p-5 shadow-[0_12px_35px_rgba(58,36,24,0.04)] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <MapPin className="size-5 text-[var(--brown-700)]" aria-hidden="true" />
                <h2 className="mt-4 font-serif text-3xl font-semibold text-[var(--brown-900)]">
                  {location.name}
                </h2>
              </div>
              <span
                className={
                  location.is_active
                    ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800"
                    : "rounded-full bg-stone-200 px-3 py-1 text-xs font-bold text-stone-700"
                }
              >
                {location.is_active ? "Ativo" : "Inativo"}
              </span>
            </div>

            <address className="mt-4 not-italic text-sm leading-7 text-[var(--brown-700)]">
              <span className="block font-semibold text-[var(--brown-900)]">
                {location.address}
              </span>
              {location.city} – {location.state}
            </address>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                aria-label={`Editar ${location.name}`}
                onClick={() => openEdit(location)}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--sand-200)] px-4 text-sm font-bold text-[var(--brown-900)] transition hover:bg-[var(--offwhite-100)]"
              >
                <Edit3 className="size-4" aria-hidden="true" /> Editar
              </button>

              <button
                type="button"
                disabled={isPending}
                aria-label={`${location.is_active ? "Desativar" : "Ativar"} ${location.name}`}
                onClick={() => requestToggle(location)}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--sand-200)] px-4 text-sm font-bold text-[var(--brown-900)] transition hover:bg-[var(--offwhite-100)] disabled:opacity-50"
              >
                <Power className="size-4" aria-hidden="true" />
                {location.is_active ? "Desativar" : "Ativar"}
              </button>
            </div>
          </article>
        ))}
      </div>

      {!locations.length ? (
        <div className="mt-8 rounded-[1.75rem] border border-dashed border-[var(--beige-400)] bg-[var(--offwhite-100)] p-8 text-center">
          <p className="font-serif text-3xl font-semibold text-[var(--brown-900)]">
            Nenhum local cadastrado.
          </p>
          <p className="mt-2 text-sm text-[var(--brown-700)]">
            Cadastre o primeiro espaço para vinculá-lo às aulas.
          </p>
        </div>
      ) : null}

      {pendingDeactivation ? (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-[var(--brown-900)]/70 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="location-deactivation-title"
            className="w-full max-w-lg rounded-[2rem] bg-[var(--warm-white)] p-6 shadow-[0_30px_90px_rgba(28,15,9,0.42)] sm:p-8"
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brown-700)]">
              Confirmar desativação
            </p>
            <h2
              id="location-deactivation-title"
              className="mt-3 font-serif text-4xl font-semibold leading-tight text-[var(--brown-900)]"
            >
              Desativar {pendingDeactivation.name}?
            </h2>
            <p className="mt-5 text-sm leading-7 text-[var(--brown-700)]">
              {confirmationMessage}
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--brown-700)]">
              As referências históricas serão preservadas, mas o local deixará de aparecer como ativo no site.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setPendingDeactivation(null);
                  setConfirmationMessage(null);
                }}
                className="min-h-11 rounded-full px-5 text-sm font-bold text-[var(--brown-900)] transition hover:bg-[var(--offwhite-100)]"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={confirmDeactivation}
                className="min-h-11 rounded-full bg-[var(--brown-900)] px-5 text-sm font-bold text-[var(--warm-white)] transition hover:bg-[var(--brown-700)] disabled:opacity-50"
              >
                {isPending ? "Desativando…" : "Confirmar desativação"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
