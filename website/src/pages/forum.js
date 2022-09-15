import React from 'react';
import Layout from '@theme/Layout';
import DiscourseFeed from '@site/src/components/discourse';


function Events() {
  return (
    <Layout>
      <div className="container discourse-forum-page">
        <DiscourseFeed title="Open topics" category='help' status='unsolved' after='2022-08-14' />
        <DiscourseFeed title="Cool Problem Solving" category='show-and-tell' after='2022-06-14' inString='first' />
        <DiscourseFeed title="Interesting Discussions" category='discussions' inString='first' after='2022-06-14' />
      </div>
    </Layout>
  );
}

export default Events;
