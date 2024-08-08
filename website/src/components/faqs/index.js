import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { usePluginData } from '@docusaurus/useGlobalData';

function FAQ({ path, alt_header = null }) {
  const [isOn, setOn] = useState(false);
  const [filePath, setFilePath] = useState(path);

  // Get all faq file paths from plugin
  const { faqFiles } = usePluginData("docusaurus-build-global-data-plugin");

  useEffect(() => {
    // Search for faq where frontmatter ID matches path prop
    const faqFile = faqFiles.find((file) => path?.includes(file?.id));

    // If faqFile found with ID, set filePath for this file
    if (faqFile?.id) {
      let thisPath = faqFile?.filePath?.replace("docs/faqs/", "");
      thisPath = thisPath?.replace(".md", "");
      if (thisPath) {
        setFilePath(thisPath);
      }
    }
  }, []);

  let meta, contents
  const file = require(`../../../docs/faqs/${filePath}.md`);
  if (file) {
    meta = file.metadata;
    contents = file?.default({});
  }

  const toggleOn = function () {
    setOn(!isOn);
  };

  return (
    <div className={styles.faqs}>
      <span className={styles.link} onClick={toggleOn}>
        <span
          className={styles.toggle}
          style={{ transform: isOn ? "rotateX(0deg)" : "rotateX(180deg)" }}
        ></span>
        <span className={styles.headerText}>
          {alt_header || (meta?.title && meta.title)}
        </span>
      </span>
      {contents ? (
        <div
          style={{ display: isOn ? "block" : "none" }}
          className={styles.body}
        >
          {contents}
        </div>
      ) : null}
    </div>
  );
}

export default FAQ;
