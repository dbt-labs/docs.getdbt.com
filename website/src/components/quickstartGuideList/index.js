import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Hero from '@site/src/components/hero';
import QuickstartGuideCard from '../quickstartGuideCard'
import styles from './styles.module.css';
import { SelectDropdown } from '../selectDropdown';
import SearchInput from '../searchInput';

const quickstartTitle = 'Quickstarts'
const quickstartDescription = 'dbt Core is a powerful open-source tool for data transformations and dbt Cloud is the fastest and most reliable way to deploy your dbt jobs. With the help of a sample project, learn how to quickly start using dbt and one of the most common data platforms.'


function QuickstartList({ quickstartData }) {
  const { siteConfig } = useDocusaurusContext();
  const [filteredData, setFilteredData] = useState(() => quickstartData);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  // Build meta title from quickstartTitle and docusaurus config site title
  const metaTitle = `${quickstartTitle}${siteConfig?.title ? ` | ${siteConfig.title}` : ''}`;

  // Memoized computation of tag and level options
  const tagOptions = useMemo(() => {
    const tags = new Set();
    quickstartData.forEach(guide =>
      guide?.data?.tags?.forEach(tag => tags.add(tag))
    );
    return Array.from(tags).map(tag => ({ value: tag, label: tag }));
  }, [quickstartData]);

  const levelOptions = useMemo(() => {
    const levels = new Set();
    quickstartData.forEach(guide =>
      guide?.data?.level && levels.add(guide.data.level)
    );
    return Array.from(levels).map(level => ({ value: level, label: level }));
  }, [quickstartData]);

  // Handle all filters
  const handleDataFilter = () => {
    const filteredGuides = quickstartData.filter((guide) => {
      const tagsMatch = selectedTags.length === 0 || (Array.isArray(guide?.data?.tags) && selectedTags.every((tag) =>
        guide?.data?.tags.includes(tag.value)
      ));
      const levelMatch = selectedLevel.length === 0 || (guide?.data?.level && selectedLevel.some((level) =>
        guide?.data?.level === level.value
      ));
      const titleMatch = searchInput === '' || guide?.data?.title?.toLowerCase().includes(searchInput.toLowerCase());
      return tagsMatch && levelMatch && titleMatch;
    });
    setFilteredData(filteredGuides);
  };

  useEffect(() => {
    handleDataFilter();
  }, [selectedTags, selectedLevel, searchInput]);

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
        customStyles={{ marginBottom: 0 }}
        classNames={styles.quickstartHero}
      />
      <section id='quickstart-card-section'>
        <div className={`container ${styles.quickstartFilterContainer} `}>
          <SelectDropdown options={tagOptions} onChange={setSelectedTags} isMulti placeHolder={'Filter by topic'} />
          <SelectDropdown options={levelOptions} onChange={setSelectedLevel} isMulti placeHolder={'Filter by level'} />
          <SearchInput onChange={(value) => setSearchInput(value)} placeholder='Search Quickstarts' />
        </div>
        <div className={`container ${styles.quickstartCardContainer} `}>
          {filteredData && filteredData.length > 0 ? (
            <>
              {filteredData.map((guide) => (
                <QuickstartGuideCard frontMatter={guide.data} key={guide.data.id || guide.index} />
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

export default QuickstartList;
