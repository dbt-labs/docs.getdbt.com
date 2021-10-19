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
  const {title, description, sidebar, toc, children, ...layoutProps} = props;
  const hasSidebar = sidebar && sidebar.items.length > 0;

  // dbt Custom 
  const { blogMeta } = usePluginData('docusaurus-build-blog-data-plugin');
  const { 
    featured_image, 
    featured_cta, 
    show_title, 
    show_description 
  } = blogMeta

  return (
    <Layout {...layoutProps}>
  
        {/* dbt Custom */}
        {featured_image && featured_image !== "" ? (
          <>
            <Head>
              <meta property="og:image" content={featured_image} />
              <meta property="twitter:image" content={featured_image} />
            </Head>
            <div className="blog-hero" style={{backgroundImage: `url(${featured_image}`}}></div>
          </>
        ) : ''}
        {/* end dbt Custom */}


      <div className="container margin-vert--lg">
        <div className="blog-breadcrumbs">
            <Link to="/" title="Home">Home</Link>
            <Link to="/blog" title="Blog">Blog</Link>
        </div>
        <div className="blog-index-header">
          {show_title && <h1>{title}</h1>}
          {show_description && <p>{description}</p>}
        </div>
        <div className="row">
          {hasSidebar && (
            <aside className="col col--3">
              <BlogSidebar sidebar={sidebar} />
            </aside>
          )}
          <main
            className={clsx('col main-blog-container', {
              'col--7': hasSidebar,
              'col--9 col--offset-1': !hasSidebar,
            })}
            itemScope
            itemType="http://schema.org/Blog">
            {children}
          </main>
          <div className="col col--2 blog-right-sidebar">
            {toc && (
              <TOC toc={toc} />
            )}
            {featured_cta && (
              <CTA cta={featured_cta} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default BlogLayout;
