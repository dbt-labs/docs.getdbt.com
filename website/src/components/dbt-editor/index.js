import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Editor from "@monaco-editor/react";
import SubMenu from './sub-menu';
import { Lineage } from '../lineage';
import { buildSidebar } from './utils/build-sidebar';
import { parseCsv } from './utils/parse-csv';
import styles from './styles.module.css';
import MenuItem from './menu-item';

const editorOptions = {
  readOnly: false,
  minimap: { enabled: false },
  scrollbar: {
    vertical: 'hidden'
  },
  overviewRulerBorder: false,
  wordWrap: 'on',
  overviewRulerLanes: 0,
  hideCursorInOverviewRuler: true,
}

const defaultEditorValue = "/*\n  Welcome to the dbt editor!\n  Select a file on the left to get started.\n*/"
const errorEditorValue = "/*\n  Unable to get CSV data. \n Try selecting another seed.\n*/"

function dbtEditor({ project }) {
  const [manifest, setManifest] = useState({})
  const [showLineage, setShowLineage] = useState(false);
  const [sidebar, setSidebar] = useState([])
  const [csvData, setCsvData] = useState()
  const [currentSql, setCurrentSql] = useState(defaultEditorValue)
  const [error, setError] = useState(false)
  const [packageOpen, setPackageOpen] = useState(true)
  const [currentNodeId, setCurrentNodeId] = useState(null);

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

  // Get selected node from sidebar
  const handleFileSelect = async (e) => {
    const { 
      package_name, 
      resource_type, 
      node_name, 
      file_name 
    } = e?.target?.dataset

    if(!package_name || !resource_type || !node_name) {
      setError(true)
      return
    }

    setCurrentNodeId(node_name)
    const thisNode = manifest?.nodes[node_name]
    if(!thisNode) {
      setError(true)
      return
    }

    if(resource_type === 'seed') {
      // Show CSV seed data
      const csvRes = await parseCsv(project, file_name)
      // If CSV data not found, show message in editor
      if(!csvRes) {
        setCurrentSql(errorEditorValue)
        setCsvData(undefined)
        return
      }

      // Show seed data from CSV
      setCurrentSql("")
      setCsvData(csvRes)
    } else {
      // Show SQL code in editor
      let thisSql = ""
      if(thisNode?.raw_sql) {
        thisSql = thisNode.raw_sql
      } else if(thisNode?.raw_code) {
        thisSql = thisNode.raw_code
      }
      setCurrentSql(thisSql)
      setCsvData(undefined)
    }
  }
  
  console.log('sidebar', sidebar)

  return (
    <>
      {error ? (
        <p>Unable to load editor at this time.</p>
      ) : (
        <div className={styles.dbtEditor}>
          <div className={styles.dbtEditorSidebar}>
            <span className={styles.sidebarHeader}>File Explorer</span>
            <ul className={styles.sidebarList}>
              {sidebar && sidebar.map((project, i) => (
                <MenuItem 
                  item={project.project} 
                  subItems={project.resources} 
                  isResource={true}
                  defaultOpen={true} 
                  key={i}
                />
              ))}
            </ul>
          </div>
          <div className={styles.dbtEditorMain}>
            {currentSql && (
              <div className={styles.dbtEditorCli}>
                <Editor
                  height="300px"
                  width="100%"
                  defaultLanguage="sql"
                  defaultValue={defaultEditorValue}
                  value={currentSql}
                  options={editorOptions}
                  className='overflow-hidden'
                />
              </div>
            )}
            <div className={styles.dbtEditorActions}>
              {/* <button className={styles.editorAction}>Preview</button>
              <button className={styles.editorAction}>Save</button>
              <button className={styles.editorAction}>Run</button>
              <button className={styles.editorAction}>Test</button> */}
              <button className={styles.editorAction}
                      onClick={() => setShowLineage((isShowing) => !isShowing)}>
                Lineage
              </button>
            </div>
            {!showLineage && <div className={styles.dbtEditorResults}>
              {/* {!csvData && (
                <div className={styles.resultsHeader}>
                  <span>17.0sec</span>{' '}|{' '}Results limited to 500 rows. <img src="/img/info-icon.svg" />
                </div>
              )} */}
              <table>
                {csvData && csvData.length > 0 ? (
                  <>
                    {csvData.map((row, i) => (
                      i === 0
                        ? (
                          <thead key={i}>
                            <tr>
                              {row.map(col => (
                                <th>{col}</th>
                              ))}
                            </tr>
                          </thead>
                        ) : (
                          <tbody key={i}>
                            <tr>
                              {row.map(col => (
                                <td>{col}</td>
                              ))}
                            </tr>
                          </tbody>
                        )
                    ))}
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </table>
            </div>}
            {showLineage && <div className={styles.dbtLineageContainer}>
              <Lineage
                nodes={manifest.nodes}
                currentNodeId={currentNodeId}
                onNodeSelect={(node) => {
                  handleFileSelect({target: { dataset : node.data }})
                }} />
            </div>}
          </div>
        </div>

      )}
    </>
  );
}

export default dbtEditor;
