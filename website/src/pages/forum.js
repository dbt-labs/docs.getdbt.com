import React from 'react';
import Layout from '@theme/Layout';
import DiscourseFeed from '@site/src/components/discourse';


function Events() {
  return (
    <Layout>
        <div className="container discourse-forum-page">
            <DiscourseFeed />
        </div>
    </Layout>
  );
}

export default Events;
