import React from 'react';
import { useScroll, useSpring, useTransform, useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';

/**
 * The field photograph, fixed behind the entire application.
 *
 * The image never scrolls with the document. It drifts against the scroll,
 * which reads as depth: content sheets slide over ground that stays put.
 *
 * The drift runs through a spring rather than tracking scroll position
 * directly. Raw scroll-linked movement inherits every stutter of the
 * wheel or trackpad; damping it means the background eases toward its
 * target and arrives late, which is what makes the parallax feel smooth
 * instead of twitchy.
 */
const AppBackground = () => {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const damped = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 24,
    mass: 0.55,
    restDelta: 0.0005,
  });

  const y = useTransform(damped, [0, 1], ['0%', '-14%']);

  return (
    <div className="app-bg" aria-hidden="true">
      <picture>
        <source srcSet="/field-bg.webp" type="image/webp" />
        <m.img
          src="/field-bg.jpg"
          alt=""
          className="app-bg-photo"
          decoding="async"
          fetchPriority="high"
          draggable="false"
          style={reduced ? undefined : { y }}
        />
      </picture>
      <div className="app-bg-veil" />
      <div className="app-bg-grain" />
    </div>
  );
};

export default AppBackground;
