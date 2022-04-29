/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
 import React from 'react';
 import clsx from 'clsx';
 import {getInfimaActiveClassName} from '@theme/NavbarItem/utils';

 const dropdownLinkActiveClass = 'dropdown__link--active';
 export function NavLink({
   activeBasePath,
   activeBaseRegex,
   to,
   href,
   label,
   activeClassName = '',
   prependBaseUrlToHref,
   ...props
 }) {
 
   return (
    <a 
      className={`${props.className}`}
      onClick={props.onClick}
    >
      { label }
    </a>
   );
 }
 
 function DefaultNavbarItemDesktop({
   className,
   isDropdownItem = false,
   ...props
 }) {
   const element = (
     <NavLink
       className={clsx(
         isDropdownItem ? 'dropdown__link' : 'navbar__item navbar__link',
         className,
       )}
       {...props}
     />
   );
 
   if (isDropdownItem) {
     return <li>{element}</li>;
   }
 
   return element;
 }
 
 function DefaultNavbarItemMobile({
   className,
   isDropdownItem: _isDropdownItem,
   ...props
 }) {
   return (
     <li className="menu__list-item">
       <NavLink className={clsx('menu__link', className)} {...props} />
     </li>
   );
 }
 
 function DefaultNavbarItem({
   mobile = false,
   position: _position,
   // Need to destructure position from props so that it doesn't get passed on.
   ...props
 }) {
   const Comp = mobile ? DefaultNavbarItemMobile : DefaultNavbarItemDesktop;
   return (
     <Comp
       {...props}
       activeClassName={
         props.activeClassName ?? getInfimaActiveClassName(mobile)
       }
     />
   );
 }
 
 export default DefaultNavbarItem;
