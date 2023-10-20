import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import { DiscourseFeed } from '@site/src/components/discourse';

function Events() {
  return (
    <Layout>
      <Head>
        <title>Questions | dbt Developer Hub</title>
        <meta name="description" content="Recent interesting discussions from across the dbt Forum" />
      </Head>
      <section className='discourse-forum-page'>
        <div className='container'>   
          <h1>dbt Community Forum</h1>
          <p>The dbt Community Forum is the preferred platform for support questions  as well as a space for long-lived discussions about dbt, analytics engineering, and the analytics profession. It's a place for us to build up a long-lasting knowledge base around the common challenges, opportunities, and patterns we work with every day.</p>
          <DiscourseFeed title='Unanswered Help Questions' category='help' status='unsolved'  link_text='See open topics' link_href='https://discourse.getdbt.com/c/help/19' show_cta={true} />
          <DiscourseFeed title='In-Depth Discussions' category='discussions' link_text='See discussions' link_href='https://discourse.getdbt.com/c/discussions/21' show_cta={true} />
          <DiscourseFeed title='Show and Tell' category='show-and-tell' link_text='See more topics' link_href='https://discourse.getdbt.com/c/show-and-tell/22' show_cta={true} />
        </div>
      </section>
    </Layout>
  );
}

export default Events;
