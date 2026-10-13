"use client";

import type { PropsWithChildren } from "react";
import { MotionConfig } from "motion/react";

import { motionTransitions } from "./presets";

export function MotionProvider({ children }: PropsWithChildren) {
  return (
    <MotionConfig reducedMotion="user" transition={motionTransitions.standard}>
      {children}
    </MotionConfig>
  );
}
