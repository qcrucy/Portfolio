import { useEffect, useRef, useState } from 'react';
import SectionHeading from './SectionHeading.jsx';

const stages = [
  {
    label: 'TELA INICIAL',
    title: 'Menu do jogo',
    detail: 'A tela que recebe o jogador.',
    file: 'InitialMenu.mp4',
  },
  {
    label: 'ITENS / LUA',
    title: 'Inventário',
    detail: 'Interface para organizar os itens.',
    file: 'InventorySystem.mp4',
  },
  {
    label: 'COMBATE / LUA',
    title: 'Sistema de armas',
    detail: 'Mecânicas de combate dentro do jogo.',
    file: 'GunSystem.mp4',
  },
  {
    label: 'VEÍCULOS / LUA',
    title: 'Garagem e oficina',
    detail: 'Veículos, concessionária e oficina.',
    file: 'Garagem+Concsessionaria+OficinaSystem.mp4',
  },
  {
    label: 'INTERFACE WEB',
    title: 'Painel do jogo',
    detail: 'Um painel web que fiz.',
    file: 'GamePainelSite.mp4',
  },
];

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const cardStart = (index) => (index / stages.length) * 0.38;
const cardFocus = (index) => cardStart(index) + 0.62 * 0.7;

function cardOpacity(progress) {
  const fadeIn = clamp(progress / 0.18);
  const fadeOut = clamp((1 - progress) / 0.18);
  return Math.min(fadeIn, fadeOut);
}

function ProjectFrame({ file, title }) {
  const videoRef = useRef(null);
  const [frame, setFrame] = useState('');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    let mounted = true;

    const capture = () => {
      if (!mounted || !video.videoWidth || !video.videoHeight) return;
      const scale = Math.min(1, 720 / video.videoWidth);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(video.videoWidth * scale);
      canvas.height = Math.round(video.videoHeight * scale);
      const context = canvas.getContext('2d');
      if (!context) return;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      try { setFrame(canvas.toDataURL('image/jpeg', 0.76)); } catch { /* O vídeo continua disponível como referência local. */ }
    };

    const onMetadata = () => {
      if (video.duration > 0.5) video.currentTime = Math.min(1.2, video.duration * 0.12);
      else capture();
    };
    const onLoadedData = () => { if (video.currentTime < 0.05) capture(); };

    video.addEventListener('loadedmetadata', onMetadata);
    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('seeked', capture);
    if (video.readyState >= 1) onMetadata();
    return () => {
      mounted = false;
      video.removeEventListener('loadedmetadata', onMetadata);
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('seeked', capture);
    };
  }, [file]);

  return (
    <>
      <video
        ref={videoRef}
        className="tunnel-frame-source"
        src={`${import.meta.env.BASE_URL}images/${file}`}
        muted
        playsInline
        preload="metadata"
        tabIndex={-1}
        aria-hidden="true"
      />
      {frame ? <img className="tunnel-project-still" src={frame} alt="" /> : <span className="tunnel-frame-pending">{title}</span>}
    </>
  );
}

export default function ProcessTunnel() {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const selectedRef = useRef(-1);
  const refreshRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    selectedRef.current = selectedIndex;
    refreshRef.current?.();
  }, [selectedIndex]);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return undefined;

    let frame = 0;
    let targetProgress = 0;
    let currentProgress = 0;
    let lastFrameTime = performance.now();
    let lastActiveIndex = -1;
    let prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const render = (progress) => {
      const width = window.innerWidth;
      const height = stage.clientHeight;
      const mobile = width < 680;
      const { x: pointerX, y: pointerY } = pointerRef.current;
      stage.style.setProperty('--tunnel-progress', progress.toFixed(3));

      cardRefs.current.forEach((element, index) => {
        if (!element) return;
        const localProgress = clamp((progress - cardStart(index)) / 0.62);
        const fade = cardOpacity(localProgress);
        const selected = selectedRef.current === index;
        const angle = index * 137.5 * (Math.PI / 180);
        const radiusX = width * (mobile ? 0.34 : 0.28 + (index % 3) * 0.055);
        const radiusY = height * (mobile ? 0.32 : 0.25 + (index % 2) * 0.075);
        const pan = mobile ? 9 : 24;
        const x = Math.cos(angle) * radiusX - pointerX * pan;
        const y = Math.sin(angle) * radiusY - pointerY * pan;
        const z = -1320 + localProgress * 2180 + (selected ? 170 : 0);
        const rotation = (index % 2 === 0 ? 1 : -1) * (3 + (index % 4) * 2);
        const scale = 0.68 + localProgress * 0.5 + (selected ? 0.06 : 0);

        element.style.opacity = String(Math.max(fade, selected ? 0.42 : 0));
        element.style.zIndex = String(Math.round(z + 1400));
        element.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px), ${z.toFixed(1)}px) rotateZ(${rotation}deg) scale(${scale.toFixed(3)})`;
      });

      const nextActiveIndex = Math.min(stages.length - 1, Math.floor(progress * stages.length));
      if (nextActiveIndex !== lastActiveIndex) {
        lastActiveIndex = nextActiveIndex;
        setActiveIndex(nextActiveIndex);
      }
    };

    const updateTarget = () => {
      const travel = Math.max(1, track.offsetHeight - stage.clientHeight);
      const rect = track.getBoundingClientRect();
      targetProgress = clamp(-rect.top / travel);
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    const tick = (now) => {
      const elapsed = Math.min(64, now - lastFrameTime);
      lastFrameTime = now;
      const easing = prefersReducedMotion ? 1 : 1 - Math.exp(-elapsed / 105);
      currentProgress += (targetProgress - currentProgress) * easing;
      if (Math.abs(targetProgress - currentProgress) < 0.0005) currentProgress = targetProgress;
      render(currentProgress);

      if (currentProgress !== targetProgress) frame = window.requestAnimationFrame(tick);
      else frame = 0;
    };

    const onPointerMove = (event) => {
      pointerRef.current = {
        x: clamp((event.clientX / window.innerWidth - 0.5) * 2, -1, 1),
        y: clamp((event.clientY / window.innerHeight - 0.5) * 2, -1, 1),
      };
      if (!frame) frame = window.requestAnimationFrame(tick);
    };
    const onPointerLeave = () => {
      pointerRef.current = { x: 0, y: 0 };
      if (!frame) frame = window.requestAnimationFrame(tick);
    };
    const onMotionPreferenceChange = (event) => { prefersReducedMotion = event.matches; };
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    refreshRef.current = () => {
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', updateTarget, { passive: true });
    window.addEventListener('resize', updateTarget);
    stage.addEventListener('pointermove', onPointerMove, { passive: true });
    stage.addEventListener('pointerleave', onPointerLeave);
    motionPreference.addEventListener?.('change', onMotionPreferenceChange);
    updateTarget();

    return () => {
      window.cancelAnimationFrame(frame);
      refreshRef.current = null;
      window.removeEventListener('scroll', updateTarget);
      window.removeEventListener('resize', updateTarget);
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerleave', onPointerLeave);
      motionPreference.removeEventListener?.('change', onMotionPreferenceChange);
    };
  }, []);

  const jumpToCard = (index) => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;
    const travel = Math.max(0, track.offsetHeight - stage.clientHeight);
    const documentTop = window.scrollY + track.getBoundingClientRect().top;
    window.scrollTo({ top: documentTop + travel * cardFocus(index), behavior: 'smooth' });
  };

  const selectedCard = stages[selectedIndex];

  return (
    <section className="content-section process-section page-shell" id="processo" aria-labelledby="process-title">
      <SectionHeading
        number="01"
        label="Mapa de sistemas"
        headingId="process-title"
        animateTitle
        title="Um pouco do que eu faço."
        description="Aqui ficam alguns sistemas e interfaces que já fiz. O Lei das Ruas tem uma parte separada mais abaixo."
      />

      <div className="tunnel-track" ref={trackRef}>
        <div className="tunnel-stage" ref={stageRef}>
          <div className="tunnel-grid" aria-hidden="true" />
          <div className="tunnel-orbit tunnel-orbit-outer" aria-hidden="true" />
          <div className="tunnel-orbit tunnel-orbit-inner" aria-hidden="true" />
          <div className="tunnel-crosshair" aria-hidden="true"><i /><i /></div>

          <div className="tunnel-stage-topline" aria-hidden="true">
            <span>MAPA DE SISTEMAS <b> / </b> JUNIOR</span>
            <span>{String(activeIndex + 1).padStart(2, '0')} <i>/</i> {String(stages.length).padStart(2, '0')}</span>
          </div>

          <div className="tunnel-center" aria-live="polite" aria-atomic="true">
            <p className="tunnel-center-label">{selectedCard?.label ?? 'LUA / WEB'}</p>
            <h3>{selectedCard?.title ?? 'Do jogo até o painel.'}</h3>
            <p>{selectedCard?.detail ?? 'Dá uma olhada nos trabalhos; o Lei das Ruas aparece na seção dele.'}</p>
            {!selectedCard && <span className="tunnel-center-cue">ROLE PRA VER <b>↓</b></span>}
          </div>

          <div className="tunnel-cards" aria-label="Galeria dos sistemas que programei">
            {stages.map((card, index) => (
              <button
                className={`tunnel-card${selectedIndex === index ? ' is-selected' : ''}`}
                key={card.title}
                ref={(element) => { cardRefs.current[index] = element; }}
                type="button"
                aria-pressed={selectedIndex === index}
                aria-label={`${card.label}: ${card.title}. ${card.detail}`}
                onFocus={(event) => {
                  setSelectedIndex(index);
                  if (event.currentTarget.matches(':focus-visible')) jumpToCard(index);
                }}
                onClick={() => setSelectedIndex((current) => current === index ? -1 : index)}
              >
                <span className="tunnel-card-face">
                  <span className="tunnel-card-overline"><span>{card.label}</span><i>{String(index + 1).padStart(2, '0')}</i></span>
                  <span className="tunnel-card-visual" aria-hidden="true">
                  <ProjectFrame file={card.file} title={card.title} />
                  <span className="tunnel-visual-coordinates">{String(index + 1).padStart(2, '0')} / {card.label}</span>
                  </span>
                  <span className="tunnel-card-copy">
                    <strong>{card.title}</strong>
                    <span>{card.detail}</span>
                  </span>
                  <span className="tunnel-card-prompt">VER NO MAPA <b>↗</b></span>
                </span>
              </button>
            ))}
          </div>

          <div className="tunnel-hud" aria-hidden="true">
            <span>CAMADA {String(activeIndex + 1).padStart(2, '0')}</span>
            <span className="tunnel-progress"><i /></span>
            <span>ROLE PELO MAPA</span>
          </div>
        </div>
      </div>
    </section>
  );
}
