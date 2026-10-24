import { portfolio } from '../data/portfolio.js';
import SectionHeading from './SectionHeading.jsx';

const contacts = [
  { label: 'Discord', value: 'https://discord.gg/sFPvSYfwG', text: 'QcrucyDiscord', external: true },
  { label: 'GitHub', value: portfolio.githubUrl, external: true },
  { label: 'E-mail', value: portfolio.email ? `mailto:${portfolio.email}` : '', text: portfolio.email },
  { label: 'LinkedIn', value: portfolio.linkedinUrl, external: true },
].filter((contact) => contact.value);

export default function Contact() {
  return (
    <section className="content-section contact-section page-shell" id="contato" aria-labelledby="contact-title">
      <SectionHeading
        number="05"
        label="Contato"
        headingId="contact-title"
        title="Contato"
      />
      {contacts.length > 0 ? (
        <ul className="contact-list">
          {contacts.map((contact) => (
            <li key={contact.label}>
              <span>{contact.label}</span>
              <a href={contact.value} target={contact.external ? '_blank' : undefined} rel={contact.external ? 'noreferrer' : undefined}>
                {contact.text || contact.value.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                {contact.external && <span aria-hidden="true"> ↗</span>}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="contact-pending">Meus links de contato ainda não foram configurados.</p>
      )}
    </section>
  );
}
