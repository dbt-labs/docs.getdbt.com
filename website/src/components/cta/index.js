import React, { useState, useEffect } from 'react'
import {usePluginData} from '@docusaurus/useGlobalData';

export default function CTA({ cta }) {

  const { CTAData } = usePluginData('docusaurus-build-blog-data-plugin');

  const thisCta = CTAData.find(data => data.name === cta)

  if(!thisCta)
    return false

  const { header, subheader, button_text, url } = thisCta

  const [ ctaStyle, setCtaStyle ] = useState({})
  
  // Set top position of CTA depending on if TOC exists
  // This is required due to the TOC in right sidebar being sticky
  useEffect(() => {
    let navbarHeight = 94
    let breadcrumbsHeight = 14
    let ctaTopPosition = navbarHeight
    const toc = document.querySelector('.blog-right-sidebar .thin-scrollbar')
    
    if(toc)
      ctaTopPosition = toc.offsetHeight + navbarHeight + breadcrumbsHeight

    setCtaStyle({
      top: `calc(${ctaTopPosition}px + 1rem)`
    })
  }, [])

  return (
    <div className="docs-cta" style={ctaStyle}>
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
