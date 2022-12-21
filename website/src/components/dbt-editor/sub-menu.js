import React, { useState, useEffect } from 'react'
import MenuItem from './menu-item';
import styles from './styles.module.css';

export default function SubMenu({ item, handleFileSelect }) {
  return (
    <ul className={styles.sidebarNestedList}>
      <MenuItem 
        item={item.name} 
        subItems={item?.directories?.length 
          ? item.directories 
          : item?.nodes ? item.nodes : '' } 
      />
    </ul>
  )
}
