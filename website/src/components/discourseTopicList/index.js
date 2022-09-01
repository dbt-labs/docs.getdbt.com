import React from 'react';

function DiscourseTopicList({ categoryID, numResults = 3, templateStyle = "basic", createNew = false, orderBy = "default", topPeriod = "quarterly" }) {
  var source = `https://discourse.getdbt.com/embed/topics?template=${templateStyle}&top_period=${topPeriod}&category=${categoryID}&order=views&per_page=${numResults}${createNew ? '&allow_create=true' : ''}&order=${orderBy}`;

  return (
    <iframe src={source} width="100%" height="1400px" />
  );
}

export default DiscourseTopicList;
