import SectionHeading from './SectionHeading.jsx';

const base = import.meta.env.BASE_URL;

const photos = [
  { file: 'Ldr1.webp', label: '01' },
  { file: 'Ldr2.webp', label: '02' },
];

export default function Contributions() {
  return (
    <section className="content-section contribution-section page-shell" id="contribuicoes" aria-labelledby="contributions-title">
      <SectionHeading
        number="04"
        label="My Contributions"
        headingId="contributions-title"
        animateTitle
        title="Lei das Ruas."
      />

      <div className="ldr-feature">
        <div className="ldr-photo-wall">
          {photos.map((photo) => (
            <figure
              className="ldr-photo"
              key={photo.file}
              style={{ '--ldr-photo': `url("${base}images/${photo.file}")` }}
              role="img"
              aria-label={`Imagem ${photo.label} do Lei das Ruas`}
            >
              <span aria-hidden="true">LDR&nbsp; / &nbsp;{photo.label}</span>
            </figure>
          ))}
        </div>

        <div className="ldr-card-copy">

          <h3>Lei das Ruas</h3>
          <p>Jogo de guerra entre gangues.</p>
          <div className="ldr-links">
            <a className="ldr-link ldr-link-game" href="https://www.roblox.com/pt/games/138948219343784/Lei-das-Ruas" target="_blank" rel="noreferrer">
              Abrir no Roblox
            </a>
            <a className="ldr-link ldr-link-discord" href="https://discord.gg/FvAuFy9XP" target="_blank" rel="noreferrer">
             Entrar no Discord
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
