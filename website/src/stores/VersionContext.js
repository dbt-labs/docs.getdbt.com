import React, { useState, createContext } from "react"
import { versions } from '../../dbt-versions.json'

const lastReleasedVersion = versions[0];

const VersionContext = createContext({
  version: lastReleasedVersion,
  updateVersion: () => {},
})

export const VersionContextProvider = ({ children }) => {

  const [version, setVersion] = useState(lastReleasedVersion)

  const updateVersion = (e) => {
    if(!e.target)
      return
    
    const versionValue = e.target.text.replace('v', '')
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
