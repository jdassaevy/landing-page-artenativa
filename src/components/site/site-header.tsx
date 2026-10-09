import Link from "next/link";

const navigation = [
  { href: "/#aulas", label: "Aulas" },
  { href: "/#locais", label: "Locais" },
  { href: "/#eventos", label: "Eventos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/#contato", label: "Contato" },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-container site-header__inner">
        <Link href="/" className="site-brand" aria-label="Arte Nativa — início">
          <span className="site-brand__mark" aria-hidden="true">AN</span>
          <span>Arte Nativa</span>
        </Link>

        <nav className="site-nav" aria-label="Navegação principal">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="site-nav__link">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/#aulas" className="site-header__cta">
          Encontrar minha turma
        </Link>
      </div>
    </header>
  );
}
