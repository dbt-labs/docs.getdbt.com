import React from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { CommunitySpotlightCard } from './CommunitySpotlightCard'

function CommunitySpotlightList({ spotlightData }) {
  console.log('spotlightData', spotlightData)

  return (
    <Layout
      wrapperClassName={ThemeClassNames.wrapper.docsPages}
      pageClassName={ThemeClassNames.page.docsDocPage}
    >
      <>
        {spotlightData.map(member => (
          <CommunitySpotlightCard frontMatter={member.data} />
        ))}
      </>
    </Layout>
  )
}

export default CommunitySpotlightList
