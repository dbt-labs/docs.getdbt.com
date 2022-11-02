import React, { useEffect } from 'react'
import { VersionContextProvider } from '../stores/VersionContext'

// Default implementation, that you can customize
function Root({children}) {
  useEffect(() => {
    // If not a blog post, update blog context datalayer
    // properties to undefined. This ensures the datalayer
    // properties are updated on every page, and that we avoid
    // pushing blog context to snowplow when viewing a different page.
    if(
      !window.location.pathname.includes('/blog') ||
      window.location.pathname.includes('/blog/tags')
    ) {
      window.dataLayer = window.dataLayer || [];
      dataLayer.push({
        event: 'blogContext',
        blogAuthor: undefined,
        blogCategory: undefined,
        blogDate: undefined
      })
    }
  }, [])
  return (
    <VersionContextProvider>
      {children}
    </VersionContextProvider>
  )
}

export default Root
