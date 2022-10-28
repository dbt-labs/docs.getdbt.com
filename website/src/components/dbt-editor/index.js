import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Editor from "@monaco-editor/react";
import styles from './styles.module.css';

const editorOptions = {
  readOnly: false,
  minimap: { enabled: false },
}

const defaultEditorValue = "/*\n  Welcome to the dbt editor!\n  Select a file on the left to get started.\n*/"

function dbtEditor({ project }) {
  const [manifest, setManifest] = useState({})
  const [sidebar, setSidebar] = useState([])
  const [currentSql, setCurrentSql] = useState()
  const [error, setError] = useState(false)
  useEffect(() => {
    setError(false)
    async function buildData() {
      try {
        const res = await axios(`/dbt_projects/${project}/manifest.json`)
        if(!res?.data || !res?.data?.nodes) throw new Error('unable to find project data.')

        const { nodes } = res.data
        setManifest(res.data)
        const sidebarData = buildSidebar(nodes)
        if(!sidebarData) throw new Error('Unable to get sidebar data.')

        setSidebar(sidebarData)
      } catch(err) {
        setError(true)
        console.log('Error getting project data.', err)
      }
    }
    buildData()
  }, [])  

  console.log('sidebar', sidebar)

  // Get selected node from sidebar
  const handleFileSelect = (e) => {
    const { packagename, nodename } = e?.target?.dataset
    if(!packagename || !nodename) {
      setError(true)
      return
    }

    const thisNode = manifest?.nodes[nodename]
    console.log('thisNode', thisNode)
    if(!thisNode) {
      setError(true)
      return
    }

    setCurrentSql(thisNode.raw_sql)
  }

  console.log('currentSql', currentSql)
  return (
    <>
      {error ? (
        <p>Unable to load editor at this time.</p>
      ) : (
        <div className={styles.dbtEditor}>
          <div className={styles.dbtEditorSidebar}>
            <span className={styles.sidebarHeader}>File Explorer</span>
            <ul className={styles.sidebarList}>
              {sidebar && sidebar.map(project => (
                <li>
                  <span className={styles.listItem}>
                    <img src="/img/folder-open.svg" /> {project.project}
                  </span>
                  {project?.resources && project.resources.map(resource => (
                    <ul className={styles.sidebarNestedList}>
                      <li>
                        <span className={styles.listItem}>
                          <img src="/img/folder.svg" /> {resource.name}
                        </span>
                        {resource?.nodes && (
                          <ul className={styles.sidebarNestedList}>
                            {resource.nodes.map(node => (
                              <li>
                                <span 
                                  className={styles.listItem}
                                  onClick={(e) => handleFileSelect(e)} data-nodeName={node.node}
                                  data-packageName={project.project}
                                >
                                  <img src="/img/file-icon.svg" /> {node.name}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    </ul>
                  ))}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.dbtEditorMain}>
            <div className="editorCli">
              <Editor
                height="400px"
                defaultLanguage="sql"
                defaultValue={defaultEditorValue}
                value={currentSql}
                options={editorOptions}
              />
            </div>
            <div className={styles.dbtEditorActions}>
              <button class={styles.editorAction}>Preview</button>
              <button class={styles.editorAction}>Save</button>
              <button class={styles.editorAction}>Run</button>
              <button class={styles.editorAction}>Test</button>
            </div>
            <div className={styles.dbtEditorResults}>
              <div className={styles.resultsHeader}>
                <span>17.0sec</span> | Results limited to 500 rows. <img src="/img/info-icon.svg" />
              </div>
              <table>
                <thead>
                  <tr>
                    <th>customer_id</th>
                    <th>orders</th>
                    <th>payments</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>21532</td>
                    <td>12</td>
                    <td>12</td>
                  </tr>
                  <tr>
                    <td>49823</td>
                    <td>4</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>89234</td>
                    <td>2</td>
                    <td>2</td>
                  </tr>
                  <tr>
                    <td>12546</td>
                    <td>11</td>
                    <td>11</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      )}
    </>
  );
}

// Get packages
function buildSidebar(nodes) {
  const projectData = []
  for(let node in nodes) {
    const thisNode = nodes[node]
    const nodePath = thisNode?.path?.split('/')
    // If path not available in node, skip item in loop
    if(!nodePath) continue
    const filename = nodePath[nodePath.length - 1]

    // Set top-level directories
    let thisPackage = projectData.find(project => project?.project === thisNode.package_name)
    if(!thisPackage) {
      // Create new top-level package if not found
      thisPackage = {
        project: thisNode.package_name,
        resources: [],
      }
      projectData.push(thisPackage)
    }

    // Set resources
    let packagesResources = thisPackage?.resources?.find(resource => resource?.name === thisNode.resource_type)
    if(!packagesResources) {
      packagesResources = {
        name: thisNode.resource_type,
        nodes: [],
      }
      thisPackage.resources.push(packagesResources)
    }

    // Set nodes
    let packageNodes = thisPackage?.resources?.nodes?.find(node => node.name === filename)
    if(!packageNodes) {
      packageNodes = {
        node,
        name: filename,
        sql: thisNode.raw_sql,
      }
      packagesResources.nodes.push(packageNodes)
    }
  } 

  return projectData
}

export default dbtEditor;
