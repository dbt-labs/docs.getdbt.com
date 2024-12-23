import React from 'react';
import Admonition from '@theme/Admonition'; 

const VersionCallout = ({ version }) => {
  if (!version) {
    return null;
  }

  return (
  <div>
    <Admonition type="tip" icon="💡" title="Did you know...">
      <span>
        Available from dbt v{version} or with the{' '}
        <a href="/docs/dbt-versions/cloud-release-tracks">
        dbt Cloud "Latest" release track
        </a>{' '}.
      </span>
    </Admonition>
  </div>
);
};

export default VersionCallout;
