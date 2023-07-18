import React from 'react'
import styles from './styles.module.css';
import clsx from 'clsx';

{/* 
  The Snippet component works in a similar way as FAQs.
  Pass the filename of a snippet within the snippets directory
  as a prop to use throughout the docs.
*/}
export default function Snippet({ path }) {
  const file = require('../../../snippets/' + path + '.md')
  const contents = file.default({});
  return (
    <div className={clsx(styles.snippet, 'snippet')}>
        { contents }
    </div>
  )
}
