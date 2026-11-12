import React, { useEffect, useRef, useState } from 'react';
import areaList from '@site/release-note-areas.json';
import styles from './styles.module.css';

// Release note areas. The list lives in website/release-note-areas.json. Areas
// with a `featured` number there get their own pill, in that order; the other
// areas that appear on the page are listed, in alphabetical order, under the
// "Filters" menu.
const DEFAULT_AREAS = areaList.areas.map((area) => area.name);
const FEATURED_AREAS = areaList.areas
  .filter((area) => area.featured)
  .sort((a, b) => a.featured - b.featured)
  .map((area) => area.name);
const byName = (a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' });
const ALL = 'All';
const ANNOUNCEMENTS = 'Announcements';
const OTHER = 'Other';

// Weekly layout (single-tenant page): other headings that mean the same area.
const AREA_LOOKUP = areaList.areas.reduce((lookup, area) => {
  [area.name, ...(area.st_aliases || [])].forEach((name) => {
    lookup[name.toLowerCase()] = area.name;
  });
  return lookup;
}, {});
const WEEK_HEADING = /^[A-Z][a-z]+ \d{1,2}, \d{4}$/;
const TYPE_HEADINGS = ['new', 'enhancements', 'enhancement', 'fixes', 'fix', 'behavior changes', 'behavior change'];

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

  const all = selected.length === 0;
  entries.forEach(({ el, month: m, section: s, group: g, container }) => {
    if (container) return;
    const show = all || selected.includes(g);
    el.style.display = show ? '' : 'none';
    if (show && !all) {
      if (m) m.visible = true;
      if (s) s.visible = true;
    }
  });
  containers.forEach((c) => {
    c.heading.style.display = all || c.visible ? '' : 'none';
  });

  syncToc(getSiblings(root), selected.length === 1 ? 'H4' : null);
}

// Weekly layout, used by the single-tenant page. Weeks are dated `##` headings,
// the note types (New, Enhancements, Fixes, Behavior changes) are `##` headings
// under them, and areas are `###` headings. The page's headings are matched to
// an area by name, ignoring case; anything that doesn't match, and notes that
// aren't under an area heading, go under "Other".
function scanWeekly(root) {
  let week = null;
  let type = null;
  let group = OTHER;
  const containers = [];
  const entries = getSiblings(root).map((el) => {
    const text = /^H[23]$/.test(el.tagName) ? headingText(el) : '';
    if (el.tagName === 'H2' && WEEK_HEADING.test(text)) {
      week = { heading: el, visible: false, kind: 'week' };
      type = null;
      group = OTHER;
      containers.push(week);
      return { container: week };
    }
    if (
      el.tagName === 'H2' ||
      (el.tagName === 'H3' && TYPE_HEADINGS.includes(text.toLowerCase()))
    ) {
      type = { heading: el, visible: false, kind: 'type' };
      group = OTHER;
      containers.push(type);
      return { container: type };
    }
    if (el.tagName === 'H3') group = AREA_LOOKUP[text.toLowerCase()] || OTHER;
    return { el, week, type, group };
  });
  return { entries, containers };
}

function applyWeeklyFilter(root, selected) {
  const { entries, containers } = scanWeekly(root);
  const all = selected.length === 0;
  entries.forEach(({ el, week, type, group, container }) => {
    if (container) return;
    const show = all || !week || selected.includes(group);
    el.style.display = show ? '' : 'none';
    if (show && !all) {
      if (week) week.visible = true;
      if (type) type.visible = true;
    }
  });
  containers.forEach((c) => {
    c.heading.style.display = all || c.visible ? '' : 'none';
  });
  syncToc(getSiblings(root), selected.length === 1 ? 'H3' : null);
}

const findPresentWeeklyAreas = (root, areas) => {
  const found = new Set(
    scanWeekly(root)
      .entries.filter((entry) => entry.week && entry.el && entry.el.tagName !== 'H3')
      .map((entry) => entry.group)
  );
  const present = areas.filter((area) => found.has(area));
  return found.has(OTHER) ? [...present, OTHER] : present;
};

// Mirrors heading visibility in the right-hand table of contents, so the
// sidebar only lists the sections that are currently on screen. When an area
// is selected, its heading would repeat under every month, so the area level
// (`areaTag`) is left out and the list shows the months that have it.
function syncToc(siblings, areaTag) {
  siblings
    .filter((el) => /^H[234]$/.test(el.tagName) && el.id)
    .forEach((el) => {
      const link = document.querySelector(
        `.table-of-contents a[href="#${CSS.escape(el.id)}"]`
      );
      const item = link && link.closest('li');
      const hide = el.style.display === 'none' || el.tagName === areaTag;
      if (item) item.style.display = hide ? 'none' : '';
    });
}

const findPresentAreas = (root, areas) => {
  const siblings = getSiblings(root);
  const found = new Set(siblings.filter((el) => el.tagName === 'H4').map(headingText));
  if (siblings.some(isAnnouncement)) found.add(ANNOUNCEMENTS);
  return areas.filter((area) => found.has(area));
};

export default function ReleaseNotesFilter({
  areas = DEFAULT_AREAS,
  featured = FEATURED_AREAS,
  layout = 'monthly',
}) {
  const weekly = layout === 'weekly';
  const apply = (root, selection) =>
    weekly ? applyWeeklyFilter(root, selection) : applyFilter(root, areas, selection);
  const rootRef = useRef(null);
  // The selected area, as a list of one. Empty means "All".
  const [selected, setSelected] = useState([]);
  const [present, setPresent] = useState([]);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);

  // Close the Filters menu on an outside click or Escape.
  useEffect(() => {
    if (!moreOpen) return undefined;
    const onDown = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) setMoreOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setMoreOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [moreOpen]);

  // Marks the page body so the CSS module can style the headings. On the weekly
  // page the note types (New, Enhancements, and so on) share a heading level
  // with the dates, so they are tagged to be styled as sub-headings.
  useEffect(() => {
    const root = rootRef.current;
    const page = root && root.parentElement;
    if (!page) return undefined;
    const pageClass = weekly ? 'rn-weekly' : 'rn-page';
    page.classList.add(pageClass);
    const typeHeadings = weekly
      ? scanWeekly(root)
          .containers.filter((container) => container.kind === 'type')
          .map((container) => container.heading)
      : [];
    typeHeadings.forEach((heading) => heading.classList.add('rn-type'));
    return () => {
      page.classList.remove(pageClass);
      typeHeadings.forEach((heading) => heading.classList.remove('rn-type'));
    };
  }, [weekly]);

  useEffect(() => {
    if (!rootRef.current) return;
    setPresent(
      weekly
        ? findPresentWeeklyAreas(rootRef.current, areas)
        : findPresentAreas(rootRef.current, areas)
    );
  }, [areas, weekly]);

  useEffect(() => {
    if (rootRef.current) apply(rootRef.current, selected);
  }, [selected, areas, weekly]);

  useEffect(() => {
    const root = rootRef.current;
    return () => root && apply(root, []);
  }, [areas, weekly]);

  // One area at a time. "All" clears the selection.
  const pick = (name) => {
    setSelected(name === ALL ? [] : [name]);
    setMoreOpen(false);
  };
  const isOn = (name) => (name === ALL ? selected.length === 0 : selected.includes(name));

  // Pills for the featured areas, then one menu with the rest. "Other" (the
  // single-tenant catch-all) stays last in the menu.
  const pillAreas = featured.filter((area) => present.includes(area));
  const rest = present.filter((area) => !pillAreas.includes(area));
  const menuAreas = [
    ...rest.filter((area) => area !== OTHER).sort(byName),
    ...rest.filter((area) => area === OTHER),
  ];
  const menuSelected = selected.filter((area) => !pillAreas.includes(area));
  const menuActive = menuSelected.length > 0;

  const pill = (name) => (
    <button
      key={name}
      type="button"
      className={`${styles.pill} ${isOn(name) ? styles.active : ''}`}
      aria-pressed={isOn(name)}
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
      {[ALL, ...pillAreas].map(pill)}
      {menuAreas.length > 0 && (
        <div className={styles.more} ref={moreRef}>
          <button
            type="button"
            className={`${styles.pill} ${menuActive ? styles.active : ''}`}
            aria-haspopup="true"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen(!moreOpen)}
          >
            {menuActive ? menuSelected[0] : 'Filters'} ▾
          </button>
          {moreOpen && (
            <div className={styles.menu} role="menu">
              {menuAreas.map((name) => (
                <button
                  key={name}
                  type="button"
                  role="menuitem"
                  className={`${styles.menuItem} ${isOn(name) ? styles.menuItemActive : ''}`}
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
