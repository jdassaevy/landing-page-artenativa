import { describe, expect, it, vi } from "vitest";

import {
  buildDirectStorageTusEndpoint,
  uploadImageResumable,
  type TusUploadLike,
} from "./tus";

function makeFile() {
  return new File([new Uint8Array([1, 2, 3])], "capa.webp", { type: "image/webp" });
}

describe("buildDirectStorageTusEndpoint", () => {
  it("uses the direct Supabase Storage hostname", () => {
    expect(buildDirectStorageTusEndpoint("https://abc123.supabase.co")).toBe(
      "https://abc123.storage.supabase.co/storage/v1/upload/resumable",
    );
  });
});

describe("uploadImageResumable", () => {
  it("forwards integer upload progress and resolves the new object path", async () => {
    const onProgress = vi.fn();
    let capturedOptions: Record<string, unknown> | undefined;

    const uploadFactory = vi.fn((_file: File, options: Record<string, unknown>) => {
      capturedOptions = options;
      const upload: TusUploadLike = {
        findPreviousUploads: vi.fn().mockResolvedValue([]),
        resumeFromPreviousUpload: vi.fn(),
        start: vi.fn(() => {
          const progress = options.onProgress as (uploaded: number, total: number) => void;
          progress(3, 4);
          const success = options.onSuccess as () => void;
          success();
        }),
      };
      return upload;
    });

    await expect(
      uploadImageResumable({
        bucket: "event-covers",
        file: makeFile(),
        objectPath: "events/new-id.webp",
        accessToken: "token",
        supabaseUrl: "https://abc123.supabase.co",
        onProgress,
        uploadFactory,
      }),
    ).resolves.toEqual({ path: "events/new-id.webp" });

    expect(onProgress).toHaveBeenCalledWith(75);
    expect(capturedOptions).toMatchObject({
      endpoint: "https://abc123.storage.supabase.co/storage/v1/upload/resumable",
      chunkSize: 6 * 1024 * 1024,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      headers: { authorization: "Bearer token" },
      metadata: {
        bucketName: "event-covers",
        objectName: "events/new-id.webp",
        contentType: "image/webp",
        cacheControl: "3600",
      },
    });
  });

  it("resumes the first previous upload when one exists", async () => {
    const previous = { uploadUrl: "previous" };
    const resumeFromPreviousUpload = vi.fn();
    const start = vi.fn();

    const uploadFactory = vi.fn(() => ({
      findPreviousUploads: vi.fn().mockResolvedValue([previous]),
      resumeFromPreviousUpload,
      start,
    }));

    const promise = uploadImageResumable({
      bucket: "event-covers",
      file: makeFile(),
      objectPath: "events/new-id.webp",
      accessToken: "token",
      supabaseUrl: "https://abc123.supabase.co",
      uploadFactory,
    });

    await Promise.resolve();
    expect(resumeFromPreviousUpload).toHaveBeenCalledWith(previous);
    expect(start).toHaveBeenCalled();

    // This mock does not emit success; only verify the resume/start path.
    void promise.catch(() => undefined);
  });

  it("surfaces retry/upload errors without clearing caller state", async () => {
    const expected = new Error("network down");
    const uploadFactory = vi.fn((_file: File, options: Record<string, unknown>) => ({
      findPreviousUploads: vi.fn().mockResolvedValue([]),
      resumeFromPreviousUpload: vi.fn(),
      start: vi.fn(() => {
        const onError = options.onError as (error: Error) => void;
        onError(expected);
      }),
    }));

    await expect(
      uploadImageResumable({
        bucket: "event-covers",
        file: makeFile(),
        objectPath: "events/new-id.webp",
        accessToken: "token",
        supabaseUrl: "https://abc123.supabase.co",
        uploadFactory,
      }),
    ).rejects.toBe(expected);
  });

  it("requires replacement uploads to use a new object path", async () => {
    await expect(
      uploadImageResumable({
        bucket: "event-covers",
        file: makeFile(),
        objectPath: "events/existing.webp",
        previousObjectPath: "events/existing.webp",
        accessToken: "token",
        supabaseUrl: "https://abc123.supabase.co",
        uploadFactory: vi.fn(),
      }),
    ).rejects.toThrow(/novo caminho/i);
  });
});
