import React, { useState, useEffect } from 'react'
import {usePluginData} from '@docusaurus/useGlobalData';

export default function CTA({ cta }) {

  const { CTAData } = usePluginData('docusaurus-build-global-data-plugin');

  const thisCta = CTAData.find(data => data.name === cta)

  if(!thisCta)
    return false

  const { header, subheader, button_text, url } = thisCta

  return (
    <div className="docs-cta">
      <h4>{header}</h4>
      <p>{subheader}</p>
      {button_text && (
        <a 
          className="docs-cta-btn" 
          href={url} 
          title={button_text}
          target="_blank"
        >{button_text}</a>
      )}
    </div>
  )
}
