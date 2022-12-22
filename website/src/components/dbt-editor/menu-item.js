import React, { useState, useEffect } from 'react'
import SubMenu from './sub-menu';
import styles from './styles.module.css';

const buildSubItems = (thisSubItem, isResource, handleFileSelect) => {
  // Group all directories & nodes for items
  const subItems = []
  thisSubItem?.directories?.length && 
    subItems.push(...thisSubItem.directories)
  thisSubItem?.nodes?.length &&
    subItems.push(...thisSubItem.nodes)

  return <MenuItem 
    item={thisSubItem}
    name={isResource ? `${thisSubItem.name}s` : thisSubItem.name}
    subItems={subItems} 
    isNode={thisSubItem?.isNode}
    handleFileSelect={handleFileSelect}
  />
}

export default function MenuItem({ item, name, subItems, defaultOpen = false, isResource = false, isNode, handleFileSelect }) {
  console.log('item', item)
  const [itemOpen, setItemOpen] = useState(defaultOpen)
  return (
    <li key={name} title={name}>
      <span 
        className={styles.listItem}
        onClick={isNode
          ? e => handleFileSelect(e)
          : () => setItemOpen(!itemOpen)}
        data-resource_type={item?.resourceType && item.resourceType}
        data-node_name={item?.isNode && item.node}
        data-file_name={item?.name}
      >
        <img src={`${itemOpen
          ? `/img/folder-open.svg`
          : `/img/folder.svg`
        }`} />
        {name}
      </span>
      {itemOpen && (
        <>
          {subItems && (
            <ul className={styles.sidebarNestedList}>
              {subItems.map(subItem => (
                buildSubItems(subItem, isResource, handleFileSelect)
              ))}
            </ul>
          )}
        </>
      )}
    </li>
  )
}
