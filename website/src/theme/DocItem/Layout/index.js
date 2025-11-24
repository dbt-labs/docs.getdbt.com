import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import {useWindowSize} from '@docusaurus/theme-common';
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemContent from '@theme/DocItem/Content';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import styles from './styles.module.css';

/* dbt Customizations:
 * Import TOC & TOCCollapsible components, ThemeClassNames, VersionContext & getElements util
 * Get metadata from useDoc()
 * Replace DocItemTOCDesktop with TOC component
 * to avoid swizzling DocItemTOCDesktop component.
 * Pass custom featured_cta and editUrl props to TOC
 * Get headers and rebuild ToC to hide headers not available in current version
 * Show ToC if tocReady = true 
 * Add tocLoader styles
*/ 
import DocSearchWeight from '@site/src/components/docSearchWeight';
import TOC from '@theme/TOC';
import TOCCollapsible from '@theme/TOCCollapsible';
import {ThemeClassNames} from '@docusaurus/theme-common';
import VersionContext from '../../../stores/VersionContext'
import getElements from '../../../utils/get-html-elements';
import useHashLink from '../../../utils/use-hash-link';
import removeTrailingDashes from '../../../utils/remove-trailing-slashes';
import CopyPage from '@site/src/components/copyPage';
import StructuredData from '@site/src/components/StructuredData';

/**
 * Decide if the toc should be rendered, on mobile or desktop viewports
 */
function useDocTOC() {
  const {frontMatter, toc, metadata} = useDoc();

  // dbt Custom: If term has cta property set, show that cta
  const termCTA = frontMatter?.cta && frontMatter.cta

  // This hides any TOC items not in
  // html markdown headings for current version. 
  const { version: dbtVersion } = useContext(VersionContext)
  const [currentToc, setCurrentToc] = useState(toc)
  const [tocReady, setTocReady] = useState(true)

  async function fetchElements() {
    // get html elements
    const headings = await getElements(
      ".markdown h1, .markdown h2, .markdown h3, .markdown h4, .markdown h5, .markdown h6"
    );

    // Headings to remove from TOC
    const headingsToFilter = document.querySelectorAll(
      ".tabs-container h2, .tabs-container h3, .expandable-anchor h2, .expandable-anchor h3"
    );
    
    // if headings exist on page
    // compare against toc
    if(toc && headings && headings.length) {
      // make new TOC object 
      let updated = Array.from(headings).reduce((acc, item) => {
        // Filter out TOC items from tabs
        const shouldFilter = Array?.from(headingsToFilter)?.find(
          (thisHeading) => thisHeading?.id === item?.id
        );
        if (shouldFilter) {
          return acc;
        }

        // If heading id and toc item id match found
        // include in updated toc
        let found = toc.find((heading) => heading.id.includes(item.id));
        // If toc item is not in headings
        // do not include in toc
        // This means heading is versioned

        let makeToc = (heading) => {
          let level;
          if (heading.nodeName === "H2") {
            level = 2;
          } else if (heading.nodeName === "H3") {
            level = 3;
          } else {
            level = null;
          }

          // Remove trailing slashes from TOC item
          // Trailing slashes come from the LifeCycle pill use on headers
          const updatedHeading = removeTrailingDashes(heading)

          return {
            value: updatedHeading.innerHTML,
            id: updatedHeading.id,
            level: level && level,
          };
        };

        // If heading is in current version
        // include in updated toc
        if (found) {
          acc.push(makeToc(item));
        } else if (!found) {
          acc.push(makeToc(item));
        } else {
          null;
        }

        return acc;
      }, [])

      // If updated toc different than current
      // If so, show loader and update toc 
      if(currentToc !== updated) {
        setTocReady(false)
        // This timeout provides enough time to show the loader
        // Otherwise the content updates immediately
        // and toc content appears to flash with updates
        setTimeout(() => {
          setCurrentToc(updated)
          setTocReady(true)
        }, 500)
      } else {
        setTocReady(true)
      }
    } else {
      setTocReady(true)
    }
    useHashLink()
  }

  useEffect(() => {
      fetchElements()
  }, [toc, dbtVersion])

  // end dbt Custom

  const windowSize = useWindowSize();
  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;
  const mobile = canRender ? <TOCCollapsible
    toc={currentToc}
    minHeadingLevel={frontMatter.toc_min_heading_level}
    maxHeadingLevel={frontMatter.toc_max_heading_level}
    className={clsx(ThemeClassNames.docs.docTocMobile, styles.tocMobile)}
  /> : undefined;
  const desktop =
    canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? (
      <>
        {tocReady ? (
          <TOC
            toc={currentToc}
            minHeadingLevel={frontMatter.toc_min_heading_level}
            maxHeadingLevel={frontMatter.toc_max_heading_level}
            className={ThemeClassNames.docs.docTocDesktop}
            featured_cta={termCTA && termCTA}
            editUrl={metadata?.editUrl && metadata.editUrl} 
          />
        ) : (
          <img
            className={styles.tocLoader} 
            src="/img/loader-icon.svg" 
            alt="Loading" 
            title="Loading" 
          />
        )}
      </>
    ) : undefined;
  return {
    hidden,
    mobile,
    desktop,
  };
}
export default function DocItemLayout({children}) {
  const docTOC = useDocTOC();

  // dbt Custom
  // If the page has a search_weight value, apply that value
  const {frontMatter, metadata} = useDoc();
  const searchWeight = frontMatter?.search_weight && frontMatter.search_weight

  // Get site URL from Docusaurus config so we can build a canonical, fully-qualified URL
  const { siteConfig } = useDocusaurusContext();

  // Construct full URL for structured data
  const location = useLocation();
  const isGuidesRoute = location.pathname.includes('/guides/');
  const siteUrl = siteConfig?.url || '';
  const fullUrl = `${siteUrl}${location.pathname}${location.search}${location.hash}`;

  // Format date for structured data (use lastUpdatedAt if available)
  const formatDate = (timestamp) => {
    if (!timestamp) return undefined;
    return new Date(timestamp).toISOString();
  };

  return (
    <div className="row">
      <StructuredData
        title={frontMatter?.title}
        description={frontMatter?.description || frontMatter?.hoverSnippet}
        url={fullUrl}
        date={formatDate(metadata?.lastUpdatedAt)}
        tags={frontMatter?.tags || []}
        totalTime={frontMatter?.time_to_complete}
      />
      <div className={clsx('col', !docTOC.hidden && styles.docItemCol)}>
        <DocVersionBanner />
        <div className={styles.docItemContainer}>
          <article>
          <div className={styles.copyPageContainer}>
            <DocBreadcrumbs />
            <CopyPage dropdownRight={isGuidesRoute} pageUrl={fullUrl} />
            </div>
            <DocVersionBadge />
            {docTOC.mobile}
            <DocItemContent>{children}</DocItemContent>
            <DocSearchWeight weight={searchWeight} />
            <DocItemFooter />
          </article>
          <DocItemPaginator />
        </div>
      </div>
      {docTOC.desktop && <div className="col col--3">{docTOC.desktop}</div>}
    </div>
  );
}
