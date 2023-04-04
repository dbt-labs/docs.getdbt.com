import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar';

/* dbt Customizations:
 * Import Head, Link, plugin & context hooks
 * Sets states for checking if blog post or blog list page
 * Get blogMeta and tagData global data from plugin
 * Get blogData from docusaurus.config.js
 * Set custom breadcrumb and meta titles
 * Set custom featured image from website/blog/metadata.yml
 * Show hero card section if blog list page
 * Adds breadcrumbs section
 * Hide sidebar if blog post page and adjusts column sizing 
*/
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import {usePluginData} from '@docusaurus/useGlobalData';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function BlogLayout(props) {
  const {
    sidebar, 
    toc, 
    children, 
    title, 
    description, 
    isBlogList, 
    isBlogPost, 
    ...layoutProps
  } = props;
  const hasSidebar = sidebar && sidebar.items.length > 0;

  const { blogMeta, tagData } = usePluginData('docusaurus-build-global-data-plugin');
  const { siteConfig: { presets } } = useDocusaurusContext()
  // Get blog data from docusaurus config
  const blogData = presets && presets.reduce((acc, preset) => {
    const context = preset?.find(item => item['blog'])
    if(context) acc = context['blog']
    return acc
  }, {})

  const { 
    featured_image, 
    show_title, 
    show_description,
    hero_button_url,
    hero_button_text,
    hero_button_new_tab,
  } = blogMeta
  
  // The pageTitle variable sets the final item in breadcrumbs
  let breadcrumbTitle = undefined
  if(title) {
    // Set to title prop
    breadcrumbTitle = title
  }

  // Set custom meta title for blog list and blog post pages
  let metaTitle = undefined
  if(isBlogList) {
    metaTitle = blogData.blogTitle
  } else if(breadcrumbTitle) {
    metaTitle = `${breadcrumbTitle} | dbt Developer Blog`
  }
  // end dbtCustom

  return (
    <Layout {...layoutProps}>

      {/* Set Custom Metadata */}
       {featured_image && featured_image !== "" &&
         <Head> 
           <meta property="og:image" content={featured_image} />
           <meta property="twitter:image" content={featured_image} />
         </Head>
       }
 
       {metaTitle &&
         <Head>
           <title>{metaTitle}</title>
           <meta property="og:title" content={metaTitle} />
         </Head>
       }
 
       {description &&
         <Head>
           <meta name="description" content={description} />
           <meta property="og:description" content={description} />
         </Head>
       }
       {/* End Custom Metadata */}

      {isBlogList &&
         ((show_title || show_description) && (blogData?.blogTitle || blogData?.blogDescription)) && (
           <div className="blog-index-header">
             <div className="container margin-vert--lg">
               <div className="card large light blog-hero-card">
                 <div className="blog-hero-card-content">
                   {blogData.blogTitle && show_title && <h1>{blogData.blogTitle}</h1>}
                   {blogData.blogDescription && show_description && <p>{blogData.blogDescription}</p>}
                   {(hero_button_text !== "" && hero_button_text !== "") && (
                     hero_button_new_tab ? (
                       <a 
                         className="button button--primary" 
                         href={hero_button_url} 
                         title={hero_button_text}
                         target="_blank"
                         rel="noopener noreferrer"
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
           <Link to="/" title="dbt Docs">dbt Docs</Link>
           <Link to="/blog" title="Blog">Developer Blog</Link>
           {(!isBlogList && breadcrumbTitle) && 
             <Link to="#" title={breadcrumbTitle}>
               {breadcrumbTitle}
             </Link>
           }
         </div>
       </div>

      <div className="container margin-vert--lg">
        <div className="row">
          {!isBlogPost && <BlogSidebar sidebar={sidebar} tagData={tagData} />}
          <main
            className={clsx('col', {
              'col--7': hasSidebar,
              'col--9': !hasSidebar || isBlogPost,
            })}
            itemScope
            itemType="http://schema.org/Blog">
            {children}
          </main>
          {toc && <div className="col col--3">{toc}</div>}
        </div>
      </div>
    </Layout>
  );
}
