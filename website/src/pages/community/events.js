
import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import EventsFeed from '@site/src/components/events';


function Events() {
  return (
    <Layout>
        <Head>
          <title>dbt Community events</title>
          <meta name="description" content="Browse upcoming and on-demand dbt Labs webinars, workshops, and community sessions." />
        </Head>
        <div className="container events-page">
           <section>
            <h1>Community events & webinars</h1>
            <p>
              Upcoming and on-demand sessions from dbt Labs, including workshops and community programming. The schedule below is hosted on{' '}
              <a href="https://www.getdbt.com/resources/webinars" target="_blank" rel="noopener noreferrer">
                getdbt.com
              </a>
              .
            </p>

            <EventsFeed />
           </section>
        </div>
    </Layout>
  );
}

export default Events;
