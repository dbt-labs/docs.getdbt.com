import React, { useEffect, useRef, useState } from 'react';
import areaList from '@site/release-note-areas.json';
import styles from './styles.module.css';

// Release note areas, in pill order. The list lives in
// website/release-note-areas.json. Only areas that appear on the page get a
// pill; the first `inline` pills show in the row and the rest go under "More".
const DEFAULT_AREAS = areaList.areas.map((area) => area.name);
const ALL = 'All';
const ANNOUNCEMENTS = 'Announcements';

const headingText = (el) => el.textContent.replace(/[#\u200b]/g, '').trim();
const isAnnouncement = (el) => el.tagName === 'H3' && /announcements/i.test(headingText(el));

const getSiblings = (root) => {
  const siblings = [];
  for (let el = root.nextElementSibling; el; el = el.nextElementSibling) {
    siblings.push(el);
  }
  return siblings;
};

// Hides everything outside the selected area. Months are `##` headings and
// areas are `####` headings under them. A `###` heading is either an event
// announcement section (shown under the Announcements pill, with everything in
// it) or a plain section that can hold its own `####` areas. Month and section
// headings only stay visible when at least one entry under them does. Entries
// that aren't under an area only show under "All".
function applyFilter(root, areas, selected) {
  let group = null;
  let month = null;
  let section = null;
  let locked = false;
  const containers = [];
  const entries = getSiblings(root).map((el) => {
    if (el.tagName === 'H2') {
      month = { heading: el, visible: false };
      section = null;
      group = null;
      locked = false;
      containers.push(month);
      return { container: month };
    }
    if (el.tagName === 'H3') {
      if (isAnnouncement(el)) {
        group = ANNOUNCEMENTS;
        section = null;
        locked = true;
      } else {
        section = { heading: el, visible: false };
        group = null;
        locked = false;
        containers.push(section);
        return { container: section };
      }
    } else if (el.tagName === 'H4' && !locked) {
      const text = headingText(el);
      group = areas.includes(text) ? text : 'other';
    }
    return { el, month, section, group };
  });

  entries.forEach(({ el, month: m, section: s, group: g, container }) => {
    if (container) return;
    const show = selected === ALL || g === selected;
    el.style.display = show ? '' : 'none';
    if (show && selected !== ALL) {
      if (m) m.visible = true;
      if (s) s.visible = true;
    }
  });
  containers.forEach((c) => {
    c.heading.style.display = selected === ALL || c.visible ? '' : 'none';
  });

  syncToc(getSiblings(root));
}

// Mirrors heading visibility in the right-hand table of contents, so the
// sidebar only lists the sections that are currently on screen.
function syncToc(siblings) {
  siblings
    .filter((el) => /^H[234]$/.test(el.tagName) && el.id)
    .forEach((el) => {
      const link = document.querySelector(
        `.table-of-contents a[href="#${CSS.escape(el.id)}"]`
      );
      const item = link && link.closest('li');
      if (item) item.style.display = el.style.display === 'none' ? 'none' : '';
    });
}

const findPresentAreas = (root, areas) => {
  const siblings = getSiblings(root);
  const found = new Set(siblings.filter((el) => el.tagName === 'H4').map(headingText));
  if (siblings.some(isAnnouncement)) found.add(ANNOUNCEMENTS);
  return areas.filter((area) => found.has(area));
};

export default function ReleaseNotesFilter({ areas = DEFAULT_AREAS, inline = 7 }) {
  const rootRef = useRef(null);
  const [selected, setSelected] = useState(ALL);
  const [present, setPresent] = useState([]);
  const [moreOpen, setMoreOpen] = useState(false);

  // Marks the page body so the CSS module can style the area headings.
  useEffect(() => {
    const page = rootRef.current && rootRef.current.parentElement;
    if (!page) return undefined;
    page.classList.add('rn-page');
    return () => page.classList.remove('rn-page');
  }, []);

  useEffect(() => {
    if (rootRef.current) setPresent(findPresentAreas(rootRef.current, areas));
  }, [areas]);

  useEffect(() => {
    if (rootRef.current) applyFilter(rootRef.current, areas, selected);
  }, [selected, areas]);

  useEffect(() => {
    const root = rootRef.current;
    return () => root && applyFilter(root, areas, ALL);
  }, [areas]);

  const pick = (name) => {
    setSelected(name);
    setMoreOpen(false);
  };

  const inlineAreas = present.slice(0, inline);
  const moreAreas = present.slice(inline);
  const moreActive = moreAreas.includes(selected);

  const pill = (name) => (
    <button
      key={name}
      type="button"
      className={`${styles.pill} ${selected === name ? styles.active : ''}`}
      aria-pressed={selected === name}
      onClick={() => pick(name)}
    >
      {name}
    </button>
  );

  // data-md-hide keeps the filter out of the markdown that agents get; the
  // filtering itself only runs in the browser, so all entries stay in the HTML.
  return (
    <div
      className={styles.filter}
      ref={rootRef}
      role="group"
      aria-label="Filter release notes by area"
      data-md-hide="true"
    >
      {[ALL, ...inlineAreas].map(pill)}
      {moreAreas.length > 0 && (
        <div className={styles.more}>
          <button
            type="button"
            className={`${styles.pill} ${moreActive ? styles.active : ''}`}
            aria-haspopup="true"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen(!moreOpen)}
          >
            {moreActive ? selected : 'More'} ▾
          </button>
          {moreOpen && (
            <div className={styles.menu} role="menu">
              {moreAreas.map((name) => (
                <button
                  key={name}
                  type="button"
                  role="menuitem"
                  className={`${styles.menuItem} ${selected === name ? styles.menuItemActive : ''}`}
                  onClick={() => pick(name)}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
