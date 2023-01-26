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

export default function DocSidebarItem({item, ...props}) {

  // dbt Custom
  const { versionedPages } = usePluginData('docusaurus-build-global-data-plugin');
  const { version } = useContext(VersionContext)
  if(version && versionedPages) {
    const { pageAvailable } = pageVersionCheck(version, versionedPages, item.docId)
    if(!pageAvailable)
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
