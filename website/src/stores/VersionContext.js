import React, { useState, createContext } from "react"
import versionsArray from '../../dbt-versions.json'

const lastReleasedVersion = versionsArray[0];

const VersionContext = createContext({
  version: lastReleasedVersion,
  updateVersion: () => {},
})

export const VersionContextProvider = ({ children }) => {

  const [version, setVersion] = useState(lastReleasedVersion)
  console.log('lastReleasedVersion', lastReleasedVersion)

  const updateVersion = (e) => {
    if(!e.target)
      return
    
    const versionValue = e.target.text.replace('v', '')
    console.log('SELECTED VERSION VALUE', versionValue)
    setVersion(versionValue)
  }

  const context = {
    version, 
    updateVersion
  }

  return (
    <VersionContext.Provider value={context}>
      { children }
    </VersionContext.Provider>
  )
}

export default VersionContext
