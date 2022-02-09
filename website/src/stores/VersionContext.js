import React, { useState, useEffect, createContext } from "react"
import { versions } from '../../dbt-versions.json'

const lastReleasedVersion = versions[0];

const VersionContext = createContext({
  version: lastReleasedVersion,
  updateVersion: () => {},
})

export const VersionContextProvider = ({ children }) => {

  const [version, setVersion] = useState('')

  useEffect(() => {
    const storageVersion = window.localStorage.getItem('dbtVersion')
    const { search } = window.location
    const urlParams = new URLSearchParams(search);
    const versionParam = urlParams.get('version')

    if(versionParam && versions.includes(versionParam)) {
      {/* 
        * Check if version param exists in url,
        * and is in current versions array
        * If true, set version to param value
      */}
      setVersion(versionParam)
      window.localStorage.setItem('dbtVersion', versionParam)
    } else {
      {/*
        * If localStorage version exists, set version to LS value
        * Otherwise set version to latest version 
      */}
      storageVersion
        ? setVersion(storageVersion)
        : setVersion(lastReleasedVersion)
    }
  }, [])

  const updateVersion = (e) => {
    if(!e.target)
      return
    
    const versionValue = e.target.text.replace('v', '')
    versionValue &&
      setVersion(versionValue)
      window.localStorage.setItem('dbtVersion', versionValue)
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
