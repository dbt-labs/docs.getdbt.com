import React, { useContext } from 'react'
import { dbtVariables } from '../../../dbt-global-variables';
import VersionContext from '../../stores/VersionContext';

console.log('dbtVar', dbtVariables)
export default function Variable({ name }) {
  const { version } = useContext(VersionContext)
  console.log("v", version)

  const currentVariable = dbtVariables[name]
  if(!currentVariable)
    return null

  console.log('currentVariable', currentVariable)

  // Check if versions array set for variable
  return (
    <span>{ currentVariable.name }</span>
  )
}
