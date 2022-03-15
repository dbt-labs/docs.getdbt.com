import React, { useState, useEffect, useContext } from 'react'
import { dbtVariables } from '../../../dbt-global-variables';
import VersionContext from '../../stores/VersionContext';

export default function Var({ name }) {
  if(!name)
    return null
  
  const [variableName, setVariableName] = useState('')

  const { version } = useContext(VersionContext)

  const currentVariable = dbtVariables[name]
  if(!currentVariable)
    return null

  useEffect(() => {
    if(currentVariable?.versions?.length && version) {
      {/*
        * If versions set for variable
        * show correct variable name for current version
        * 
        * Sort by lowest version first 
        * If this version is greater or equal to the active version
        * Show this variable name
        * If no match is found, show original variable name
        * 
      */}
      const thisVersionVariable = currentVariable.versions
        .sort((item1, item2) => (parseFloat(item1.version) > parseFloat(item2.version)) ? 1 : -1)
        .find(varVersion => 
          parseFloat(varVersion.version) >= parseFloat(version) ? true : false
        )
      
      !thisVersionVariable
        ? setVariableName(currentVariable.name)
        :  setVariableName(thisVersionVariable.name)

    } else {
      setVariableName(currentVariable.name)
    }
  }, [version])

  return <span>{ variableName }</span>
}
