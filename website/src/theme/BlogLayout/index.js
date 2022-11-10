import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar';

// dbt Custom 
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import {usePluginData} from '@docusaurus/useGlobalData';

export default function BlogLayout(props) {
  console.log('props', props)

  const {sidebar, toc, children, title, description, ...layoutProps} = props;
  const hasSidebar = sidebar && sidebar.items.length > 0;

  // dbt Custom
  const [isBlogPost, setIsBlogPost] = useState(false)
  const [isBlogList, setIsBlogList] = useState(false)
  const { blogMeta, tagData } = usePluginData('docusaurus-build-global-data-plugin');
  const { 
    featured_image, 
    featured_cta, 
    show_title, 
    show_description,
    hero_button_url,
    hero_button_text,
    hero_button_new_tab,
    show_left_sidebar
  } = blogMeta
  
  useEffect(() => {    
    document?.querySelector('.blog-post-page') && setIsBlogPost(true)
    document?.querySelector('.blog-list-page') && setIsBlogList(true)
  }, [])

  // The pageTitle variable sets the final item in breadcrumbs
  let breadcrumbTitle = undefined
  if(title) {
    // Set to title prop
    breadcrumbTitle = title
  }

  return (
    <Layout {...layoutProps}>

      {/* Set Custom Metadata */}
      {featured_image && featured_image !== "" &&
        <Head> 
          <meta property="og:image" content={featured_image} />
          <meta property="twitter:image" content={featured_image} />
        </Head>
      }

      {isBlogList &&
         ((show_title || show_description) && (title || description)) && (
           <div className="blog-index-header">
             <div className="container margin-vert--lg">
               <div className="card large light blog-hero-card">
                 <div className="blog-hero-card-content">
                   {title && show_title && <h1>{title}</h1>}
                   {description && show_description && <p>{description}</p>}
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
          {!isBlogPost && <BlogSidebar sidebar={sidebar} />}
          <main
            className={clsx('col', {
              'col--7': hasSidebar,
              'col--9': !hasSidebar || isBlogPost,
            })}
            itemScope
            itemType="http://schema.org/Blog">
            {children}
          </main>
          {toc && <div className="col col--2">{toc}</div>}
        </div>
      </div>
    </Layout>
  );
}
