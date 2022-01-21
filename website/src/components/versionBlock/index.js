import React from 'react'
import useGlobalData from '@docusaurus/useGlobalData';

export default function Versioning({ excluded_versions, children }) {
  const data = useGlobalData()
  console.log('global data', data)

  const version = window.localStorage.getItem('version')
  console.log('version from component', version)

  console.log('excluded_versions', excluded_versions)
  if(excluded_versions.includes(version))
    return null

  return (
    <div>
      <p>{children}</p>
    </div>
  )
}
