import React from 'react';
import Layout from '@theme/Layout';
import DiscourseFeed from '@site/src/components/discourse';

function Events() {
  return (
    <Layout>
      <section className='discourse-forum-page'>
        <div className='container'>   
          <h1>dbt Discourse</h1>
          <DiscourseFeed title='Open topics' category='help' status='unsolved'  link_text='See open topics' />
          <DiscourseFeed title='Cool Problem Solving' category='show-and-tell' after='2022-06-14' link_text='See more topics' link_href='https://discourse.getdbt.com/c/show-and-tell/22' />
          <DiscourseFeed title='Interesting Discussions' category='discussions'   link_text='See discussions' link_href='https://discourse.getdbt.com/c/discussions/21' />
        </div>
      </section>
    </Layout>
  );
}

export default Events;
