import React from 'react';
import clsx from 'clsx';
import TOCItems from '@theme/TOCItems';
import styles from './styles.module.css';
import EditThisPage from '@theme/EditThisPage';
import CTA from '../../components/cta';
// Using a custom className
// This prevents TOCInline/TOCCollapsible getting highlighted by mistake

/* dbt Customizations:
 * Import EditThisPage and CTA components
 * add featured_cta & editUrl props and elements
*/
const LINK_CLASS_NAME = 'table-of-contents__link toc-highlight';
const LINK_ACTIVE_CLASS_NAME = 'table-of-contents__link--active';
export default function TOC({className, featured_cta, editUrl, ...props}) {
  return (
    <div className={clsx(styles.tableOfContents, 'thin-scrollbar', className)}>
      <TOCItems
        {...props}
        linkClassName={LINK_CLASS_NAME}
        linkActiveClassName={LINK_ACTIVE_CLASS_NAME}
      />

      {editUrl && (
        <div className="col margin-top--sm">
          <EditThisPage editUrl={editUrl} />
        </div>)}

      {featured_cta && (
        <CTA cta={featured_cta} />
      )}
    </div>
  );
}
