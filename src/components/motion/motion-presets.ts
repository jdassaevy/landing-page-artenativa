import type { Transition } from "motion/react";

export const motionDurations = {
  fast: 0.18,
  standard: 0.32,
  cinematic: 0.5,
} as const;

export const motionEasings = {
  enter: [0.22, 1, 0.36, 1],
  exit: [0.4, 0, 1, 1],
} as const;

export const motionTransitions = {
  interaction: {
    duration: motionDurations.fast,
    ease: motionEasings.enter,
  },
  enter: {
    duration: motionDurations.standard,
    ease: motionEasings.enter,
  },
  exit: {
    duration: 0.2,
    ease: motionEasings.exit,
  },
  cinematic: {
    type: "spring",
    duration: motionDurations.cinematic,
    bounce: 0,
  },
} satisfies Record<string, Transition>;
