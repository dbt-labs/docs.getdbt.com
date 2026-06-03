import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';

/*
 * WizardPopcorn — renders an inline link (its children). Each click pops a
 * burst of little colorful ASCII dbt Wizards across the viewport, then they
 * fade away. Click again for more. A playful easter egg for the docs.
 *
 * Hidden "next level": click enough times and you summon the Wizard — fine
 * sparkles scatter as a giant Wizard blows up to fill the screen, it delivers
 * a line in a speech bubble, then poofs itself out of existence. The counter
 * resets afterward, so it can be summoned again.
 *
 * Accessibility: the link is a real <button>; the burst is decorative
 * (aria-hidden) and is suppressed under `prefers-reduced-motion`.
 */

// Clicks needed to summon the Wizard finale.
const UNLOCK_AT = 10;

// Finale timing (ms): grow-in with sparkles → hold while it speaks → poof.
const SUMMON_MS = 1200;
const SPEAK_MS = 3800;
const POOF_MS = 850;

const SPEECH =
  "You've summoned dbt Wizard. Side effects may include cleaner models and suspiciously green runs.";

// The wizard figure, grouped by part so each line can be colored.
// Whitespace is significant — keep it exactly as-is.
const WIZARD_LINES = [
  { text: '   ▄', part: 'hat' },
  { text: '    █▄', part: 'hat' },
  { text: '   ████', part: 'hat' },
  { text: '▄▄██████▄▄', part: 'hat' },
  { text: '  ▄▄ ▄ ▄▄', part: 'face' },
  { text: '  ▀██▀██', part: 'face' },
  { text: '   ▀▀▀▀▀', part: 'face' },
  { text: '   ███ █', part: 'legs' },
  { text: ' ████   █', part: 'legs' },
  { text: '███ █   ███', part: 'legs' },
];

const partClass = { hat: styles.hat, face: styles.face, legs: styles.legs };

const Sprite = () => (
  <pre className={styles.sprite} aria-hidden="true">
    {WIZARD_LINES.map((line, i) => (
      <span key={i} className={partClass[line.part]}>
        {line.text}
        {'\n'}
      </span>
    ))}
  </pre>
);

const rand = (min, max) => Math.random() * (max - min) + min;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Fine-grained sparkles that scatter across the page as the Wizard is summoned.
// Positions are offsets from screen center in vw/vh so they cover the full
// viewport; `g` is the glyph, `s` a size multiplier, `d` the stagger.
const GLYPHS = ['✦', '✧', '⋆', '·', '˙', '*'];
const SPARKLES = Array.from({ length: 90 }, (_, i) => ({
  x: rand(-49, 49),
  y: rand(-49, 49),
  d: rand(0, 0.7),
  s: rand(0.5, 1.2),
  g: GLYPHS[i % GLYPHS.length],
}));

// The puff of magic dust the Wizard leaves behind as it vanishes. Particles
// drift outward and fade. Positions/sizes in em, like the sparkles.
const PUFFS = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * Math.PI * 2;
  const dist = 2 + (i % 3);
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
    d: (i % 6) * 0.02,
    s: 0.6 + (i % 4) * 0.2,
    g: i % 2 ? '·' : '•',
  };
});

const WizardPopcorn = ({ children = 'wizard logo' }) => {
  const [pops, setPops] = useState([]);
  const nextId = useRef(0);

  // Finale state machine: null → 'summon' → 'speaking' → 'poofing' → null.
  const [finale, setFinale] = useState(null);
  const clickCount = useRef(0);
  const timers = useRef([]);

  // Clear any pending finale timers when we unmount mid-finale.
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    },
    [],
  );

  const startFinale = useCallback(() => {
    setFinale('summon');
    timers.current.push(
      setTimeout(() => setFinale('speaking'), SUMMON_MS),
      setTimeout(() => setFinale('poofing'), SUMMON_MS + SPEAK_MS),
      setTimeout(() => {
        setFinale(null);
        timers.current = [];
      }, SUMMON_MS + SPEAK_MS + POOF_MS),
    );
  }, []);

  const burst = useCallback(() => {
    // Respect reduced-motion: don't animate a screen full of wizards.
    if (prefersReducedMotion()) {
      return;
    }

    // Count clicks toward the hidden finale. Once unlocked, hold the count so
    // the dance can't be re-triggered (or stacked) until it finishes.
    if (finale === null) {
      clickCount.current += 1;
      if (clickCount.current >= UNLOCK_AT) {
        clickCount.current = 0;
        startFinale();
      }
    }

    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const count = Math.floor(rand(8, 15));

    const batch = Array.from({ length: count }, () => {
      const id = nextId.current++;
      return {
        id,
        left: rand(4, vw - 80),
        top: rand(vh * 0.15, vh * 0.85),
        rot: rand(-25, 25),
        scale: rand(0.7, 1.3),
        delay: rand(0, 0.35),
      };
    });

    setPops((prev) => [...prev, ...batch]);

    // Clean up this batch once its animation (≈1.2s) plus delay has finished.
    const ids = new Set(batch.map((p) => p.id));
    setTimeout(() => {
      setPops((prev) => prev.filter((p) => !ids.has(p.id)));
    }, 1700);
  }, [finale, startFinale]);

  return (
    <>
      <button type="button" className={styles.link} onClick={burst}>
        {children}
      </button>
      <div className={styles.overlay} aria-hidden="true">
        {pops.map((p) => (
          <span
            key={p.id}
            className={styles.pop}
            style={{
              left: `${p.left}px`,
              top: `${p.top}px`,
              '--rot': `${p.rot}deg`,
              '--scale': p.scale,
              animationDelay: `${p.delay}s`,
            }}
          >
            <Sprite />
          </span>
        ))}
      </div>

      {finale && (
        <div className={styles.finale} aria-hidden="true">
          {finale === 'summon' &&
            SPARKLES.map((s, i) => (
              <span
                key={i}
                className={styles.sparkle}
                style={{
                  '--sx': `${s.x}vw`,
                  '--sy': `${s.y}vh`,
                  '--ss': s.s,
                  animationDelay: `${s.d}s`,
                }}
              >
                {s.g}
              </span>
            ))}
          {finale === 'speaking' && (
            <div className={styles.speech}>{SPEECH}</div>
          )}
          <div className={styles[`finale_${finale}`]}>
            <Sprite />
            {finale === 'poofing' &&
              PUFFS.map((p, i) => (
                <span
                  key={i}
                  className={styles.puff}
                  style={{
                    '--sx': `${p.x}em`,
                    '--sy': `${p.y}em`,
                    '--ss': p.s,
                    animationDelay: `${p.d}s`,
                  }}
                >
                  {p.g}
                </span>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default WizardPopcorn;
