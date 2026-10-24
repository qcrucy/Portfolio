import { portfolio } from '../data/portfolio.js';

export default function Footer() {
  return (
    <footer className="site-footer page-shell">
      <p>© {new Date().getFullYear()} {portfolio.name}</p>
      {portfolio.githubUrl && <a href={portfolio.githubUrl} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>}
      <a className="back-to-top" href="#inicio">Voltar ao início <span aria-hidden="true">↑</span></a>
    </footer>
  );
}
