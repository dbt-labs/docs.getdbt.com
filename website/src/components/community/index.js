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
      <Hero heading="Community spotlight" subheading="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam." showGraphic={false} customStyles={{marginBottom: 0}} />
      <section id='spotlight-members-section'>
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
