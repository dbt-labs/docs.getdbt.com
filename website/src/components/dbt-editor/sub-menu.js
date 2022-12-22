import React, { useState, useEffect } from 'react'
import MenuItem from './menu-item';
import styles from './styles.module.css';

export default function SubMenu({ item, isResource = false, handleFileSelect }) {
  return (
    <MenuItem 
      item={isResource ? `${item.name}s` : item.name} 
      subItems={item?.directories?.length 
        ? item.directories 
        : item?.nodes?.length ? item.nodes : '' } 
      // isNode={item?.nodes?.length && true}
    />
  )
}
