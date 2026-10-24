import { useEffect } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import WorkGallery from './components/WorkGallery.jsx';
import Contributions from './components/Contributions.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  useEffect(() => {
    const revealTargets = Array.from(document.querySelectorAll(
      '.content-section .section-heading, .about-content, .skills-grid, .work-grid, .ldr-feature, .contact-list, .contact-pending',
    ));
    let revealObserver;
    if ('IntersectionObserver' in window) {
      revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -38px 0px' });
      revealTargets.forEach((target) => {
        target.classList.add('scroll-reveal');
        revealObserver.observe(target);
      });
    } else {
      revealTargets.forEach((target) => target.classList.add('is-visible'));
    }

    return () => {
      revealObserver?.disconnect();
    };
  }, []);

  return (
    <div className="site-frame">
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo">
        <Hero />
        <WorkGallery />
        <About />
        <Skills />
        <Contributions />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
