import React, {memo} from 'react';
import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';
import {
  useVisibleBlogSidebarItems,
  BlogSidebarItemList,
} from '@docusaurus/plugin-content-blog/client';
import BlogSidebarContent from '@theme/BlogSidebar/Content';
import Link from "@docusaurus/Link";
import CTA from '@site/src/components/cta';
import {usePluginData} from '@docusaurus/useGlobalData';
import styles from './styles.module.css';

/* dbt Customizations:
 * Brings in tagData prop
 * If tagData available, add 'Categories' section to sidebar
*/

const ListComponent = ({items}) => {
  return (
    <BlogSidebarItemList
      items={items}
      ulClassName={clsx(styles.sidebarItemList, 'clean-list')}
      liClassName={styles.sidebarItem}
      linkClassName={styles.sidebarItemLink}
      linkActiveClassName={styles.sidebarItemLinkActive}
    />
  );
};

function BlogSidebarDesktop({ sidebar, tagData }) {
  const items = useVisibleBlogSidebarItems(sidebar.items);
  const { blogMeta } = usePluginData('docusaurus-build-global-data-plugin');
  return (
    <aside className="col col--3">
      <nav
        className={clsx(styles.sidebar, "thin-scrollbar")}
        aria-label={translate({
          id: "theme.blog.sidebar.navAriaLabel",
          message: "Blog recent posts navigation",
          description: "The ARIA label for recent posts in the blog sidebar",
        })}
      >
        {tagData && (
          <>
            <div className={clsx(styles.sidebarItemTitle, "margin-bottom--md")}>
              Categories
            </div>
            <ul className={styles.sidebarItemList}>
              {tagData &&
                tagData
                  .filter((tag) => tag.is_featured)
                  ?.map((tag, i) => {
                    if (!tag) return null;
                    return (
                      <li className={styles.sidebarItem} key={i}>
                        <Link
                          isNavLink
                          to={`/blog/tags/${tag.slug}`}
                          className={styles.sidebarItemLink}
                          activeClassName={styles.sidebarItemLinkActive}
                        >
                          {tag.display_title ? tag.display_title : tag.name}
                        </Link>
                      </li>
                    );
                  })}
            </ul>
          </>
        )}
        <div className={clsx(styles.sidebarItemTitle, "margin-bottom--md")}>
          {sidebar.title}
        </div>
        <BlogSidebarContent
          items={items}
          ListComponent={ListComponent}
          yearGroupHeadingClassName={styles.yearGroupHeading}
        />
        {blogMeta?.featured_cta && (
          <div className="margin-top--lg">
            <CTA cta={blogMeta.featured_cta} />
          </div>
        )}
      </nav>
    </aside>
  );
}

export default memo(BlogSidebarDesktop);
