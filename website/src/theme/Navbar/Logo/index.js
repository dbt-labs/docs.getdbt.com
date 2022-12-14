import React from 'react';
import Logo from '@theme/Logo';

/* dbt Customizations:
 * Import useActiveDocContext hook to check if docs page
 * Check if page has sidebar
 * If has sidebar, add custom class to logo
 * This sets custom styles with right border for docs pages
*/ 
import {useActiveDocContext} from '@docusaurus/plugin-content-docs/client';

export default function NavbarLogo() {
  let hasSidebar = true
  const thisDocContext = useActiveDocContext()
  if(!thisDocContext?.activeDoc?.sidebar) {
    hasSidebar = false
  }
  return (
    <Logo
      className={`navbar__brand ${hasSidebar ? 'dbt__brand': ''}`}
      imageClassName="navbar__logo"
      titleClassName="navbar__title text--truncate"
    />
  );
}
