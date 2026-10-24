import { portfolio } from '../data/portfolio.js';

export default function Hero() {
  return (
    <section className="hero page-shell" id="inicio" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title">Lua and Web Developer 4 Years.</h1>
        <p className="hero-description">{portfolio.introduction}</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#trabalhos">See my projects <span aria-hidden="true">↘</span></a>
        </div>
      </div>

      <div>
        <div className="hero-showcase-heading"></div>
        <video
          src={`${import.meta.env.BASE_URL}images/GamePainelSite.mp4`}
          className="hero-project-video-player"
          controls
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Demonstração em vídeo de um painel web"
        />
        <div className="hero-showcase-caption"><strong>Painel web</strong><span>By. Junior</span></div>

      </div>
    </section>
  );
}
