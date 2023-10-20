import React, { useState, useEffect, createContext } from "react"
import { versions } from '../../dbt-versions'

const lastReleasedVersion = versions && versions.find(ver => ver.version && ver.version != "" && !ver.isPrerelease);

const VersionContext = createContext({
  version: lastReleasedVersion.version,
  EOLDate: lastReleasedVersion.EOLDate || undefined, 
  isPrerelease: lastReleasedVersion.isPrerelease || false,
  latestStableRelease: lastReleasedVersion.version,
  updateVersion: () => Object,
})

export const VersionContextProvider = ({ value = "", children }) => {

  const [version, setVersion] = useState(value)

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
      
    const vRegex = /(?:v)?(\d+(\.\d+)*)/ // Regex that will parse out the version number, even if there is/isn't a 'v' in front of version number and a '(Beta)' afterwards.
    const versionValue = e.target.text.match(vRegex)[1]

    versionValue &&
      setVersion(versionValue)
      window.localStorage.setItem('dbtVersion', versionValue)
  }

  let context = {
    version, 
    updateVersion
  }

  // Determine isPrerelease status + End of Life date for current version
  const currentVersion = versions.find(ver => ver.version === version)
  if(currentVersion)
    context.EOLDate = currentVersion.EOLDate
    context.isPrerelease = currentVersion?.isPrerelease
  
  // Get latest stable release
  const latestStableRelease = versions.find(ver => !ver?.isPrerelease)
    context.latestStableRelease = latestStableRelease.version

  return (
    <VersionContext.Provider value={context}>
      { children }
    </VersionContext.Provider>
  )
}

export default VersionContext
