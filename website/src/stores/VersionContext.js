import React, { useState, useEffect, createContext } from "react"
import { versions } from '../../dbt-versions'
import sanitizeHtml from "sanitize-html";

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

  // Helper to update URL with version parameter
  const updateUrlVersion = (newVersion) => {
    const url = new URL(window.location.href)
    url.searchParams.set('version', newVersion)
    window.history.replaceState({}, '', url.toString())
  }

  useEffect(() => {
    const storageVersion = window.localStorage.getItem('dbtVersion')
    const { search } = window.location
    const urlParams = new URLSearchParams(search);
    const originalVersionParam = urlParams.get('version')

    // Sanitize version param
    const versionParam = sanitizeHtml(originalVersionParam);

    let resolvedVersion;

    // Check for exact version match first
    if(versionParam && versions.find(ver => ver?.version && ver.version === versionParam)) {
      {/* 
        * Check if version param exists in url,
        * and is in current versions array
        * If true, set version to param value
      */}
      resolvedVersion = versionParam
    } else if (versionParam && /^\d+$/.test(versionParam)) {
      {/*
        * Check if version param is a major version only (e.g., "1" or "2")
        * If so, resolve to the latest minor version within that major
      */}
      const latestForMajor = getLatestVersionForMajor(versionParam);
      if (latestForMajor) {
        resolvedVersion = latestForMajor
      } else {
        // Major version not found, fall back to default behavior
        resolvedVersion = lastReleasedVersion.version
      }
    } else {
      {/*
        * If localStorage version exists, set version to LS value
        * Otherwise set version to latest version 
      */}
      if(storageVersion && versions.find(ver => ver?.version && ver.version === storageVersion)) {
        resolvedVersion = storageVersion
      } else {
        resolvedVersion = lastReleasedVersion.version
      }
    }

    // Set version state and localStorage
    setVersion(resolvedVersion)
    window.localStorage.setItem('dbtVersion', resolvedVersion)
    
    // Always update URL to reflect current version
    updateUrlVersion(resolvedVersion)
  }, [])

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
