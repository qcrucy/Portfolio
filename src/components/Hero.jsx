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
        <img
          src={`${import.meta.env.BASE_URL}images/InitialMenu.PNG`}
          className="hero-project-image"
          alt="Captura de tela do menu inicial do jogo"
        />
        <div className="hero-showcase-caption"><strong>Menu inicial</strong><span>By. Junior</span></div>

      </div>
    </section>
  );
}
