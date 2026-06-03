import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';

/*
 * WizardPopcorn — renders an inline link (its children). Each click pops a
 * burst of little colorful ASCII dbt Wizards across the viewport, then they
 * fade away. Click again for more. A playful easter egg for the docs.
 *
 * Hidden "next level": click enough times and you summon the Wizard — fairy
 * dust shimmers across the screen as a giant Wizard eases up to fill it,
 * delivers a line, then dissolves away. The counter resets afterward, so it
 * can be summoned again.
 *
 * Accessibility: the link is a real <button>; the burst is decorative
 * (aria-hidden) and is suppressed under `prefers-reduced-motion`.
 */

// Clicks needed to summon the Wizard finale.
const UNLOCK_AT = 10;

// Finale timing (ms): fairy dust shimmers in first → the Wizard roller-skates
// across the page → poofs out of existence.
const DUST_MS = 1500;
const SKATE_MS = 3600;
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

// Roller skates, appended under the feet for the skating finale only.
const SKATE_LINES = [
  { text: '▟███▙  ▟██▙', part: 'skate' },
  { text: ' O O    O O', part: 'wheel' },
];

// A laptop on a neck strap, held at chest height for the skating finale.
const LAPTOP_LINES = [
  { text: '  ╱    ╲', part: 'strap' },
  { text: ' ▟██████▙', part: 'laptop' },
  { text: ' ▐▤▤▤▤▤▤▌', part: 'keys' },
  { text: ' ▔▔▔▔▔▔▔▔', part: 'keys' },
];

const partClass = {
  hat: styles.hat,
  face: styles.face,
  legs: styles.legs,
  skate: styles.skate,
  wheel: styles.wheel,
  strap: styles.strap,
  laptop: styles.laptop,
  keys: styles.keys,
};

// The full skating getup: wizard + laptop tray (between face and legs) + skates.
const SKATING_LINES = (() => {
  const legStart = WIZARD_LINES.findIndex((l) => l.part === 'legs');
  return [
    ...WIZARD_LINES.slice(0, legStart),
    ...LAPTOP_LINES,
    ...WIZARD_LINES.slice(legStart),
    ...SKATE_LINES,
  ];
})();

const Sprite = ({ skates = false }) => {
  const lines = skates ? SKATING_LINES : WIZARD_LINES;
  return (
    <pre className={styles.sprite} aria-hidden="true">
      {lines.map((line, i) => (
        <span key={i} className={partClass[line.part]}>
          {line.text}
          {'\n'}
        </span>
      ))}
    </pre>
  );
};

const rand = (min, max) => Math.random() * (max - min) + min;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Ambient fairy dust: fine motes scattered across the whole screen that drift
// gently and twinkle on their own loops, so the page shimmers the entire time
// the Wizard is present. `left`/`top` are absolute viewport positions (vw/vh);
// `size` (vmin), `c` color, `dur`/`delay` (s) and `drift`/`rise` (px) vary per
// mote so no two move alike.
const GLYPHS = ['✦', '✧', '⋆', '·', '˙'];
const COLORS = ['#ffe9a8', '#ffffff', '#d9c8ff', '#ffd6f0', '#bfe9ff', '#b0a3ff'];
const DUST = Array.from({ length: 220 }, (_, i) => ({
  left: rand(0, 100),
  top: rand(0, 100),
  size: rand(0.5, 1.7),
  dur: rand(2.6, 5.2),
  delay: rand(0, 4),
  drift: rand(-18, 18),
  rise: rand(-26, -90),
  peak: rand(0.55, 1),
  g: GLYPHS[i % GLYPHS.length],
  c: COLORS[i % COLORS.length],
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

  // Finale state machine: null → 'dust' → 'skating' → 'poofing' → null.
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
    setFinale('dust'); // fairy dust shimmers in before the Wizard arrives
    timers.current.push(
      setTimeout(() => setFinale('skating'), DUST_MS),
      setTimeout(() => setFinale('poofing'), DUST_MS + SKATE_MS),
      setTimeout(() => {
        setFinale(null);
        timers.current = [];
      }, DUST_MS + SKATE_MS + POOF_MS),
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
          {/* A soft light sweep so the whole screen shimmers. */}
          <div className={styles.shimmer} />
          {/* Ambient fairy dust drifting and twinkling across the page. */}
          {DUST.map((d, i) => (
            <span
              key={i}
              className={styles.dust}
              style={{
                left: `${d.left}vw`,
                top: `${d.top}vh`,
                fontSize: `${d.size}vmin`,
                color: d.c,
                textShadow: `0 0 6px ${d.c}`,
                '--drift': `${d.drift}px`,
                '--rise': `${d.rise}px`,
                '--peak': d.peak,
                animationDuration: `${d.dur}s`,
                animationDelay: `${d.delay}s`,
              }}
            >
              {d.g}
            </span>
          ))}
          {finale === 'skating' && (
            <div className={styles.speech}>{SPEECH}</div>
          )}
          {/* The Wizard only appears once the dust has shimmered in. */}
          {finale !== 'dust' && (
            <div className={styles[`finale_${finale}`]}>
              <Sprite skates />
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
          )}
        </div>
      )}
    </>
  );
};

export default WizardPopcorn;
