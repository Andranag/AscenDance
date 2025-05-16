import React from 'react';

export const NavigationMenu = ({ children, className = '' }) => (
  <nav className={`navigation-menu ${className}`}>
    {children}
  </nav>
);

export const NavigationMenuList = ({ children, className = '' }) => (
  <ul className={`navigation-menu-list flex ${className}`}>
    {children}
  </ul>
);

export const NavigationMenuItem = ({ children, className = '' }) => (
  <li className={`navigation-menu-item ${className}`}>
    {children}
  </li>
);

export default NavigationMenu;
