/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import DocPaginator from '@theme/DocPaginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import Seo from '@theme/Seo';
import DocItemFooter from '@theme/DocItemFooter';
import TOC from '@theme/TOC';
import TOCCollapsible from '@theme/TOCCollapsible';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import { ThemeClassNames, useWindowSize } from '@docusaurus/theme-common';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';

// dbt Custom
import VersionContext from '../../stores/VersionContext'
import getElements from '../../utils/get-html-elements';

export default function DocItem(props) {
  const { content: DocContent } = props;
  const { metadata, frontMatter, assets } = DocContent;
  const {
    keywords,
    hide_title: hideTitle,
    hide_table_of_contents: hideTableOfContents,
    toc_min_heading_level: tocMinHeadingLevel,
    toc_max_heading_level: tocMaxHeadingLevel,
  } = frontMatter;
  const { description, title } = metadata;
  const image = assets.image ?? frontMatter.image; // We only add a title if:
  // - user asks to hide it with front matter
  // - the markdown content does not already contain a top-level h1 heading

  const shouldAddTitle =
    !hideTitle && typeof DocContent.contentTitle === 'undefined';
  const windowSize = useWindowSize();
  const canRenderTOC =
    !hideTableOfContents && DocContent.toc && DocContent.toc.length > 0;
  const renderTocDesktop =
    canRenderTOC && (windowSize === 'desktop' || windowSize === 'ssr');

  // dbt Custom
  // If term has cta property set, show that cta
  const termCTA = frontMatter?.cta && frontMatter.cta

  // This hides any TOC items not in
  // html markdown headings for current version. 
  const { version: dbtVersion } = useContext(VersionContext)
  const [currentToc, setCurrentToc] = useState(DocContent.toc)
  const [tocReady, setTocReady] = useState(true)
  useEffect(() => {
    async function fetchElements() {
      // get html elements
      const headings = await getElements(".markdown h1, .markdown h2, .markdown h3, .markdown h4, .markdown h5, .markdown h6")
      // if headings exist on page
      // compare against toc
      if (DocContent.toc && headings && headings.length) {
        // make new TOC object 
        let updated = Array.from(headings).reduce((acc, item) => {
          // If heading id and toc item id match found
          // include in updated toc
          let found = DocContent.toc.find(heading =>
            heading.id.includes(item.id)
          )
          // If toc item is not in headings
          // do not include in toc
          // This means heading is versioned

          let makeToc = (heading) => {
            let level;
            if (heading.nodeName === "H2") {
              level = 2
            } else if (heading.nodeName === "H3") {
              level = 3
            } else {
              level = null
            }

            return {
              value: heading.innerHTML,
              id: heading.id,
              level: level && level
            }
          }

          if (found) {
            acc.push(makeToc(item))
          } else if (!found) {
            acc.push(makeToc(item))
          } else {
            null
          }

          return acc
        }, [])

        // If updated toc different than current
        // If so, show loader and update toc 
        if (currentToc.length !== updated.length) {
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
    }
    fetchElements()
  }, [DocContent, dbtVersion])
  // end dbt Custom

  return (
    <>
      <Seo
        {...{
          title,
          description,
          keywords,
          image,
        }}
      />

      <div className="row">
        <div
          className={clsx('col', {
            [styles.docItemCol]: !hideTableOfContents,
          })}>
          <DocVersionBanner />
          <div className={styles.docItemContainer}>
            <article>
              <DocBreadcrumbs />
              <DocVersionBadge />

              {canRenderTOC && (
                <TOCCollapsible
                  toc={currentToc}
                  minHeadingLevel={tocMinHeadingLevel}
                  maxHeadingLevel={tocMaxHeadingLevel}
                  className={clsx(
                    ThemeClassNames.docs.docTocMobile,
                    styles.tocMobile,
                  )}
                />
              )}

              <div
                className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
                {/*
                 Title can be declared inside md content or declared through
                 front matter and added manually. To make both cases consistent,
                 the added title is added under the same div.markdown block
                 See https://github.com/facebook/docusaurus/pull/4882#issuecomment-853021120
                 */}
                {shouldAddTitle && (
                  <header>
                    <Heading as="h1">{title}</Heading>
                  </header>
                )}

                <DocContent />
              </div>

              <DocItemFooter {...props} />
            </article>

            <DocPaginator previous={metadata.previous} next={metadata.next} />
          </div>
        </div>
        {renderTocDesktop && (
          <div className="col col--3">
            {tocReady ? (
              <TOC
                toc={currentToc}
                minHeadingLevel={tocMinHeadingLevel}
                maxHeadingLevel={tocMaxHeadingLevel}
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
          </div>
        )}
      </div>
    </>
  );
}
