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
    } = usePluginData('docusaurus-build-blog-data-plugin');
  const { 
    featured_posts_count,
    featured_tag_posts_count
  } = blogMeta

  // Set Featured Posts
  const featuredPosts = items
    .slice(0, featured_posts_count ? featured_posts_count : 2)
    .filter(post => post.content.frontMatter.is_featured)

  // Set Featured Categories
  const featuredCategories = tagData.filter(tag => tag && tag.is_featured)
  console.log('featuredCategories', featuredCategories)
  console.log('items', items)
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
          {featuredPosts.map(({content: BlogPostContent}) => (
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

      {/* Posts by Featured Tags */}
      {featuredCategories && featuredCategories.map(category => {
        const recentPosts = items
          .filter(post => {
            const lowercaseTags = post.content.frontMatter.tags.map(tag => tag.toLowerCase())
            console.log('lowercaseTags', lowercaseTags)
            if(lowercaseTags.includes(category.name.toLowerCase()))
              return true
          })
        if(!category)
          return null

        const { name, display_title, description, slug } = category
        return (
          <section className="blog-index-posts-section" key={display_title ? display_title : name}>
            <h3>
              <Link to={`/blog/tags/${slug}`}>{display_title ? display_title : name}</Link>
            </h3>
            <p>{description}</p>
            <div>
              {recentPosts.slice(0, featured_tag_posts_count ? featured_tag_posts_count : 4).map(({content: BlogPostContent}) => (
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
        )}
      )}

      {/* <BlogListPaginator metadata={metadata} /> */}
    </BlogLayout>
  );
}

export default BlogListPage;
