import React from 'react';
import Admonition from '@theme/Admonition'; 

const VersionCallout = ({ version }) => {
  if (!version) {
    return null;
  }

  return (
  <div>
    <Admonition
      type="tip"
      // data-md-hide keeps the emoji on the rendered callout but strips it from
      // the generated Markdown, where a bare string icon (unlike the default
      // aria-hidden SVG admonition icons) leaked as "💡Did you know...".
      icon={<span data-md-hide="true">💡</span>}
      title="Did you know..."
    >
      <span>
        Available from dbt v{version} or with the{' '}
        <a href="/docs/dbt-versions/dbt-release-tracks">
        dbt "v1 Latest" release track
        </a>{''}.
      </span>
    </Admonition>
  </div>
);
};

export default VersionCallout;
