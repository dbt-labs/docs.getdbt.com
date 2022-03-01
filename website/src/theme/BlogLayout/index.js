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
 
 function BlogLayout(props) {
   const {title, description, blogPageTitle, sidebar, toc, children, ...layoutProps} = props;
      
   // dbt Custom 
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

   const hasSidebar = layoutProps.pageClassName === "blog-post-page"
    ? show_left_sidebar && (sidebar && sidebar.items.length > 0)
    : sidebar && sidebar.items.length > 0

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

   const metaTitle = layoutProps.pageClassName !== "blog-list-page"
    ? `${breadcrumbTitle} | dbt Developer Blog`
    : breadcrumbTitle

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
 
       {featured_image && featured_image !== "" &&
         <Link to="/blog">
           <div className="blog-hero" style={{backgroundImage: `url(${featured_image}`}}></div>
         </Link>
       }
 
       {layoutProps.pageClassName && layoutProps.pageClassName === "blog-list-page" &&
         ((show_title || show_description) && (title || description)) && (
           <div className="blog-index-header">
             <div className="container margin-vert--lg">
               <div className="card large light blog-hero-card">
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
           <Link to="/" title="dbt Docs">dbt Docs</Link>
           <Link to="/blog" title="Blog">Developer Blog</Link>
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
           <aside className="col blog-aside">
             <BlogSidebar sidebar={sidebar} tagData={tagData} />
           </aside>
         )}
         <main
          className={clsx("docMainContainer_node_modules-@docusaurus-theme-classic-lib-next-theme-DocPage-styles-module", {
            ["left-sidebar-hidden"]: (layoutProps.pageClassName === "blog-post-page" && !show_left_sidebar) || !layoutProps.pageClassName
          })}
           itemScope
           itemType="http://schema.org/Blog">
           <div className="container padding-top--md padding-bottom--lg">
             <div className="row">
               <div className="col docItemCol_node_modules-@docusaurus-theme-classic-lib-next-theme-DocItem-styles-module">
                 {children}
               </div>
               {layoutProps.pageClassName &&
                 <div className="col col--3 blog-right-sidebar">
                   {toc && (
                     <TOC toc={toc} featured_cta={featured_cta} />
                   )}
                 </div>
               }
             </div>
           </div>
         </main>
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
 