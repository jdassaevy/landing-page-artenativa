import Link from "next/link";

export function SiteFooter() {
  return (
    <footer id="contato" className="site-footer">
      <div className="site-container site-footer__grid">
        <div>
          <p className="site-footer__eyebrow">Arte Nativa</p>
          <p className="site-footer__title">Tradição em movimento.</p>
        </div>

        <div className="site-footer__links" aria-label="Links do rodapé">
          <Link href="/#aulas">Aulas e horários</Link>
          <Link href="/#eventos">Próximos eventos</Link>
          <Link href="/sobre">Nossa história</Link>
        </div>
      </div>
      <div className="site-container site-footer__bottom">
        <small>© {new Date().getFullYear()} Arte Nativa. Todos os direitos reservados.</small>
      </div>
    </footer>
  );
}
