import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { usePluginData } from '@docusaurus/useGlobalData';

function FAQ({ path, alt_header = null }) {
  const [isOn, setOn] = useState(false);
  const [filePath, setFilePath] = useState(path);
  const [fileContent, setFileContent] = useState({});
  const [hoverTimeout, setHoverTimeout] = useState(null);

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

  const handleMouseEnter = () => {
    setHoverTimeout(setTimeout(() => {
      setOn(true);
    }, 500));
  };

  const handleMouseLeave = () => {
  if (!isOn) {
      clearTimeout(hoverTimeout);
      setOn(false);
  }
};

  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const toggleOn = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setOn(!isOn);
  };

  return (
    <div className={styles.faqs} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <span className={styles.link} onClick={toggleOn}>
        <span className={styles.toggle} style={{ transform: isOn ? 'rotateX(0deg)' : 'rotateX(180deg)' }}></span>
        <span className={styles.headerText}>{alt_header || (fileContent?.meta && fileContent.meta.title)}</span>
        <small className={styles.disclaimer}>Hover to view</small>
      </span>
      <div style={{ display: isOn ? 'block' : 'none' }} className={styles.body}>
        {fileContent?.contents}
      </div>
    </div>
  );
}

export default FAQ;
