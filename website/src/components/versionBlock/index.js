import React, { useContext } from 'react'
import VersionContext from '../../stores/VersionContext';

export default function VersionBlock({ firstVersion, lastVersion = undefined, children }) {
  const { version } = useContext(VersionContext)

  if(lastVersion) {
    if(parseFloat(version) > parseFloat(lastVersion))
      return null
  } else {
    if(parseFloat(version) < parseFloat(firstVersion))
      return null
  }

  return (
    <div>{children}</div>
  )
}
