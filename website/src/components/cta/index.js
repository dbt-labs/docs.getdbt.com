import React from 'react'
import {usePluginData} from '@docusaurus/useGlobalData';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function CTA({ cta }) {

  const { CTAData } = usePluginData('docusaurus-build-global-data-plugin');

  const thisCta = CTAData.find(data => data.name === cta)

  if(!thisCta)
    return false

  const { header, subheader, button_text, url } = thisCta

  // Get site url from docusaurus.config.js
  // If cta url has different hostname, open cta in new tab 
  const { siteConfig } = useDocusaurusContext()
  return (
    <div className="docs-cta">
      <h4>{header}</h4>
      <p>{subheader}</p>
      {button_text && (
        <a 
          className="docs-cta-btn" 
          href={url} 
          title={button_text}
          target={!url.includes(siteConfig?.url) ? '_blank' : '_self'}
        >{button_text}</a>
      )}
    </div>
  )
}
