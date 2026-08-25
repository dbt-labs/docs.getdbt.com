import React, { useState, useEffect, createContext, useCallback, useRef } from "react"
import { products, versions, isPrerelease } from '../../dbt-versions'
import sanitizeHtml from "sanitize-html";
import { useLocation } from '@docusaurus/router';

// Find a subProduct object by name across all products
function findSubProduct(name) {
  for (const product of products) {
    const sp = product.subProducts.find((s) => s.name === name);
    if (sp) return sp;
  }
  return null;
}

// Find the product name that owns a given subProduct name
function findProductForSubProduct(subProductName) {
  for (const product of products) {
    if (product.subProducts.find((s) => s.name === subProductName)) {
      return product.name;
    }
  }
  return null;
}

// Resolve a subProduct name from a version string (?version= URLs)
function resolveSubProductFromVersion(versionString) {
  for (const product of products) {
    const sp = product.subProducts.find((s) => s.version === versionString);
    if (sp) return sp.name;
  }
  return null;
}

// Default subProduct: first non-beta subProduct across all products
function getDefaultSubProductName() {
  for (const product of products) {
    const sp = product.subProducts.find((s) => !isPrerelease(s));
    if (sp) return sp.name;
  }
  return products[0]?.subProducts[0]?.name;
}

const defaultSubProductName = getDefaultSubProductName();
const defaultSubProduct = findSubProduct(defaultSubProductName);

const VersionContext = createContext({
  version: defaultSubProduct?.version,
  subProduct: defaultSubProductName,
  product: findProductForSubProduct(defaultSubProductName),
  EOLDate: defaultSubProduct?.EOLDate,
  isPrerelease: isPrerelease(defaultSubProduct),
  customDisplay: defaultSubProductName,
  latestStableRelease: defaultSubProduct?.version,
  updateVersion: () => Object,
})

export const VersionContextProvider = ({ value = "", children }) => {

  const [subProductName, setSubProductName] = useState(value)
  const location = useLocation()
  const pendingSubProductRef = useRef(null)

  // Helper to update URL with the version parameter
  const updateUrlParams = useCallback((newSubProductName) => {
    const url = new URL(window.location.href)
    const sp = findSubProduct(newSubProductName);

    // Strip legacy params that are no longer written to the URL
    url.searchParams.delete('subProduct')
    url.searchParams.delete('name')

    if (sp?.version) {
      // Group-level selections (e.g. "v1") use major version in URL (?version=1)
      // Specific selections (e.g. "dbt Core v1.12") use full version (?version=1.12)
      const productName = findProductForSubProduct(newSubProductName);
      const urlVersion = newSubProductName === productName
        ? sp.version.split('.')[0]
        : sp.version;
      url.searchParams.set('version', urlVersion)
    } else {
      url.searchParams.delete('version')
    }

    window.history.replaceState({}, '', url.toString())
  }, [])

  // Resolve a subProduct name from URL search params
  const resolveSubProductFromSearch = useCallback((search) => {
    const storageSubProduct = window.localStorage.getItem('dbtSubProduct')
    const urlParams = new URLSearchParams(search);

    const rawVersionParam = urlParams.get('version')
    const versionParam = rawVersionParam ? sanitizeHtml(rawVersionParam) : null

    // Legacy subProduct param (still read for backward compat)
    const rawSubProductParam = urlParams.get('subProduct')
    const subProductParam = rawSubProductParam ? sanitizeHtml(rawSubProductParam) : null
    if (subProductParam && findSubProduct(subProductParam)) {
      return subProductParam
    }

    // Resolve from the version param
    if (versionParam) {
      // Exact version match
      const fromVersion = resolveSubProductFromVersion(versionParam)
      if (fromVersion) return fromVersion

      // Major version shortcut (e.g., "1" or "2")
      if (/^\d+$/.test(versionParam)) {
        const matchingVersion = versions.find((ver) => ver.version.startsWith(versionParam + '.'))
        if (matchingVersion) {
          const fromMajor = resolveSubProductFromVersion(matchingVersion.version)
          if (fromMajor) return fromMajor
        }
      }
    }

    // Check localStorage (new key)
    if (storageSubProduct && findSubProduct(storageSubProduct)) {
      return storageSubProduct
    }

    // Check legacy localStorage version key
    const storageVersion = window.localStorage.getItem('dbtVersion')
    if (storageVersion) {
      const fromStoredVersion = resolveSubProductFromVersion(storageVersion)
      if (fromStoredVersion) return fromStoredVersion
    }

    return defaultSubProductName
  }, [])

  // Sync subProduct from current URL
  const syncSubProductFromUrl = useCallback(() => {
    const resolved = resolveSubProductFromSearch(window.location.search)
    setSubProductName(resolved)
    window.localStorage.setItem('dbtSubProduct', resolved)
    updateUrlParams(resolved)
  }, [resolveSubProductFromSearch, updateUrlParams])

  // Initial sync on mount
  useEffect(() => {
    syncSubProductFromUrl()
  }, [syncSubProductFromUrl])

  // Listen for route changes via Docusaurus router
  useEffect(() => {
    if (location.search.includes('subProduct=') || location.search.includes('version=')) {
      const resolved = resolveSubProductFromSearch(location.search)
      setSubProductName(resolved)
      window.localStorage.setItem('dbtSubProduct', resolved)
      updateUrlParams(resolved)
    }
  }, [location.search, resolveSubProductFromSearch, updateUrlParams])

  // Capture version from link hrefs before navigation
  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href) return

      if (href.includes('subProduct=') || href.includes('version=')) {
        try {
          const url = new URL(href, window.location.origin)
          const subProductFromLink = url.searchParams.get('subProduct')
          const versionFromLink = url.searchParams.get('version')
          if (subProductFromLink) {
            pendingSubProductRef.current = { type: 'subProduct', value: subProductFromLink }
          } else if (versionFromLink) {
            pendingSubProductRef.current = { type: 'version', value: versionFromLink }
          }
        } catch (e) {
          // Invalid URL, ignore
        }
      }
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  // Process pending subProduct after navigation completes
  useEffect(() => {
    if (pendingSubProductRef.current) {
      const pending = pendingSubProductRef.current
      pendingSubProductRef.current = null

      let resolved;
      if (pending.type === 'subProduct') {
        const sanitized = sanitizeHtml(pending.value)
        if (findSubProduct(sanitized)) resolved = sanitized
      } else if (pending.type === 'version') {
        const sanitized = sanitizeHtml(pending.value)
        if (/^\d+$/.test(sanitized)) {
          const matchingVersion = versions.find((ver) => ver.version.startsWith(sanitized + '.'))
          if (matchingVersion) resolved = resolveSubProductFromVersion(matchingVersion.version)
        } else {
          resolved = resolveSubProductFromVersion(sanitized)
        }
      }

      if (resolved) {
        setSubProductName(resolved)
        window.localStorage.setItem('dbtSubProduct', resolved)
        updateUrlParams(resolved)
      }
    }
  }, [location.pathname, updateUrlParams])

  // Called when user clicks a version menu item (reads data-dbt-subproduct attribute)
  const updateVersion = (e) => {
    if (!e.target) return
    const newSubProductName = e.target?.dataset?.dbtSubproduct
    if (newSubProductName && findSubProduct(newSubProductName)) {
      setSubProductName(newSubProductName)
      window.localStorage.setItem('dbtSubProduct', newSubProductName)
      updateUrlParams(newSubProductName)
    }
  }

  // Derive all context values from current subProductName
  const currentSubProduct = findSubProduct(subProductName)
  const currentProductName = findProductForSubProduct(subProductName)
  const latestStableRelease = versions.find((ver) => !ver?.isPrerelease)

  const fullVersion = currentSubProduct?.version || defaultSubProduct?.version;
  const urlVersion = subProductName === currentProductName
    ? fullVersion?.split('.')[0]
    : fullVersion;

  const context = {
    version: fullVersion,
    urlVersion,
    subProduct: subProductName,
    product: currentProductName,
    EOLDate: currentSubProduct?.EOLDate,
    isPrerelease: isPrerelease(currentSubProduct),
    customDisplay: subProductName,
    latestStableRelease: latestStableRelease?.version,
    updateVersion,
  }

  return (
    <VersionContext.Provider value={context}>
      {children}
    </VersionContext.Provider>
  )
}

export default VersionContext
