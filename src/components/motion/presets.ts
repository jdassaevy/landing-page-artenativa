export const motionDurations = {
  fast: 0.16,
  standard: 0.28,
  cinematic: 0.48,
} as const;

export const motionEasings = {
  standard: [0.22, 1, 0.36, 1],
  exit: [0.4, 0, 1, 1],
} as const;

export const motionTransitions = {
  fast: {
    duration: motionDurations.fast,
    ease: motionEasings.standard,
  },
  standard: {
    duration: motionDurations.standard,
    ease: motionEasings.standard,
  },
  cinematic: {
    duration: motionDurations.cinematic,
    ease: motionEasings.standard,
  },
} as const;
