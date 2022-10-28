import React, { useState, useEffect } from 'react'
import styles from './styles.module.css';

export default function SubMenu({ resource, handleFileSelect }) {
  const [subMenuOpen, setSubMenuOpen] = useState(false)
  return (
    <ul 
      className={styles.sidebarNestedList} 
      key={resource.name}
    >
      <li>
        <span 
          className={styles.listItem} 
          onClick={() => setSubMenuOpen(!subMenuOpen)}
        >
          <img src={`${subMenuOpen
            ? `/img/folder-open.svg`
            : `/img/folder.svg`
          }`} /> {resource.name}
        </span>
        {resource?.nodes && (
          <ul className={`${styles.sidebarNestedList}
            ${!subMenuOpen ? styles.hideItem : ''}
          `}>
            {resource.nodes.map(node => (
              <li key={node.name}>
                <span 
                  className={styles.listItem}
                  onClick={(e) => handleFileSelect(e)} 
                  data-nodeName={node.node}
                >
                  <img src="/img/file-icon.svg" /> {node.name}
                </span>
              </li>
            ))}
          </ul>
          )}
      </li>
    </ul>
  )
}
