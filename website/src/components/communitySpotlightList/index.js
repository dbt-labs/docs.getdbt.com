import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Hero from '@site/src/components/hero';
import CommunitySpotlightCard from '../communitySpotlightCard'

const communityTitle = 'Community spotlight'
const communityDescription = "The dbt Community is where analytics engineering lives and grows, and you're a part of it! Every quarter we'll be highlighting community members in the dbt Community Spotlight. These are individuals who have gone above and beyond to contribute to the community in a variety of ways. We all see you. We appreciate you. You are awesome."

function CommunitySpotlightList({ spotlightData }) {
  const { siteConfig } = useDocusaurusContext()

  // Build meta title from communityTitle and docusaurus config site title
  const metaTitle = `${communityTitle}${siteConfig?.title ? ` | ${siteConfig.title}` : ''}`

  return (
    <Layout>
      <Head>
        <title>{metaTitle}</title>
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={communityDescription} />
      </Head>
      <Hero 
        heading={communityTitle} 
        subheading={communityDescription} 
        showGraphic={false} 
        customStyles={{marginBottom: 0}} 
        classNames='community-spotlight-hero'
        colClassNames='col--8'
      />
      <section id='spotlight-members-section'>
        <div className='container'>   
          {spotlightData && spotlightData.length > 0 ? (
            <>
              {spotlightData.map((member, i) => (
                <CommunitySpotlightCard frontMatter={member.data} key={i} />
              ))}
            </>
          ) : 
            <p>No community spotlight members are available at this time. 😕</p>
          }
        </div>
      </section>
    </Layout>
  )
}

export default CommunitySpotlightList
