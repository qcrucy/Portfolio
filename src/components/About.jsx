import { portfolio } from '../data/portfolio.js';
import SectionHeading from './SectionHeading.jsx';
import CountUp from './CountUp.jsx';

export default function About() {
  return (
    <section className="content-section page-shell" id="sobre" aria-labelledby="about-title">
      <SectionHeading
        number="02"
        label="Sobre"
        headingId="about-title"
      />
      <div className="about-content">
        <aside className="about-stats about-facts" aria-label="O que eu faço">
          <div className="about-fact">
            <span className="stat-label">HÁ</span>
            <CountUp value={4} unit="anos" />
            <span className="stat-caption">programando em Lua</span>
          </div>
          <div className="about-fact about-fact-web">
            <span className="stat-label">TAMBÉM</span>
            <strong className="about-fact-word">Web</strong>
            <span className="stat-caption">sites e interfaces.</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
