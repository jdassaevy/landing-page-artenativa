import Link from "next/link";
import { Card } from "@/components/ui/card";

const placeholderCards = [0, 1, 2] as const;

export default function HomePage() {
  return (
    <main id="conteudo-principal">
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="site-container hero-section__grid">
          <div className="hero-copy">
            <p className="eyebrow">Arte Nativa · Dança e tradição</p>
            <h1 id="hero-title">Tradição que se dança. Cultura que se vive.</h1>
            <p className="hero-copy__lead">
              Uma nova experiência para encontrar turmas, locais e encontros da Arte Nativa com clareza.
            </p>
            <div className="hero-actions">
              <Link className="button-link button-link--primary" href="#aulas">
                Ver aulas e horários
              </Link>
              <Link className="button-link button-link--secondary" href="/sobre">
                Conhecer a Arte Nativa
              </Link>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-visual__frame">
              <div className="hero-visual__monogram">AN</div>
              <div className="hero-visual__caption">Desde a tradição, para novos passos.</div>
            </div>
          </div>
        </div>
      </section>

      <section id="aulas" className="section section--light" aria-labelledby="aulas-title">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Aulas e horários</p>
              <h2 id="aulas-title">Encontre a sua próxima turma.</h2>
            </div>
            <p>Os horários ativos serão apresentados aqui em ordem de segunda a domingo.</p>
          </div>
          <div className="card-grid" aria-label="Área reservada para turmas ativas">
            {placeholderCards.map((item) => (
              <Card key={item} className="placeholder-card" aria-hidden="true">
                <span className="placeholder-card__day" />
                <span className="placeholder-card__title" />
                <span className="placeholder-card__line" />
                <span className="placeholder-card__line placeholder-card__line--short" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="locais" className="section" aria-labelledby="locais-title">
        <div className="site-container split-panel">
          <div>
            <p className="eyebrow">Locais</p>
            <h2 id="locais-title">Chegue sem dúvida.</h2>
            <p>Endereço, turmas disponíveis e acesso rápido à rota em cada local ativo.</p>
          </div>
          <div className="map-placeholder" aria-hidden="true">
            <span>Mapa</span>
          </div>
        </div>
      </section>

      <section id="eventos" className="section section--brown" aria-labelledby="eventos-title">
        <div className="site-container">
          <div className="section-heading section-heading--inverse">
            <div>
              <p className="eyebrow eyebrow--inverse">Próximos eventos</p>
              <h2 id="eventos-title">Bailes e celebrações em destaque.</h2>
            </div>
            <p>Eventos publicados ganharão espaço próprio e acesso direto às reservas pelo WhatsApp.</p>
          </div>
          <div className="event-placeholder" aria-hidden="true" />
        </div>
      </section>

      <section className="section section--light" aria-labelledby="historia-title">
        <div className="site-container story-panel">
          <p className="eyebrow">Nossa história</p>
          <h2 id="historia-title">Uma escola feita para manter a cultura viva.</h2>
          <p>A história completa da Arte Nativa terá seu próprio espaço, com foco nas pessoas e na trajetória da escola.</p>
          <Link className="text-link" href="/sobre">Conhecer nossa história →</Link>
        </div>
      </section>
    </main>
  );
}
