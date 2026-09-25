/**
 * Suppress CSS transitions while the browser window is actively being resized.
 *
 * Without this, dragging the window edge makes Chrome replay the navbar and
 * dropdown-menu transitions (transform/opacity), so the bar and any open menu
 * visibly "dip" and flicker mid-drag. We add `is-resizing` to <html> on the
 * first resize event and remove it shortly after resizing stops; the paired
 * rule in custom.css turns transitions off only for that window.
 */
if (typeof window !== 'undefined') {
  let timer = null;

  window.addEventListener(
    'resize',
    () => {
      const root = document.documentElement;
      if (timer === null) {
        root.classList.add('is-resizing');
      } else {
        clearTimeout(timer);
      }
      timer = window.setTimeout(() => {
        root.classList.remove('is-resizing');
        timer = null;
      }, 200);
    },
    { passive: true },
  );
}
