
import React from 'react';
import Layout from '@theme/Layout';
import EventsFeed from '@site/src/components/events';


function Events() {
  return (
    <Layout>
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
