import React from 'react'
import { VersionContextProvider } from '../stores/VersionContext'
import { DatadogInitializer } from '../components/DatadogInitializer'

// Default implementation, that you can customize
function Root({children}) {
  return (
    <VersionContextProvider>
      <DatadogInitializer />
      {children}
    </VersionContextProvider>
  )
}

export default Root
