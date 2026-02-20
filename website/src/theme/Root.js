import React from 'react'
import { VersionContextProvider } from '../stores/VersionContext'
import { useAnchorRedirect } from '../utils/use-anchor-redirect'

/**
 * Inner component that uses the anchor redirect hook
 * This is separate from Root to ensure hooks work correctly
 */
function AnchorRedirectHandler({ children }) {
  useAnchorRedirect();
  return children;
}

// Default implementation, that you can customize
function Root({children}) {
  return (
    <VersionContextProvider>
      <AnchorRedirectHandler>
        {children}
      </AnchorRedirectHandler>
    </VersionContextProvider>
  )
}

export default Root
