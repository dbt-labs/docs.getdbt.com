import React, { useContext } from 'react'
import VersionContext from '../../stores/VersionContext';

export default function Versioning({ excluded_versions, children }) {
  const { version } = useContext(VersionContext)
  console.log('version from context', version)

  console.log('excluded_versions', excluded_versions)
  if(excluded_versions.includes(version))
    return null

  return (
    <div>{children}</div>
  )
}
