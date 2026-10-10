"use client";

import { Upload, type UploadOptions } from "tus-js-client";

export interface TusUploadLike {
  findPreviousUploads(): Promise<unknown[]>;
  resumeFromPreviousUpload(previousUpload: unknown): void;
  start(): void;
}

export type TusUploadFactory = (
  file: File,
  options: Record<string, unknown>,
) => TusUploadLike;

export interface UploadImageResumableInput {
  bucket: "event-covers" | "location-images";
  file: File;
  objectPath: string;
  previousObjectPath?: string | null;
  accessToken: string;
  supabaseUrl: string;
  onProgress?: (percentage: number) => void;
  uploadFactory?: TusUploadFactory;
}

export function buildDirectStorageTusEndpoint(supabaseUrl: string): string {
  const parsed = new URL(supabaseUrl);
  const hostname = parsed.hostname;

  if (hostname.endsWith(".storage.supabase.co")) {
    return `https://${hostname}/storage/v1/upload/resumable`;
  }

  if (!hostname.endsWith(".supabase.co")) {
    throw new Error("URL do Supabase inválida para upload resumível.");
  }

  const projectRef = hostname.slice(0, -".supabase.co".length);
  if (!projectRef) throw new Error("Project ref do Supabase não encontrado.");

  return `https://${projectRef}.storage.supabase.co/storage/v1/upload/resumable`;
}

const defaultUploadFactory: TusUploadFactory = (file, options) => {
  const upload = new Upload(file, options as UploadOptions);
  return {
    findPreviousUploads: () => upload.findPreviousUploads(),
    resumeFromPreviousUpload: (previousUpload) =>
      upload.resumeFromPreviousUpload(
        previousUpload as Parameters<typeof upload.resumeFromPreviousUpload>[0],
      ),
    start: () => upload.start(),
  };
};

export function uploadImageResumable({
  bucket,
  file,
  objectPath,
  previousObjectPath = null,
  accessToken,
  supabaseUrl,
  onProgress,
  uploadFactory = defaultUploadFactory,
}: UploadImageResumableInput): Promise<{ path: string }> {
  const path = objectPath.trim();
  const previousPath = previousObjectPath?.trim() || null;
  const token = accessToken.trim();

  if (!path) return Promise.reject(new Error("Informe um caminho para a imagem."));
  if (!token) return Promise.reject(new Error("Sessão inválida para upload."));
  if (previousPath && previousPath === path) {
    return Promise.reject(
      new Error("Uploads de substituição devem usar um novo caminho de objeto."),
    );
  }

  const endpoint = buildDirectStorageTusEndpoint(supabaseUrl);

  return new Promise((resolve, reject) => {
    const options: Record<string, unknown> = {
      endpoint,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        authorization: `Bearer ${token}`,
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      metadata: {
        bucketName: bucket,
        objectName: path,
        contentType: file.type,
        cacheControl: "3600",
      },
      chunkSize: 6 * 1024 * 1024,
      onError: (error: Error) => reject(error),
      onProgress: (bytesUploaded: number, bytesTotal: number) => {
        if (bytesTotal <= 0) return;
        const percentage = Math.max(
          0,
          Math.min(100, Math.round((bytesUploaded / bytesTotal) * 100)),
        );
        onProgress?.(percentage);
      },
      onSuccess: () => resolve({ path }),
    };

    let upload: TusUploadLike;
    try {
      upload = uploadFactory(file, options);
    } catch (error) {
      reject(error);
      return;
    }

    upload
      .findPreviousUploads()
      .then((previousUploads) => {
        if (previousUploads.length) {
          upload.resumeFromPreviousUpload(previousUploads[0]);
        }
        upload.start();
      })
      .catch(reject);
  });
}
