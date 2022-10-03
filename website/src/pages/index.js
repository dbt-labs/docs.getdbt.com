
import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import classnames from 'classnames';
import Head from '@docusaurus/Head';
import Card from '@site/src/components/card';

const bannerAnimation = require('@site/static/img/banner-white.svg');

function getBanner() {
  return { __html: bannerAnimation };
};

function Home() {
  const context = useDocusaurusContext();

  return (
    <>
      <Head>
        <meta name="google-site-verification" content="ex1EMwuCGU33-nOpoOajLXEpMPgUYK5exBWePCu-0l0" />
      </Head>
      <Layout permalink="/">
        <div className="container container--fluid home" style={{ "padding": "10px 0", "background": "#FFF" }}>
          <section className="resource-section row">
            <div className="col col--8">
              <h2>Popular resources</h2>
              <div class="row">
                <div className="col col--6">
                  <Card
                    title="What is dbt?"
                    body="dbt enables data practitioners to adopt software engineering best practices and deploy modular, reliable analytics code."
                    link="https://docs.getdbt.com/docs/introduction"
                    icon="question-mark"
                  />
                </div>
                <div className="col col--6">
                  <Card
                    title="Getting started guide"
                    body="Learn how to set up dbt and build your first models. You will also test and document your project, and schedule a job."
                    link="https://docs.getdbt.com/guides/getting-started"
                    icon="question-mark"
                  />
                </div>
              </div>
              <div class="row">
                <div className="col col--6">
                  <Card
                    title="Docs"
                    body="Discover everything dbt has to offer from the basics to advanced concepts"
                    link="https://docs.getdbt.com/docs/introduction"
                    icon="question-mark"
                  />
                </div>
                <div className="col col--6">
                  <Card
                    title="Supported data platforms"
                    body="dbt connects to most major databases, data warehouses, data lakes, or query engines."
                    link="https://docs.getdbt.com/docs/available-adapters"
                    icon="question-mark"
                  />
                </div>
              </div>
            </div>
            <div className="col col--4">
              <h2>Featured resource</h2>
              <Card
                title="What is dbt?"
                body="Lorem ipsum dolor sit amet, consectetur elit, sed do eiu smod tempor incididunt."
                link="https://docs.getdbt.com/docs/introduction"
                icon="question-mark"
              />
            </div>
          </section>

          <section className="from-the-blog row">
            <div className="col">
              <h2>The latest from the Developer Blog</h2>
              <div className="row">
                <div className="col col--4">
                  <Card
                    title="What is dbt?"
                    body="dbt enables data practitioners to adopt software engineering best practices and deploy modular, reliable analytics code."
                    link="https://docs.getdbt.com/docs/introduction"
                    icon="question-mark"
                  />
                </div>
                <div className="col col--4">
                  <Card
                    title="Getting started guide"
                    body="Learn how to set up dbt and build your first models. You will also test and document your project, and schedule a job."
                    link="https://docs.getdbt.com/guides/getting-started"
                    icon="question-mark"
                  />
                </div>
                <div className="col col--4">
                  <Card
                    title="Docs"
                    body="Discover everything dbt has to offer from the basics to advanced concepts"
                    link="https://docs.getdbt.com/docs/introduction"
                    icon="question-mark"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="from-the-community row">
            <div className="col">
              <h2>From the dbt community</h2>
              <div className="row">
                <div className="col col--4">
                  <Card
                    title="What is dbt?"
                    body="Lorem ipsum dolor sit amet, consectetur elit, sed do eiu smod tempor incididunt."
                    link="https://docs.getdbt.com/docs/introduction"
                    icon="question-mark"
                  />
                </div>
                <div className="col col--4">
                  <Card
                    title="What is dbt?"
                    body="Lorem ipsum dolor sit amet, consectetur elit, sed do eiu smod tempor incididunt."
                    link="https://docs.getdbt.com/docs/introduction"
                    icon="question-mark"
                  />
                </div>
                <div className="col col--4">
                  <Card
                    title="What is dbt?"
                    body="Lorem ipsum dolor sit amet, consectetur elit, sed do eiu smod tempor incididunt."
                    link="https://docs.getdbt.com/docs/introduction"
                    icon="question-mark"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="like-a-pro row">
            <div className="col">
              <h2>Use dbt like a pro</h2>
              <div className="row">
                <div className="col col--4">
                  <Card
                    title="What is dbt?"
                    body="Lorem ipsum dolor sit amet, consectetur elit, sed do eiu smod tempor incididunt."
                    link="https://docs.getdbt.com/docs/introduction"
                    icon="question-mark"
                  />
                </div>
                <div className="col col--4">
                  <Card
                    title="What is dbt?"
                    body="Lorem ipsum dolor sit amet, consectetur elit, sed do eiu smod tempor incididunt."
                    link="https://docs.getdbt.com/docs/introduction"
                    icon="question-mark"
                  />
                </div>
                <div className="col col--4">
                  <Card
                    title="What is dbt?"
                    body="Lorem ipsum dolor sit amet, consectetur elit, sed do eiu smod tempor incididunt."
                    link="https://docs.getdbt.com/docs/introduction"
                    icon="question-mark"
                  />
                </div>
              </div>
            </div>
          </section>

        </div>

        <div className="banner-animation" dangerouslySetInnerHTML={getBanner()}></div>
      </Layout>
    </>
  );
}

export default Home;
