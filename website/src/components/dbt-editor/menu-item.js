import React, { useState, useEffect } from 'react'
import SubMenu from './sub-menu';
import styles from './styles.module.css';

export default function MenuItem({ item, subItems, defaultOpen = false, isNode = false, handleFileSelect }) {
  const [itemOpen, setItemOpen] = useState(defaultOpen)
  return (
    <li key={item} title={item}>
      <span 
        className={styles.listItem}
        onClick={() => setItemOpen(!itemOpen)}
      >
        {isNode ? (
          item === 'seed' ? (
            <img src={'/img/seed-icon.svg'} />
          ) : (
            <img src={'/img/file-icon.svg'} />
          )
        ) : (
          <img src={`${itemOpen
            ? `/img/folder-open.svg`
            : `/img/folder.svg`
          }`} />
        )}
        {item}
      </span>
      {itemOpen && (
        <>
          {subItems && subItems.map((subItem, i) => (
            <SubMenu 
              item={subItem}
              handleFileSelect={handleFileSelect}
              key={i}
            />
          ))}
        </>
      )}
    </li>
  )
}
