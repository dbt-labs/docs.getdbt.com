import React from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Hero from '@site/src/components/hero';
import QuickstartGuideCard from '../quickstartGuideCard';
import styles from './styles.module.css';
import { useLocation } from '@docusaurus/router';
import { CheckboxGroup } from '../checkboxGroup';
import { frontMatter as CONFIG } from '@site/docs/guides/_config.md?raw';
import GuidesCarousel from '@site/src/components/guidesCarousel';
import SearchInput from '../searchInput';

// Helper function to normalize title into a key
// Eliminates the need to manually update the key for each category
const normalizeTitle = (title) => {
  return title.toLowerCase().replace(/\s+/g, '-');
};

// Contains the categorized guides
const GuideSection = ({ title, guides, onFavoriteUpdate }) => {
  // Key to force re-render of GuidesCarousel when guides change
  const carouselKey = useMemo(() => guides?.map(g => g.data.id).join('-'), [guides]);
  
  if (!guides || guides.length === 0) return null;
  
  return (
    <div className={styles.guideSection}>
      <h3>{title}</h3>
      <GuidesCarousel 
        key={carouselKey}
        guidesData={guides.map(guide => guide.data)}
        showNavigation={guides.length > 2}
        onFavoriteUpdate={onFavoriteUpdate}
      />
    </div>
  );
}

// New filters can be added here following the same pattern as tags and level
// Please reach out to the web team if you have questions
const FILTER_CONFIGS = {
  tags: {
    urlParam: 'tags',
    frontMatterKey: 'tags',
    label: 'Choose a topic',
    isArray: true, // tags is an array in frontmatter
  },
  level: {
    urlParam: 'level',
    frontMatterKey: 'level',
    label: 'Choose a level',
    isArray: false, // level is a single string in frontmatter
  },
  
};

function QuickstartList({ quickstartData }) {
  const { siteConfig } = useDocusaurusContext();
  
  const title = CONFIG?.title;
  const description = CONFIG?.description;
  
  const metaTitle = `${title}${siteConfig?.title ? ` | ${siteConfig.title}` : ''}`;

  const [filteredData, setFilteredData] = useState(() => quickstartData);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [searchInput, setSearchInput] = useState('');
  const location = useLocation();
  const [favorites, setFavorites] = useState([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Replace individual filter states with a single object
  const getFilterOptions = (filterKey) => {
    const config = FILTER_CONFIGS[filterKey];
    const values = new Set();
    
    quickstartData.forEach(guide => {
      const frontMatterValue = guide?.data?.[config.frontMatterKey];
      if (config.isArray) {
        frontMatterValue?.forEach(value => values.add(value));
      } else if (frontMatterValue) {
        values.add(frontMatterValue);
      }
    });
    
    return Array.from(values)
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      .map(value => ({ value, label: value }));
  };

  // Memoize filter options to prevent unnecessary recalculations
  const filterOptions = useMemo(() => {
    // Iterate through each filter type (tags, level, etc.) defined in FILTER_CONFIGS
    return Object.keys(FILTER_CONFIGS).reduce((acc, filterKey) => ({
      ...acc,
      // For each filter type, generate an array of available options
      // by calling getFilterOptions which extracts unique values from quickstartData
      [filterKey]: getFilterOptions(filterKey)
    }), {});
  }, [quickstartData]);

  const updateUrlParams = useCallback((filters) => {
    const params = new URLSearchParams(location.search);
    
    // Clear existing filter params
    Object.keys(FILTER_CONFIGS).forEach(key => {
      params.delete(FILTER_CONFIGS[key].urlParam);
    });

    // Add new filter params
    Object.entries(filters).forEach(([key, selected]) => {
      if (selected?.length > 0) {
        params.set(
          FILTER_CONFIGS[key].urlParam,
          selected.map(item => item.value).join(',')
        );
      }
    });

    const queryString = params.toString();
    const newUrl = queryString 
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;

    window.history.pushState({}, '', newUrl);
  }, [location.search]);

  const handleDataFilter = useCallback(() => {
    // Reset search when filters change
    setSearchInput('');
    
    // If no filters are selected, reset to original data
    if (Object.values(selectedFilters).every(selected => !selected?.length)) {
      setFilteredData(quickstartData);
      return;
    }

    const filteredGuides = quickstartData.filter((guide) => {
      return Object.entries(selectedFilters).every(([filterKey, selected]) => {
        if (!selected?.length) return true;
        
        const config = FILTER_CONFIGS[filterKey];
        const guideValue = guide?.data?.[config.frontMatterKey];
        
        if (config.isArray) {
          return selected.some(item => guideValue?.includes(item.value));
        }
        return selected.some(item => guideValue === item.value);
      });
    });
    setFilteredData(filteredGuides);
  }, [quickstartData, selectedFilters]);

  // Read URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filtersFromUrl = {};
    
    // Only add filters that actually exist in the URL
    Object.keys(FILTER_CONFIGS).forEach(filterKey => {
      const config = FILTER_CONFIGS[filterKey];
      const paramValue = params.get(config.urlParam);
      if (paramValue) {
        filtersFromUrl[filterKey] = paramValue.split(',').map(value => ({ 
          value, 
          label: value 
        }));
      }
    });
    
    setSelectedFilters(filtersFromUrl);
  }, [location.search]);

  useEffect(() => {
    updateUrlParams(selectedFilters);
  }, [selectedFilters, location.pathname]);

  // Separating out useEffects because we want to run handleDataFilter after the URL params are set
  // Also just good practice to separate out side effects with different functions
  useEffect(() => {
    handleDataFilter();
  }, [selectedFilters, quickstartData]);

  // Function to organize guides by section
  const organizedGuides = useMemo(() => {
    // First check if there's a search term
    if (searchInput.trim()) {
      const searchLower = searchInput.toLowerCase();
      const searchResults = quickstartData.filter((guide) => {
        const title = guide.data.title?.toLowerCase() || '';
        return title.includes(searchLower)
      });
      return {
        filtered: searchResults
      };
    }

    // Then check if any filters are actually selected
    const hasActiveFilters = Object.values(selectedFilters)
      .some(selected => selected && selected.length > 0);

    if (hasActiveFilters) {
      return {
        filtered: filteredData
      };
    }

    // When no filters are active and no search term, use the original categorized view
    return CONFIG?.categories?.reduce((acc, category) => {
      // Get the guides for this category
      const categoryGuides = quickstartData.filter(guide => 
        category.guides?.includes(guide.data.id)
      );
      
      // Sort the guides based on their position in the category.guides array
      const sortedGuides = categoryGuides.sort((a, b) => {
        const indexA = category.guides.indexOf(a.data.id);
        const indexB = category.guides.indexOf(b.data.id);
        return indexA - indexB;
      });
      
      return {
        ...acc,
        [normalizeTitle(category.title)]: sortedGuides
      };
    }, {}) || {};
  }, [filteredData, selectedFilters, quickstartData, searchInput, favorites]);

  // Add this useEffect to load favorites
  useEffect(() => {
    const favoriteIds = JSON.parse(localStorage.getItem('favoriteGuides') || '[]');
    const favoriteGuides = quickstartData.filter(guide => 
      favoriteIds.includes(guide.data.id)
    );
    setFavorites(favoriteGuides);
  }, [quickstartData]);

  // Scroll listener for mobile filter
  useEffect(() => {
    const handleScroll = () => {
      const scrolledUp = window.scrollY < (window.lastScrollY || 0);
      window.lastScrollY = window.scrollY;
      setIsScrolled(scrolledUp);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search input
  const handleSearch = useCallback((searchTerm) => {
    setSearchInput(searchTerm);
  }, []);

  // Handler for favorites with immediate state update
  const handleFavoriteUpdate = useCallback((guideId, isFavorited) => {
    console.log('handleFavoriteUpdate called:', { guideId, isFavorited });
    
    // Get current favorites from localStorage
    const favoriteIds = JSON.parse(localStorage.getItem('favoriteGuides') || '[]');
    console.log('Current favoriteIds:', favoriteIds);
    
    let newFavoriteIds;
    if (isFavorited) {
      newFavoriteIds = [...favoriteIds, guideId];
    } else {
      newFavoriteIds = favoriteIds.filter(id => id !== guideId);
    }
    
    // Update localStorage with new favorites
    localStorage.setItem('favoriteGuides', JSON.stringify(newFavoriteIds));
    
    // Update state with new favorites
    const newFavorites = quickstartData.filter(guide => 
      newFavoriteIds.includes(guide.data.id)
    );
    console.log('New favorites:', newFavorites);
    
    setFavorites(newFavorites);
  }, [quickstartData]);

  // Separate favorites section render
  const renderFavoritesSection = () => {
    if (!favorites || favorites.length === 0) return null;
    
    return (
      <GuideSection
        title="Favorites"
        guides={favorites}
        onFavoriteUpdate={handleFavoriteUpdate}
      />
    );
  };

  return (
    <Layout>
      <Head>
        <title>{metaTitle}</title>
        <meta property="og:title" content={metaTitle} />
        <meta 
          property="og:description" 
          content={description} 
        />
      </Head>
      <Hero
        heading={title}
        subheading={description}
        showGraphic={false}
        customStyles={{ marginBottom: 0 }}
        classNames={styles.quickstartHero}
        colClassNames={styles.quickstartHeroCol}
        lightBackground={true}
      >
          <SearchInput
            value={searchInput}
            onChange={handleSearch}
            placeholder="Search guides..."
            classNames={styles.searchInput}
          />
   
      </Hero>
      <section id='quickstart-card-section' className={styles.quickstartCardSection}>
        <div className={`${styles.quickstartFilterContainer} ${isScrolled ? styles.scrolled : ''} ${isFilterExpanded ? styles.expanded : ''}`}>
          <div className={styles.filterHeader} onClick={() => setIsFilterExpanded(!isFilterExpanded)}>
            <h3>Filter by</h3>
            <button className={`${styles.expandButton} ${isFilterExpanded ? styles.expanded : ''}`}>
              <span className={styles.arrow}>▼</span>
            </button>
          </div>
          <div className={`${styles.filterContent} ${isFilterExpanded ? styles.expanded : ''}`}>
            {Object.entries(FILTER_CONFIGS).map(([key, config]) => (
              filterOptions[key]?.length > 0 && (
                <CheckboxGroup
                  key={key}
                  options={filterOptions[key]}
                  selectedValues={selectedFilters[key] || []}
                  onChange={(selected) => setSelectedFilters(prev => ({
                    ...prev,
                    [key]: selected
                  }))}
                  label={config.label}
                />
              )
            ))}
            <button 
              className={styles.clearAllFiltersButton}
              onClick={() => {
                setSelectedFilters({});
                setFilteredData(quickstartData);
              }}
            >
              Clear all
            </button>
          </div>
        </div>
        <div className={styles.quickstartCardWrapper}>
          {searchInput.trim() ? (
            // Show search results
            organizedGuides.filtered?.length > 0 ? (
              <div className={styles.quickstartCardContainer}>
                {organizedGuides.filtered.map((guide) => (
                  <QuickstartGuideCard 
                    frontMatter={guide.data} 
                    key={guide.data.id || guide.index}
                    onFavoriteUpdate={handleFavoriteUpdate}
                  />
                ))}
              </div>
            ) : (
              <p>No guides found matching your search.</p>
            )
          ) : Object.values(selectedFilters).some(selected => selected?.length > 0) ? (
            // Show filtered results
            filteredData.length > 0 ? (
              <div className={styles.quickstartCardContainer}>
                {filteredData.map((guide) => (
                  <QuickstartGuideCard 
                    frontMatter={guide.data} 
                    key={guide.data.id || guide.index}
                    onFavoriteUpdate={handleFavoriteUpdate}
                  />
                ))}
              </div>
            ) : (
              <p>No quickstarts are available with the selected filters.</p>
            )
          ) : (
            // Show categorized view
            <>
              {renderFavoritesSection()}
              {CONFIG?.categories?.map((category) => (
                <GuideSection
                  key={normalizeTitle(category.title)}
                  title={category.title}
                  guides={organizedGuides[normalizeTitle(category.title)]}
                  onFavoriteUpdate={handleFavoriteUpdate}
                />
              ))}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}

export default QuickstartList;
