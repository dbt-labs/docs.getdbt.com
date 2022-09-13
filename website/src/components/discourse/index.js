import React, { useEffect } from 'react'
import feedStyles from './styles.module.css';

export default function DiscourseFeed(styles = {}) {
  return (
    <section className={feedStyles.discourseSection}>
      <h1>dbt Discourse</h1>
      Content
    </section >
  )
}
