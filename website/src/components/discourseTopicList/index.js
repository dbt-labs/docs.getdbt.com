import React from 'react';

function DiscourseTopicList({ categoryID, tags, numResults = 3, templateStyle, createNew = false, orderBy = "default", topPeriod = "quarterly" }) {
  var params = [];
  if (categoryID) {
    params.push(`categoryID=${categoryID}`);
  }
  if (tags && tags.length > 0) {
    params.push(`tags=${tags.replace(",", "+")}`);
  }
  if (numResults) {
    params.push(`per_page=${numResults}`);
  }
  if (templateStyle) {
    params.push(`template=${templateStyle}`);
  }
  if (createNew) {
    params.push(`allow_create=true`);
  }
  if (orderBy) {
    params.push(`order=${orderBy}`);
  }
  if (topPeriod) {
    params.push(`top_period=${topPeriod}`);
  }

  var source = `https://discourse.getdbt.com/embed/topics?${params.join("&")}`;

  return (
    <iframe src={source} width="100%" height="1400px" />
  );
}

export default DiscourseTopicList;
