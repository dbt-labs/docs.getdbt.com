import React, { useState, useEffect } from 'react'
import styles from './styles.module.css';

export default function SubMenu({ project, resource, handleFileSelect }) {
  const [subMenuOpen, setSubMenuOpen] = useState(false)
  const [directoryOpen, setDirectoryOpen] = useState(false)
  return (
    <ul 
      className={styles.sidebarNestedList} 
      key={resource.name}
    >
      <li title={`${resource.name}s`}>
        <span 
          className={styles.listItem} 
          onClick={() => setSubMenuOpen(!subMenuOpen)}
        >
          <img src={`${subMenuOpen
            ? `/img/folder-open.svg`
            : `/img/folder.svg`
          }`} /> {resource.name}s
        </span>
        {resource?.directories 
        && resource?.directories?.length > 0 ? (
          <ul className={`${styles.sidebarNestedList}
            ${!subMenuOpen ? styles.hideItem : ''}
          `}>
            {resource.directories.map(dir => (
              <li key={dir.name} title={dir.name}>
                <span 
                  className={styles.listItem} 
                  onClick={() => setDirectoryOpen(!directoryOpen)}
                >
                  <img src={`${directoryOpen
                    ? `/img/folder-open.svg`
                    : `/img/folder.svg`
                  }`} /> {dir.name}
                </span>
                {dir?.nodes && dir?.nodes?.length > 0 && (
                  <ul className={`${styles.sidebarNestedList}
                    ${!directoryOpen ? styles.hideItem : ''}
                  `}>
                    {dir.nodes.map(node => (
                      <li key={node.name} title={node.name}>
                        <span 
                          className={styles.listItem}
                          onClick={(e) => handleFileSelect(e)} 
                          data-package_name={project}
                          data-resource_type={resource.name}
                          data-node_name={node.node}
                          data-file_name={node.name}
                        >
                          <img src={resource.name === 'seed'
                            ? `/img/seed-icon.svg`
                            : `/img/file-icon.svg`} 
                          /> {node.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  )}
              </li>
            ))}
          </ul>
          ) : resource?.nodes && (
          <ul className={`${styles.sidebarNestedList}
            ${!subMenuOpen ? styles.hideItem : ''}
          `}>
            {resource.nodes.map(node => (
              <li key={node.name} title={node.name}>
                <span 
                  className={styles.listItem}
                  onClick={(e) => handleFileSelect(e)} 
                  data-package_name={project}
                  data-resource_type={resource.name}
                  data-node_name={node.node}
                  data-file_name={node.name}
                >
                  <img src={resource.name === 'seed'
                    ? `/img/seed-icon.svg`
                    : `/img/file-icon.svg`} 
                  /> {node.name}
                </span>
              </li>
            ))}
          </ul>
          )}


        
      </li>
    </ul>
  )
}
