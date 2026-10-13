import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './spellShooter.module.css';

/*
 * SpellShooter — a 15-second mini-game hidden behind the WizardPopcorn link.
 * Click the link enough times and the Wizard shows up to fight your parse
 * errors: move with the mouse (or arrow keys), cast with a click (or space),
 * and zap the errors falling down the screen before they hit prod.
 *
 * Everything is drawn on a <canvas> inside a fixed overlay, so the game can't
 * disturb the page it's sitting on. Closing (Esc, the close button, or the
 * timer running out) tears the whole thing down.
 *
 * Accessibility: the game is decorative and opt-in. It never starts under
 * `prefers-reduced-motion`, the overlay traps nothing but Esc, and the score
 * is announced in text at the end rather than only in color.
 */

const GAME_MS = 15000;
const W = 640;
const H = 400;

// Wizard geometry, in canvas pixels. The figure is drawn upward from its feet
// so it always stands on the floor, whatever the sprite's line count.
const WIZ_W = 52;
const WIZ_FEET_Y = H - 24;
const WIZ_LINE_H = 9;
const WIZ_SPEED = 7; // px per 60Hz frame for keyboard movement

// Motion below is tuned in "60Hz frames" so the numbers stay readable, then
// scaled by `step` each tick (1 at 60Hz, 0.5 at 120Hz). Without this the game
// runs at double speed on a 120Hz display. Capped at 3 so a backgrounded tab
// doesn't teleport everything across the screen on the next frame.
const FRAME_MS = 1000 / 60;
const MAX_STEP = 3;

// Where the wand tip sits relative to the wizard's center and its top line.
// Spells leave from here, not from the middle of the hat.
const WAND_DX = 15;
const WAND_DY = -3;

// The things you're shooting at. Real dbt failures, mostly.
const ERRORS = [
  'SyntaxError',
  "ref('stg_orders')",
  'ambiguous column',
  'NULL',
  'missing schema.yml',
  'circular dependency',
  'compilation error',
  'unique test failed',
  'model not found',
  'Error [DependencyNotFound (dbt1048)]',
  '403 Forbidden: Access denied',
  "Could not find profile named 'user'",
  'Partial parsing compilation error',
  'Runtime error in packages.yml',
];

// End-of-round verdicts, scored mostly on how many errors reached prod. The
// first matching tier wins, so keep these ordered most specific first, and
// give the last one a `when` that always matches.
const VERDICTS = [
  {
    when: (zapped, escaped) => escaped === 0 && zapped === 0,
    lines: [
      'Nothing ran. Technically nothing broke.',
      'No models built, no tests run. Idempotent, at least.',
    ],
  },
  {
    when: (zapped, escaped) => escaped === 0 && zapped >= 25,
    lines: [
      'Green DAG, top to bottom. Screenshot it for standup.',
      'Full refresh, zero failures. Unheard of.',
    ],
  },
  {
    when: (zapped, escaped) => escaped === 0,
    lines: ['Clean parse. Ship it.', 'All tests passed. Suspicious, but ship it.'],
  },
  {
    when: (zapped, escaped) => escaped <= 3,
    lines: [
      'A few made it to prod. Nobody noticed.',
      'A few made it to prod. Fix it before the morning run.',
    ],
  },
  {
    when: (zapped, escaped) => escaped <= 7,
    lines: ['Your stakeholders have questions.', "Someone's already asking in #analytics-help."],
  },
  {
    when: () => true,
    lines: [
      'The exec dashboard is blank. Slack is happening.',
      'Prod is a lava lamp now. Roll back.',
    ],
  },
];

// The wizard, drawn as stacked ASCII lines with a wand held out to one side.
// `part` picks the color; whitespace is significant.
const WIZ_LINES = [
  { text: '        ✦', part: 'tip' },
  { text: '   ▄   ╱', part: 'hat' },
  { text: '   █▄ ╱', part: 'hat' },
  { text: '  ████╱', part: 'hat' },
  { text: ' ▄█████▄', part: 'hat' },
  { text: '  ▄▄ ▄ ▄', part: 'face' },
  { text: '  ▀██▀█', part: 'face' },
  { text: '  ███ █', part: 'robe' },
  { text: ' ██ █ ██', part: 'robe' },
];

const WIZ_COLORS = {
  tip: '#d9c8ff',
  hat: '#fe6702',
  face: '#ffffff',
  robe: '#b0a3ff',
};

// The top of the sprite, derived so the feet always land on WIZ_FEET_Y.
const WIZ_TOP_Y = WIZ_FEET_Y - (WIZ_LINES.length - 1) * WIZ_LINE_H;

const rand = (min, max) => Math.random() * (max - min) + min;

const SpellShooter = ({ onClose }) => {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [result, setResult] = useState(null);
  // Bumping the round re-runs the game effect, which starts a fresh clock.
  const [round, setRound] = useState(0);

  // All mutable game state lives in a ref so the animation loop never
  // re-renders React on every frame.
  const game = useRef({
    wizX: W / 2,
    keys: { left: false, right: false },
    bolts: [],
    errors: [],
    sparks: [],
    zapped: 0,
    escaped: 0,
    startedAt: 0,
    nextSpawn: 0,
    raf: 0,
    over: false,
  });

  // Replay without closing: clearing the result hides the panel, and the round
  // bump restarts the game effect with a fresh clock and score.
  const playAgain = useCallback(() => {
    setResult(null);
    setRound((r) => r + 1);
  }, []);

  const fire = useCallback(() => {
    const g = game.current;
    if (g.over) return;
    // A short cooldown so holding the mouse down doesn't spray.
    const now = performance.now();
    if (now - (g.lastFire || 0) < 140) return;
    g.lastFire = now;
    // Spells leave the wand tip, so they trail up from the wizard's right hand.
    g.bolts.push({ x: g.wizX + WAND_DX, y: WIZ_TOP_Y + WAND_DY, vy: -7.5 });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    // Reset every round, so a replay starts clean rather than inheriting the
    // last round's score and whatever was still falling when time ran out.
    const g = game.current;
    g.wizX = W / 2;
    g.keys = { left: false, right: false };
    g.bolts = [];
    g.errors = [];
    g.sparks = [];
    g.zapped = 0;
    g.escaped = 0;
    g.lastFire = 0;
    g.over = false;
    g.startedAt = performance.now();
    g.nextSpawn = g.startedAt + 300;
    g.lastFrame = g.startedAt;

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * W;
      g.wizX = Math.max(WIZ_W / 2, Math.min(W - WIZ_W / 2, x));
    };

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      // Once the round is over, space doubles as the replay key, the way the
      // Chrome dinosaur restarts on space.
      if (g.over) {
        if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
          e.preventDefault();
          playAgain();
        }
        return;
      }
      if (e.key === 'ArrowLeft') g.keys.left = true;
      if (e.key === 'ArrowRight') g.keys.right = true;
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        fire();
      }
    };

    const onKeyUp = (e) => {
      if (e.key === 'ArrowLeft') g.keys.left = false;
      if (e.key === 'ArrowRight') g.keys.right = false;
    };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mousedown', fire);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    wrapRef.current?.focus();

    const drawWizard = (x, castAge) => {
      ctx.font = '11px Menlo, ui-monospace, monospace';
      ctx.textAlign = 'center';
      WIZ_LINES.forEach((line, i) => {
        ctx.fillStyle = WIZ_COLORS[line.part];
        ctx.fillText(line.text, x, WIZ_TOP_Y + i * WIZ_LINE_H);
      });

      // The wand tip flares for a moment after each cast.
      if (castAge !== null && castAge < 160) {
        const fade = 1 - castAge / 160;
        const tipX = x + WAND_DX;
        const tipY = WIZ_TOP_Y + WAND_DY;
        const grad = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 14);
        grad.addColorStop(0, `rgba(217, 200, 255, ${0.85 * fade})`);
        grad.addColorStop(1, 'rgba(139, 107, 255, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(tipX, tipY, 14, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      const now = performance.now();
      const elapsed = now - g.startedAt;
      const left = Math.max(0, GAME_MS - elapsed);
      const step = Math.min((now - g.lastFrame) / FRAME_MS, MAX_STEP);
      g.lastFrame = now;

      // ── update ──────────────────────────────────────────────────────────
      if (g.keys.left) g.wizX = Math.max(WIZ_W / 2, g.wizX - WIZ_SPEED * step);
      if (g.keys.right) g.wizX = Math.min(W - WIZ_W / 2, g.wizX + WIZ_SPEED * step);

      // Errors arrive faster as the clock runs down.
      if (now > g.nextSpawn && left > 600) {
        const label = ERRORS[Math.floor(rand(0, ERRORS.length))];
        ctx.font = '13px Menlo, ui-monospace, monospace';
        const w = ctx.measureText(label).width;
        g.errors.push({
          label,
          w,
          // Long error strings are otherwise near-impossible to miss, so the
          // hitbox stops widening past 90px.
          hw: Math.min(w, 90) / 2,
          x: rand(w / 2 + 10, W - w / 2 - 10),
          y: -10,
          vy: rand(1.1, 1.5) + elapsed / 7000,
        });
        g.nextSpawn = now + rand(420, 900) - elapsed / 40;
      }

      g.bolts.forEach((b) => (b.y += b.vy * step));
      g.bolts = g.bolts.filter((b) => b.y > -10);

      g.errors.forEach((er) => (er.y += er.vy * step));

      // Collisions: a bolt inside an error's box zaps it.
      g.errors = g.errors.filter((er) => {
        const hitIndex = g.bolts.findIndex(
          (b) =>
            b.x > er.x - er.hw - 4 &&
            b.x < er.x + er.hw + 4 &&
            b.y > er.y - 14 &&
            b.y < er.y + 6,
        );
        if (hitIndex !== -1) {
          g.bolts.splice(hitIndex, 1);
          g.zapped += 1;
          for (let i = 0; i < 8; i++) {
            g.sparks.push({
              x: er.x,
              y: er.y,
              vx: rand(-2.2, 2.2),
              vy: rand(-2.4, 1.2),
              life: 1,
            });
          }
          return false;
        }
        if (er.y > H - 18) {
          g.escaped += 1;
          return false;
        }
        return true;
      });

      g.sparks.forEach((s) => {
        s.x += s.vx * step;
        s.y += s.vy * step;
        s.life -= 0.045 * step;
      });
      g.sparks = g.sparks.filter((s) => s.life > 0);

      // ── draw ────────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#14101f';
      ctx.fillRect(0, 0, W, H);

      // The prod line the errors are trying to reach.
      ctx.strokeStyle = 'rgba(255, 95, 86, 0.5)';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(0, H - 18);
      ctx.lineTo(W, H - 18);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = '10px Menlo, ui-monospace, monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255, 95, 86, 0.65)';
      ctx.fillText('prod', 8, H - 6);

      // Falling errors.
      ctx.font = '13px Menlo, ui-monospace, monospace';
      ctx.textAlign = 'center';
      g.errors.forEach((er) => {
        ctx.fillStyle = '#ff5f56';
        ctx.fillText(er.label, er.x, er.y);
      });

      // Bolts of purple fire.
      g.bolts.forEach((b) => {
        ctx.fillStyle = '#d9c8ff';
        ctx.font = '14px Menlo, ui-monospace, monospace';
        ctx.fillText('✦', b.x, b.y);
      });

      // Sparks from a zapped error.
      g.sparks.forEach((s) => {
        ctx.fillStyle = `rgba(176, 163, 255, ${Math.max(0, s.life)})`;
        ctx.fillRect(s.x, s.y, 2, 2);
      });

      drawWizard(g.wizX, g.lastFire ? now - g.lastFire : null);

      // HUD.
      ctx.textAlign = 'left';
      ctx.font = '12px Menlo, ui-monospace, monospace';
      ctx.fillStyle = '#c9bcff';
      ctx.fillText(`zapped ${g.zapped}`, 10, 20);
      ctx.textAlign = 'right';
      ctx.fillStyle = g.escaped > 0 ? '#ff8a80' : '#9be8a8';
      ctx.fillText(`escaped ${g.escaped}`, W - 10, 20);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#8f87a8';
      ctx.fillText(`${(left / 1000).toFixed(1)}s`, W / 2, 20);

      if (left <= 0) {
        g.over = true;
        setResult({ zapped: g.zapped, escaped: g.escaped });
        return;
      }
      g.raf = requestAnimationFrame(loop);
    };

    g.raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(g.raf);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mousedown', fire);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [fire, onClose, playAgain, round]);

  // Pick a line for the tier the round landed in, so two identical scores
  // don't read the same. useMemo keeps it from re-rolling on every render.
  const verdict = useMemo(() => {
    if (!result) return null;
    const { zapped, escaped } = result;
    const tier = VERDICTS.find((t) => t.when(zapped, escaped));
    return tier.lines[Math.floor(Math.random() * tier.lines.length)];
  }, [result]);

  return (
    <div className={styles.overlay} role="dialog" aria-label="Wizard vs parse errors">
      <div className={styles.panel} ref={wrapRef} tabIndex={-1}>
        <div className={styles.header}>
          <span className={styles.title}>dbt Wizard vs your parse errors</span>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close game"
          >
            ✕
          </button>
        </div>

        <div className={styles.stage}>
          <canvas
            ref={canvasRef}
            className={styles.canvas}
            style={{ width: `${W}px`, height: `${H}px` }}
          />
          {result && (
            <div className={styles.result}>
              <p className={styles.resultScore}>
                {result.zapped} zapped · {result.escaped} escaped
              </p>
              <p className={styles.resultVerdict}>{verdict}</p>
              <div className={styles.resultActions}>
                <button type="button" className={styles.again} onClick={playAgain} autoFocus>
                  Run it again
                </button>
                <button type="button" className={styles.backToDocs} onClick={onClose}>
                  Back to the docs
                </button>
              </div>
            </div>
          )}
        </div>

        <p className={styles.hint}>
          Move with your mouse or ←→ · cast with a click or space · space to run it again · Esc to
          quit
        </p>
      </div>
    </div>
  );
};

export default SpellShooter;
