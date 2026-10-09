import { SiteAnalyticsObserver } from "@/components/site/site-analytics-observer";

export default function PublicTemplate({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteAnalyticsObserver />
      {children}
    </>
  );
}
