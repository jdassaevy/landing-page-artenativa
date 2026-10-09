import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ImageUpload } from "./image-upload";

function makeFile() {
  return new File([new Uint8Array([1, 2, 3])], "capa.webp", { type: "image/webp" });
}

describe("ImageUpload", () => {
  it("shows upload progress and emits a new path", async () => {
    const onUploaded = vi.fn();
    const upload = vi.fn(async (input: { objectPath: string; previousObjectPath?: string | null; onProgress?: (value: number) => void }) => {
      input.onProgress?.(42);
      input.onProgress?.(100);
      return { path: input.objectPath };
    });

    render(
      <ImageUpload
        currentPath="events/old.webp"
        onUploaded={onUploaded}
        upload={upload}
        getCredentials={vi.fn().mockResolvedValue({
          accessToken: "token",
          supabaseUrl: "https://abc123.supabase.co",
        })}
      />,
    );

    fireEvent.change(screen.getByLabelText(/capa do evento/i), {
      target: { files: [makeFile()] },
    });

    expect(await screen.findByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
    await waitFor(() => expect(onUploaded).toHaveBeenCalledTimes(1));

    const uploadInput = upload.mock.calls[0][0];
    expect(uploadInput.previousObjectPath).toBe("events/old.webp");
    expect(uploadInput.objectPath).toMatch(/^events\/[0-9a-f-]+\.webp$/i);
    expect(uploadInput.objectPath).not.toBe("events/old.webp");
  });

  it("keeps the selected file available for retry after an upload failure", async () => {
    const upload = vi
      .fn()
      .mockRejectedValueOnce(new Error("network down"))
      .mockResolvedValueOnce({ path: "events/retry.webp" });
    const onUploaded = vi.fn();

    render(
      <ImageUpload
        currentPath={null}
        onUploaded={onUploaded}
        upload={upload}
        getCredentials={vi.fn().mockResolvedValue({
          accessToken: "token",
          supabaseUrl: "https://abc123.supabase.co",
        })}
      />,
    );

    fireEvent.change(screen.getByLabelText(/capa do evento/i), {
      target: { files: [makeFile()] },
    });

    expect(await screen.findByText(/network down/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /tentar novamente/i }));

    await waitFor(() => expect(upload).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(onUploaded).toHaveBeenCalledWith("events/retry.webp"));
  });

  it("rejects an invalid file before requesting credentials or upload", async () => {
    const upload = vi.fn();
    const getCredentials = vi.fn();
    const invalid = new File([new Uint8Array([1])], "arquivo.svg", { type: "image/svg+xml" });

    render(
      <ImageUpload
        currentPath={null}
        onUploaded={vi.fn()}
        upload={upload}
        getCredentials={getCredentials}
      />,
    );

    fireEvent.change(screen.getByLabelText(/capa do evento/i), {
      target: { files: [invalid] },
    });

    expect(await screen.findByText(/jpeg, png ou webp/i)).toBeInTheDocument();
    expect(getCredentials).not.toHaveBeenCalled();
    expect(upload).not.toHaveBeenCalled();
  });
});
