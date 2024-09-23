import React, { useState, useEffect } from 'react'
import ReactTooltip from "react-tooltip";
import styles from './styles.module.css';

{/* 
  Props:
  id: maps to term in website/docs/terms/hover-terms.md
  children (optional): to display different text 
  other than displayText property for term
*/}
export default function Term({ id, children = undefined }) {

  const [uniqueID] = useState(String(Math.random()))
  const [pageReady, setPageReady] = useState(false)

  // Rebuild tooltips on every update
  useEffect(() => {
    ReactTooltip.rebuild()
    setPageReady(true)
  })

  // Get terms file
  const file = require('../../../docs/terms/hover-terms.md')

  // Get term by id
  const term = file?.frontMatter?.[id]
  
  // If term not found in file, return children if available or null
  if(!term) 
    return children || null

  // Get properties from front matter
  const { displayText, hoverSnippet } = term;

  // If component has children, show children text,
  // Else, default to displayText frontmatter field,
  // Or filename if displayText not set
  const displayValue = children ? children : displayText ? displayText : id

  return (
    <>
      {pageReady && hoverSnippet ? (
        <>
          <span key={id} className={styles.term} data-tip data-for={uniqueID}>
            {displayValue}
          </span>
          <ReactTooltip
            id={uniqueID}
            className={styles.termToolTip}
            place="bottom"
            effect="solid"
            wrapper="span"
          >
            {hoverSnippet}
          </ReactTooltip>
        </>
      ) : (
        <span>{displayValue}</span>
      )}
    </>
  );
}
