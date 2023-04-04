import React from 'react';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import createPostPreview from '@site/functions/post-preview';


function BlogPostCard({ postMetaData }) {
  const { title, date, readingTime, description, link, image } = postMetaData
  return (
    <div className={styles.cardWrapper}>
      <article className={`${image ? styles.imageCard : styles.card}`}>
        {image && <div className={styles.imageContentContainer} style={{ "background": `no-repeat center/100% url(${image})` }}></div>}
        <div className={`${styles.contentContainer} ${image ? styles.imageContentContainer : null}`}>
          <Link to={useBaseUrl(link)}><h3>{title}</h3></Link>
          {readingTime && <span className={styles.readingTime}>{date} · {readingTime} minute read</span>}
          <p>
            {createPostPreview(description, 140)}
          </p>
          <Link className={styles.ctaLink} to={useBaseUrl(link)}>Read more</Link>
        </div>
      </article>
    </div>
  );
}

export default BlogPostCard;
