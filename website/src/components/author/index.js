import React from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

function Author(props) {
  const { authorData } = props
  const { siteConfig } = useDocusaurusContext()
  const presets  = siteConfig.presets[0].find(preset => preset['blog'])
  let blogData = {} 
  if(presets) blogData = presets['blog']

  const { name, job_title, image_url, organization, description, links, slug } = authorData

  const authorPosts = getAuthorPosts(slug)

  return (
    <Layout>
      <Head>
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={`${name} - ${blogData && blogData.blogTitle ? blogData.blogTitle : ''}`} />
        {description ?
          <meta property="og:description" content={`${description}`} />
        : ''}
      </Head>
      <div className="container margin-vert--lg">
        <main
          itemScope
          itemType="http://schema.org/Person">
          <section className="author-header row align-items-center">
            <div className="author-header-left">
              <img src={image_url} alt={name} itemProp="image" />
            </div>
            <div className="author-header-right">
              <h1 itemProp="name">{name}</h1>
              <h4 className="author-title" itemProp="jobTitle">
                {job_title ? job_title : ''} {organization ? `at ${organization}` : ''} 
                <div className="author-links">
                {links && links.length > 0 ? (
                  <>
                  <span>|</span>
                  {links.map((link, i) => (
                    <a 
                      href={link.url} 
                      title={`${name} - Social`} 
                      target="_blank"
                      key={i}
                    >
                      <i className={`fab ${link.icon}`}></i>
                    </a>
                  ))}
                  </>
                )
                : ''}
              </div>
              </h4>
              <p itemProp="description">{description ? description : ''}</p>
            </div>
          </section>
          {authorPosts && authorPosts.length > 0 ? 
            <AuthorPosts posts={authorPosts} siteImg={siteConfig.themeConfig.image} />
          : ''}
        </main>
      </div>
    </Layout>
  );
}

// Author Posts component
function AuthorPosts({posts, siteImg}) {
  return (
    <section className="author-posts-section">
      <h2>View Author Posts</h2>
      <div className="row author-posts">
        {posts.map(post => {
          const { authors, date, formattedDate, image, permalink, title, description } = post
          let postImg = image ? image : siteImg
          return (
            <div className="author-post">
              <Link to={permalink}>
                <img src={postImg} alt={title} />
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

// Util function to filter posts by Author
function getAuthorPosts(author) {
  /* 
   * Credit to get all posts:
   * https://blog.johnnyreilly.com/2021/05/01/blog-archive-for-docusaurus/
   */
  const allPosts = ((ctx) => {
    const blogpostNames = ctx.keys();
    return blogpostNames.reduce((blogposts, blogpostName, i) => {
      const module = ctx(blogpostName);
      const { image } = module.frontMatter
      const { date, formattedDate, title, permalink, authors, description } = module.metadata;
      return [
        ...blogposts,
        {
          date,
          formattedDate,
          title,
          permalink,
          authors,
          image,
          description
        },
      ];
    }, ([]));
  })(require.context('../../../blog', false, /.md/));

  return allPosts.filter(post => 
    post.authors.find(auth => auth.key === author)
  )
}

export default Author;

