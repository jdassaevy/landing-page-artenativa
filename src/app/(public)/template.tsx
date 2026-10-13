import { Suspense } from "react";

import { SiteAnalyticsObserver } from "@/components/site/site-analytics-observer";

export default function PublicTemplate({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Suspense fallback={null}>
        <SiteAnalyticsObserver />
      </Suspense>
      {children}
    </>
  );
}
