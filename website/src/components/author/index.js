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

  const { name, title, image_url, organization, description, links } = authorData

  /* 
   * Credit to get all posts:
   * https://blog.johnnyreilly.com/2021/05/01/blog-archive-for-docusaurus/
   */
  const allPosts = ((ctx) => {
    const blogpostNames = ctx.keys();
    return blogpostNames.reduce((blogposts, blogpostName, i) => {
      const module = ctx(blogpostName);
      const { image } = module.frontMatter
      const { date, formattedDate, title, permalink, authors } = module.metadata;
      return [
        ...blogposts,
        {
          date,
          formattedDate,
          title,
          permalink,
          authors,
          image
        },
      ];
    }, ([]));
  })(require.context('../../../blog', false, /.md/));

  console.log('allPosts', allPosts)

  // TODO: Filter posts by author

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
        <div className="row">
          <main
            className="col"
            itemScope
            itemType="http://schema.org/Person">
            <div className="author-header">
              <div className="author-header-left">
                <img src={image_url} alt={name} itemProp="image" />
              </div>
              <div className="author-header-right">
                <h1 itemProp="name">{name}</h1>
                <h4 className="author-title" itemProp="jobTitle">
                  {title ? title : ''} {organization ? `at ${organization}` : ''} 
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
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}

export default Author;

