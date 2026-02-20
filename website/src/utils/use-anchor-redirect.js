import { useEffect } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';
import { findAnchorRedirect } from './anchor-redirects';

/**
 * Hook to handle client-side anchor redirects
 * 
 * This runs on every page load/navigation and checks if the current URL
 * (including hash) matches any anchor redirects. If so, it performs a
 * client-side redirect.
 */
export function useAnchorRedirect() {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const { pathname, hash, search } = location;
    
    // Check if there's a redirect for this path + hash combination
    const destination = findAnchorRedirect(pathname, hash);
    
    if (destination) {
      // Parse the destination to handle both relative and absolute URLs
      let newPath = destination;
      let newHash = '';
      
      // Split destination into path and hash
      const hashIndex = destination.indexOf('#');
      if (hashIndex !== -1) {
        newPath = destination.substring(0, hashIndex);
        newHash = destination.substring(hashIndex);
      }
      
      // If the path is empty, keep the current path (same-page anchor redirect)
      if (!newPath) {
        newPath = pathname;
      }
      
      // Perform the redirect
      // Use replace to avoid adding to history (like a server redirect)
      history.replace({
        pathname: newPath,
        search: search,
        hash: newHash,
      });
    }
  }, [location.pathname, location.hash, history]);
}

