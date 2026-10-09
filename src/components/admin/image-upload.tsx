"use client";

import { ImagePlus, RefreshCcw, UploadCloud } from "lucide-react";
import { ChangeEvent, useCallback, useState } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import {
  uploadImageResumable,
  type UploadImageResumableInput,
} from "@/lib/uploads/tus";
import { eventImageSchema } from "@/schemas/event";

interface UploadCredentials {
  accessToken: string;
  supabaseUrl: string;
}

type UploadFunction = (
  input: UploadImageResumableInput,
) => Promise<{ path: string }>;

interface ImageUploadProps {
  currentPath: string | null;
  onUploaded: (path: string) => void;
  upload?: UploadFunction;
  getCredentials?: () => Promise<UploadCredentials>;
}

const MIME_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function getDefaultCredentials(): Promise<UploadCredentials> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error("URL pública do Supabase não configurada.");
  }

  const supabase = createBrowserSupabaseClient();
  const { data, error } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;

  if (error || !accessToken) {
    throw new Error("Sua sessão expirou. Entre novamente antes de enviar a imagem.");
  }

  return { accessToken, supabaseUrl };
}

function createObjectPath(file: File): string {
  const extension = MIME_EXTENSION[file.type];
  if (!extension) throw new Error("A capa deve ser JPEG, PNG ou WebP.");
  return `events/${crypto.randomUUID()}.${extension}`;
}

export function ImageUpload({
  currentPath,
  onUploaded,
  upload = uploadImageResumable,
  getCredentials = getDefaultCredentials,
}: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [completedPath, setCompletedPath] = useState<string | null>(null);

  const runUpload = useCallback(
    async (file: File) => {
      const validation = eventImageSchema.safeParse({
        size: file.size,
        type: file.type,
      });

      if (!validation.success) {
        const message = !MIME_EXTENSION[file.type]
          ? "A capa deve ser JPEG, PNG ou WebP."
          : "A capa deve ter no máximo 8 MiB.";
        setError(message);
        setProgress(0);
        return;
      }

      setError(null);
      setProgress(0);
      setIsUploading(true);

      try {
        const credentials = await getCredentials();
        const objectPath = createObjectPath(file);
        const result = await upload({
          bucket: "event-covers",
          file,
          objectPath,
          previousObjectPath: currentPath,
          accessToken: credentials.accessToken,
          supabaseUrl: credentials.supabaseUrl,
          onProgress: (value) => setProgress(value),
        });

        setProgress(100);
        setCompletedPath(result.path);
        onUploaded(result.path);
      } catch (uploadError) {
        setError(
          uploadError instanceof Error
            ? uploadError.message
            : "Não foi possível enviar a capa.",
        );
      } finally {
        setIsUploading(false);
      }
    },
    [currentPath, getCredentials, onUploaded, upload],
  );

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setCompletedPath(null);
    setError(null);
    setProgress(0);

    if (file) void runUpload(file);
  }

  return (
    <div className="rounded-[1.5rem] border border-[var(--sand-200)] bg-[var(--offwhite-100)] p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--sand-200)]/60 text-[var(--brown-900)]">
          <ImagePlus className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[var(--brown-900)]">Capa do evento</p>
          <p className="mt-1 text-xs leading-5 text-[var(--brown-700)]">
            JPEG, PNG ou WebP, até 8 MiB. Substituições usam um novo caminho para evitar imagem antiga em cache.
          </p>
          {currentPath ? (
            <p className="mt-2 truncate text-xs text-[var(--brown-700)]">
              Atual: {currentPath}
            </p>
          ) : null}
        </div>
      </div>

      <label className="mt-4 flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--beige-400)] bg-[var(--warm-white)] px-4 text-sm font-bold text-[var(--brown-900)] transition hover:bg-white focus-within:ring-2 focus-within:ring-[var(--brown-700)]">
        <UploadCloud className="size-4" aria-hidden="true" />
        <span>{selectedFile ? selectedFile.name : "Selecionar capa"}</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-label="Capa do evento"
          onChange={handleFileChange}
          disabled={isUploading}
          className="sr-only"
        />
      </label>

      {(isUploading || progress > 0) ? (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold text-[var(--brown-700)]">
            <span>{progress >= 100 ? "Upload concluído" : "Enviando capa"}</span>
            <span>{progress}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Progresso do upload da capa"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="h-2 overflow-hidden rounded-full bg-[var(--sand-200)]"
          >
            <div
              className="h-full origin-left rounded-full bg-[var(--brown-900)] transition-transform duration-200"
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>
        </div>
      ) : null}

      {completedPath ? (
        <p className="mt-3 text-xs font-semibold text-emerald-800" role="status">
          Capa enviada e pronta para salvar no evento.
        </p>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
          <p>{error}</p>
          {selectedFile ? (
            <button
              type="button"
              disabled={isUploading}
              onClick={() => void runUpload(selectedFile)}
              className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-bold transition hover:bg-red-100 disabled:opacity-50"
            >
              <RefreshCcw className="size-4" aria-hidden="true" /> Tentar novamente
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
