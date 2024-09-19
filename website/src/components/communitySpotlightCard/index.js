import React from 'react'
import Link from '@docusaurus/Link';
import Head from "@docusaurus/Head";
import styles from './styles.module.css';
import imageCacheWrapper from '../../../functions/image-cache-wrapper';

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
  const { 
    id, 
    title, 
    description, 
    image,
    pronouns,
    location,
    jobTitle, 
    companyName, 
    organization, 
    socialLinks,
    communityAward,
    communityAwardYear,
  } = frontMatter

  // Get meta description text
  const metaDescription = stripHtml(description)

  return (
    <SpotlightWrapper
      isSpotlightMember={isSpotlightMember}
      frontMatter={frontMatter}
    >
      {isSpotlightMember && metaDescription ? (
        <Head>
          <meta
            name="description"
            content={metaDescription}
          />
          <meta
            property="og:description"
            content={metaDescription}
          />
        </Head>
      ) : null}
      {communityAward ? (
        <div className={styles.awardBadge}>
          <span>Community Award Recipient {communityAwardYear}</span>
        </div>
      ) : null}
      {image && (
        <div className={styles.spotlightMemberImgContainer}>
          {id && isSpotlightMember ? (
            <img src={imageCacheWrapper(image)} alt={title} />
          ) : (
            <Link
              to={`/community/spotlight/${id}`}
              className={styles.spotlightMemberHeader}
            >
              <img src={imageCacheWrapper(image)} alt={title} />
            </Link>
          )}
        </div>
      )}
      <div className={styles.spotlightMemberContent}>
        {!isSpotlightMember && id ? (
          <h2>
            <Link
              to={`/community/spotlight/${id}`}
              className={`${styles.spotlightMemberHeader} ${styles.spotlightMemberHeaderSmall}`}
            >
              {title}
            </Link>
          </h2>
        ) : (
          <h1 className={styles.spotlightMemberHeader}>{title}</h1>
        )}
        {pronouns && (
          <div className={styles.spotlightMemberPronouns}>{pronouns}</div>
        )}

        {isSpotlightMember && (
          <div className={styles.spotlightMemberHeaderContain}>
            {(jobTitle || companyName) && (
              <div className={styles.spotlightMemberInfo}>
                {jobTitle && jobTitle}
                {jobTitle && companyName && ", "}
                {companyName && companyName}
              </div>
            )}
            {location && (
              <div className={styles.spotlightMemberInfo}>
                <span>Location:</span> {location}
              </div>
            )}
            {organization && (
              <div className={styles.spotlightMemberInfo}>
                <span>Organizations:</span> {organization}
              </div>
            )}
          </div>
        )}
        {description && !isSpotlightMember && (
          <p
            className={styles.spotlightMemberDescription}
            dangerouslySetInnerHTML={{ __html: truncateText(description) }}
          />
        )}
        {socialLinks && isSpotlightMember && socialLinks?.length > 0 && (
          <div className={styles.spotlightMemberSocial}>
            {socialLinks.map((item, i) => (
              <>
                {item?.name && item?.link && (
                  <>
                    {i !== 0 && " | "}
                    <a
                      href={item.link}
                      title={item.name}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.name}
                    </a>
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
          >
            Read More
          </Link>
        )}
      </div>
      {description && isSpotlightMember && (
        <div className={styles.spotlightMemberDescriptionFull}>
          <h2>About</h2>
          <p
            className={styles.spotlightMemberDescription}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      )}
    </SpotlightWrapper>
  );
}

// Truncate description text for community member cards
function truncateText(str) {
  // Max length of string
  let maxLength = 300

  // Check if anchor link starts within maxLength
  let hasLinks = false
  if(str.substring(0, maxLength - 3).match(/(?:<a)/g)) {
    hasLinks = true
  }

  // Exclude link html from content length count
  // Otherwise href, title, rel values all counted as text.
  if(hasLinks) {
    const linkText = str.match(/(?<=<a ).*(?=<\/a>)/g)
    if(linkText?.length && linkText[0]?.length) {
      maxLength += linkText[0]?.length
    }
  }

  const substring = str.substring(0, maxLength - 3)

  return str.length > maxLength
    ? `${substring}...`
    : str
}

// Strip HTML for meta description
function stripHtml(desc) {
  const maxLength = 130

  if(!desc) return null

  // Remove HTML elements from string
  const strippedHtml = desc?.replace(/(<([^>]+)>)/gi, "")

  // Strip new lines and return 130 character substring for description
  const updatedDesc = strippedHtml
    ?.substring(0, maxLength)
    ?.replace(/(\r\n|\r|\n)/g, "");

  return desc?.length > maxLength ? `${updatedDesc}...` : updatedDesc
}

export default CommunitySpotlightCard
