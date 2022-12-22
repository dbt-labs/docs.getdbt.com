import React, { useState, useEffect } from 'react'
import MenuItem from './menu-item';
import styles from './styles.module.css';

export default function SubMenu({ item, isResource = false, handleFileSelect }) {
  // Group all directories & nodes for items
  const subItems = []
  item?.directories?.length && 
    subItems.push(...item.directories)
  item?.nodes?.length &&
    subItems.push(...item.nodes)

  console.log('item', item)
  return (
    <MenuItem 
      item={isResource ? `${item.name}s` : item.name}
      isNode={item?.isNode}
      subItems={subItems} 
    />
  )
}
