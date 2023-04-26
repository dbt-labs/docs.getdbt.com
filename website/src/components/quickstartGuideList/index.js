import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Hero from '@site/src/components/hero';
import QuickstartGuideCard from '../quickstartGuideCard'
import styles from './styles.module.css';

const quickstartTitle = 'Quickstart guides'
const quickstartDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'

function QuickstartList({ quickstartData }) {
  const { siteConfig } = useDocusaurusContext()
 
  // Build meta title from quickstartTitle and docusaurus config site title
  const metaTitle = `${quickstartTitle}${siteConfig?.title ? ` | ${siteConfig.title}` : ''}`

  return (
    <Layout>
      <Head>
        <title>{metaTitle}</title>
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={quickstartDescription} />
      </Head>
      <Hero 
        heading={quickstartTitle} 
        subheading={quickstartDescription} 
        showGraphic={false} 
        customStyles={{marginBottom: 0}} 
        classNames='quickstart-hero'
      />
      <section id='quickstart-card-section'>
        <div className={`container ${styles.quickstartCardContainer} `}>   
          {quickstartData && quickstartData.length > 0 ? (
            <>
              {quickstartData.map((member, i) => (
                <QuickstartGuideCard frontMatter={member.data} key={i} />
              ))}
            </>
          ) : 
            <p>No quickstart guides are available at this time. 😕</p>
          }
        </div>
      </section>
    </Layout>
  )
}

export default QuickstartList
