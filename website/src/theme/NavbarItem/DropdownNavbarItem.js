/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, {useState, useRef, useEffect, useContext} from 'react';
import clsx from 'clsx';
import {
  isSamePath,
  useCollapsible,
  Collapsible,
  isRegexpStringMatch,
  useLocalPathname,
} from '@docusaurus/theme-common';
import {NavLink} from '@theme/NavbarItem/DefaultNavbarItem';
import NavbarItem from '@theme/NavbarItem';
import VersionsNavbarItem from './VersionsNavItem';
import VersionContext from '../../stores/VersionContext';

const dropdownLinkActiveClass = 'dropdown__link--active';

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

function DropdownNavbarItemDesktop({items, position, className, versionContext, ...props}) {
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

  // If in the blog directory, hide versioning from nav
  if(window?.location?.pathname.includes('/blog') && className === 'nav-versioning')
    return null

  return (
    <div
      ref={dropdownRef}
      className={clsx('navbar__item', 'dropdown', 'dropdown--hoverable', {
        'dropdown--right': position === 'right',
        'dropdown--show': showDropdown,
      })}>
        <NavLink
          href={props.to ? undefined : '#'}
          className={clsx('navbar__link', className)}
          {...props}
          label={className === "nav-versioning" ? `v${versionContext.version}` : props.children ?? props.label}
          onClick={props.to ? undefined : (e) => e.preventDefault()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              setShowDropdown(!showDropdown);
            }
          }}>
          props.children ?? props.label
        </NavLink>
      <ul className="dropdown__menu">
        {items.map((childItemProps, i) => (
          className === "nav-versioning" ? (
            <VersionsNavbarItem 
              isDropdownItem
              onKeyDown={(e) => {
                if (i === items.length - 1 && e.key === 'Tab') {
                  e.preventDefault();
                  setShowDropdown(false);
                  const nextNavbarItem = dropdownRef.current.nextElementSibling;

                  if (nextNavbarItem) {
                    nextNavbarItem.focus();
                  }
                }
              }}
              activeClassName={dropdownLinkActiveClass}
              {...childItemProps}
              onClick={(e) => versionContext.updateVersion(e)}
              key={i}
            />
          ) : (
            <NavbarItem
              isDropdownItem
              onKeyDown={(e) => {
                if (i === items.length - 1 && e.key === 'Tab') {
                  e.preventDefault();
                  setShowDropdown(false);
                  const nextNavbarItem = dropdownRef.current.nextElementSibling;
  
                  if (nextNavbarItem) {
                    nextNavbarItem.focus();
                  }
                }
              }}
              activeClassName={dropdownLinkActiveClass}
              {...childItemProps}
              key={i}
            />
          )
        ))}
      </ul>
    </div>
  );
}

function DropdownNavbarItemMobile({
  items,
  className,
  position: _position,
  versionContext,
  // Need to destructure position from props so that it doesn't get passed on.
  ...props
}) {
  const localPathname = useLocalPathname();
  const containsActive = containsActiveItems(items, localPathname);
  const {collapsed, toggleCollapsed, setCollapsed} = useCollapsible({
    initialState: () => !containsActive,
  }); // Expand/collapse if any item active after a navigation

  useEffect(() => {
    if (containsActive) {
      setCollapsed(!containsActive);
    }
  }, [localPathname, containsActive, setCollapsed]);
  return (
    <li
      className={clsx('menu__list-item', {
        'menu__list-item--collapsed': collapsed,
      })}>
      <NavLink
        role="button"
        className={clsx('menu__link menu__link--sublist', className)}
        {...props}
        label={className === "nav-versioning" ? `v${versionContext.version}` : props.children ?? props.label}
        onClick={(e) => {
          e.preventDefault();
          toggleCollapsed();
        }}>
        {props.children ?? props.label}
      </NavLink>
      <Collapsible lazy as="ul" className="menu__list" collapsed={collapsed}>
        {items.map((childItemProps, i) => (
          className === "nav-versioning" ? (
            <VersionsNavbarItem
              mobile
              isDropdownItem
              onClick={(e) => versionContext.updateVersion(e)}
              activeClassName="menu__link--active"
              {...childItemProps}
              key={i}
            />
          ) : (
            <NavbarItem
              mobile
              isDropdownItem
              onClick={props.onClick}
              activeClassName="menu__link--active"
              {...childItemProps}
              key={i}
            />
          )
        ))}
      </Collapsible>
    </li>
  );
}

function DropdownNavbarItem({mobile = false, ...props}) {
  const versionContext = useContext(VersionContext)

  const Comp = mobile ? DropdownNavbarItemMobile : DropdownNavbarItemDesktop;
  return <Comp versionContext={versionContext} {...props} />;
}

export default DropdownNavbarItem;
