import React from 'react';

function DiscourseTopicList({ categoryID, numResults = 3, templateStyle = "basic" }) {
  var source = `https://discourse.getdbt.com/embed/topics?template=${templateStyle}&top_period=month&category=${categoryID}&order=views&per_page=${numResults}`;
  return (
    <iframe src={source} width="100%" height="400px" />
  );
}

export default DiscourseTopicList;
