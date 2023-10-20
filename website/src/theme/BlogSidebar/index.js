import React from 'react';
import {useWindowSize} from '@docusaurus/theme-common';
import BlogSidebarDesktop from '@theme/BlogSidebar/Desktop';
import BlogSidebarMobile from '@theme/BlogSidebar/Mobile';

/* dbt Customizations:
 * Passes tagData to BlogSidebarDesktop to display categories
*/

export default function BlogSidebar({sidebar, tagData}) {
  const windowSize = useWindowSize();
  if (!sidebar?.items.length) {
    return null;
  }
  // Mobile sidebar doesn't need to be server-rendered
  if (windowSize === 'mobile') {
    return <BlogSidebarMobile sidebar={sidebar} />;
  }
  return <BlogSidebarDesktop sidebar={sidebar} tagData={tagData} />;
}
