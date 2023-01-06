import React from 'react';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

function WHCode({children}) {

  let tabValuesArr = []
  let value

  const tabItems = children.map((child, index) => {
    if (child.props.warehouse == undefined || child.props.warehouse == '') {
      throw "Expected warehouse prop to be defined for each child of WHCode component";
    }

    tabValuesArr.push({ label: child.props.warehouse, value: child.props.warehouse })

    value = child.props.warehouse

    return (
      <TabItem key={index} value={value}>
        {child}
      </TabItem>
    );
  })

  return (
    <Tabs
      defaultValue={tabValuesArr[0].value}
      values={tabValuesArr}>
      {tabItems}
    </Tabs>
  );
}

export default WHCode;
