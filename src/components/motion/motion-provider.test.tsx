import type { PropsWithChildren } from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { motionConfigSpy } = vi.hoisted(() => ({
  motionConfigSpy: vi.fn(),
}));

vi.mock("motion/react", () => ({
  MotionConfig: ({ children, ...props }: PropsWithChildren<{ reducedMotion?: string }>) => {
    motionConfigSpy(props);
    return children;
  },
}));

import { MotionProvider } from "./motion-provider";

describe("MotionProvider", () => {
  beforeEach(() => {
    motionConfigSpy.mockClear();
  });

  it("applies user reduced-motion preference globally", () => {
    render(
      <MotionProvider>
        <div>content</div>
      </MotionProvider>,
    );

    expect(screen.getByText("content")).toBeInTheDocument();
    expect(motionConfigSpy).toHaveBeenCalledWith(
      expect.objectContaining({ reducedMotion: "user" }),
    );
  });
});
