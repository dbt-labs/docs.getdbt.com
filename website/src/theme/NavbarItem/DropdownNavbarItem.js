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
 * Era label: displayName + era name, e.g. "dbt v2" / "dbt v1".
 * Comes from dbt-versions.js so labels stay config-driven.
 */
function getEraLabel(productName) {
  const product = products.find((p) => p.name === productName);
  if (!product) return productName;
  return product.displayName
    ? `${product.displayName} ${product.name}`
    : product.name;
}

// Group header above a multi-version era, e.g. "dbt v1"
function getGroupHeader(product) {
  return getEraLabel(product.name);
}

/**
 * Label for the current selection on the dropdown trigger.
 * Single-version era -> sub-product label; multi-version -> "dbt 1.12".
 */
function getCurrentVersionLabel(subProductName) {
  for (const product of products) {
    const sp = product.subProducts.find((s) => s.name === subProductName);
    if (sp) {
      if (product.subProducts.length === 1) {
        return sp.name;
      }
      return product.displayName
        ? `${product.displayName} ${sp.version}`
        : sp.version;
    }
  }
  return subProductName;
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

// Note shown in the version dropdown footer.
function TransitionNote() {
  return (
    <>
      On dbt platform?
      <br />
      v2 ={" "}
      <a
        href="https://docs.getdbt.com/docs/dbt-versions/dbt-release-tracks?version=2.0#fusion-release-tracks"
        target="_blank"
        rel="noopener noreferrer"
      >
        Fusion release tracks
      </a>
      <br />
      v1 ={" "}
      <a
        href="https://docs.getdbt.com/docs/dbt-versions/dbt-release-tracks?version=2.0#dbt-core-release-tracks"
        target="_blank"
        rel="noopener noreferrer"
      >
        Core release tracks
      </a>
    </>
  );
}

// Short label for a sub-product in the compact picker (e.g. "dbt Core v1.12" -> "v1.12")
function shortVersionLabel(subProductName) {
  return subProductName.replace(/^dbt Core\s+/i, "");
}

/**
 * Compact version picker shown beside the toggle when v1 is selected.
 * Lets Core Python users choose a specific v1.x version.
 */
function VersionSubPicker({ subProducts, currentSubProduct, versionContext }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const active =
    subProducts.find((sp) => sp.name === currentSubProduct) || subProducts[0];

  return (
    <div className="version-subpicker" ref={ref}>
      <button
        type="button"
        className="version-subpicker__button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {shortVersionLabel(active?.name || "")}
        <span className="version-subpicker__caret" aria-hidden="true">▾</span>
      </button>
      {open && (
        <ul className="version-subpicker__menu" role="listbox">
          {subProducts.map((sp) => {
            const isActive = sp.name === currentSubProduct;
            return (
              <li key={sp.name}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={clsx("version-subpicker__option", {
                    "version-subpicker__option--active": isActive,
                  })}
                  onClick={() => {
                    versionContext.updateVersion({
                      target: { dataset: { dbtSubproduct: sp.name } },
                    });
                    setOpen(false);
                  }}
                >
                  {isActive && (
                    <span className="nav-versioning-checkmark">&#10003;</span>
                  )}
                  {shortVersionLabel(sp.name)}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
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

  // Version selector renders as a compact dropdown list
  if (className === "nav-versioning") {
    const currentLabel = getCurrentVersionLabel(versionContext?.subProduct);

    const selectSubProduct = (e) => {
      versionContext.updateVersion({ target: e.currentTarget });
      setShowDropdown(false);
    };

    return (
      <div
        ref={dropdownRef}
        className={clsx("navbar__item", "dropdown", "version-dropdown", {
          "dropdown--right": position === "right",
          "dropdown--show": showDropdown,
        })}
      >
        <button
          type="button"
          className="version-dropdown__trigger"
          aria-haspopup="listbox"
          aria-expanded={showDropdown}
          onClick={() => setShowDropdown((v) => !v)}
        >
          <span className="version-dropdown__branch" aria-hidden="true">
            <svg viewBox="0 0 16 16" width="17" height="17">
              <path
                fill="currentColor"
                d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.493 2.493 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Zm-6 0a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Zm8.25-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"
              />
            </svg>
          </span>
          <span className="version-dropdown__current">{currentLabel}</span>
          <span className="version-dropdown__caret" aria-hidden="true">▾</span>
        </button>
        <ul className="dropdown__menu version-dropdown__menu" role="listbox">
          {products.map((product) => {
            const single = product.subProducts.length === 1;
            const renderItem = (sp, label, indented) => {
              const isActive = sp.name === versionContext?.subProduct;
              return (
                <li key={sp.name}>
                  <a
                    className={clsx("dropdown__link version-dropdown__link", {
                      "version-dropdown__link--active": isActive,
                      "version-dropdown__link--indented": indented,
                    })}
                    role="option"
                    aria-selected={isActive}
                    data-dbt-subproduct={sp.name}
                    onClick={selectSubProduct}
                  >
                    <span className="version-dropdown__text">
                      {label}
                      {sp.stage && (
                        <span className="version-dropdown__stage"> ({sp.stage})</span>
                      )}
                    </span>
                    {isActive && (
                      <span className="version-dropdown__check" aria-hidden="true">✓</span>
                    )}
                  </a>
                </li>
              );
            };

            if (single) {
              const sp = product.subProducts[0];
              return renderItem(sp, sp.name, false);
            }
            const latestName = product.subProducts[0]?.name;
            return (
              <React.Fragment key={product.name}>
                <li>
                  <a
                    className="dropdown__link version-dropdown__link version-dropdown__group-link"
                    role="option"
                    data-dbt-subproduct={latestName}
                    onClick={selectSubProduct}
                  >
                    <span className="version-dropdown__text">{getGroupHeader(product)}</span>
                  </a>
                </li>
                {product.subProducts.map((sp) => renderItem(sp, sp.version, true))}
              </React.Fragment>
            );
          })}
          {/* Platform-track note — remove at unified-versioning GA */}
          <li className="version-dropdown__note"><TransitionNote /></li>
        </ul>
      </div>
    );
  }

  return (
    <div
      ref={dropdownRef}
      className={clsx("navbar__item", "dropdown", "dropdown--hoverable", {
        "dropdown--right": position === "right",
        "dropdown--show": showDropdown,
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
      >
        {props.children ?? props.label}
      </NavbarNavLink>
      <ul className="dropdown__menu">
        {items.map((childItemProps, i) => (
          <NavbarItem
            isDropdownItem
            onKeyDown={(e) => {
              if (i === items.length - 1 && e.key === "Tab") {
                e.preventDefault();
                setShowDropdown(false);
                const nextNavbarItem = dropdownRef.current.nextElementSibling;
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
        ))}
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

  if (className === "nav-versioning") {
    const selectSubProduct = (e) => {
      versionContext.updateVersion({ target: e.currentTarget });
      onClick && onClick(e);
    };

    return (
      <li className="menu__list-item version-menu-mobile">
        <div className="version-menu-mobile__header">
          <span className="version-toggle__icon" aria-hidden="true">
            <svg viewBox="0 0 16 16" width="15" height="15">
              <path
                fill="currentColor"
                d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.493 2.493 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Zm-6 0a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Zm8.25-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"
              />
            </svg>
          </span>
          <span>Version</span>
        </div>
        <ul className="menu__list">
          {products.map((product) => {
            const single = product.subProducts.length === 1;
            if (single) {
              const sp = product.subProducts[0];
              const isActive = sp.name === versionContext?.subProduct;
              return (
                <li key={product.name} className="menu__list-item">
                  <a
                    className={clsx("menu__link", {
                      "menu__link--active": isActive,
                    })}
                    data-dbt-subproduct={sp.name}
                    onClick={selectSubProduct}
                  >
                    {sp.name}
                  </a>
                </li>
              );
            }
            return (
              <React.Fragment key={product.name}>
                <li className="menu__list-item">
                  <a
                    className="menu__link version-menu-mobile__grouplink"
                    data-dbt-subproduct={product.subProducts[0]?.name}
                    onClick={selectSubProduct}
                  >
                    {getGroupHeader(product)}
                  </a>
                </li>
                {product.subProducts.map((sp) => {
                  const isActive = sp.name === versionContext?.subProduct;
                  return (
                    <li key={sp.name} className="menu__list-item">
                      <a
                        className={clsx("menu__link version-menu-mobile__indented", {
                          "menu__link--active": isActive,
                        })}
                        data-dbt-subproduct={sp.name}
                        onClick={selectSubProduct}
                      >
                        {sp.version}
                        {sp.stage && ` (${sp.stage})`}
                      </a>
                    </li>
                  );
                })}
              </React.Fragment>
            );
          })}
        </ul>
        {/* Platform-track note — remove at unified-versioning GA */}
        <p className="nav-versioning-filter__note"><TransitionNote /></p>
      </li>
    );
  }

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
      >
        {props.children ?? props.label}
      </NavbarNavLink>
      <Collapsible lazy as="ul" className="menu__list" collapsed={collapsed}>
        {items.map((childItemProps, i) => (
          <NavbarItem
            mobile
            isDropdownItem
            onClick={onClick}
            activeClassName="menu__link--active"
            {...childItemProps}
            key={i}
          />
        ))}
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
