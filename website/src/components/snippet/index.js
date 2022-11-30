import React from 'react'
import styles from './styles.module.css';

{/* 
  The Snippet component works in a similar way as FAQs.
  Pass the filename of a snippet within the snippets directory
  as a prop to use throughout the docs.
*/}
export default function Snippet({ src }) {
  const file = require('../../../snippets/' + src + '.md')
  const contents = file.default({});
  return (
    <div className={styles.snippet}>
        { contents }
    </div>
  )
}
