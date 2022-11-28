import React from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import BlogLayout from '@theme/BlogLayout';

export const CommunitySpotlightList = (props) => {
  console.log('props', props)
  // const { authorData } = props
  
  // const { name, job_title, image_url, organization, description, links, slug } = authorData


  return (
    <Layout>
      <p>wee</p>
      {/* <Head>
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={`${name} - ${blogData && blogData.blogTitle && blogData.blogTitle}`} />
        {description &&
          <meta property="og:description" content={`${description}`} />
        }
      </Head> */}

      {/* <main
        itemScope
        itemType="http://schema.org/Person">
        <section className="author-header row align-items-center">
         
        </section>
      </main> */}
    </Layout>
  )
}
