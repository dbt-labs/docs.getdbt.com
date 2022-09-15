/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import BlogLayout from '@theme/BlogLayout';
import BlogPostItem from '@theme/BlogPostItem';
import BlogListPaginator from '@theme/BlogListPaginator';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {usePluginData} from '@docusaurus/useGlobalData';

function BlogListPage(props) {
  const {metadata, items, sidebar} = props;
  const {
    siteConfig: {title: siteTitle},
  } = useDocusaurusContext();
  const {blogDescription, blogTitle, permalink} = metadata;
  const isBlogOnlyMode = permalink === '/';
  const title = isBlogOnlyMode ? siteTitle : blogTitle;

  // dbt Custom 
  const { 
    blogMeta,
    tagData
    } = usePluginData('docusaurus-build-global-data-plugin');
  const { 
    featured_posts_count,
    regular_posts_count
  } = blogMeta

  // Sort posts by date then title
  const handlePostsSort = (a, b) => {
    const { date: a_date, title: a_title } = a.content.frontMatter
    const { date: b_date, title: b_title } = b.content.frontMatter
    return b_date - a_date || a_title.localeCompare(b_title)
  }

  // Set Featured Posts
  const featuredPosts = items
    .filter(post => post.content.frontMatter.is_featured)
    .slice(0, featured_posts_count ? featured_posts_count : 2)
  
  // Get all non-featured posts
  let allOtherPosts = items
    .filter(post => !post.content.frontMatter.is_featured)
  
  // Get all featured posts 
  // which aren't included in featured posts section
  const allOtherFeaturedPosts = items
    .filter(post => post.content.frontMatter.is_featured)
    .slice(featured_posts_count ? featured_posts_count : 2)
  
  // Group together all posts not featured
  allOtherPosts = allOtherPosts.concat(allOtherFeaturedPosts)    

  return (
    <BlogLayout
      title={title}
      description={blogDescription}
      wrapperClassName={ThemeClassNames.wrapper.blogPages}
      pageClassName={ThemeClassNames.page.blogListPage}
      searchMetadatas={{
        // assign unique search tag to exclude this page from search results!
        tag: 'blog_posts_list',
      }}
      sidebar={sidebar}>
      
      {/* Featured Posts */}
      <section className="blog-index-posts-section">
        <h3>Featured Posts</h3>
        <div>
          {featuredPosts
            .sort(handlePostsSort)
            .map(({content: BlogPostContent}) => (
              <BlogPostItem
                key={BlogPostContent.metadata.permalink}
                frontMatter={BlogPostContent.frontMatter}
                assets={BlogPostContent.assets}
                metadata={BlogPostContent.metadata}
                truncated={BlogPostContent.metadata.truncated}>
                <BlogPostContent />
              </BlogPostItem>
            ))}
        </div>
      </section>
      
      <section className="blog-index-posts-section blog-index-other-posts">
        <h3>Recent Posts</h3>
        <div>
          {allOtherPosts
            .sort(handlePostsSort)
            .slice(0, regular_posts_count ? regular_posts_count : 15)
            .map(({content: BlogPostContent}) => (
              <BlogPostItem
                key={BlogPostContent.metadata.permalink}
                frontMatter={BlogPostContent.frontMatter}
                assets={BlogPostContent.assets}
                metadata={BlogPostContent.metadata}
                truncated={BlogPostContent.metadata.truncated}>
                <BlogPostContent />
              </BlogPostItem>
            ))}
        </div>
      </section>

      {/* <BlogListPaginator metadata={metadata} /> */}
    </BlogLayout>
  );
}

export default BlogListPage;
