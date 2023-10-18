import React, { useContext } from 'react';
import DocSidebarItemCategory from '@theme/DocSidebarItem/Category';
import DocSidebarItemLink from '@theme/DocSidebarItem/Link';
import DocSidebarItemHtml from '@theme/DocSidebarItem/Html';

/* dbt Customizations:
 * Import version context and utils
 * Get versionedPages from website/dbt-versions.js
 * Get version from context
 * Hide sidebar item if not available for current version
*/
import {usePluginData} from '@docusaurus/useGlobalData';
import VersionContext from '../../stores/VersionContext'
import pageVersionCheck from '../../utils/page-version-check';
import categoryVersionCheck from '../../utils/category-version-check';

export default function DocSidebarItem({item, ...props}) {

  // dbt Custom
  const { versionedPages, versionedCategories } = usePluginData('docusaurus-build-global-data-plugin');
  const { version } = useContext(VersionContext)

  // Hide versionedPages if they do not match the current version
  if(version && versionedPages) {
    const { pageAvailable } = pageVersionCheck(version, versionedPages, item.docId)
    if(!pageAvailable)
      return null
  }

  // Hide versionedCategories if they do not match the current version
  if(version && versionedCategories && item.type === 'category') {
    const { categoryAvailable } = categoryVersionCheck(version, versionedCategories, item.label)
    if(!categoryAvailable)
      return null
  }

  switch (item.type) {
    case 'category':
      return <DocSidebarItemCategory item={item} {...props} />;
    case 'html':
      return <DocSidebarItemHtml item={item} {...props} />;
    case 'link':
    default:
      return <DocSidebarItemLink item={item} {...props} />;
  }
}
