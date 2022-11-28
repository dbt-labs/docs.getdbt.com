import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Hero from '@site/src/components/hero';
import { CommunitySpotlightCard } from './CommunitySpotlightCard'

const communityTitle = 'Community spotlight'
const communityDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'



function CommunitySpotlightList({ spotlightData }) {
  console.log('spotlightData', spotlightData)
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
      />
      <section id='spotlight-members-section'>
        <div className='container'>   
          {spotlightData.map((member, i) => (
            <CommunitySpotlightCard frontMatter={member.data} key={i} />
          ))}
        </div>
      </section>
    </Layout>
  )
}

export default CommunitySpotlightList
