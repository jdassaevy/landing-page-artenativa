"use client";

import type { HTMLAttributes, PropsWithChildren } from "react";
import { motion } from "motion/react";

import { motionTransitions } from "./presets";

interface RevealProps extends PropsWithChildren {
  className?: string;
  delay?: number;
  as?: "div" | "section";
}

export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const Component = as === "section" ? motion.section : motion.div;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ ...motionTransitions.standard, delay }}
    >
      {children}
    </Component>
  );
}

export type RevealHtmlProps = HTMLAttributes<HTMLElement>;
