import React from 'react';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import createPostPreview from '@site/functions/post-preview';


function BlogPostCard({ postMetaData }) {
  const { title, description, link, image, tags } = postMetaData
  return (
    <div className={styles.cardWrapper}>
      <article className={`${image ? styles.imageCard : styles.card}`}>
        {image && <div className={styles.imageContentContainer} style={{ "background": `no-repeat center/100% url(${image})` }}></div>}
        <div className={`${styles.contentContainer} ${image ? styles.imageContentContainer : null}`}>
          <Link to={useBaseUrl(link)}><h4 className="heading-4">{title}</h4></Link>
          <p>
            {createPostPreview(description, 140)}
          </p>
          {tags && tags.length > 0 && (
            <div className={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <Link 
                  key={index}
                  to={useBaseUrl(`${tag.permalink}`)}
                >
                  <span className="tag" style={{marginBottom: '0'}}>{tag.label}</span>
                </Link>
              ))}
            </div>
          )}
          <Link className={styles.ctaLink} to={useBaseUrl(link)}>Read more</Link>
        </div>
      </article>
    </div>
  );
}

export default BlogPostCard;
