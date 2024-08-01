import React, { useState, useEffect } from 'react';
import Markdown from "markdown-to-jsx";
import styles from './styles.module.css';
import { usePluginData } from '@docusaurus/useGlobalData';

function FAQ({ path, alt_header = null }) {
  const [isOn, setOn] = useState(false);
  const [filePath, setFilePath] = useState(path);
  const [fileContent, setFileContent] = useState({});

  // Get all faq file paths from plugin
  const { faqFiles } = usePluginData('docusaurus-build-global-data-plugin');

  useEffect(() => {
    // Search for faq where frontmatter ID matches path prop
    const faqFile = faqFiles.find(file => path?.includes(file?.id))

    // If faqFile found with ID, set filePath for this file
    if (faqFile?.id) {
      let thisPath = faqFile?.filePath?.replace('docs/faqs/', '')
      thisPath = thisPath?.replace('.md', '')
      if (thisPath) {
        setFilePath(thisPath);
      }
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("filePath", filePath);
        const file = await import(`../../../docs/faqs/${filePath}.md`)
        console.log("file", file)

        if (file) {
          const meta = file.metadata;
          console.log('meta', meta)

          // const markdown = await fetch(file.default);
          const markdown = file.default;
          console.log("markdown", markdown);
          // const contents = await fetch(markdown?.text())
          // console.log('contents', contents)

          setFileContent({ meta, contents: markdown })
        }
      } catch (err) {
        return null
      }
    }
    fetchData()
  }, [filePath])

  const toggleOn = function () {
    setOn(!isOn);
  }

  console.log("fileContent", fileContent);

  return (
    <div className={styles.faqs}>
      <span className={styles.link} onClick={toggleOn}>
        <span
          className={styles.toggle}
          style={{ transform: isOn ? "rotateX(0deg)" : "rotateX(180deg)" }}
        ></span>
        <span className={styles.headerText}>
          {alt_header || (fileContent?.meta && fileContent.meta.title)}
        </span>
      </span>
      {fileContent.contents ? (
        <div
          style={{ display: isOn ? "block" : "none" }}
          className={styles.body}
        >
          {/* <Markdown children={fileContent.contents} /> */}
          {fileContent.contents}
        </div>
      ) : null}
    </div>
  );
}

export default FAQ;
