import React, { useState, useEffect, createContext, useCallback, useRef } from "react"
import { versions } from '../../dbt-versions'
import sanitizeHtml from "sanitize-html";
import { useLocation } from '@docusaurus/router';

const lastReleasedVersion = versions && versions.find(ver => ver.version && ver.version != "" && !ver.isPrerelease);

/**
 * Get the latest version for a given major version number
 * e.g., "1" returns "1.12", "2" returns "2.1"
 * @param {string} majorVersion - The major version number (e.g., "1" or "2")
 * @returns {string|null} - The latest full version string or null if not found
 */
function getLatestVersionForMajor(majorVersion) {
  const matchingVersions = versions.filter(ver => 
    ver?.version && ver.version.startsWith(majorVersion + '.')
  );
  // Versions array is ordered newest first, so return the first match
  return matchingVersions.length > 0 ? matchingVersions[0].version : null;
}

const VersionContext = createContext({
  version: lastReleasedVersion.version,
  EOLDate: lastReleasedVersion.EOLDate || undefined, 
  isPrerelease: lastReleasedVersion.isPrerelease || false,
  latestStableRelease: lastReleasedVersion.version,
  updateVersion: () => Object,
})

export const VersionContextProvider = ({ value = "", children }) => {

  const [version, setVersion] = useState(value)
  const location = useLocation()
  const pendingVersionRef = useRef(null)

  // Helper to update URL with version parameter
  const updateUrlVersion = useCallback((newVersion) => {
    const url = new URL(window.location.href)
    url.searchParams.set('version', newVersion)
    window.history.replaceState({}, '', url.toString())
  }, [])

  // Function to resolve version from a URL search string
  const resolveVersionFromSearch = useCallback((search) => {
    const storageVersion = window.localStorage.getItem('dbtVersion')
    const urlParams = new URLSearchParams(search);
    const originalVersionParam = urlParams.get('version')

    // Sanitize version param
    const versionParam = sanitizeHtml(originalVersionParam);

    // Check for exact version match first
    if(versionParam && versions.find(ver => ver?.version && ver.version === versionParam)) {
      return versionParam
    } else if (versionParam && /^\d+$/.test(versionParam)) {
      // Check if version param is a major version only (e.g., "1" or "2")
      const latestForMajor = getLatestVersionForMajor(versionParam);
      if (latestForMajor) {
        return latestForMajor
      }
    }
    
    // Fall back to localStorage or latest version
    if(storageVersion && versions.find(ver => ver?.version && ver.version === storageVersion)) {
      return storageVersion
    }
    return lastReleasedVersion.version
  }, [])

  // Sync version from current URL
  const syncVersionFromUrl = useCallback(() => {
    const resolvedVersion = resolveVersionFromSearch(window.location.search)
    setVersion(resolvedVersion)
    window.localStorage.setItem('dbtVersion', resolvedVersion)
    updateUrlVersion(resolvedVersion)
  }, [resolveVersionFromSearch, updateUrlVersion])

  // Initial sync on mount
  useEffect(() => {
    syncVersionFromUrl()
  }, [syncVersionFromUrl])

  // Listen for route changes via Docusaurus router
  useEffect(() => {
    if (location.search.includes('version=')) {
      const resolvedVersion = resolveVersionFromSearch(location.search)
      setVersion(resolvedVersion)
      window.localStorage.setItem('dbtVersion', resolvedVersion)
      // Update URL to show resolved version (in case of major version shortcut)
      updateUrlVersion(resolvedVersion)
    }
  }, [location.search, resolveVersionFromSearch, updateUrlVersion])

  // Listen for click events on links to capture version before navigation
  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href) return

      // Check if the link has a version parameter
      if (href.includes('version=')) {
        // Extract and store the version from the href for after navigation
        try {
          const url = new URL(href, window.location.origin)
          const versionFromLink = url.searchParams.get('version')
          if (versionFromLink) {
            pendingVersionRef.current = versionFromLink
          }
        } catch (e) {
          // Invalid URL, ignore
        }
      }
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  // Process pending version after navigation completes
  useEffect(() => {
    if (pendingVersionRef.current) {
      const pendingVersion = sanitizeHtml(pendingVersionRef.current)
      pendingVersionRef.current = null
      
      let resolvedVersion;
      // Check for exact match
      if (versions.find(ver => ver?.version && ver.version === pendingVersion)) {
        resolvedVersion = pendingVersion
      } else if (/^\d+$/.test(pendingVersion)) {
        // Major version shortcut
        const latestForMajor = getLatestVersionForMajor(pendingVersion)
        if (latestForMajor) {
          resolvedVersion = latestForMajor
        }
      }
      
      if (resolvedVersion) {
        setVersion(resolvedVersion)
        window.localStorage.setItem('dbtVersion', resolvedVersion)
        updateUrlVersion(resolvedVersion)
      }
    }
  }, [location.pathname, updateUrlVersion])

  const updateVersion = (e) => {
    if(!e.target)
      return

    // Get selected version value from `dbt-version` data attribute
    const versionValue = e.target?.dataset?.dbtVersion
    
    if (versionValue) {
      setVersion(versionValue)
      window.localStorage.setItem('dbtVersion', versionValue)
      updateUrlVersion(versionValue)
    }
  }

  let context = {
    version, 
    updateVersion
  }

  // Determine isPrerelease status + End of Life date for current version
  const currentVersion = versions.find(ver => ver.version === version)
  if(currentVersion) {
    context.EOLDate = currentVersion.EOLDate
    context.isPrerelease = currentVersion?.isPrerelease
    context.customDisplay = currentVersion?.customDisplay;
  }
  
  // Get latest stable release
  const latestStableRelease = versions.find(ver => !ver?.isPrerelease)
    context.latestStableRelease = latestStableRelease.version

  return (
    <VersionContext.Provider value={context}>
      { children }
    </VersionContext.Provider>
  )
}

export default VersionContext
