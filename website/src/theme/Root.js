import React from 'react'
import { VersionContextProvider } from '../stores/VersionContext'
import { useVersionUrlSync } from '../utils/useVersionUrlSync'
import { OptimizelyInitializer } from '../components/OptimizelyInitializer'

/**
 * Inner component that syncs version to URL on route changes.
 * Must be inside VersionContextProvider to access the version context.
 */
function VersionUrlSyncHandler({ children }) {
  useVersionUrlSync();
  return children;
}

// Default implementation, that you can customize
function Root({children}) {
  return (
    <VersionContextProvider>
      <OptimizelyInitializer />
      <VersionUrlSyncHandler>
        {children}
      </VersionUrlSyncHandler>
    </VersionContextProvider>
  )
}

export default Root
