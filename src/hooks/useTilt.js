import { useRef } from 'react';

/**
 * Attaches a subtle 3D tilt + specular-highlight-following-cursor effect
 * to a "liquid-glass" element via CSS custom properties.
 */
export function useTilt(strength = 8) {
  const ref = useRef(null);

  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty('--ry', `${(px * strength).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${(-py * strength).toFixed(2)}deg`);
    el.style.setProperty('--mx', `${((px + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${((py + 0.5) * 100).toFixed(1)}%`);
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--mx', '50%');
    el.style.setProperty('--my', '30%');
  };

  return { ref, onMouseMove, onMouseLeave };
}
