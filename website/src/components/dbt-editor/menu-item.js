import React, { useState } from 'react'
import styles from './styles.module.css';

// Build submenu for each menu item
// This self-invokes the MenuItem component from within itself
const buildSubItems = (thisSubItem, isResource, handleFileSelect) => {
  // Group all directories & nodes for items
  const subItems = []
  thisSubItem?.directories?.length && 
    subItems.push(...thisSubItem.directories)
  thisSubItem?.nodes?.length &&
    subItems.push(...thisSubItem.nodes)

  // Return each submenu item as its own menu item
  return <MenuItem 
    item={thisSubItem}
    name={isResource ? `${thisSubItem.name}s` : thisSubItem.name}
    subItems={subItems} 
    isNode={thisSubItem?.isNode}
    handleFileSelect={handleFileSelect}
  />
}

export default function MenuItem({ item, name, subItems, defaultOpen = false, isResource = false, isNode, handleFileSelect }) {
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
        {item?.isNode ? (
          <img src={item?.resourceType === 'seed'
            ? `/img/seed-icon.svg`
            : `/img/file-icon.svg`} 
          />
        ) : (
          <img src={`${itemOpen
            ? `/img/folder-open.svg`
            : `/img/folder.svg`
          }`} />
        )}
        {name}
      </span>
      {itemOpen && (
        <>
          {subItems && (
            <ul className={styles.sidebarNestedList}>
              {subItems.map(subItem => (
                <React.Fragment key={subItem.name}>
                  {buildSubItems(subItem, isResource, handleFileSelect)}
                </React.Fragment>
              ))}
            </ul>
          )}
        </>
      )}
    </li>
  )
}
