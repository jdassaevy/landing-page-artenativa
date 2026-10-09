"use client";

import type { PropsWithChildren } from "react";
import { MotionConfig } from "motion/react";

export function MotionProvider({ children }: PropsWithChildren) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
