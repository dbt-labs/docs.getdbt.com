import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {
  findFirstSidebarItemLink,
  useDocById,
} from '@docusaurus/theme-common/internal';
import {usePluralForm} from '@docusaurus/theme-common';
import isInternalUrl from '@docusaurus/isInternalUrl';
import {translate} from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

/* dbt Customizations:
 * Add styles.glossaryCard to CardContainer
 * Add hoverSnippet prop to CardLayout
 * Prevent truncate if card links to /terms/ page
 * Show hoverSnippet text instead of description if set 
 * Get hoverSnippet from frontmatter and pass to CardLayout
*/

function useCategoryItemsPlural() {
  const {selectMessage} = usePluralForm();
  return (count) =>
    selectMessage(
      count,
      translate(
        {
          message: '1 item|{count} items',
          id: 'theme.docs.DocCard.categoryDescription.plurals',
          description:
            'The default description for a category card in the generated index about how many items this category includes',
        },
        {count},
      ),
    );
}
function CardContainer({href, children}) {
  return (
    <Link
      href={href}
      className={clsx(
        "card padding--lg",
        styles.cardContainer,
        href.includes("/terms/") && styles.glossaryCard
      )}
    >
      {children}
    </Link>
  );
}
function CardLayout({href, icon, title, description, hoverSnippet}) {
  return (
    <CardContainer href={href}>
      <Heading
        as="h2"
        className={clsx(
          !href.includes("/terms/") && "text--truncate",
          styles.cardTitle
        )}
        title={title}
      >
        {icon} {title}
      </Heading>
      {description && (
        <p
          className={clsx(
            !href.includes("/terms/") && "text--truncate",
            styles.cardDescription
          )}
          title={hoverSnippet ? hoverSnippet : description}
        >
          {hoverSnippet ? hoverSnippet : description}
        </p>
      )}
    </CardContainer>
  );
}
function CardCategory({item}) {
  const href = findFirstSidebarItemLink(item);
  const categoryItemsPlural = useCategoryItemsPlural();
  // Unexpected: categories that don't have a link have been filtered upfront
  if (!href) {
    return null;
  }
  return (
    <CardLayout
      href={href}
      icon="🗃️"
      title={item.label}
      description={item.description ?? categoryItemsPlural(item.items.length)}
    />
  );
}
function CardLink({item}) {
  const icon = isInternalUrl(item.href) ? "📄️" : "🔗";
  const doc = useDocById(item.docId ?? undefined);

  // dbt custom
  let hoverSnippet;
  if (item.docId && item.href && item.href.includes("/terms/")) {
    const file = require(`../../../docs/${item.docId}.md`);
    if (file) {
      hoverSnippet = file.frontMatter.hoverSnippet;
    }
  }

  return (
    <CardLayout
      href={item.href}
      icon={icon}
      title={item.label}
      description={item.description ?? doc?.description}
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
