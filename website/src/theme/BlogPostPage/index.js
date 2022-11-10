import React, { useEffect } from 'react';
import clsx from 'clsx';
import {HtmlClassNameProvider, ThemeClassNames} from '@docusaurus/theme-common';
import {BlogPostProvider, useBlogPost} from '@docusaurus/theme-common/internal';
import BlogLayout from '@theme/BlogLayout';
import BlogPostItem from '@theme/BlogPostItem';
import BlogPostPaginator from '@theme/BlogPostPaginator';
import BlogPostPageMetadata from '@theme/BlogPostPage/Metadata';
import TOC from '@theme/TOC';
function BlogPostPageContent({sidebar, children}) {
  const {metadata, toc} = useBlogPost();
  const {nextItem, prevItem, frontMatter, authors, tags, formattedDate} = metadata;
  const {
    hide_table_of_contents: hideTableOfContents,
    toc_min_heading_level: tocMinHeadingLevel,
    toc_max_heading_level: tocMaxHeadingLevel
  } = frontMatter;

  // dbt Custom - send blog post context to datalayer to send to snowplow
  useEffect(() => {
    let blogContext = {
      event: 'blogContext',
      blogAuthor: '',
      blogCategory: '',
      blogDate: formattedDate ? formattedDate : undefined
    }

    if(authors && authors.length > 0) {
      authors.map((author, i) => {
        author?.name && (
          blogContext.blogAuthor += 
            `${author.name}${i !== authors.length - 1 ? ', ' : ''}`
        )
      })
    }
    
    if(tags && tags.length > 0) {
      tags.map((tag, i) => {
        tag?.label && (
          blogContext.blogCategory += 
            `${tag.label}${i !== tags.length - 1 ? ', ' : ''}`
        )
      })
    }

    window.dataLayer = window.dataLayer || [];
    dataLayer && dataLayer.push(blogContext)
  }, [])

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
          />
        ) : undefined
      }>
      <BlogPostItem>{children}</BlogPostItem>

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
