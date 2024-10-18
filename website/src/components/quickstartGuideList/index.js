import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Hero from '@site/src/components/hero';
import QuickstartGuideCard from '../quickstartGuideCard';
import styles from './styles.module.css';
import { SelectDropdown } from '../selectDropdown';
import SearchInput from '../searchInput';
import { useHistory, useLocation } from '@docusaurus/router';

const quickstartTitle = 'Guides';
const quickstartDescription = 'dbt Cloud is the fastest and most reliable way to deploy your dbt jobs and dbt Core is a powerful open-source tool for data transformations. With the help of a sample project, learn how to quickly start using dbt and one of the most common data platforms.';

function QuickstartList({ quickstartData }) {
  const { siteConfig } = useDocusaurusContext();
  const [filteredData, setFilteredData] = useState(() => quickstartData);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const history = useHistory();
  const location = useLocation();

  // Build meta title from quickstartTitle and docusaurus config site title
  const metaTitle = `${quickstartTitle}${siteConfig?.title ? ` | ${siteConfig.title}` : ''}`;

  // UseMemo to prevent re-rendering on every filter change
  // Get tag options
  // Populated from the tags frontmatter array
  const tagOptions = useMemo(() => {
    const tags = new Set();
    quickstartData.forEach(guide =>
      guide?.data?.tags?.forEach(tag => tags.add(tag))
    );
    // Sort alphabetically
    return Array.from(tags).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())).map(tag => ({ value: tag, label: tag }));
  }, [quickstartData]);

  // Get level options
  // Populated by the level frontmatter string
  const levelOptions = useMemo(() => {
    const levels = new Set();
    quickstartData.forEach(guide =>
      guide?.data?.level && levels.add(guide.data.level)
    );
    return Array.from(levels).map(level => ({ value: level, label: level }));
  }, [quickstartData]);

  const updateUrlParams = (selectedTags, selectedLevel) => {
    // Create a new URLSearchParams object from the current URL search string
    const params = new URLSearchParams(location.search);

    // Remove existing 'tags' and 'level' parameters to avoid duplicates
    params.delete('tags');
    params.delete('level');

    // Append new 'tags' and 'level' values from the current state
    selectedTags.forEach(tag => params.append('tags', tag.value));
    selectedLevel.forEach(level => params.append('level', level.value));

    // Update the URL with the new search parameters
    history.replace({ search: params.toString() });
  };

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

  // Reads the current URL params applied and sets the selected tags and levels
  // This allows the filters to be sharable via URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tagsFromUrl = params.getAll('tags').map(tag => ({ value: tag, label: tag }));
    const levelsFromUrl = params.getAll('level').map(level => ({ value: level, label: level }));
    setSelectedTags(tagsFromUrl);
    setSelectedLevel(levelsFromUrl);
  }, [location.search]); // Added location.search to dependency array

  useEffect(() => {
    updateUrlParams(selectedTags, selectedLevel);
  }, [selectedTags, selectedLevel]);

  // Separating out useEffects because we want to run handleDataFilter after the URL params are set
  // Also just good practice to separate out side effects with different functions
  useEffect(() => {
    handleDataFilter();
  }, [selectedTags, selectedLevel, searchInput]); // Added searchInput to dependency array

  // Set the featured guides that will show as CTAs in the hero section
  // The value of the tag must match a tag in the frontmatter of the guides in order for the filter to apply after clicking
  const heroCTAs = [
    {
      title: 'Quickstart guides',
      value: 'Quickstart'
    },
    {
      title: 'Use Jinja to improve your SQL code',
      value: 'Jinja'
    },
    {
      title: 'Orchestration',
      value: 'Orchestration'
    },
  ];

  // Function to handle CTA clicks
  const handleCallToActionClick = (value) => {
    const params = new URLSearchParams(location.search);
    params.set('tags', value);
    history.replace({ search: params.toString() });
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
        customStyles={{ marginBottom: 0 }}
        classNames={styles.quickstartHero}
        callToActions={heroCTAs.map(guide => ({
          title: guide.title,
          href: guide.href,
          onClick: () => handleCallToActionClick(guide.value),
          newTab: guide.newTab
        }))}
        callToActionsTitle={'Popular guides'}
      />
      <section id='quickstart-card-section'>
        <div className={`container ${styles.quickstartFilterContainer} `}>
          {tagOptions && tagOptions.length > 0 && (
            <SelectDropdown options={tagOptions} onChange={setSelectedTags} value={selectedTags} isMulti placeHolder={'Filter by topic'} />
          )}
          {levelOptions && levelOptions.length > 0 && (
            <SelectDropdown options={levelOptions} onChange={setSelectedLevel} value={selectedLevel} isMulti placeHolder={'Filter by level'} />
          )}
          <SearchInput onChange={(value) => setSearchInput(value)} placeholder='Search Guides' />
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
  );
}

export default QuickstartList;
