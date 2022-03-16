import React, { useState, useEffect, useContext } from 'react'
import VersionContext from '../../stores/VersionContext';

export default function VersionBlock({ firstVersion = 0, lastVersion = undefined, children }) {
  const { version } = useContext(VersionContext)

  const [loading, setLoading] = useState(true)

  // Hide versionBlock components until version ready
  useEffect(() => {
    console.log('setting loading false')
    version && setLoading(false)
  }, [version])

  // Only check version if current version set
  if(version) {
    const currentVersionVal = parseFloat(version)
    const firstVersionVal = parseFloat(firstVersion)
    {/* 
      * If last version set, check if current version greater than last version
      * Or if current version less than first version
      * If either is true, hide block
      * Else, if current version less than first version, hide block
    */}
    if(lastVersion) {
      if((currentVersionVal > parseFloat(lastVersion)) 
      || (currentVersionVal < firstVersionVal))
        return null
    } else {
      console.log('made it here', currentVersionVal, firstVersionVal)
      if(currentVersionVal < firstVersionVal) {
        console.log('made it to if')
        return null
      }
      
    }
  }

  console.log('render data', loading)
  return loading
    ?  null
    : <div>{children}</div>
}
