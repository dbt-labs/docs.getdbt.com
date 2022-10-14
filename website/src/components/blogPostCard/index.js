import React from 'react';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';


function BlogPostCard({ postMetaData }) {
  const { title, date, readingTime, description, link, image } = postMetaData
  return (
    <div className={styles.cardWrapper}>
      <article className={`${image ? styles.imageCard : styles.card}`}>
        {image && <div className={styles.imageContainer} style={{ "background": `no-repeat center/100% url(${image})` }}></div>}
        <div className={`${image ? styles.contentContainer : null}`}>
          <Link to={useBaseUrl(link)}><h3>{title}</h3></Link>
          {readingTime && <span>{date} · {readingTime} minute read</span>}
          <p>
            {description}
          </p>
          <Link to={useBaseUrl(link)}><a className={styles.ctaLink}>Read more</a></Link>
        </div>
      </article>
    </div>
  );
}

export default BlogPostCard;

