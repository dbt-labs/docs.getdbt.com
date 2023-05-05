import React, { useEffect } from 'react'

export const HubSpotForm = (props) => {
  const {
    region,
    portalId,
    formId,
    containerId = 'hubspotForm',
    sfdcCampaignId = '',
  } = props
  const formatContainerId = '#' + containerId
  useEffect(() => {
    // Only add hubspot script if not already exists
    let script = document.getElementById('hubspot-v2-script')
    if (!script) {
      const newScript = document.createElement('script')
      newScript.src = '//js.hsforms.net/forms/v2.js'
      newScript.id = 'hubspot-v2-script'
      document.body.appendChild(newScript)
      script = newScript
    }

    script.addEventListener('load', () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          region: region,
          portalId: portalId,
          formId: formId,
          target: formatContainerId,
          sfdcCampaignId: sfdcCampaignId,
        })
      }
    })
  }, [])

  return (
    <div>
      <div id={containerId}></div>
    </div>
  )
}
