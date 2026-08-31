import { useEffect, useContext } from 'react';
import { useLocation } from '@docusaurus/router';
import VersionContext from '../stores/VersionContext';

/**
 * Hook that syncs the current version to the URL on route changes.
 * This ensures the version parameter persists as users navigate between pages.
 */
export function useVersionUrlSync() {
  const location = useLocation();
  const { urlVersion } = useContext(VersionContext);

  useEffect(() => {
    // Only run on client side and when we have a version
    if (typeof window === 'undefined' || !urlVersion) return;

    const url = new URL(window.location.href);
    const currentVersionParam = url.searchParams.get('version');

    // Only update if the version param is missing or different
    if (currentVersionParam !== urlVersion) {
      url.searchParams.set('version', urlVersion);
      window.history.replaceState({}, '', url.toString());
    }
  }, [location.pathname, urlVersion]);
}

