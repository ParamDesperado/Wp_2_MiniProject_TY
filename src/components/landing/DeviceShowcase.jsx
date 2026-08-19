import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import {
  Droplets, Thermometer, Sprout, Bell, Activity, TrendingDown, CheckCircle2,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* Sensor pins laid over the field photograph. Positions are percentages of
   the screen area, chosen to sit on the crop rows rather than the sky. */
const PINS = [
  { id: 'a', x: 26, y: 62, label: 'Sector A', metric: '32%', sub: 'soil moisture', tone: 'low',  icon: <Droplets size={13} /> },
  { id: 'b', x: 62, y: 47, label: 'Sector B', metric: '31°C', sub: 'canopy temp',  tone: 'warn', icon: <Thermometer size={13} /> },
  { id: 'c', x: 79, y: 73, label: 'Sector C', metric: '58%', sub: 'soil moisture', tone: 'ok',   icon: <Sprout size={13} /> },
];

/* The three beats of the scroll sequence. Each names what the reader is
   being shown, so the rail explains rather than decorates. */
const BEATS = [
  { id: 'read',   label: 'Read the field',    note: 'Sensors report from every sector.' },
  { id: 'judge',  label: 'Weigh the reading', note: 'Growth stage and forecast applied.' },
  { id: 'advise', label: 'Make the call',     note: 'One decision you can act on today.' },
];

/* One shared lift for every emerging panel. A spring rather than a CSS
   curve, so an interrupted hover reverses from wherever it got to. */
const hoverLift = { y: -6, scale: 1.03 };
const springLift = { type: 'spring', stiffness: 320, damping: 26, mass: 0.7 };

const Sparkline = () => (
  <svg viewBox="0 0 120 40" className="emerge-spark" preserveAspectRatio="none" aria-hidden="true">
    <polygon points="0,10 24,16 48,22 72,27 96,31 120,33 120,40 0,40" fill="var(--primary)" opacity="0.10" />
    <polyline
      points="0,10 24,16 48,22 72,27 96,31 120,33"
      fill="none" stroke="var(--primary)" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const FieldScreen = ({ variant, photoRef, activePin, setActivePin }) => (
  <div className={`device-screen device-screen-${variant}`}>
    <picture>
      <source srcSet="/field-hero.webp" type="image/webp" />
      <img
        ref={photoRef}
        src="/field-hero.jpg"
        alt="Sugarcane field in the late afternoon, crop rows running toward a tractor on the ridge"
        className="device-photo"
        width={688}
        height={432}
        loading="lazy"
        decoding="async"
        draggable="false"
      />
    </picture>

    <div className="device-overlay">
      <div className="device-overlay-top">
        <span className="device-chip device-chip-live">Live</span>
        <span className="device-chip">Sugarcane · Grand growth</span>
      </div>

      {PINS.map((pin, i) => (
        <button
          type="button"
          key={pin.id}
          className={`field-pin field-pin-${pin.tone} ${activePin === pin.id ? 'is-open' : ''}`}
          style={{ left: `${pin.x}%`, top: `${pin.y}%`, '--pin-delay': `${i * 0.5}s` }}
          onMouseEnter={() => setActivePin(pin.id)}
          onFocus={() => setActivePin(pin.id)}
          onMouseLeave={() => setActivePin(null)}
          onBlur={() => setActivePin(null)}
          onClick={() => setActivePin(activePin === pin.id ? null : pin.id)}
          aria-label={`${pin.label}: ${pin.metric} ${pin.sub}`}
        >
          <span className="field-pin-dot">{pin.icon}</span>
          <span className="field-pin-card">
            <span className="field-pin-label">{pin.label}</span>
            <span className="field-pin-metric">{pin.metric}</span>
            <span className="field-pin-sub">{pin.sub}</span>
          </span>
        </button>
      ))}
    </div>
  </div>
);

const DeviceShowcase = () => {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const rigRef = useRef(null);
  const phoneRef = useRef(null);
  const tabletPhotoRef = useRef(null);
  const phonePhotoRef = useRef(null);
  const cardsRef = useRef([]);
  const [activePin, setActivePin] = useState(null);
  const [beat, setBeat] = useState(0);
  const reduced = useReducedMotion();
  const lift = reduced ? undefined : hoverLift;

  const addCard = (el) => {
    if (el && !cardsRef.current.includes(el)) cardsRef.current.push(el);
  };

  useEffect(() => {
    const mm = gsap.matchMedia();

    /* ── Wide screens: pin the stage, let the interface come apart ──
       The section is taller than the viewport. While it is pinned,
       scroll drives a timeline: the device rises to face the reader,
       then each panel detaches from the middle of the screen and
       travels out to its resting place. Every card that flies out is
       a real panel from the product, not an ornament.               */
    mm.add('(min-width: 981px) and (prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        cardsRef.current = cardsRef.current.filter((el) => el.isConnected);
        const cards = cardsRef.current;
        gsap.set(cards, { opacity: 0, scale: 0.55, x: 0, y: 0, rotate: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=3400',
            scrub: 1.15,
            pin: stageRef.current,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const next = self.progress < 0.32 ? 0 : self.progress < 0.66 ? 1 : 2;
              setBeat((prev) => (prev === next ? prev : next));
            },
          },
        });

        // Beat one: the device rises out of the page
        tl.fromTo(
          rigRef.current,
          { rotateX: 26, rotateY: -14, scale: 0.88, y: 60 },
          { rotateX: 3, rotateY: -4, scale: 1, y: 0, ease: 'power2.inOut', duration: 1.5 }
        );

        tl.fromTo(
          phoneRef.current,
          { yPercent: 20, xPercent: 12, opacity: 0 },
          { yPercent: 0, xPercent: 0, opacity: 1, ease: 'power2.out', duration: 1.1 },
          '-=0.85'
        );

        // Beats two and three: panels peel off the screen in turn
        cards.forEach((card, i) => {
          tl.to(
            card,
            {
              opacity: 1,
              scale: 1,
              x: parseFloat(card.dataset.x || 0),
              y: parseFloat(card.dataset.y || 0),
              rotate: parseFloat(card.dataset.rot || 0),
              ease: 'power3.out',
              duration: 1.3,
            },
            i === 0 ? '>-0.35' : '>-1.0'
          );
        });

        // Hold, so the assembled state is readable before the pin releases
        tl.to({}, { duration: 1.4 });

        // The photograph drifts inside its own frame throughout
        [tabletPhotoRef.current, phonePhotoRef.current].forEach((photo, i) => {
          if (!photo) return;
          gsap.fromTo(
            photo,
            { yPercent: -6 },
            {
              yPercent: 6 + i * 2,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        });
      }, sectionRef);

      return () => ctx.revert();
    });

    /* ── Narrow screens and reduced motion ──
       No pinning and nothing flies. The same panels sit in a grid and
       fade up as they enter, so a touch scroll is never hijacked.    */
    mm.add('(max-width: 980px), (prefers-reduced-motion: reduce)', () => {
      const ctx = gsap.context(() => {
        cardsRef.current = cardsRef.current.filter((el) => el.isConnected);
        gsap.set(cardsRef.current, { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 });
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        gsap.from(cardsRef.current, {
          opacity: 0,
          y: 16,
          scale: 0.94,
          duration: 0.45,
          ease: 'back.out(1.4)',
          stagger: { each: 0.08 },
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        });
      }, sectionRef);

      return () => ctx.revert();
    });

    // Fonts and the photograph land after mount and change layout height,
    // so ScrollTrigger's measurements have to be taken again once settled.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const settle = window.setTimeout(refresh, 1200);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refresh).catch(() => {});
    }

    return () => {
      window.removeEventListener('load', refresh);
      window.clearTimeout(settle);
      mm.revert();
    };
  }, []);

  const onPointerMove = (e) => {
    const rig = rigRef.current;
    if (!rig || !window.matchMedia('(hover: hover)').matches) return;
    const rect = rig.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rig.style.setProperty('--sheen-x', `${(px + 0.5) * 100}%`);
    rig.style.setProperty('--sheen-y', `${(py + 0.5) * 100}%`);
  };

  return (
    <section id="in-the-field" className="device-section" ref={sectionRef}>
      <div className="device-stage" ref={stageRef}>
        <div className="section-inner device-stage-inner">
          <div className="device-copy">
            <div className="section-kicker">On the ground</div>
            <h2 className="section-heading">Watch the field become a decision</h2>
            <p className="section-sub">
              Everything AgriSense shows you starts as one photograph of your block.
              Keep scrolling and the interface comes off the screen a piece at a time.
            </p>

            <ol className="beat-rail">
              {BEATS.map((b, i) => (
                <li
                  key={b.id}
                  className={`beat ${beat === i ? 'is-active' : ''} ${beat > i ? 'is-done' : ''}`}
                >
                  <span className="beat-marker">{beat > i ? <CheckCircle2 size={13} /> : i + 1}</span>
                  <span className="beat-text">
                    <strong>{b.label}</strong>
                    <span>{b.note}</span>
                  </span>
                </li>
              ))}
            </ol>

            <p className="device-hint">Hover or tap a pin on the field to read that sector.</p>
          </div>

          <div className="device-rig" ref={rigRef} onMouseMove={onPointerMove}>
            <div className="device device-tablet">
              <div className="device-bezel">
                <FieldScreen
                  variant="tablet"
                  photoRef={tabletPhotoRef}
                  activePin={activePin}
                  setActivePin={setActivePin}
                />
              </div>
              <span className="device-foot" />
            </div>

            <div className="device device-phone" ref={phoneRef}>
              <div className="device-bezel">
                <span className="device-notch" />
                <FieldScreen
                  variant="phone"
                  photoRef={phonePhotoRef}
                  activePin={activePin}
                  setActivePin={setActivePin}
                />
              </div>
            </div>

            <div className="device-shadow" aria-hidden="true" />

            {/* Panels that emerge from the screen. Each starts stacked at
                the centre of the device and travels to its data offset. */}
            <div className="emerge-layer">
              <m.div
                className="emerge-card emerge-moisture"
                ref={addCard}
                data-x="-318" data-y="-132" data-rot="0"
                whileHover={lift}
                transition={springLift}
              >
                <div className="emerge-head"><Droplets size={13} /> Soil moisture</div>
                <div className="emerge-ring" style={{ '--pct': 32 }}>
                  <div className="emerge-ring-inner"><strong>32%</strong></div>
                </div>
                <span className="emerge-foot emerge-foot-low">
                  <TrendingDown size={12} /> Below 40% threshold
                </span>
              </m.div>

              <m.div
                className="emerge-card emerge-metrics"
                ref={addCard}
                data-x="318" data-y="-132" data-rot="0"
                whileHover={lift}
                transition={springLift}
              >
                <div className="emerge-head"><Activity size={13} /> Live readings</div>
                <div className="emerge-metric-grid">
                  <div><span>Temp</span><strong>31°C</strong></div>
                  <div><span>Humidity</span><strong>68%</strong></div>
                  <div><span>Rain</span><strong>2mm</strong></div>
                  <div><span>Water</span><strong>74%</strong></div>
                </div>
              </m.div>

              <m.div
                className="emerge-card emerge-alert"
                ref={addCard}
                data-x="-318" data-y="128" data-rot="0"
                whileHover={lift}
                transition={springLift}
              >
                <div className="emerge-head"><Bell size={13} /> Alert</div>
                <p className="emerge-body">Low soil moisture in Sector A</p>
                <span className="emerge-time">10 mins ago</span>
              </m.div>

              <m.div
                className="emerge-card emerge-trend"
                ref={addCard}
                data-x="318" data-y="128" data-rot="0"
                whileHover={lift}
                transition={springLift}
              >
                <div className="emerge-head">Moisture, past 8 hours</div>
                <Sparkline />
                <span className="emerge-foot emerge-foot-low">42% falling to 32%</span>
              </m.div>

              <m.div
                className="emerge-card emerge-verdict"
                ref={addCard}
                data-x="0" data-y="292" data-rot="0"
                whileHover={lift}
                transition={springLift}
              >
                <span className="emerge-verdict-badge">Advisory</span>
                <strong className="emerge-verdict-title">Irrigate today, 6:00 PM</strong>
                <span className="emerge-verdict-sub">20,000 L per hectare · Sector A first</span>
              </m.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeviceShowcase;
