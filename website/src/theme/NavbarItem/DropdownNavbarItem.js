import React, { useState, useRef, useEffect, useContext } from 'react';
import clsx from 'clsx';
import {
  isRegexpStringMatch,
  useCollapsible,
  Collapsible,
} from '@docusaurus/theme-common';
import { isSamePath, useLocalPathname } from '@docusaurus/theme-common/internal';
import NavbarNavLink from '@theme/NavbarItem/NavbarNavLink';
import NavbarItem from '@theme/NavbarItem';

/* dbt Customizations:
 * Import VersionContext and products from dbt-versions
 * Version menu filter buttons are driven by product names
 * Menu items represent sub-products; selection tracked by sub-product name
 * data-dbt-subproduct attribute triggers version context updates
 */
import VersionContext from '../../stores/VersionContext';
import { products } from '../../../dbt-versions'

/**
 * Renders a display string, splitting on \n to create line breaks
 */
function renderVersionDisplay(text) {
  if (!text || !text.includes('\n')) return text;
  return text.split('\n').map((part, idx, arr) => (
    <React.Fragment key={idx}>
      {part}
      {idx < arr.length - 1 && <br />}
    </React.Fragment>
  ));
}

/**
 * Returns product names in the order defined in dbt-versions.js
 */
function getProductNames() {
  return products.map((p) => p.name);
}

/**
 * Find which product a sub-product belongs to by sub-product name
 */
function getProductForSubProduct(subProductName) {
  for (const product of products) {
    if (product.subProducts.find((sp) => sp.name === subProductName)) {
      return product.name;
    }
  }
  return null;
}

/**
 * Find a sub-product object by name
 */
function findSubProduct(name) {
  for (const product of products) {
    const sp = product.subProducts.find((s) => s.name === name);
    if (sp) return sp;
  }
  return null;
}

function isItemActive(item, localPathname) {
  if (isSamePath(item.to, localPathname)) {
    return true;
  }
  if (isRegexpStringMatch(item.activeBaseRegex, localPathname)) {
    return true;
  }
  if (item.activeBasePath && localPathname.startsWith(item.activeBasePath)) {
    return true;
  }
  return false;
}
function containsActiveItems(items, localPathname) {
  return items.some((item) => isItemActive(item, localPathname));
}
function DropdownNavbarItemDesktop({
  items,
  position,
  className,
  onClick, // eslint-disable-line
  versionContext,
  ...props
}) {
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // dbt Custom: handle version dropdown hide-on-select behavior
  const [showVersionDropdown, setShowVersionDropdown] = useState(true);

  // dbt Custom: product filter — default to first product (Fusion)
  const productNames = className === "nav-versioning" ? getProductNames() : [];
  const [productFilter, setProductFilter] = useState(productNames[0] || null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current || dropdownRef.current.contains(event.target)) {
        return;
      }
      setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [dropdownRef]);

  // Hide version dropdown on item click, then immediately reset so CSS re-triggers
  const handleVersionMenuClick = () => {
    setShowVersionDropdown(false)
  }

  useEffect(() => {
    setShowVersionDropdown(true)
  }, [showVersionDropdown])

  return (
    <div
      ref={dropdownRef}
      className={clsx("navbar__item", "dropdown", "dropdown--hoverable", {
        "dropdown--right": position === "right",
        "dropdown--show": showDropdown,
        "dropdown--version--hide": !showVersionDropdown,
      })}
    >
      <NavbarNavLink
        aria-haspopup="true"
        aria-expanded={showDropdown}
        role="button"
        href={props.to ? undefined : "#"}
        className={clsx("navbar__link", className)}
        {...props}
        onClick={props.to ? undefined : (e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            setShowDropdown(!showDropdown);
          }
        }}
        label={
          className === "nav-versioning"
            ? `Version: ${versionContext?.customDisplay || `v${versionContext?.version}`}`
            : props.children ?? props.label
        }
      >
        {props.children ?? props.label}
      </NavbarNavLink>
      <ul className="dropdown__menu">
        {className === "nav-versioning" && productNames.length > 1 && (
          <li className="nav-versioning-filter">
            <div className="nav-versioning-filter__buttons">
              {productNames.map((productName) => (
                <button
                  key={productName}
                  className={clsx("nav-versioning-filter__btn", {
                    "nav-versioning-filter__btn--active": productFilter === productName,
                  })}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setProductFilter(productName);
                  }}
                >
                  {productName}
                </button>
              ))}
              <button
                className={clsx("nav-versioning-filter__btn", {
                  "nav-versioning-filter__btn--active": productFilter === null,
                })}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setProductFilter(null);
                }}
              >
                All
              </button>
            </div>
          </li>
        )}
        {items.map((childItemProps, i) => {
          // For version menu, childItemProps.label is a sub-product name
          if (className === "nav-versioning") {
            const subProductName = childItemProps.label;
            const thisSubProduct = findSubProduct(subProductName);
            const owningProduct = getProductForSubProduct(subProductName);

            // Filter: hide if a product filter is active and this sub-product doesn't belong to it
            if (productFilter !== null && owningProduct !== productFilter) {
              return null;
            }

            const isBeta = thisSubProduct?.isBeta || false;
            const isActive = subProductName === versionContext?.subProduct;

            return (
              <li key={i}>
                <a
                  className={clsx(
                    "dropdown__link nav-versioning-dropdown__link",
                    { "nav-versioning-dropdown__link--active": isActive }
                  )}
                  data-dbt-subproduct={subProductName}
                  onClick={(e) => {
                    handleVersionMenuClick();
                    const syntheticEvent = { target: e.currentTarget };
                    versionContext.updateVersion(syntheticEvent);
                  }}
                >
                  {isActive && (
                    <span className="nav-versioning-checkmark">&#10003;</span>
                  )}
                  <span>
                    {renderVersionDisplay(subProductName)}
                    {isBeta && " (Beta)"}
                  </span>
                </a>
              </li>
            );
          }

          return (
            <NavbarItem
              isDropdownItem
              onKeyDown={(e) => {
                if (i === items.length - 1 && e.key === "Tab") {
                  e.preventDefault();
                  setShowDropdown(false);
                  const nextNavbarItem =
                    dropdownRef.current.nextElementSibling;
                  if (nextNavbarItem) {
                    const targetItem =
                      nextNavbarItem instanceof HTMLAnchorElement
                        ? nextNavbarItem
                        : nextNavbarItem.querySelector("a");
                    targetItem.focus();
                  }
                }
              }}
              activeClassName="dropdown__link--active"
              {...childItemProps}
              key={i}
            />
          );
        })}
      </ul>
    </div>
  );
}
function DropdownNavbarItemMobile({
  items,
  className,
  position, // eslint-disable-line
  onClick,
  versionContext,
  ...props
}) {
  const localPathname = useLocalPathname();
  const containsActive = containsActiveItems(items, localPathname);
  const { collapsed, toggleCollapsed, setCollapsed } = useCollapsible({
    initialState: () => !containsActive,
  });
  useEffect(() => {
    if (containsActive) {
      setCollapsed(!containsActive);
    }
  }, [localPathname, containsActive, setCollapsed]);
  return (
    <li
      className={clsx("menu__list-item", {
        "menu__list-item--collapsed": collapsed,
      })}
    >
      <NavbarNavLink
        role="button"
        className={clsx(
          "menu__link menu__link--sublist menu__link--sublist-caret",
          className
        )}
        {...props}
        onClick={(e) => {
          e.preventDefault();
          toggleCollapsed();
        }}
        label={
          className === "nav-versioning"
            ? `Version: ${versionContext?.customDisplay || `v${versionContext?.version}`}`
            : props.children ?? props.label
        }
      >
        {props.children ?? props.label}
      </NavbarNavLink>
      <Collapsible lazy as="ul" className="menu__list" collapsed={collapsed}>
        {items.map((childItemProps, i) => {
          if (className === "nav-versioning") {
            const subProductName = childItemProps.label;
            const thisSubProduct = findSubProduct(subProductName);
            const isBeta = thisSubProduct?.isBeta || false;
            const displayLabel = isBeta ? `${subProductName} (Beta)` : subProductName;

            return (
              <li key={i} className="menu__list-item">
                <a
                  className={clsx(
                    "menu__link",
                    { "menu__link--active": subProductName === versionContext?.subProduct }
                  )}
                  data-dbt-subproduct={subProductName}
                  onClick={(e) => {
                    versionContext.updateVersion({ target: e.currentTarget });
                    onClick && onClick(e);
                  }}
                >
                  {displayLabel}
                </a>
              </li>
            );
          }

          return (
            <NavbarItem
              mobile
              isDropdownItem
              onClick={onClick}
              activeClassName="menu__link--active"
              {...childItemProps}
              key={i}
            />
          );
        })}
      </Collapsible>
    </li>
  );
}
export default function DropdownNavbarItem({ mobile = false, ...props }) {
  const Comp = mobile ? DropdownNavbarItemMobile : DropdownNavbarItemDesktop;

  // dbt Custom
  const versionContext = useContext(VersionContext)

  return <Comp versionContext={versionContext} {...props} />;
}
