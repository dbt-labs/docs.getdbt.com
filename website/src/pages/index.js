
import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import classnames from 'classnames';
import Head from '@docusaurus/Head';
import Card from '@site/src/components/card';
import Hero from '@site/src/components/hero';
import Callout from '@site/src/components/callout';
// import Swiper JS
import Swiper from 'swiper';
// import Swiper styles
import 'swiper/css';


const bannerAnimation = require('@site/static/img/banner-white.svg');

function getBanner() {
  return { __html: bannerAnimation };
};

function Home() {
  return (
    <>
      <Head>
        <meta name="google-site-verification" content="ex1EMwuCGU33-nOpoOajLXEpMPgUYK5exBWePCu-0l0" />
      </Head>
      <Layout permalink="/">
        <div className="container container--fluid home" style={{ "padding": "0", "background": "#FFF" }}>
          <Hero heading="Welcome to the dbt Developer Hub" subheading="Your home base for learning dbt, connecting with the community and contributing to the craft of analytics engineering " showGraphic />
          <section className="resource-section row">
            <div className="popular-header"><h2>Popular resources</h2></div>
            <div className="popular-resources">
              <div class="grid">
                <div>
                  <Card
                    title="What is dbt?"
                    body="dbt enables data practitioners to adopt software engineering best practices and deploy modular, reliable analytics code."
                    link="/docs/introduction"
                    icon="question-mark"
                  />
                </div>
                <div>
                  <Card
                    title="Getting started guide"
                    body="Learn how to set up dbt and build your first models. You will also test and document your project, and schedule a job."
                    link="/guides/getting-started"
                    icon="book"
                  />
                </div>
                <div>
                  <Card
                    title="Docs"
                    body="Discover everything dbt has to offer from the basics to advanced concepts."
                    link="/docs/introduction"
                    icon="docs"
                  />
                </div>
                <div>
                  <Card
                    title="Supported data platforms"
                    body="dbt connects to most major databases, data warehouses, data lakes, or query engines."
                    link="/docs/available-adapters"
                    icon="rocket"
                  />
                </div>
              </div>
            </div>
            <div className="featured-header"><h2>Featured resource</h2></div>
            <div className="featured-resource">
              <Card
                title="What is dbt?"
                body="Lorem ipsum dolor sit amet, consectetur elit, sed do eiu smod tempor incididunt."
        
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
                  title="Join the community"
                  body="Connect with data practitioners from around the world."
                  link="https://www.getdbt.com/community/join"
                  icon="smiley-face"
                />
              </div>
              <div>
                <Card
                  title="How to contribute"
                  body="Help build the resources the community uses to solve hard problems."
                  link="/docs/introduction"
                  icon="pencil-paper"
                />
              </div>
              <div>
                <Card
                  title="Open source dbt projects"
                  body="Take your dbt project to the next level with community built packages."
                  link="https://hub.getdbt.com/"
                  icon="packages"
                />
              </div>
            </div>
          </section>

          <section className="like-a-pro ">
            <h2>Use dbt like a pro</h2>
            <div className="grid--3-col">
              <div>
                <Card
                  title="Guides"
                  body="Learn battle tested strategies for analytics engineering best practices."
                  link="/guides/getting-started"
                  icon="guides"
                />
              </div>
              <div>
                <Card
                  title="Community Forum"
                  body="Get help and swap knowledge in the async forum."
                  link="/guides/getting-started"
                  icon="discussions"
                />
              </div>
              <div>
                <Card
                  title="Online courses"
                  body="Structured video courses to give you a deep dive into analytics engineering topics."
                  link="https://courses.getdbt.com/collections"
                  icon="computer"
                />
              </div>
            </div>
          </section>

          <Callout heading="Create a free account to get started" subheading="Start delivering reliable datasets at the pace your business requires with a free-forever developer account. New accounts include access to a 14-day free trial of the Team plan, which allows you to invite up to 40 collaborators, no credit card required." cta="Create a free account" link="https://www.getdbt.com/signup/" />

        </div>

        <div className="banner-animation" dangerouslySetInnerHTML={getBanner()}></div>
      </Layout>
    </>
  );
}

export default Home;
