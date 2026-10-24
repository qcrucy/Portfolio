import { useEffect, useRef, useState } from 'react';
import SectionHeading from './SectionHeading.jsx';

const base = import.meta.env.BASE_URL;

const projects = [
  {
    file: 'GamePainelSite.mp4',
    title: 'Painel web',
    kind: 'WEB',
    note: 'Uma interface web que fiz.',
  },
  {
    file: 'InitialMenu.mp4',
    title: 'Menu inicial',
    kind: 'LUA',
    note: 'A primeira tela que aparece no jogo.',
  },
  {
    file: 'InventorySystem.mp4',
    title: 'Inventário',
    kind: 'LUA',
    note: 'Um jeito de guardar e organizar os itens.',
  },
  {
    file: 'GunSystem.mp4',
    title: 'Sistema de armas',
    kind: 'LUA',
    note: 'Mecânicas de combate dentro do jogo.',
  },
  {
    file: 'Garagem+Concsessionaria+OficinaSystem.mp4',
    title: 'Garagem e oficina',
    kind: 'LUA',
    note: 'Veículos, concessionária e oficina.',
  },
];

function ProjectThumbnail({ project }) {
  const videoRef = useRef(null);
  const [frame, setFrame] = useState('');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    let mounted = true;
    let frameAttempts = 0;

    const captureFrame = () => {
      if (!mounted || video.seeking || !video.videoWidth || !video.videoHeight) return;
      const scale = Math.min(1, 760 / video.videoWidth);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(video.videoWidth * scale);
      canvas.height = Math.round(video.videoHeight * scale);
      const context = canvas.getContext('2d');
      if (!context) return;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let brightness = 0;
      let samples = 0;
      for (let index = 0; index < pixels.length; index += 64) {
        brightness += pixels[index] + pixels[index + 1] + pixels[index + 2];
        samples += 3;
      }
      if (samples && brightness / samples < 19) {
        const nextPosition = [0.3, 0.52, 0.74][frameAttempts++];
        if (nextPosition && video.duration > 1) {
          video.currentTime = Math.min(video.duration - 0.15, video.duration * nextPosition);
          return;
        }
        setFrame('');
        return;
      }
      try { setFrame(canvas.toDataURL('image/jpeg', 0.8)); } catch { /* O botão continua funcionando sem a miniatura. */ }
    };

    const onMetadata = () => {
      if (video.duration > 0.5) {
        frameAttempts = 0;
        video.currentTime = Math.min(video.duration - 0.15, Math.max(0.9, video.duration * 0.12));
      }
      else captureFrame();
    };
    video.addEventListener('loadedmetadata', onMetadata);
    video.addEventListener('loadeddata', captureFrame);
    video.addEventListener('seeked', captureFrame);
    if (video.readyState >= 1) onMetadata();

    return () => {
      mounted = false;
      video.removeEventListener('loadedmetadata', onMetadata);
      video.removeEventListener('loadeddata', captureFrame);
      video.removeEventListener('seeked', captureFrame);
    };
  }, [project.file]);

  return (
    <>
      <video
        ref={videoRef}
        className="work-frame-source"
        src={`${base}images/${project.file}`}
        muted
        playsInline
        preload="metadata"
        tabIndex={-1}
        aria-hidden="true"
      />
      {frame ? <img className="work-thumbnail" src={frame} alt="" /> : <span className="work-thumbnail-placeholder">{project.kind === 'WEB' ? 'web' : 'lua'}</span>}
    </>
  );
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
            <button className="work-lightbox-close" type="button" onClick={() => setActiveProject(null)} aria-label="Fechar vídeo">×</button>
            <video key={activeProject.file} src={`${base}images/${activeProject.file}`} controls autoPlay muted playsInline preload="metadata" />
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
