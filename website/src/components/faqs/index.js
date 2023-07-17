import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { usePluginData } from '@docusaurus/useGlobalData';

function FAQ({ path, alt_header = null }) {

  const [isOn, setOn] = useState(false);
  const [filePath, setFilePath] = useState(path)
  const [fileContent, setFileContent] = useState({})

  // Get all faq file paths from plugin
  const { faqFiles } = usePluginData('docusaurus-build-global-data-plugin');

  useEffect(() => {
    // Search for faq where frontmatter ID matches path prop
    const faqFile = faqFiles.find(file => file.id === path)

    // If faqFile found with ID, set filePath for this file
    if (faqFile?.id) {
      const data = faqFile.filePath.match(/(docs\/docs\/faqs\/(.*)\.md$)/g)
      if (data?.length) {
        setFilePath(data[1])
      }
    }
  }, [])

  useEffect(() => {
    try {
      const file = require(`../../../docs/faqs/${filePath}.md`)
      if (file) {
        const meta = file.metadata;
        const contents = file.default({});
        setFileContent({ meta, contents })
      }
    } catch (err) {
      return null
    }
  }, [filePath])

  const toggleOn = function () {
    setOn(!isOn);
  }

  return (
    <div className='faqs'>
      <span className={styles.link} onClick={toggleOn}>
        <span className={styles.toggle}
          style={{
            transform: isOn ? null : 'rotateX(180deg)'
          }}>
        </span >&nbsp;
        <span>{alt_header || fileContent?.meta && fileContent.meta.title}</span>
      </span >
      <div style={{ display: (isOn ? 'block' : 'none') }} className={styles.body}>
        {fileContent?.contents && fileContent.contents}
      </div>
    </div >
  );
}

export default FAQ;
