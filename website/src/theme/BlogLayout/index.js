/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar';
import TOC from '@theme/TOC';

// dbt Custom 
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import {usePluginData} from '@docusaurus/useGlobalData';
import CTA from '../../components/cta';

function BlogLayout(props) {
  const {title, description, blogPageTitle, sidebar, toc, children, ...layoutProps} = props;
  const hasSidebar = sidebar && sidebar.items.length > 0;

  // dbt Custom 
  const { blogMeta, tagData } = usePluginData('docusaurus-build-blog-data-plugin');
  const { 
    featured_image, 
    featured_cta, 
    show_title, 
    show_description,
    hero_button_url,
    hero_button_text,
    hero_button_new_tab
  } = blogMeta

  // The pageTitle variable sets the final item in breadcrumbs
  let breadcrumbTitle = undefined
  if(blogPageTitle) {
    // Set to blogPageTitle prop
    breadcrumbTitle = blogPageTitle
  } else if(title) {
    // Set to title prop
    breadcrumbTitle = title
  } else if (layoutProps.pageClassName === "blog-post-page") {
    // Set to blog post title
    const { props: { frontMatter }} = children.find(child => child.props.frontMatter)
    breadcrumbTitle = frontMatter.title
  }

  return (
    <Layout {...layoutProps}>

        {/* dbt Custom */}
        {featured_image && featured_image !== "" ? (
          <>
            <Head>
              <meta property="og:image" content={featured_image} />
              <meta property="twitter:image" content={featured_image} />
            </Head>
            <Link to="/blog">
              <div className="blog-hero" style={{backgroundImage: `url(${featured_image}`}}></div>
            </Link>
          </>
        ) : ''}
        {/* end dbt Custom */}
        
      {layoutProps.pageClassName && layoutProps.pageClassName === "blog-list-page" &&
        ((show_title || show_description) && (title || description)) && (
          <div className="blog-index-header">
            <div className="container margin-vert--lg">
              <div className="admonition alert card large light blog-hero-card">
                <div className="blog-hero-card-content">
                  {title && show_title && <h1>{title}</h1>}
                  {description && show_description && <p>{description}</p>}
                  {blogMeta.test}
                  {(hero_button_text !== "" && hero_button_text !== "") && (
                    hero_button_new_tab ? (
                      <a 
                        className="button button--primary" 
                        href={hero_button_url} 
                        title={hero_button_text}
                        target="_blank"
                      >{hero_button_text}</a>
                    ) : (
                      <Link 
                        className="button button--primary" 
                        to={hero_button_url} 
                        title={hero_button_text}
                      >{hero_button_text}</Link>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      }

      <div className="blog-breadcrumbs">
        <div className="container">
          <Link to="/" title="Home">Home</Link>
          <Link to="/blog" title="Blog">Blog</Link>
          {(layoutProps.pageClassName !== "blog-list-page" && breadcrumbTitle) && 
            <Link to="#" title={breadcrumbTitle}>
              {breadcrumbTitle}
            </Link>
          }
        </div>
      </div>
      
      <div className="mobile-toc-section container">
        {toc && (
          <div className="mobile-toc-container">
            <div 
              id="mobile-toc-dropdown"
              className="tocCollapsible_node_modules-@docusaurus-theme-classic-lib-next-theme-TOCCollapsible-styles-module theme-doc-toc-mobile tocMobile_node_modules-@docusaurus-theme-classic-lib-next-theme-DocItem-styles-module"
            >
              <button type="button" className="clean-btn tocCollapsibleButton_node_modules-@docusaurus-theme-classic-lib-next-theme-TOCCollapsible-styles-module" onClick={handleTocClick}>On this page</button>
              <TOC toc={toc} />
            </div>
          </div>
        )}
      </div>

      <div className="row blog-main-row">
        {hasSidebar && (
          <aside className="col col--2 blog-aside">
            <BlogSidebar sidebar={sidebar} tagData={tagData} />
          </aside>
        )}
        <main
          className={clsx('col main-blog-container', {
            'col--7': hasSidebar,
            'col--8 col--offset-1': !hasSidebar && layoutProps.pageClassName,
            'col--9 col--offset-1': !hasSidebar && !layoutProps.pageClassName,
          })}
          itemScope
          itemType="http://schema.org/Blog">
          <div className="container margin-vert--lg">
            {children}
          </div>
        </main>
        {layoutProps.pageClassName &&
          <div className="col col--3 blog-right-sidebar">
            {toc && (
              <TOC toc={toc} />
            )}
            {featured_cta && (
              <CTA cta={featured_cta} />
            )}
          </div>
        }
      </div>
    </Layout>
  );
}

// Show or hide table of contents for mobile
function handleTocClick(e) {
  const tocButton = document.querySelector('#mobile-toc-dropdown > button')
  const toc = document.querySelector('#mobile-toc-dropdown > div')

  if(toc.classList.contains('tocActive')) {
    toc.classList.remove('tocActive')
    tocButton.classList.remove('tocActive')
  } else {
    toc.classList.add('tocActive')
    tocButton.classList.add('tocActive')

  }
}

export default BlogLayout;
