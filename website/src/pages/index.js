
import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import classnames from 'classnames';
import Head from '@docusaurus/Head';
import Card from '@site/src/components/card';
import Hero from '@site/src/components/hero';

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
        <Hero heading="Title here" subheading="subtitle here" />
          <section className="resource-section row">
            <div className="popular-header"><h2>Popular resources</h2></div>
            <div className="popular-resources">
              <div class="grid">
                <div>
                  <Card
                    title="What is dbt?"
                    body="dbt enables data practitioners to adopt software engineering best practices and deploy modular, reliable analytics code."
                    link="https://docs.getdbt.com/docs/introduction"
                    icon="question-mark"
                  />
                </div>
                <div>
                  <Card
                    title="Getting started guide"
                    body="Learn how to set up dbt and build your first models. You will also test and document your project, and schedule a job."
                    link="https://docs.getdbt.com/guides/getting-started"
                    icon="question-mark"
                  />
                </div>
                <div>
                  <Card
                    title="Docs"
                    body="Discover everything dbt has to offer from the basics to advanced concepts"
                    link="https://docs.getdbt.com/docs/introduction"
                    icon="question-mark"
                  />
                </div>
                <div>
                  <Card
                    title="Supported data platforms"
                    body="dbt connects to most major databases, data warehouses, data lakes, or query engines."
                    link="https://docs.getdbt.com/docs/available-adapters"
                    icon="question-mark"
                  />
                </div>
              </div>
            </div>
            <div className="featured-header"><h2>Featured resource</h2></div>
            <div className="featured-resource">
              <Card
                title="What is dbt?"
                body="Lorem ipsum dolor sit amet, consectetur elit, sed do eiu smod tempor incididunt."
                link="https://docs.getdbt.com/docs/introduction"
                icon="question-mark"
              />
            </div>
          </section>

          <section className="from-the-blog">
            <h2>The latest from the Developer Blog</h2>
            <div className="grid--3-col">
              <div>
                <Card
                  title="What is dbt?"
                  body="Lorem ipsum dolor sit amet, consectetur elit, sed do eiu smod tempor incididunt."
                  link="https://docs.getdbt.com/docs/introduction"
                  icon="question-mark"
                />
              </div>
              <div>
                <Card
                  title="What is dbt?"
                  body="Lorem ipsum dolor sit amet, consectetur elit, sed do eiu smod tempor incididunt."
                  link="https://docs.getdbt.com/docs/introduction"
                  icon="question-mark"
                />
              </div>
              <div>
                <Card
                  title="What is dbt?"
                  body="Lorem ipsum dolor sit amet, consectetur elit, sed do eiu smod tempor incididunt."
                  link="https://docs.getdbt.com/docs/introduction"
                  icon="question-mark"
                />
              </div>
            </div>
          </section>

          <section className="from-the-community">
            <h2>From the dbt community</h2>
            <div className="grid--3-col">
              <div>
                <Card
                  title="What is dbt?"
                  body="Lorem ipsum dolor sit amet, consectetur elit, sed do eiu smod tempor incididunt."
                  link="https://docs.getdbt.com/docs/introduction"
                  icon="question-mark"
                />
              </div>
              <div>
                <Card
                  title="What is dbt?"
                  body="Lorem ipsum dolor sit amet, consectetur elit, sed do eiu smod tempor incididunt."
                  link="https://docs.getdbt.com/docs/introduction"
                  icon="question-mark"
                />
              </div>
              <div>
                <Card
                  title="What is dbt?"
                  body="Lorem ipsum dolor sit amet, consectetur elit, sed do eiu smod tempor incididunt."
                  link="https://docs.getdbt.com/docs/introduction"
                  icon="question-mark"
                />
              </div>
            </div>
          </section>

          <section className="like-a-pro ">
            <h2>Use dbt like a pro</h2>
            <div className="grid--3-col">
              <div>
                <Card
                  title="What is dbt?"
                  body="Lorem ipsum dolor sit amet, consectetur elit, sed do eiu smod tempor incididunt."
                  link="https://docs.getdbt.com/docs/introduction"
                  icon="question-mark"
                />
              </div>
              <div>
                <Card
                  title="What is dbt?"
                  body="Lorem ipsum dolor sit amet, consectetur elit, sed do eiu smod tempor incididunt."
                  link="https://docs.getdbt.com/docs/introduction"
                  icon="question-mark"
                />
              </div>
              <div>
                <Card
                  title="What is dbt?"
                  body="Lorem ipsum dolor sit amet, consectetur elit, sed do eiu smod tempor incididunt."
                  link="https://docs.getdbt.com/docs/introduction"
                  icon="question-mark"
                />
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
