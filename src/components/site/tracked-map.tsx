"use client";

import type { MouseEvent, ReactNode } from "react";

import { trackOpenMaps } from "@/components/site/analytics-events";

interface TrackedMapProps {
  analyticsId: string;
  children: ReactNode;
}

export function TrackedMap({ analyticsId, children }: TrackedMapProps) {
  function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (!target.closest("button, a")) return;
    trackOpenMaps(analyticsId);
  }

  return <div onClickCapture={handleClickCapture}>{children}</div>;
}
