/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Swizzled on 10-15-21
 * 
 * Custom dbtLabs Changes:
 * - Add image above title for blog posts
 */

import React, { useEffect } from 'react';
import clsx from 'clsx';
import {MDXProvider} from '@mdx-js/react';
import Translate, {translate} from '@docusaurus/Translate';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import {usePluralForm} from '@docusaurus/theme-common';
import MDXComponents from '@theme/MDXComponents';
import EditThisPage from '@theme/EditThisPage';
import styles from './styles.module.css';
import TagsListInline from '@theme/TagsListInline';
import BlogPostAuthors from '@theme/BlogPostAuthors'; // Very simple pluralization: probably good enough for now

function useReadingTimePlural() {
  const {selectMessage} = usePluralForm();
  return (readingTimeFloat) => {
    const readingTime = Math.ceil(readingTimeFloat);
    return selectMessage(
      readingTime,
      translate(
        {
          id: 'theme.blog.post.readingTime.plurals',
          description:
            'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
          message: 'One min read|{readingTime} min read',
        },
        {
          readingTime,
        },
      ),
    );
  };
}

function BlogPostItem(props) {
  const readingTimePlural = useReadingTimePlural();
  const {withBaseUrl} = useBaseUrlUtils();
  const {
    children,
    frontMatter,
    assets,
    metadata,
    truncated,
    isBlogPostPage = false,
  } = props;
  const {
    date,
    formattedDate,
    permalink,
    tags,
    readingTime,
    title,
    editUrl,
    authors,
  } = metadata;
  const image = assets.image ?? frontMatter.image ?? '/img/avatar.png';

  const renderPostHeader = () => {
    const TitleHeading = isBlogPostPage ? 'h1' : 'h2';
    return (
      <header>
        <TitleHeading className={styles.blogPostTitle} itemProp="headline">
          
          {isBlogPostPage ? (
            title
          ) : (
            <Link itemProp="url" to={permalink}>
              {title}
            </Link>
          )}
        </TitleHeading>
        <div className={clsx(styles.blogPostData, 'margin-vert--md')}>
          <time dateTime={date} itemProp="datePublished">
            {formattedDate}
          </time>

          {typeof readingTime !== 'undefined' && (
            <>
              {' · '}
              {readingTimePlural(readingTime)}
            </>
          )}
        </div>
        <BlogPostAuthors authors={authors} assets={assets} />
      </header>
    );
  };

  // dbt custom - send blog context to datalayer to send to snowplow
  useEffect(() => {
    let blogContext = {
      event: 'blogContext',
      blogAuthor: '',
      blogCategory: '',
      blogDate: formattedDate ? formattedDate : undefined
    }

    if(authors && authors.length > 0) {
      authors.map((author, i) => {
        blogContext.blogAuthor += 
          `${author.name}${i !== authors.length - 1 ? ', ' : ''}`
      })
    }
    
    if(tags && tags.length > 0) {
      tags.map((tag, i) => {
        blogContext.blogCategory += 
          `${tag.label}${i !== tags.length - 1 ? ', ' : ''}`
      })
    }

    // Only send to datalayer if blog post page
    if(isBlogPostPage) {
      window.dataLayer = window.dataLayer || [];
      dataLayer && dataLayer.push(blogContext)
    }
  }, [])

  return (
    <>
      {frontMatter.canonical_url && (
        <Head>
          <link rel="canonical" href={frontMatter.canonical_url} />
        </Head>
      )}
      <article
        className={!isBlogPostPage ? 'blog-list-item' : undefined}
        itemProp="blogPost"
        itemScope
        itemType="http://schema.org/BlogPosting">
        {renderPostHeader()}

        {image && (
          <meta
            itemProp="image"
            content={withBaseUrl(image, {
              absolute: true,
            })}
          />
        )}

        <div className="markdown" itemProp="articleBody">
          <MDXProvider components={MDXComponents}>{children}</MDXProvider>
        </div>

        {(tags.length > 0 || truncated) && (
          <footer
            className={clsx('row docusaurus-mt-lg', {
              [styles.blogPostDetailsFull]: isBlogPostPage,
            })}>
            {tags.length > 0 && (
              <div
                className={clsx('col', {
                  'col--9': !isBlogPostPage,
                })}>
                <TagsListInline tags={tags} />
              </div>
            )}

            {isBlogPostPage && editUrl && (
              <div className="col margin-top--sm">
                <EditThisPage editUrl={editUrl} />
              </div>
            )}

            {!isBlogPostPage && truncated && (
              <div className="col col--3 text--right">
                <Link
                  to={metadata.permalink}
                  aria-label={`Read more about ${title}`}>
                  <b>
                    <Translate
                      id="theme.blog.post.readMore"
                      description="The label used in blog post item excerpts to link to full blog posts">
                      Read More
                    </Translate>
                  </b>
                </Link>
              </div>
            )}
          </footer>
        )}
      </article>
    </>
  );
}

export default BlogPostItem;
