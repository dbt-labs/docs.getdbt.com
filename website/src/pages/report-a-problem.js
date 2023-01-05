
import React from 'react';
import Layout from '@theme/Layout';
import Hero from '@site/src/components/hero';

function ReportAProblem() {
  
  return (
    <>
      <Layout>
        <div className="container container--fluid home" style={{ "padding": "0", "background": "#FFF" }}>
          <Hero heading="Welcome to the dbt Developer Hub" subheading="Your home base for learning dbt, connecting with the community and contributing to the craft of analytics engineering " showGraphic />
            <section>
                <h1>Test</h1>
            </section>
        </div>
      </Layout>
    </>
  );
}

export default ReportAProblem;
