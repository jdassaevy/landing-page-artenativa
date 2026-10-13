import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { motionConfigSpy } = vi.hoisted(() => ({
  motionConfigSpy: vi.fn(({ children }: { children: React.ReactNode }) => children),
}));

vi.mock("motion/react", () => ({
  MotionConfig: motionConfigSpy,
}));

import { MotionProvider } from "./motion-provider";

describe("MotionProvider", () => {
  it("applies user reduced-motion preference globally", () => {
    render(
      <MotionProvider>
        <div>content</div>
      </MotionProvider>,
    );

    expect(screen.getByText("content")).toBeInTheDocument();
    expect(motionConfigSpy).toHaveBeenCalledWith(
      expect.objectContaining({ reducedMotion: "user" }),
      undefined,
    );
  });
});
