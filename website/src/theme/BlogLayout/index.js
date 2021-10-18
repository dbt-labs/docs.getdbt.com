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
import {usePluginData} from '@docusaurus/useGlobalData';

function BlogLayout(props) {
  const {sidebar, toc, children, ...layoutProps} = props;
  const hasSidebar = sidebar && sidebar.items.length > 0;

  // dbt Custom 
  const blogData = usePluginData('docusaurus-build-blog-data-plugin');
  const {featured_image} = blogData

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
        <div className="row">
          {hasSidebar && (
            <aside className="col col--3">
              <BlogSidebar sidebar={sidebar} />
            </aside>
          )}
          <main
            className={clsx('col', {
              'col--7': hasSidebar,
              'col--9 col--offset-1': !hasSidebar,
            })}
            itemScope
            itemType="http://schema.org/Blog">
            {children}
          </main>
          {toc && (
            <div className="col col--2">
              <TOC toc={toc} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default BlogLayout;
