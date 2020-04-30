
import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import classnames from 'classnames';

const bannerAnimation = require('@site/static/img/banner-white.svg');

function getBanner() {
    return {__html: bannerAnimation};
};

function Home() {
  const context = useDocusaurusContext();

  return (
    <Layout permalink="/">
        <div className="container">
            <h1>
                Test
                <i data-icon="fishtown"></i>
            </h1>
            <div className="row" style={{"textAlign": "center", "marginTop": "calc(12.5vh)"}}>
                <div className="col col--4">
                  <div className="card">
                    <div className="card__header">
                      <h3>Documentation</h3>
                    </div>
                    <div className="card__body" style={{"textAlign": "left"}}>
                      <p>
                        View detailed reference documentation and usage guides for dbt.
                      </p>
                    </div>
                    <div className="card__footer">
                        <Link
                          className="button button--primary button--block"
                          to="/docs/introduction">
                          View the documentation
                        </Link>
                    </div>
                  </div>
                </div>
                <div className="col col--4">
                  <div className="card" >
                    <div className="card__header">
                      <h3>Getting Started</h3>
                    </div>
                    <div className="card__body" style={{"textAlign": "left"}}>
                      <p>
                        Follow along with this tutorial to learn how to build, test, and deploy a new dbt project.
                      </p>
                    </div>
                    <div className="card__footer">
                        <Link
                          className="button button--primary button--block"
                          to={useBaseUrl('tutorial/setting-up')}>
                          Start building
                        </Link>
                    </div>
                  </div>
                </div>
                <div className="col col--4">
                  <div className="card">
                    <div className="card__header">
                      <h3>Frequently Asked Questions</h3>
                    </div>
                    <div className="card__body" style={{"textAlign": "left"}}>
                      <p>
                        Find answers to commonly asked questions about dbt.
                      </p>
                    </div>
                    <div className="card__footer">
                        <Link
                          className="button button--primary button--block"
                          to={useBaseUrl('faqs/all')}>
                          Check them out
                        </Link>
                    </div>
                  </div>
                </div>
            </div>
            {/*
            <div className="row" style={{"textAlign": "center", "marginTop": "calc(10vh)"}}>
                <div className="col col--8 col--offset-2">
                  <div className="card item shadow--tl">
                    <div className="card__body" style={{"textAlign": "center"}}>
                        <input className="search" type="text" placeholder="Search the docs..." />
                    </div>
                  </div>
                </div>
            </div>
           */}
        </div>
        <div className="banner-animation"  dangerouslySetInnerHTML={getBanner()}></div>
    </Layout>
  );
}

export default Home;
