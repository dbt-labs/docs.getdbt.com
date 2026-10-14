import React, { useEffect, useState } from 'react';
import styles from './playInvite.module.css';

/*
 * PlayInvite — a small 80s-arcade cabinet that slides into the corner once
 * you've clicked the wizard enough times. It never takes over the page: the
 * game only starts if you press PLAY, and the invite dismisses itself if you
 * ignore it, so a reader who's here for the docs is left alone.
 */

// How long the invite waits around before quietly leaving.
const LINGER_MS = 14000;

// `onDismiss` is an explicit "not now"; `onExpire` is the invite quietly
// timing out. The caller treats them differently, so keep them separate.
const PlayInvite = ({ onPlay, onDismiss, onExpire = onDismiss }) => {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setLeaving(true);
      setTimeout(onExpire, 400);
    }, LINGER_MS);
    return () => clearTimeout(t);
  }, [onExpire]);

  return (
    <aside
      className={`${styles.cabinet} ${leaving ? styles.leaving : ''}`}
      aria-label="Hidden game"
    >
      <div className={styles.marquee}>
        <span className={styles.marqueeText}>★ dbt Wizard ★</span>
      </div>

      <p className={styles.tagline}>
        cast the errors
        <br />
        away
      </p>

      <p className={styles.blink}>1 credit · 15 sec</p>

      <div className={styles.buttons}>
        <button type="button" className={styles.play} onClick={onPlay}>
          ▶ Play
        </button>
        <button type="button" className={styles.skip} onClick={onDismiss}>
          Not now
        </button>
      </div>
    </aside>
  );
};

export default PlayInvite;
