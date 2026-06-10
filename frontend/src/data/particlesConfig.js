// tsParticles configuration for the home page background
import { loadFull } from 'tsparticles'

export const particlesInit = async (engine) => {
  await loadFull(engine)
}

export const particlesConfig = {
  fullScreen: false,
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: { enable: true, mode: 'grab' },
      onClick: { enable: true, mode: 'push' },
      resize: true,
    },
    modes: {
      grab: { distance: 140, links: { opacity: 0.5 } },
      push: { quantity: 4 },
    },
  },
  particles: {
    color: { value: ['#00f5ff', '#8000ff', '#ff00ff'] },
    links: {
      color: '#00f5ff',
      distance: 150,
      enable: true,
      opacity: 0.2,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1,
      direction: 'none',
      random: true,
      straight: false,
      outModes: { default: 'bounce' },
    },
    number: { density: { enable: true, area: 800 }, value: 60 },
    opacity: {
      value: { min: 0.1, max: 0.5 },
      animation: { enable: true, speed: 1, minimumValue: 0.1 },
    },
    shape: { type: 'circle' },
    size: { value: { min: 1, max: 3 } },
  },
  detectRetina: true,
}
