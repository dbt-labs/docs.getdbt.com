import React, { useState, useEffect } from 'react'
import Editor from "@monaco-editor/react";
import styles from './styles.module.css';

const editorOptions = {
  readOnly: false,
  minimap: { enabled: false },
};

function dbtEditor() {
  return (
    <div className={styles.dbtEditor}>
      <div className={styles.dbtEditorSidebar}>
        <span className={styles.sidebarHeader}>File Explorer</span>
        <ul className={styles.sidebarList}>
          <li>
            <img src="/img/folder-open.svg" /> my_dbt_project
          </li>
        </ul>
      </div>
      <div className={styles.dbtEditorMain}>
        <div className="editorCli">
          <Editor
            height="400px"
            defaultLanguage="sql"
            defaultValue={`"/*\n    Welcome to your first dbt model!\n    Did you know that you can also configure models directly within SQL files?\n    This will override configurations stated in dbt_project.yml\n\n    Try changing \"table\" to \"view\" below\n*/\n\n{{ config(materialized='table') }}\n\nwith source_data as (\n\n    select 1 as id\n    union all\n    select null as id\n\n)\n\nselect *\nfrom source_data\n\n/*\n    Uncomment the line below to remove records with null \`id\` values\n*/\n\n-- where id is not null",`}
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
  );
}

export default dbtEditor;
