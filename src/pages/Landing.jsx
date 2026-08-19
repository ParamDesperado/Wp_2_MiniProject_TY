import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import {
  Droplets, Activity, Leaf, Bell, ArrowRight, ChevronDown, Sprout,
  Thermometer, Wind, Waves, Menu, X, CheckCircle2, Radio, BrainCircuit, Bolt,
} from 'lucide-react';
import SplineScene from '../components/landing/SplineScene';
import DeviceShowcase from '../components/landing/DeviceShowcase';
import Reveal from '../components/Reveal';
import { useTilt } from '../hooks/useTilt';
import { mockSensorData } from '../data/mockData';

const splitLine = (text) =>
  text.split('').map((ch, i) => (
    <span className="title-char" key={i}>{ch === ' ' ? '\u00A0' : ch}</span>
  ));

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`glass-nav ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="nav-brand">
        <Droplets color="var(--primary)" size={22} />
        <span>AgriSense</span>
      </Link>

      <div className="nav-links">
        <a href="#features">Features</a>
        <a href="#in-the-field">In the Field</a>
        <a href="#how-it-works">How it Works</a>
        <a href="#dashboard-preview">Dashboard</a>
      </div>

      <div className="nav-actions">
        <Link to="/login" className="btn-ghost"><span className="full">Sign In</span></Link>
        <Link to="/register" className="btn">Get Started</Link>
        <button className="nav-mobile-toggle" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="liquid-glass nav-mobile-panel">
          <a href="#features" onClick={() => setOpen(false)}>Features</a>
          <a href="#in-the-field" onClick={() => setOpen(false)}>In the Field</a>
          <a href="#how-it-works" onClick={() => setOpen(false)}>How it Works</a>
          <a href="#dashboard-preview" onClick={() => setOpen(false)}>Dashboard</a>
          <a href="#footer" onClick={() => setOpen(false)}>About</a>
        </div>
      )}
    </nav>
  );
};

const SensorWidget = () => {
  const moisture = mockSensorData.soilMoisture;
  return (
    <div className="sensor-widget-wrap">
      <div className="liquid-glass sensor-widget">
        <div className="sensor-widget-head">
          <h4>Field · Sector A</h4>
          <span className="live-dot">LIVE</span>
        </div>

        <div className="moisture-ring-row">
          <div className="moisture-ring" style={{ '--pct': moisture }}>
            <div className="moisture-ring-inner">
              <strong>{moisture}%</strong>
              <span>moisture</span>
            </div>
          </div>
          <div className="moisture-caption">
            <p style={{ color: 'var(--danger)' }}>Irrigation recommended</p>
            <span>Sugarcane · Grand growth stage</span>
          </div>
        </div>

        <div className="sensor-mini-grid">
          <div className="sensor-mini-stat">
            <span>Temp</span>
            <strong>{mockSensorData.temperature}°C</strong>
          </div>
          <div className="sensor-mini-stat">
            <span>Humidity</span>
            <strong>{mockSensorData.humidity}%</strong>
          </div>
          <div className="sensor-mini-stat">
            <span>Rainfall</span>
            <strong>{mockSensorData.rainfall}mm</strong>
          </div>
          <div className="sensor-mini-stat">
            <span>Water lvl</span>
            <strong>{mockSensorData.waterLevel}%</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, to, delay }) => {
  const tilt = useTilt(7);
  return (
    <Reveal variant="up" delay={delay}>
      <Link
        to={to}
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className="liquid-glass feature-card"
      >
        <div className="feature-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{desc}</p>
        <span className="feature-link">Explore <ArrowRight size={14} /></span>
      </Link>
    </Reveal>
  );
};

const Landing = () => {
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const metaRef = useRef(null);
  const widgetRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([subRef.current, ctaRef.current, metaRef.current, widgetRef.current], { visibility: 'visible' });
      const tl = gsap.timeline({ delay: 0.15 });

      if (titleRef.current) {
        gsap.set(titleRef.current, { visibility: 'visible' });
        const chars = titleRef.current.querySelectorAll('.title-char');
        tl.from(chars, {
          yPercent: 120, opacity: 0, duration: 1.1, stagger: 0.018, ease: 'power4.out',
        });
      }
      tl.from(subRef.current, { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6');
      tl.from(ctaRef.current, { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5');
      tl.from(metaRef.current, { y: 16, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5');
      tl.from(widgetRef.current, { x: 40, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.9');
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="landing-page">
      <NavBar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero-section">
        <SplineScene />
        <div className="hero-glow hero-glow-a" />
        <div className="hero-glow hero-glow-b" />

        <div className="hero-grid">
          <div>
            <div className="eyebrow-badge"><Radio size={13} /> AI + Sensor-Driven Irrigation</div>

            <h1 className="hero-title" ref={titleRef}>
              <span className="title-line">{splitLine('Irrigate on the ')}</span>
              <span className="title-line">
                {splitLine("field's ")}<span className="accent">{splitLine('terms')}</span>
              </span>
              <span className="title-line">{splitLine('— not the calendar’s.')}</span>
            </h1>

            <p className="hero-sub" ref={subRef}>
              AgriSense reads soil moisture, temperature and weather in real time, then tells you
              exactly when — and how much — to irrigate your sugarcane. Built to cut water waste
              without ever risking the crop.
            </p>

            <div className="hero-cta-row" ref={ctaRef}>
              <Link to="/register" className="btn btn-lg">Get Started <ArrowRight size={18} /></Link>
              <Link to="/login" className="btn-ghost btn-lg">Sign In</Link>
              <a href="#how-it-works" className="btn-link-cta">See how it works <ChevronDown size={16} /></a>
            </div>

            <div className="hero-meta-row" ref={metaRef}>
              <div className="hero-meta-item"><strong>5</strong><span>live field metrics</span></div>
              <div className="hero-meta-item"><strong>24/7</strong><span>sensor monitoring</span></div>
              <div className="hero-meta-item"><strong>~40%</strong><span>less water wasted*</span></div>
            </div>
          </div>

          <div ref={widgetRef} style={{ visibility: 'hidden' }}><SensorWidget /></div>
        </div>

        <div className="scroll-cue">
          Scroll <ChevronDown className="chevron" size={16} />
        </div>
      </section>

      {/* ── Stat strip ───────────────────────────────────────── */}
      <section className="stat-strip">
        <div className="stat-strip-grid">
          {[
            { num: '5', label: 'sensors tracked per field' },
            { num: '4', label: 'growth stages guided' },
            { num: '~40%', label: 'less water wasted*' },
            { num: '24/7', label: 'continuous monitoring' },
          ].map((s, i) => (
            <Reveal key={s.label} variant="scale" delay={i * 90}>
              <div className="liquid-glass stat-strip-item">
                <div className="num">{s.num}</div>
                <div className="label">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '1rem' }}>
          *Modelled from field-trial irrigation data, WP2 Mini Project
        </p>
      </section>

      {/* ── The field, in hand ───────────────────────────────── */}
      <DeviceShowcase />

      {/* ── Features ─────────────────────────────────────────── */}
      <section id="features">
        <div className="section-inner">
          <Reveal>
            <div className="section-kicker">What AgriSense does</div>
            <h2 className="section-heading">Everything your field needs to tell you, in one place</h2>
            <p className="section-sub">
              Four connected views turn raw sensor noise into decisions you can actually act on.
            </p>
          </Reveal>

          <div style={{ height: '2.5rem' }} />

          <div className="feature-grid">
            <FeatureCard
              icon={<Activity size={22} />}
              title="Live Sensor Network"
              desc="Soil moisture, temperature, humidity, rainfall and water level, streamed from the field every few minutes."
              to="/app/sensors"
              delay={0}
            />
            <FeatureCard
              icon={<Droplets size={22} />}
              title="AI Irrigation Advisory"
              desc="A clear today-or-skip recommendation with the reasoning behind it — no more guesswork on the valves."
              to="/app/advisory"
              delay={80}
            />
            <FeatureCard
              icon={<Leaf size={22} />}
              title="Crop Growth Tracking"
              desc="Follow your sugarcane through every growth stage, with tailored water guidance at each one."
              to="/app/crop"
              delay={160}
            />
            <FeatureCard
              icon={<Bell size={22} />}
              title="Smart Alerts"
              desc="Get warned about drought stress, heat spikes or sensor issues before they cost you yield."
              to="/app/alerts"
              delay={240}
            />
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section id="how-it-works">
        <div className="section-inner">
          <Reveal>
            <div className="section-kicker">The pipeline</div>
            <h2 className="section-heading">From soil reading to irrigation decision, in four steps</h2>
          </Reveal>

          <div style={{ height: '2.5rem' }} />

          <div className="steps-row">
            {[
              { icon: <Radio size={18} />, title: 'Sense', desc: "In-field sensors capture soil moisture, temperature, humidity and rainfall." },
              { icon: <BrainCircuit size={18} />, title: 'Analyze', desc: "The AI model compares live readings against the crop's growth stage and local weather." },
              { icon: <Bolt size={18} />, title: 'Advise', desc: 'AgriSense turns that into one clear call: irrigate now, or hold off.' },
              { icon: <CheckCircle2 size={18} />, title: 'Act & Track', desc: 'Log the irrigation, then watch soil moisture and yield respond over time.' },
            ].map((s, i) => (
              <Reveal key={s.title} variant="up" delay={i * 100}>
                <div className="liquid-glass step-card">
                  <span className="step-num">0{i + 1}</span>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{s.icon} {s.title}</h4>
                  <p>{s.desc}</p>
                  {i < 3 && <div className="step-connector" />}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dashboard preview ────────────────────────────────── */}
      <section id="dashboard-preview">
        <div className="section-inner preview-grid">
          <Reveal variant="left" className="preview-copy">
            <div className="section-kicker">Your farm, at a glance</div>
            <h2 className="section-heading">A dashboard built for a five-minute morning check</h2>
            <ul>
              <li><CheckCircle2 size={16} /> One glance recommendation — irrigate today, or don't.</li>
              <li><CheckCircle2 size={16} /> Every sensor reading, trended over the day.</li>
              <li><CheckCircle2 size={16} /> Alerts ranked by urgency, not just by time.</li>
              <li><CheckCircle2 size={16} /> Crop-stage-aware guidance, not generic advice.</li>
            </ul>
            <div style={{ marginTop: '2rem' }}>
              <Link to="/app/dashboard" className="btn">Open the Dashboard <ArrowRight size={16} /></Link>
            </div>
          </Reveal>

          <Reveal variant="right">
            <div className="liquid-glass preview-panel">
              <div className="preview-panel-head">
                <h4>Today's Advisory</h4>
                <span className="preview-badge">Irrigate</span>
              </div>
              <div className="preview-gauge-row">
                <div className="moisture-ring" style={{ '--pct': mockSensorData.soilMoisture, width: 78, height: 78 }}>
                  <div className="moisture-ring-inner" style={{ width: 60, height: 60 }}>
                    <strong style={{ fontSize: '0.95rem' }}>{mockSensorData.soilMoisture}%</strong>
                  </div>
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>Sugarcane · Sector A</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Grand growth stage</p>
                </div>
              </div>
              <div className="preview-mini-grid">
                <div className="preview-mini-stat"><Thermometer size={16} color="var(--warning)" /><strong>{mockSensorData.temperature}°C</strong><span>Temp</span></div>
                <div className="preview-mini-stat"><Wind size={16} color="var(--accent)" /><strong>{mockSensorData.humidity}%</strong><span>Humidity</span></div>
                <div className="preview-mini-stat"><Waves size={16} color="var(--primary-light)" /><strong>{mockSensorData.waterLevel}%</strong><span>Water lvl</span></div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Credit strip ─────────────────────────────────────── */}
      <section className="credit-strip">
        <Reveal>
          <div className="section-kicker" style={{ justifyContent: 'center' }}>WP2 Mini Project</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Irrigation Advisory System for Sugarcane, using AI and Sensor-based Technology</h3>
          <p>Designed and built by Param Sangani, Ankit Vishvakarma and Aarya Thota — Batch B2, IT.</p>
        </Reveal>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section style={{ padding: '2rem 1.5rem 6rem' }}>
        <div className="section-inner">
          <Reveal variant="scale">
            <div className="liquid-glass cta-banner">
              <Sprout size={30} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
              <h2>Ready to let the data decide?</h2>
              <p>Create a free account and connect your field in minutes.</p>
              <div className="btn-row">
                <Link to="/register" className="btn btn-lg">Get Started <ArrowRight size={18} /></Link>
                <Link to="/login" className="btn-ghost btn-lg">I already have an account</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="landing-footer" id="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-brand"><Droplets color="var(--primary)" size={20} /><span>AgriSense</span></div>
            <p>Smart, sensor-driven irrigation advisory for sugarcane — built as a WP2 laboratory mini project.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h5>Product</h5>
              <a href="#features">Features</a>
              <a href="#how-it-works">How it Works</a>
              <a href="#dashboard-preview">Dashboard</a>
            </div>
            <div className="footer-col">
              <h5>Account</h5>
              <Link to="/login">Sign In</Link>
              <Link to="/register">Register</Link>
            </div>
            <div className="footer-col">
              <h5>Project</h5>
              <Link to="/app/about">About</Link>
              <span>Somaiya Vidyavihar University</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} AgriSense · WP2 Mini Project</span>
          <span>KJSSE / IT / TY BTech / SEM-V</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
