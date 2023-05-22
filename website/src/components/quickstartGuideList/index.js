import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Hero from '@site/src/components/hero';
import QuickstartGuideCard from '../quickstartGuideCard'
import styles from './styles.module.css';

const quickstartTitle = 'Quickstarts'
const quickstartDescription = 'dbt Core is a powerful open-source tool for data transformations and dbt Cloud is the fastest and most reliable way to deploy your dbt jobs. With the help of a sample project, learn how to quickly start using dbt and one of the most common data platforms.'

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
        classNames={styles.quickstartHero}
      />
      <section id='quickstart-card-section'>
        <div className={`container ${styles.quickstartCardContainer} `}>   
          {quickstartData && quickstartData.length > 0 ? (
            <>
              {quickstartData.map((guide, i) => (
                <QuickstartGuideCard frontMatter={guide.data} key={i} />
              ))}
            </>
          ) : 
            <p>No quickstarts are available at this time. 😕</p>
          }
        </div>
      </section>
    </Layout>
  )
}

export default QuickstartList
