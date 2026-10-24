import { portfolio } from '../data/portfolio.js';
import SectionHeading from './SectionHeading.jsx';

export default function Skills() {
  return (
    <section className="content-section skills-section page-shell" id="tecnologias" aria-labelledby="skills-title">
      <SectionHeading
        label="Stacks"
        headingId="skills-title"
      />
      <div className="skills-grid">
        {portfolio.skillGroups.map((group, index) => (
          <article className={`skill-group skill-group-${index + 1}`} key={group.title}>
            <h3>{group.title}</h3>
            <p className="skill-group-description">{group.description}</p>
            <ul className="skill-tags">
              {group.items.map((item) => (
                <li key={item.name}>
                  <strong>{item.name}</strong>
                  <span>{item.detail}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
