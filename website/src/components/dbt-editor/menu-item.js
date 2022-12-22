import React, { useState, useEffect } from 'react'
import SubMenu from './sub-menu';
import styles from './styles.module.css';

export default function MenuItem({ item, subItems, defaultOpen = false, isResource = false, isNode = false, handleFileSelect }) {
  const [itemOpen, setItemOpen] = useState(defaultOpen)
  return (
    <li key={item} title={item}>
      <span 
        className={styles.listItem}
        onClick={() => setItemOpen(!itemOpen)}
      >
        <img src={`${itemOpen
          ? `/img/folder-open.svg`
          : `/img/folder.svg`
        }`} />
        {item}
      </span>
      {itemOpen && (
        <>
          {subItems && (
            <ul className={styles.sidebarNestedList}>
              {subItems.map((subItem, i) => (
                <SubMenu 
                  item={subItem}
                  isResource={isResource}
                  handleFileSelect={handleFileSelect}
                  key={i}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </li>
  )
}
