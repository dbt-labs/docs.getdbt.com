import React from 'react'
import { CONSTANTS } from '@site/constants';

/**
 * @param {string} name - The name of the constant to display
 * @returns {React.ReactNode} The constant value
 */

export default function Constant({ name }) {
  const currentConstant = CONSTANTS[name]

  if(!name || !currentConstant)
    return null

  return <span>{ currentConstant }</span>
}
