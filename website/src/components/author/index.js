import React from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import BlogLayout from '@theme/BlogLayout';
import getAllPosts from '../../utils/get-all-posts';
import imageCacheWrapper from '../../../functions/image-cache-wrapper';
import getSvgIcon from '../../utils/get-svg-icon';

function Author(props) {
  const { authorData } = props
  const { siteConfig } = useDocusaurusContext()

  const presets  = 
    siteConfig.presets && 
    siteConfig.presets[0].find(preset => preset['blog'])

  let blogData = {} 
  if(presets) blogData = presets['blog']
  
  const { name, job_title, image_url, organization, description, links, slug } = authorData

  // Get all posts and filter by Author
  let authorPosts = getAllPosts().filter(post => 
    post.authors.find(auth => auth.key === slug)
  )

  return (
    <BlogLayout title={name}>
      <Head>
        <meta property="og:type" content="profile" />
        <meta
          property="og:title"
          content={`${name} - ${
            blogData && blogData.blogTitle && blogData.blogTitle
          }`}
        />
        {description && (
          <meta property="og:description" content={`${description}`} />
        )}
      </Head>

      <main itemScope itemType="http://schema.org/Person">
        <section className="author-header row align-items-center">
          <div className="author-header-left">
            <img
              src={imageCacheWrapper(image_url)}
              alt={name}
              itemProp="image"
            />
          </div>
          <div className="author-header-right">
            <h1 itemProp="name">{name}</h1>
            <h4 className="author-title" itemProp="jobTitle">
              {job_title && job_title} {organization && `@ ${organization}`}
              <div className="author-links">
                {links && links.length > 0 && (
                  <>
                    <span>|</span>
                    {links.map((link, i) => (
                      <a
                        href={link.url}
                        title={`${name} - Social`}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={i}
                      >
                        {/* <!--! Font Awesome Pro 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}
                        {link?.icon ? (
                          <div className="social-icon">
                            {getSvgIcon(link?.icon)}
                          </div>
                        ) : null}
                      </a>
                    ))}
                  </>
                )}
              </div>
            </h4>
            <p itemProp="description">{description ? description : ""}</p>
          </div>
        </section>
        {authorPosts && authorPosts.length > 0 && (
          <AuthorPosts
            posts={authorPosts}
            siteImg={siteConfig.themeConfig && siteConfig.themeConfig.image}
          />
        )}
      </main>
    </BlogLayout>
  );
}

// Author Posts component
function AuthorPosts({posts}) {
  return (
    <section className="author-posts-section">
      <h2>Author Posts</h2>
      <div className="row author-posts">
        {posts.map((post, i) => {
          const { permalink, title, description } = post
          return (
            <div className="author-post" key={i}>
              <Link to={permalink}>
                <h3>{title}</h3>
              </Link>
              <p>{description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Author;

