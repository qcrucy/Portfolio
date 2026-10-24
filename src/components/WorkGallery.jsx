import { useEffect, useState } from 'react';
import SectionHeading from './SectionHeading.jsx';

const base = import.meta.env.BASE_URL;

const projects = [
  {
    file: 'InitialMenu.PNG',
    title: 'Menu inicial',
    kind: 'LUA',
    note: 'A primeira tela que aparece no jogo.',
  },
  {
    file: 'InventorySystem.PNG',
    title: 'Inventário',
    kind: 'LUA',
    note: 'Um jeito de guardar e organizar os itens.',
  },
  {
    file: 'GunSystem.PNG',
    title: 'Sistema de armas',
    kind: 'LUA',
    note: 'Mecânicas de combate dentro do jogo.',
  },
  {
    file: 'OficinaSystem.PNG',
    title: 'Garagem e oficina',
    kind: 'LUA',
    note: 'Veículos, concessionária e oficina.',
  },
];

function ProjectThumbnail({ project }) {
  return <img className="work-thumbnail" src={`${base}images/${project.file}`} alt="" />;
}

export default function WorkGallery() {
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    if (!activeProject) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setActiveProject(null);
    };
    document.body.classList.add('has-open-work');
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.classList.remove('has-open-work');
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [activeProject]);

  return (
    <section className="content-section work-section page-shell" id="trabalhos" aria-labelledby="work-title">
      <SectionHeading
        number="01"
        label="My Programs"
        headingId="work-title"
      />

      <div className="work-grid">
        {projects.map((project, index) => (
          <button className={`work-card work-card-${index + 1}`} type="button" key={project.file} onClick={() => setActiveProject(project)}>
            <span className="work-card-image">
              <ProjectThumbnail project={project} />
              <span className="work-card-kind">{project.kind}</span>
            </span>
            <span className="work-card-copy">
              <strong>{project.title}</strong>
              <span>{project.note}</span>
            </span>

          </button>
        ))}
      </div>

      {activeProject && (
        <div className="work-lightbox" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveProject(null); }}>
          <section className="work-lightbox-panel" role="dialog" aria-modal="true" aria-labelledby="work-lightbox-title">
            <button className="work-lightbox-close" type="button" onClick={() => setActiveProject(null)} aria-label="Fechar imagem">×</button>
            <img src={`${base}images/${activeProject.file}`} alt={activeProject.title} />
            <div className="work-lightbox-copy">
              <span>{activeProject.kind}</span>
              <h3 id="work-lightbox-title">{activeProject.title}</h3>
              <p>{activeProject.note}</p>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
