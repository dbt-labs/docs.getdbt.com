import React from 'react'
import { VersionContextProvider } from '../stores/VersionContext'

// Default implementation, that you can customize
function Root({children}) {
  return (
    <VersionContextProvider>
      {children}
    </VersionContextProvider>
  )
}

export default Root
