import React from 'react';

/**
 * Field photo fixed behind the whole app, with a light veil on top
 * so text stays readable over it. Plain CSS `position: fixed` — no
 * scroll-linked JS — keeps this compositor-cheap since every glass
 * card on the page re-blurs whatever sits behind it on every frame.
 */
const AppBackground = () => (
  <div className="app-bg" aria-hidden="true">
    <picture>
      <source srcSet="/field-bg.webp" type="image/webp" />
      <img
        src="/field-bg.jpg"
        alt=""
        className="app-bg-photo"
        decoding="async"
        fetchPriority="high"
        draggable="false"
      />
    </picture>
    <div className="app-bg-veil" />
  </div>
);

export default AppBackground;
