import React from 'react'
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const SpotlightWrapper = ({ isSpotlightMember, frontMatter, children }) => {
  return isSpotlightMember ? (
    <>
      <div className={`blog-breadcrumbs ${styles.spotlightBreadcrumbs}`}>
        <div className={`container ${styles.spotlightBreadcrumbsContainer}`}>
          <Link to="/" title="Home">Home</Link>
          <Link 
            to="/community/spotlight" 
            title="Community spotlight"
          >
            Community spotlight
          </Link>
          {frontMatter?.title && frontMatter?.id && 
            <Link 
              to={`/community/spotlight/${frontMatter.id}`} 
              title={frontMatter.title}
            >
              {frontMatter.title}
            </Link>
          }
        </div>
      </div>
      <header className={styles.spotlightMemberCard}>
        {children}
      </header>
    </>
  ) : (
    <div className={styles.spotlightMemberCard}>
      {children}
    </div>
  )
} 

function CommunitySpotlightCard({ frontMatter, isSpotlightMember = false }) {
  const { id, title, description, image, jobTitle, companyName, socialLinks } = frontMatter

  return (  
    <SpotlightWrapper isSpotlightMember={isSpotlightMember} frontMatter={frontMatter}>
      {image && (
        <div className={styles.spotlightMemberImgContainer}>
          {id && isSpotlightMember ? (
            <img 
              src={image} 
              alt={title} 
            />
          ) : (
            <Link to={`/community/spotlight/${id}`} className={styles.spotlightMemberHeader}>
              <img 
                src={image} 
                alt={title} 
              />
            </Link>
          )}
        </div>
      )}
      <div className={styles.spotlightMemberContent}>
        {!isSpotlightMember && id ? (
          <Link to={`/community/spotlight/${id}`} className={styles.spotlightMemberHeader}>{title}</Link>
          ) : (
          <h1 className={styles.spotlightMemberHeader}>{title}</h1>
        )}
        {(jobTitle || companyName) && (
          <div className={styles.spotlightMemberInfo}>
            <span>
              {jobTitle && jobTitle}
              {jobTitle && companyName && ', '}
              {companyName && companyName}
            </span>
          </div>
        )}
        {description && !isSpotlightMember && (
          <p className={styles.spotlightMemberDescription}>{description}</p>
        )}
        {socialLinks && isSpotlightMember && socialLinks?.length > 0 && (
          <div className={styles.spotlightMemberSocial}>
            {socialLinks.map((item, i) => (
              <>
                {item?.name && item?.link && (
                  <>
                    {i !== 0 && ' | '}
                    <a href={item.link} title="#">{item.name}</a>
                  </>
                )}
              </>
            ))}
          </div>
        )}
        {id && !isSpotlightMember && (
          <Link 
            to={`/community/spotlight/${id}`} 
            className={styles.spotlightReadMore}
          >Read More</Link>
        )}
      </div>
    </SpotlightWrapper>
  )
}

export default CommunitySpotlightCard
