import React, { createContext, useContext, useState, useCallback } from 'react';

/*
 * PageBannerContext lets an individual page override the global announcement
 * bar (configured via themeConfig.announcementBar) with a page-specific banner.
 *
 * A doc page publishes its `banner` frontmatter into this context (see
 * DocItem/Content), and the swizzled AnnouncementBar reads it to render the
 * page banner in place of the global one.
 */
const PageBannerContext = createContext(null);

export function PageBannerProvider({ children }) {
  const [banner, setBannerState] = useState(null);

  // Normalize falsy values to null so consumers only check for truthiness
  const setBanner = useCallback((nextBanner) => {
    setBannerState(nextBanner || null);
  }, []);

  return (
    <PageBannerContext.Provider value={{ banner, setBanner }}>
      {children}
    </PageBannerContext.Provider>
  );
}

// Read the current page banner (or null when no page sets one)
export function usePageBanner() {
  const ctx = useContext(PageBannerContext);
  return ctx ? ctx.banner : null;
}

// No-op fallback for when the provider is absent (e.g. non-doc routes)
const noop = () => undefined;

// Setter used by a page to publish/clear its banner
export function useSetPageBanner() {
  const ctx = useContext(PageBannerContext);
  return ctx ? ctx.setBanner : noop;
}
