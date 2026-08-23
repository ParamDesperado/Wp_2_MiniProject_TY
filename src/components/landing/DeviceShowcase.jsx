import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
        <span className="device-chip device-chip-live"><Activity size={11} /> LIVE</span>
        <span className="device-chip"><Bell size={11} /> 1 alert</span>
      </div>

      {PINS.map((p) => (
        <button
          key={p.id}
          type="button"
          className={`field-pin field-pin-${p.tone} ${activePin === p.id ? 'is-open' : ''}`}
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          onMouseEnter={() => setActivePin(p.id)}
          onFocus={() => setActivePin(p.id)}
        >
          <span className="field-pin-dot">{p.icon}</span>
          <span className="field-pin-card">
            <span className="field-pin-label">{p.label}</span>
            <span className="field-pin-metric">{p.metric}</span>
            <span className="field-pin-sub">{p.sub}</span>
          </span>
        </button>
      ))}
    </div>
  </div>
);

/**
 * Scroll-pinned sequence: the field photo (in a tablet + phone mockup)
 * stays fixed on screen while GSAP's ScrollTrigger steps three insight
 * cards ("read → judge → advise") in and out as the visitor scrolls.
 */
const DeviceShowcase = () => {
  const stageRef = useRef(null);
  const emergeRef = useRef(null);
  const tabletPhotoRef = useRef(null);
  const [activeBeat, setActiveBeat] = useState(0);
  const [activePin, setActivePin] = useState('a');

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.emerge-card', emergeRef.current);
      gsap.set(cards, { opacity: 0, scale: 0.85 });
      if (cards[0]) gsap.set(cards[0], { opacity: 1, scale: 1 });

      const isNarrow = window.matchMedia('(max-width: 980px)').matches;
      if (isNarrow) {
        gsap.set(cards, { opacity: 1, scale: 1 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: 'top top',
          end: '+=1600',
          scrub: 0.6,
          pin: true,
          onUpdate: (self) => {
            const beat = Math.min(BEATS.length - 1, Math.floor(self.progress * BEATS.length));
            setActiveBeat(beat);
          },
        },
      });

      cards.forEach((card, i) => {
        if (i === 0) return;
        tl.to(cards[i - 1], { opacity: 0, scale: 0.85, duration: 0.3 }, i)
          .to(card, { opacity: 1, scale: 1, duration: 0.3 }, i);
      });
    }, stageRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="device-section" id="in-the-field" ref={stageRef}>
      <div className="device-stage">
        <div className="device-stage-inner">
          <div>
            <div className="section-kicker">In the field</div>
            <h2 className="section-heading">The same photo your sensors are reading</h2>
            <p className="section-sub">Scroll to watch a raw reading turn into a decision.</p>

            <ul className="beat-rail">
              {BEATS.map((b, i) => (
                <li key={b.id} className={`beat ${i === activeBeat ? 'is-active' : i < activeBeat ? 'is-done' : ''}`}>
                  <span className="beat-marker">{i + 1}</span>
                  <span className="beat-text">
                    <strong>{b.label}</strong>
                    <span>{b.note}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="device-stats">
              <div className="device-stat"><strong>3</strong><span>sectors shown</span></div>
              <div className="device-stat"><strong>2</strong><span>devices, one feed</span></div>
            </div>
            <div className="device-hint">Hover a pin on the field photo for its live reading</div>
          </div>

          <div className="device-rig">
            <div className="device device-tablet">
              <div className="device-bezel">
                <FieldScreen variant="tablet" photoRef={tabletPhotoRef} activePin={activePin} setActivePin={setActivePin} />
              </div>
              <span className="device-foot" />
            </div>

            <div className="device device-phone">
              <div className="device-bezel">
                <span className="device-notch" />
                <FieldScreen variant="phone" activePin={activePin} setActivePin={setActivePin} />
              </div>
            </div>

            <div className="device-shadow" />

            <div className="emerge-layer" ref={emergeRef}>
              <div className="emerge-card">
                <div className="emerge-head"><Droplets size={13} /> Sector A</div>
                <div className="emerge-body">Soil moisture reading: <strong>32%</strong>, below the 40% threshold.</div>
                <div className="emerge-time">Just now</div>
              </div>

              <div className="emerge-card">
                <div className="emerge-head"><Thermometer size={13} /> Weighed against context</div>
                <Sparkline />
                <div className="emerge-metric-grid">
                  <div><span>Stage</span><strong>Grand growth</strong></div>
                  <div><span>Forecast</span><strong>No rain</strong></div>
                </div>
                <div className="emerge-foot emerge-foot-low"><TrendingDown size={12} /> Trending down</div>
              </div>

              <div className="emerge-card emerge-verdict">
                <span className="emerge-verdict-badge">Advisory</span>
                <div className="emerge-ring" style={{ '--pct': 32 }}>
                  <div className="emerge-ring-inner"><strong>32%</strong></div>
                </div>
                <div className="emerge-verdict-title">Irrigate Sector A today</div>
                <div className="emerge-verdict-sub"><CheckCircle2 size={12} style={{ verticalAlign: '-2px' }} /> Recommended before 6 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeviceShowcase;
