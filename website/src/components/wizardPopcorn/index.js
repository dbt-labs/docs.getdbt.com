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
const UNLOCK_AT = 20;

// Finale timing (ms): fairy dust shimmers in first → the Wizard roller-skates
// across the page → poofs out of existence.
const DUST_MS = 1500;
const SKATE_MS = 3600;
const POOF_MS = 850;

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

// A laptop on a neck strap, held at chest height for the skating finale. The
// screen interior is left empty — the real dbt "bit" logo is overlaid on top
// (see DbtBit / .laptopLogo) so it scales and moves with the Wizard.
const LAPTOP_LINES = [
  { text: '  ╱    ╲', part: 'strap' },
  { text: ' ┌──────┐', part: 'laptop' },
  { text: ' │      │', part: 'laptop' },
  { text: ' └──────┘', part: 'laptop' },
  { text: '▟████████▙', part: 'keys' },
];

// The dbt "bit" mark (from static/img/favicon.svg), drawn on the laptop screen.
const DBT_BIT_PATH =
  'M13.4904 2.49926C13.7719 2.77037 13.957 3.12889 14 3.51852C14 3.68148 13.957 3.78963 13.8593 3.99556C13.7615 4.20148 12.557 6.28444 12.1985 6.85926C11.9926 7.19556 11.8844 7.59704 11.8844 7.98815C11.8844 8.37926 11.9926 8.78074 12.1985 9.11704C12.557 9.69185 13.7615 11.7867 13.8593 11.9926C13.957 12.1985 14 12.2963 14 12.4593C13.957 12.8504 13.7837 13.2074 13.5007 13.4681C13.2296 13.7496 12.8711 13.9348 12.4919 13.9674C12.3289 13.9674 12.2207 13.9244 12.0252 13.8267C11.8296 13.7289 9.7037 12.557 9.12889 12.1985C9.08593 12.1763 9.04148 12.1437 8.98815 12.123L6.14519 10.4415C6.21037 10.9837 6.44889 11.5052 6.84 11.8844C6.91556 11.96 6.99259 12.0252 7.07852 12.0904C7.01333 12.123 6.93778 12.1556 6.87259 12.1985C6.29778 12.557 4.20296 13.7615 3.99704 13.8593C3.79111 13.957 3.69333 14 3.52 14C3.12889 13.957 2.77185 13.7837 2.51111 13.5007C2.22963 13.2296 2.04444 12.8711 2.00148 12.4815C2.01185 12.3185 2.0563 12.1556 2.14222 12.0148C2.24 11.8089 3.44444 9.71407 3.80296 9.13926C4.00889 8.80296 4.11704 8.41185 4.11704 8.01037C4.11704 7.60889 4.00889 7.21778 3.80296 6.88148C3.44296 6.28593 2.22815 4.19111 2.14074 3.98519C2.05333 3.84444 2.01037 3.68148 2 3.51852C2.04296 3.12889 2.2163 2.77037 2.49926 2.49926C2.77037 2.2163 3.12889 2.04296 3.51852 2C3.68148 2.01037 3.84444 2.05481 3.99556 2.14074C4.16889 2.2163 5.69926 3.10667 6.51259 3.5837L6.69778 3.69185C6.76296 3.73481 6.81778 3.76741 6.86074 3.78963L6.94815 3.84444L9.84444 5.55852C9.77926 4.90815 9.44296 4.31111 8.92148 3.90963C8.98667 3.87704 9.06222 3.84444 9.12741 3.80148C9.70222 3.44296 11.797 2.22815 12.003 2.14074C12.1437 2.05333 12.3067 2.01037 12.48 2C12.8593 2.04296 13.2178 2.2163 13.4889 2.49926H13.4904ZM8.15259 8.77037L8.77037 8.15259C8.85778 8.06519 8.85778 7.9363 8.77037 7.84889L8.15259 7.23111C8.06519 7.1437 7.9363 7.1437 7.84889 7.23111L7.23111 7.84889C7.1437 7.9363 7.1437 8.06519 7.23111 8.15259L7.84889 8.77037C7.92444 8.84593 8.06519 8.84593 8.15259 8.77037Z';

const DbtBit = () => (
  <svg className={styles.laptopLogo} viewBox="0 0 16 16" aria-hidden="true">
    <path d={DBT_BIT_PATH} fill="#fe6702" />
  </svg>
);

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
        <span key={i} className={line.part ? partClass[line.part] : undefined}>
          {line.segments
            ? line.segments.map((s, j) => (
                <span key={j} className={partClass[s.part]}>
                  {s.text}
                </span>
              ))
            : line.text}
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
          {/* The Wizard only appears once the dust has shimmered in. */}
          {finale !== 'dust' && (
            <div className={styles[`finale_${finale}`]}>
              <Sprite skates />
              <DbtBit />
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
