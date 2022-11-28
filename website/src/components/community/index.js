import React from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Hero from '@site/src/components/hero';
import { CommunitySpotlightCard } from './CommunitySpotlightCard'

function CommunitySpotlightList({ spotlightData }) {
  console.log('spotlightData', spotlightData)

  return (
    <Layout>
     <section id='community-spotlight-page'>
        <Hero heading="Welcome to the dbt Developer Hub" subheading="Your home base for learning dbt, connecting with the community and contributing to the craft of analytics engineering " showGraphic={false} />
        <div className='container'>   
          {spotlightData.map(member => (
            <CommunitySpotlightCard frontMatter={member.data} />
          ))}
        </div>
      </section>
    </Layout>
  )
}

export default CommunitySpotlightList
