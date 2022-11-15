import React, { useContext, useEffect } from 'react';
import styles from './styles.module.css';
import { tocContext } from '@theme/DocItem';


{/* 
  The Snippet component works in a similar way as FAQs.
  Pass the filename of a snippet within the snippets directory
  as a prop to use throughout the docs.
*/}
export default function NewSnippet({ children, toc }) {

  const { currentToc, setCurrentToc } = useContext(tocContext)

  useEffect(() => {
    let additionalToc = toc.filter((tocItem) => !currentToc.includes(tocItem))
    let updatedToc = currentToc.concat(additionalToc)

    if (additionalToc.length) {
      setCurrentToc(updatedToc)
    }
  }, [])

  return (
    <div className={styles.snippet}>
      {children}
    </div>
  )
}
