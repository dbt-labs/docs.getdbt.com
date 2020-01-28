import React from 'react';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

function CloudCore({children}) {
  if (children.length != 2) {
      throw "Expected two elements as children of CloudCore element, got " + children.length;
  }
  return (
    <Tabs
      defaultValue="cloud"
      values={[
        { label: 'dbt Cloud', value: 'cloud', },
        { label: 'dbt CLI', value: 'cli', },
      ]
    }>
        <TabItem value="cloud">{children[0]}</TabItem>
        <TabItem value="cli">{children[1]}</TabItem>
    </Tabs>
  );
}

export default CloudCore;

