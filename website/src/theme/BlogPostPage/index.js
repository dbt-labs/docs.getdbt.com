import React, { useEffect } from 'react';
import clsx from 'clsx';
import {HtmlClassNameProvider, ThemeClassNames} from '@docusaurus/theme-common';
import {BlogPostProvider, useBlogPost} from '@docusaurus/theme-common/internal';
import BlogLayout from '@theme/BlogLayout';
import BlogPostItem from '@theme/BlogPostItem';
import BlogPostPaginator from '@theme/BlogPostPaginator';
import BlogPostPageMetadata from '@theme/BlogPostPage/Metadata';
import TOC from '@theme/TOC';
import TOCCollapsible from '@theme/TOCCollapsible';
import styles from './styles.module.css';
import { DiscourseBlogComments } from '@site/src/components/discourseBlogComments';
import { useDateTimeFormat } from "@docusaurus/theme-common/internal";

/* dbt Customizations:
 * Import global data from plugin
 * Import TOCCollapsible and custom styles
 * Gets authors, tags, date from metadata
 * Format date using theme's method for date formatting
 * Send authors, tags, date to snowplow
 * Passes post title prop BlogLayout to display in breadcrumbs 
 * Get featured_cta from global data and pass to TOC
*/
import {usePluginData} from '@docusaurus/useGlobalData';

function BlogPostPageContent({sidebar, children}) {
  const { metadata, toc } = useBlogPost();
  const { nextItem, prevItem, frontMatter, authors, tags, date } =
    metadata;
  const {
    hide_table_of_contents: hideTableOfContents,
    toc_min_heading_level: tocMinHeadingLevel,
    toc_max_heading_level: tocMaxHeadingLevel,
  } = frontMatter;

  // Use same date formatting as in theme's BlogPostItem component
  // https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-theme-classic/src/theme/BlogPostItem/Header/Info/index.tsx
  const dateTimeFormat = useDateTimeFormat({
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const formatDate = (blogDate) => dateTimeFormat.format(new Date(blogDate));

  // dbt Custom - send blog post context to datalayer to send to snowplow
  useEffect(() => {
    let blogContext = {
      event: "blogContext",
      blogAuthor: "",
      blogCategory: "",
      blogDate: date ? formatDate(date) : undefined,
    };

    if (authors && authors.length > 0) {
      authors.map((author, i) => {
        author?.name &&
          (blogContext.blogAuthor += `${author.name}${i !== authors.length - 1 ? ", " : ""}`);
      });
    }

    if (tags && tags.length > 0) {
      tags.map((tag, i) => {
        tag?.label &&
          (blogContext.blogCategory += `${tag.label}${i !== tags.length - 1 ? ", " : ""}`);
      });
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer && window.dataLayer.push(blogContext);
  }, []);

  const { blogMeta } = usePluginData("docusaurus-build-global-data-plugin");
  const { featured_cta } = blogMeta;

  return (
    <BlogLayout
      sidebar={sidebar}
      title={frontMatter?.title}
      description={frontMatter?.description}
      toc={
        !hideTableOfContents && toc.length > 0 ? (
          <TOC
            toc={toc}
            minHeadingLevel={tocMinHeadingLevel}
            maxHeadingLevel={tocMaxHeadingLevel}
            featured_cta={featured_cta}
          />
        ) : undefined
      }
      isBlogPost={true}
    >
      {!hideTableOfContents && toc.length > 0 && (
        <TOCCollapsible
          toc={toc}
          minHeadingLevel={tocMinHeadingLevel}
          maxHeadingLevel={tocMaxHeadingLevel}
          className={clsx(ThemeClassNames.docs.docTocMobile, styles.tocMobile)}
        />
      )}

      <BlogPostItem>{children}</BlogPostItem>

      <DiscourseBlogComments
        title={frontMatter.title}
        slug={frontMatter.slug}
      />

      {(nextItem || prevItem) && (
        <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
      )}
    </BlogLayout>
  );
}
export default function BlogPostPage(props) {
  const BlogPostContent = props.content;
  return (
    <BlogPostProvider content={props.content} isBlogPostPage>
      <HtmlClassNameProvider
        className={clsx(
          ThemeClassNames.wrapper.blogPages,
          ThemeClassNames.page.blogPostPage,
        )}>
        <BlogPostPageMetadata />
        <BlogPostPageContent sidebar={props.sidebar}>
          <BlogPostContent />
        </BlogPostPageContent>
      </HtmlClassNameProvider>
    </BlogPostProvider>
  );
}
