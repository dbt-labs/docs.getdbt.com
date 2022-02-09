import React, { useState, useEffect, useContext } from 'react'
import VersionContext from '../../stores/VersionContext';

export default function VersionBlock({ firstVersion, lastVersion = undefined, children }) {
  const { version } = useContext(VersionContext)

  const [loading, setLoading] = useState(true)

  // Hide versionBlock components until version ready
  useEffect(() => {
    version && setLoading(false)
  }, [version])

  // Only check version if current version and first version set
  if(version && firstVersion) {
    const currentVersionVal = parseFloat(version)
    const firstVersionval = parseFloat(firstVersion)
    {/* 
      * If last version set, check if current version greater than last version
      * Or if current version less than first version
      * If either is true, hide block
      * Else, if current version less than first version, hide block
    */}
    if(lastVersion) {
      if((currentVersionVal > parseFloat(lastVersion)) 
      || (currentVersionVal < firstVersionval))
        return null
    } else {
      if(currentVersionVal < firstVersionval)
        return null
    }
  }

  return loading
    ?  null
    : <div>{children}</div>
}
