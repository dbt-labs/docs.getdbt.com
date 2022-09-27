
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
          <div className="resource-section row" style={{ "maxWidth": "var(--ifm-container-width)", "margin": "calc(5vh) auto calc(2vh)" }}>
            <div className="col col--6">
              <Card
              title="What is dbt?"
              body="Lorem ipsum dolor sit amet, consectetur elit, sed do eiu smod tempor incididunt."
              link="https://docs.getdbt.com/docs/introduction"
              icon="question-mark"
              />
            </div>
          </div>
        </div>

        <div className="banner-animation" dangerouslySetInnerHTML={getBanner()}></div>
      </Layout>
    </>
  );
}

export default Home;
