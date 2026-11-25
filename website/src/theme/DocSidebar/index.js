import React, { useEffect } from "react";
import DocSidebar from "@theme-original/DocSidebar";

/* dbt Customizations:
 * Scroll the sidebar to the active page on first load.
 *
 * Docusaurus expands the ancestor categories of the active page but never
 * scrolls the sidebar's scroll container to it, so landing on a deeply nested
 * page (from search, a shared link, or an external referrer) renders the
 * sidebar scrolled to the top with the current page far below the fold.
 * See https://github.com/facebook/docusaurus/issues/7980 and
 * https://github.com/dbt-labs/docs.getdbt.com/issues/9728.
 *
 * This is a wrap swizzle, which upstream marks as safe for DocSidebar. It adds
 * no markup and copies no upstream code, so if Docusaurus restructures the
 * sidebar the effect degrades to a no-op rather than breaking the layout.
 */

/* The desktop sidebar only. The mobile sidebar lives in the navbar's secondary
 * menu, which is already scrolled to the top when opened. */
const SIDEBAR_SELECTOR = ".theme-doc-sidebar-container";

/* Ancestor categories also carry `menu__link--active`, so match on aria-current
 * to get the current page rather than one of its parents. */
const ACTIVE_LINK_SELECTOR = 'a.menu__link[aria-current="page"]';

/*
 * Walk up from the active link to the element that actually scrolls, stopping
 * at `boundary` so we never return an ancestor that would scroll the document.
 */
function findScrollContainer(element, boundary) {
  let node = element.parentElement;
  while (node && boundary.contains(node)) {
    const { overflowY } = window.getComputedStyle(node);
    const scrolls = overflowY === "auto" || overflowY === "scroll";
    if (scrolls && node.scrollHeight > node.clientHeight) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

export default function DocSidebarWrapper(props) {
  useEffect(() => {
    const sidebar = document.querySelector(SIDEBAR_SELECTOR);
    const link = sidebar?.querySelector(ACTIVE_LINK_SELECTOR);
    if (!link) return;

    const container = findScrollContainer(link, sidebar);
    if (!container) return;

    const linkRect = link.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Already in view, so leave the reader's position alone.
    if (
      linkRect.top >= containerRect.top &&
      linkRect.bottom <= containerRect.bottom
    ) {
      return;
    }

    /* Set scrollTop directly instead of using link.scrollIntoView(), which
     * walks every scrollable ancestor and would also scroll the article.
     *
     * Done synchronously rather than in requestAnimationFrame, which never
     * fires while a tab is hidden — that would skip the scroll entirely for
     * pages opened in a background tab. The DOM is already committed here. */
    const linkOffset = linkRect.top - containerRect.top + container.scrollTop;
    const centered =
      linkOffset - (container.clientHeight - linkRect.height) / 2;
    container.scrollTop = Math.max(0, centered);

    /* Mount-only on purpose: navigating within the site should preserve
     * whatever scroll position the reader left the sidebar in. */
  }, []);

  return <DocSidebar {...props} />;
}
