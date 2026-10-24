import { useEffect, useState } from 'react';
import { portfolio } from '../data/portfolio.js';

const navigation = [
  { href: '#inicio', label: 'Início' },
  { href: '#trabalhos', label: 'Trabalhos' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#tecnologias', label: 'Tecnologias' },
  { href: '#contribuicoes', label: 'Contribuições' },
  { href: '#contato', label: 'Contato' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  useEffect(() => {
    const sections = navigation
      .map((item) => document.querySelector(item.href))
      .filter(Boolean);
    if (!('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver((entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
      if (visibleSection) setActiveSection(visibleSection.target.id);
    }, { threshold: [0.2, 0.45, 0.7], rootMargin: '-24% 0px -48% 0px' });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-inner page-shell">
        <a className="brand" href="#inicio" onClick={closeMenu} aria-label={`${portfolio.name}, início`}>
          <span>{portfolio.name.toLowerCase()}</span><i aria-hidden="true">!</i>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="menu-toggle-lines" aria-hidden="true"><i /><i /></span>
          <span>{menuOpen ? 'Fechar' : 'Menu'}</span>
        </button>

        <nav
          className={`primary-navigation${menuOpen ? ' is-open' : ''}`}
          id="primary-navigation"
          aria-label="Navegação principal"
        >
          {navigation.map((item) => (
            <a
              className={activeSection === item.href.slice(1) ? 'is-active' : undefined}
              aria-current={activeSection === item.href.slice(1) ? 'location' : undefined}
              key={item.href}
              href={item.href}
              onClick={closeMenu}
            >{item.label}</a>
          ))}
          {portfolio.githubUrl && (
            <a className="nav-github" href={portfolio.githubUrl} target="_blank" rel="noreferrer">
              GitHub <span aria-hidden="true">↗</span>
            </a>
          )}
          <a className="nav-contact-cta" href="#contato" onClick={closeMenu}>Bora conversar <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
    </header>
  );
}
