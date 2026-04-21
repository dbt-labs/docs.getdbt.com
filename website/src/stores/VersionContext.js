import React, { useState, useEffect, createContext, useCallback, useRef } from "react"
import { products, versions } from '../../dbt-versions'
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

// Resolve a subProduct name from a version string (backward compat for ?version= URLs)
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
    const sp = product.subProducts.find((s) => !s.isBeta);
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
  isPrerelease: defaultSubProduct?.isBeta || false,
  customDisplay: defaultSubProductName,
  latestStableRelease: defaultSubProduct?.version,
  updateVersion: () => Object,
})

export const VersionContextProvider = ({ value = "", children }) => {

  const [subProductName, setSubProductName] = useState(value)
  const location = useLocation()
  const pendingSubProductRef = useRef(null)

  // Helper to update URL with subProduct parameter
  const updateUrlSubProduct = useCallback((newSubProductName) => {
    const url = new URL(window.location.href)
    url.searchParams.set('subProduct', newSubProductName)
    // Keep version in URL for backward compatibility with external links
    const sp = findSubProduct(newSubProductName);
    if (sp?.version) {
      url.searchParams.set('version', sp.version)
    }
    window.history.replaceState({}, '', url.toString())
  }, [])

  // Resolve a subProduct name from URL search params
  const resolveSubProductFromSearch = useCallback((search) => {
    const storageSubProduct = window.localStorage.getItem('dbtSubProduct')
    const urlParams = new URLSearchParams(search);

    // Try new subProduct param first
    const rawSubProductParam = urlParams.get('subProduct')
    const subProductParam = rawSubProductParam ? sanitizeHtml(rawSubProductParam) : null
    if (subProductParam && findSubProduct(subProductParam)) {
      return subProductParam
    }

    // Fall back to legacy version param
    const rawVersionParam = urlParams.get('version')
    const versionParam = rawVersionParam ? sanitizeHtml(rawVersionParam) : null
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
    updateUrlSubProduct(resolved)
  }, [resolveSubProductFromSearch, updateUrlSubProduct])

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
      updateUrlSubProduct(resolved)
    }
  }, [location.search, resolveSubProductFromSearch, updateUrlSubProduct])

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
        updateUrlSubProduct(resolved)
      }
    }
  }, [location.pathname, updateUrlSubProduct])

  // Called when user clicks a version menu item (reads data-dbt-subproduct attribute)
  const updateVersion = (e) => {
    if (!e.target) return
    const newSubProductName = e.target?.dataset?.dbtSubproduct
    if (newSubProductName && findSubProduct(newSubProductName)) {
      setSubProductName(newSubProductName)
      window.localStorage.setItem('dbtSubProduct', newSubProductName)
      updateUrlSubProduct(newSubProductName)
    }
  }

  // Derive all context values from current subProductName
  const currentSubProduct = findSubProduct(subProductName)
  const currentProductName = findProductForSubProduct(subProductName)
  const latestStableRelease = versions.find((ver) => !ver?.isPrerelease)

  const context = {
    version: currentSubProduct?.version || defaultSubProduct?.version,
    subProduct: subProductName,
    product: currentProductName,
    EOLDate: currentSubProduct?.EOLDate,
    isPrerelease: currentSubProduct?.isBeta || false,
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
