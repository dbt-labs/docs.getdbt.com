import React from 'react'
import Link from '@docusaurus/Link';
import styles from './styles.module.css';


function QuickstartGuideCard({ frontMatter }) {
  const { id, title, timeToComplete } = frontMatter


  return (  
    <Link to={`/docs/quickstarts/dbt-cloud/${id}`} frontMatter={frontMatter} className={styles.quickstartCard}>
        <h3>{title}</h3>

        {timeToComplete &&
            <span className={styles.timeToComplete}>
                {timeToComplete}
            </span>
        }
      
          <span 
            to={`/quickstart/guide/${id}`} 
            className={styles.start}
          >Start</span>
    </Link>
  )
}

export default QuickstartGuideCard
