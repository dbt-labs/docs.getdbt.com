import React from 'react'
import Link from '@docusaurus/Link';
import ReactTooltip from "react-tooltip";
import styles from './styles.module.css';

{/* 
  
*/}
export default function Term({ id, children = undefined }) {

  const file = require('../../../docs/terms/' + id + '.md')
  if(!file)
    return null
  
  const fm = file.frontMatter
  if(!fm)
    return null
  
  const { displayText, hoverSnippet, permalink } = fm

  return (
    <>
      <Link
        to={permalink ? permalink : `/terms/${id}`}
        className={styles.term}
        data-tip data-for="termTip"
      >
        {children ? children : displayText}
      </Link>
      {hoverSnippet && (
        <ReactTooltip id="termTip" className={styles.termToolTip} place="bottom" effect="solid">
          <span>{hoverSnippet}</span>
        </ReactTooltip>
      )} 
    </>
  )
}
