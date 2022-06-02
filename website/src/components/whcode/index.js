import React from 'react';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

function WHCode({children}) {
  if (children.length != 4) {
      throw "Expected four elements as children of WHCode element, got " + children.length;
  }
  return (
    <Tabs
      defaultValue="bq"
      values={[
        { label: 'BigQuery', value: 'bq', },
        { label: 'Databricks', value: 'db', },
        { label: 'Redshift', value: 'rs', },
        { label: 'Snowflake', value: 'sf', },
      ]
    }>
        <TabItem value="bq">{children[0]}</TabItem>
        <TabItem value="db">{children[1]}</TabItem>
        <TabItem value="rs">{children[2]}</TabItem>
        <TabItem value="sf">{children[3]}</TabItem>
    </Tabs>
  );
}

export default WHCode;