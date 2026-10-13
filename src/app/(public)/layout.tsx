import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div id="top" className="min-h-screen">
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
