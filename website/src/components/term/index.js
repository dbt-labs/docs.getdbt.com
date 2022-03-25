import React, { useState } from 'react'
import Link from '@docusaurus/Link';
import ReactTooltip from "react-tooltip";
import styles from './styles.module.css';

{/* 

*/}
export default function Term({ id, children = undefined }) {

  const [uniqueID, setUniqueID] = useState(String(Math.random()))
  
  const file = require('../../../docs/terms/' + id + '.md')
  if(!file)
    return null
  
  const fm = file.frontMatter
  if(!fm)
    return null
  
  const { displayText, hoverSnippet } = fm

  const hideTooltip = () => {
    ReactTooltip.hide()
  }

  return (
    <>
      <Link
        to={`/terms/${id}`}
        className={styles.term}
        data-tip 
        data-for={uniqueID}
        onMouseEnter={() => hideTooltip()}
      >
        {/* If component has children, show children text,
            Else, default to displayText frontmatter field,
            Or filename if displayText not set
        */}
        {children ? children : displayText ? displayText : id}
      </Link>
      {hoverSnippet && (
        <ReactTooltip 
          id={uniqueID} 
          className={styles.termToolTip} 
          place="bottom" 
          effect="solid"
          wrapper="span" 
        >
          {hoverSnippet}
        </ReactTooltip>
      )} 
    </>
  )
}
