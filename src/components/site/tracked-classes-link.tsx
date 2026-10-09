"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { trackViewClasses, type ClassesAnalyticsSource } from "@/components/site/analytics-events";

interface TrackedClassesLinkProps {
  href: string;
  source: ClassesAnalyticsSource;
  className: string;
  children: React.ReactNode;
  showArrow?: boolean;
}

export function TrackedClassesLink({
  href,
  source,
  className,
  children,
  showArrow = false,
}: TrackedClassesLinkProps) {
  return (
    <Link href={href} onClick={() => trackViewClasses(source)} className={className}>
      {children}
      {showArrow ? <ArrowRight className="size-4" aria-hidden="true" /> : null}
    </Link>
  );
}
