
import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import EventsFeed from '@site/src/components/events';


function Events() {
  return (
    <Layout>
        <Head>
          <title>Title here</title>
          <meta name="description" content="Description here" />
        </Head>
        <div className="container events-page">
           <section>
            <h1>Upcoming dbt Community Events</h1>
            <p>Join us for upcoming meetups, conferences, or office hours with the dbt Labs team. Events are online unless explicitly listed as in-person.</p>

            <EventsFeed />
           </section>
        </div>
    </Layout>
  );
}

export default Events;
