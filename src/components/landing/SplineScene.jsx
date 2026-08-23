import React, { useEffect, useRef, useState } from 'react';

const SPLINE_URL = 'https://my.spline.design/clonergrasscopy-pwh2Qi96dPfFoMFsQuxJM5ne/';

/**
 * Ambient 3D grass field (Spline) used as the hero's living ground layer.
 *
 * Mounted lazily: the iframe is only injected once the host element is
 * actually near the viewport, so the WebGL scene never costs anything on
 * routes that don't show it. Falls back to a painted gradient when the
 * visitor prefers reduced motion or the scene fails to load.
 */
const SplineScene = ({ className = '' }) => {
  const hostRef = useRef(null);
  const [shouldMount, setShouldMount] = useState(false);
  const [inView, setInView] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return undefined;

    // Respect reduced-motion: keep the painted fallback, skip the 3D scene.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setFailed(true);
      return undefined;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setShouldMount(true);
      return undefined;
    }

    // Keeps watching (never unobserves) so the WebGL canvas can be hidden
    // once the visitor scrolls past the hero — a 3D scene left rendering
    // off-screen is the single biggest thing that makes scrolling feel laggy.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setInView(entry.isIntersecting);
          if (entry.isIntersecting) setShouldMount(true);
        });
      },
      { rootMargin: '300px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // If the scene hasn't reported back in time, quietly keep the fallback.
  useEffect(() => {
    if (!shouldMount || loaded) return undefined;
    const timer = window.setTimeout(() => setFailed(true), 9000);
    return () => window.clearTimeout(timer);
  }, [shouldMount, loaded]);

  return (
    <div ref={hostRef} className={`spline-stage ${className}`.trim()} aria-hidden="true">
      <div className={`spline-fallback ${loaded ? 'is-hidden' : ''}`} />

      {shouldMount && !failed && (
        <iframe
          src={SPLINE_URL}
          title="Ambient 3D grass field"
          frameBorder="0"
          loading="lazy"
          tabIndex={-1}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`spline-frame ${loaded ? 'is-ready' : ''}`}
          style={{ display: inView ? 'block' : 'none' }}
        />
      )}

      {/* Scrim: keeps the hero copy at full contrast over the moving scene. */}
      <div className="spline-scrim" />
    </div>
  );
};

export default SplineScene;
