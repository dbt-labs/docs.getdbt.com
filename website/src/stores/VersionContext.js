import React, { useState, useEffect, createContext } from "react"
import { versions } from '../../dbt-versions'

const lastReleasedVersion = versions[0];

const VersionContext = createContext({
  version: lastReleasedVersion.version,
  EODDate: lastReleasedVersion.EOLDate, 
  latestStableRelease: lastReleasedVersion.version,
  updateVersion: () => {},
})

export const VersionContextProvider = ({ children }) => {

  const [version, setVersion] = useState('')

  useEffect(() => {
    const storageVersion = window.localStorage.getItem('dbtVersion')
    const { search } = window.location
    const urlParams = new URLSearchParams(search);
    const versionParam = urlParams.get('version')

    if(versionParam && versions.find(ver => ver?.version && ver.version === versionParam)) {
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
      if(storageVersion && versions.find(ver => ver?.version && ver.version === storageVersion)) {
        setVersion(storageVersion)
      } else {
        setVersion(lastReleasedVersion.version)
        window.localStorage.setItem('dbtVersion', lastReleasedVersion.version)
      }
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

  let context = {
    version, 
    updateVersion
  }

  // Get End of Life date for current version
  const currentVersion = versions.find(ver => ver.version === version)
  if(currentVersion)
    context.EOLDate = currentVersion.EOLDate
  
  // Get latest stable release
  const latestStableRelease = versions.find(ver => new Date(ver.EOLDate) > new Date())
  if(latestStableRelease?.version)
    context.latestStableRelease = latestStableRelease.version

  return (
    <VersionContext.Provider value={context}>
      { children }
    </VersionContext.Provider>
  )
}

export default VersionContext
