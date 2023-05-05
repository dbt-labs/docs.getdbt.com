import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {
  findFirstCategoryLink,
  useDocById,
} from '@docusaurus/theme-common/internal';
import isInternalUrl from '@docusaurus/isInternalUrl';
import {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

/* dbt Customizations:
 * Add styles.glossaryCard to CardContainer
 * Add hoverSnippet prop to CardLayout
 * Prevent truncate if card links to /terms/ page
 * Show hoverSnippet text instead of description if set 
 * Get hoverSnippet from frontmatter and pass to CardLayout
*/

function CardContainer({href, children}) {
  return (
    <Link
      href={href}
      className={clsx(
        'card padding--lg', 
        styles.cardContainer, 
        href.includes('/terms/') && styles.glossaryCard
      )}>
      {children}
    </Link>
  );
}
function CardLayout({href, icon, title, description, hoverSnippet}) {
  return (
    <CardContainer href={href}>
      <h2 className={clsx(!href.includes('/terms/') && 'text--truncate', styles.cardTitle)} title={title}>
        {icon} {title}
      </h2>
      {description && (
        <p
          className={clsx(!href.includes('/terms/') && 'text--truncate', styles.cardDescription)}
          title={hoverSnippet ? hoverSnippet : description}>
          {hoverSnippet ? hoverSnippet : description}
        </p>
      )}
    </CardContainer>
  );
}
function CardCategory({item}) {
  const href = findFirstCategoryLink(item);
  // Unexpected: categories that don't have a link have been filtered upfront
  if (!href) {
    return null;
  }
  return (
    <CardLayout
      href={href}
      icon="🗃️"
      title={item.label}
      description={translate(
        {
          message: '{count} items',
          id: 'theme.docs.DocCard.categoryDescription',
          description:
            'The default description for a category card in the generated index about how many items this category includes',
        },
        {count: item.items.length},
      )}
    />
  );
}
function CardLink({item}) {
  const icon = isInternalUrl(item.href) ? '📄️' : '🔗';
  const doc = useDocById(item.docId ?? undefined);

  // dbt custom
  let hoverSnippet
  if(item.docId && item.href && item.href.includes('/terms/')) {
    const file = require(`../../../docs/${item.docId}.md`)
    if(file) {
      hoverSnippet = file.frontMatter.hoverSnippet
    }
  }

  return (
    <CardLayout
      href={item.href}
      icon={icon}
      title={item.label}
      description={doc?.description}
      hoverSnippet={hoverSnippet}
    />
  );
}
export default function DocCard({item}) {
  switch (item.type) {
    case 'link':
      return <CardLink item={item} />;
    case 'category':
      return <CardCategory item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}