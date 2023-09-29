import React from 'react';
import { useState } from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Hero from '@site/src/components/hero';
import QuickstartGuideCard from '../quickstartGuideCard'
import styles from './styles.module.css';
import { SelectDropdown } from '../selectDropdown';

const quickstartTitle = 'Quickstarts'
const quickstartDescription = 'dbt Core is a powerful open-source tool for data transformations and dbt Cloud is the fastest and most reliable way to deploy your dbt jobs. With the help of a sample project, learn how to quickly start using dbt and one of the most common data platforms.'


function QuickstartList({ quickstartData }) {
  const { siteConfig } = useDocusaurusContext()
  const [filteredData, setFilteredData] = useState(quickstartData);
 
  // Build meta title from quickstartTitle and docusaurus config site title
  const metaTitle = `${quickstartTitle}${siteConfig?.title ? ` | ${siteConfig.title}` : ''}`

  // Create an options array for the tag select dropdown
  const tagOptions = [];
  quickstartData.forEach((guide) => {
    if (guide.data.tags) {
      guide.data.tags.forEach((tag) => {
        const tagOption = { value: tag, label: tag };
        if (!tagOptions.find((option) => option.value === tag)) {
          tagOptions.push(tagOption);
        }
      });
    }
  });

  // Filter the quickstart guides based on the selected tags
  const onChange = (selectedOption) => {
    // only return the quickstart guides that have the selected tag and match all of the selected tags
    const filteredGuides = quickstartData.filter((guide) => {
      if (guide.data.tags) {
        return selectedOption.every((option) =>
          guide.data.tags.includes(option.value)
        );
      }
    });
    setFilteredData(filteredGuides);

    // If no tags are selected, show all quickstart guides
    if (selectedOption.length === 0) {
      setFilteredData(quickstartData);
    }
    
  };

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
        <div className={`container ${styles.quickstartFilterContainer} `}>
        <SelectDropdown options={tagOptions} onChange={onChange} />
        </div>
        <div className={`container ${styles.quickstartCardContainer} `}>   
          {filteredData && filteredData.length > 0 ? (
            <>
              {filteredData.map((guide, i) => (
                <QuickstartGuideCard frontMatter={guide.data} key={i} />
              ))}
            </>
          ) : 
            <p>No quickstarts are available with the selected filters.</p>
          }
        </div>
      </section>
    </Layout>
  )
}

export default QuickstartList
