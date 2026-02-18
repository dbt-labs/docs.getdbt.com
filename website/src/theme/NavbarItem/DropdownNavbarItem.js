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
 * Import VersionsNavbarItem component and context
 * Pass versionContext prop into DropdownNavbarItemDesktop or DropdownNavbarItemMobile
 * Custom state to handle version dropdown on click
 * Show version dropdown on version state change
 * Pass versionContext to Comp
 * 
*/
// import VersionsNavbarItem from './VersionsNavItem';
import VersionContext from '../../stores/VersionContext';
import { versions } from '../../../dbt-versions'

/**
 * Renders a version display string, splitting on \n to create line breaks
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
 * Get unique major versions from the versions array
 */
function getMajorVersions() {
  const majors = new Set();
  versions.forEach((v) => {
    if (v.version) {
      const major = v.version.split('.')[0];
      majors.add(major);
    }
  });
  return Array.from(majors).sort((a, b) => Number(a) - Number(b));
}

/**
 * Display labels for major version filter buttons
 */
const majorVersionLabels = {
  "1": "Core",
  "2": "Fusion",
};

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

  // dbt Custom: handle version dropdown state on click
  const [showVersionDropdown, setShowVersionDropdown] = useState(true);

  // dbt Custom: major version filter
  const majorVersions = className === "nav-versioning" ? getMajorVersions() : [];
  const [majorVersionFilter, setMajorVersionFilter] = useState(null);

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

  // dbt Custom: Hide version dropdown on click
  // This adds dropdown--version--hide class on line 87
  const handleVersionMenuClick = () => {
    setShowVersionDropdown(false)
  }

  // Run when showVersionDropdown state changes
  // which occurs during version menu item clicked
  // This resets version dropdown to original state
  // and removes the dropdown--version--hide class
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
            ? `Version: ${versionContext?.customDisplay ? `${versionContext.customDisplay}` : `v${versionContext.version} ${versionContext?.isPrerelease ? "(Beta)" : ""}`}`
            : props.children ?? props.label
        }
      >
        {props.children ?? props.label}
      </NavbarNavLink>
      <ul className="dropdown__menu">
        {className === "nav-versioning" && majorVersions.length > 1 && (
          <li className="nav-versioning-filter">
            <div className="nav-versioning-filter__buttons">
              {[...majorVersions].reverse().map((major) => (
                <button
                  key={major}
                  className={clsx("nav-versioning-filter__btn", {
                    "nav-versioning-filter__btn--active": majorVersionFilter === major,
                  })}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setMajorVersionFilter(major);
                  }}
                >
                  {majorVersionLabels[major] || `v${major}`}
                </button>
              ))}
              <button
                className={clsx("nav-versioning-filter__btn", {
                  "nav-versioning-filter__btn--active": majorVersionFilter === null,
                })}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMajorVersionFilter(null);
                }}
              >
                All
              </button>
            </div>
          </li>
        )}
        {items.map((childItemProps, i) => {
          const thisVersion = versions.find(
            (version) => childItemProps.label == version.version
          );
          const versionDisplay = thisVersion?.customDisplay ? thisVersion.customDisplay : `${childItemProps.label} ${thisVersion?.isPrerelease ? " (Beta)" : ""}`;

          // Filter by major version if a filter is active
          if (
            className === "nav-versioning" &&
            majorVersionFilter !== null &&
            childItemProps.label.split('.')[0] !== majorVersionFilter
          ) {
            return null;
          }

          return (
            <React.Fragment key={i}>
              {className === "nav-versioning" ? (
                <li>
                  <a
                    className={clsx(
                      "dropdown__link nav-versioning-dropdown__link",
                      { "nav-versioning-dropdown__link--active": childItemProps.label === versionContext.version }
                    )}
                    data-dbt-version={childItemProps.label}
                    onClick={(e) => {
                      handleVersionMenuClick();
                      // Use currentTarget to ensure we always read the data attribute
                      // from the <a> element, not a child element the user clicked on
                      const syntheticEvent = {
                        target: e.currentTarget
                      };
                      versionContext.updateVersion(syntheticEvent);
                    }}
                  >
                    {childItemProps.label === versionContext.version && (
                      <span className="nav-versioning-checkmark">&#10003;</span>
                    )}
                    <span>{renderVersionDisplay(versionDisplay)}</span>
                  </a>
                </li>
              ) : (
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
                            : // Next item is another dropdown; focus on the inner
                              // anchor element instead so there's outline
                              nextNavbarItem.querySelector("a");
                        targetItem.focus();
                      }
                    }
                  }}
                  activeClassName="dropdown__link--active"
                  {...childItemProps}
                  key={i}
                />
              )}
            </React.Fragment>
          );
        }
        )}
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
  // Expand/collapse if any item active after a navigation
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
            ? `Version: ${versionContext?.customDisplay ? `${versionContext.customDisplay}` : `v${versionContext.version} ${versionContext?.isPrerelease ? "(Beta)" : ""}`}`
            : props.children ?? props.label
        }
      >
        {props.children ?? props.label}
      </NavbarNavLink>
      <Collapsible lazy as="ul" className="menu__list" collapsed={collapsed}>
        {items.map((childItemProps, i) => {
          const thisVersion = versions.find(
            (version) => childItemProps.label == version.version
          );
          const versionDisplay = thisVersion?.customDisplay
            ? thisVersion.customDisplay
            : `${childItemProps.label} ${thisVersion?.isPrerelease ? " (Beta)" : ""}`;

          return (
            <NavbarItem
              mobile
              isDropdownItem
              data-dbt-version={childItemProps.label}
              onClick={
                className === "nav-versioning"
                  ? (e) => versionContext.updateVersion(e)
                  : onClick
              }
              activeClassName="menu__link--active"
              {...childItemProps}
              label={versionDisplay}
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
