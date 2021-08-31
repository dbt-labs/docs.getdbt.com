
import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import classnames from 'classnames';
import Head from '@docusaurus/Head';

const bannerAnimation = require('@site/static/img/banner-white.svg');

function getBanner() {
    return {__html: bannerAnimation};
};

function Home() {
  const context = useDocusaurusContext();

  return (
    <>
      <Head>
        <meta name="google-site-verification" content="ex1EMwuCGU33-nOpoOajLXEpMPgUYK5exBWePCu-0l0" />
      </Head>

      <Layout permalink="/">
          <div className="container container--fluid home" style={{"padding": "10px 0"}}>
          	<div className="row" style={{"maxWidth": "var(--ifm-container-width)", "margin": "calc(5vh) auto calc(2vh)"}}>
          		<div className="col col--8">
          			 <h1>Get started</h1>
          			 <p style={{"fontSize": "120%"}}>If you’re new to dbt, start here. These resources will get you off to a strong start:</p>
	  			</div>
	  		</div>
              <div className="row" style={{"maxWidth": "var(--ifm-container-width)", "margin": "calc(2vh) auto calc(2vh)"}}>
                  <div className="col col--4">
                    <div className="card large dark">
                      <div className="card__header">
                        <h3>What is dbt?</h3>
                      </div>
                      <div className="card__body">
                        <p>
                          Some of the very first questions a new user has are covered in this introduction.
                        </p>
                      </div>
                      <div className="card__footer">
                          <Link
                            className="button button--primary"
                            to="/docs/introduction">
                            Learn More
                          </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card large dark darker">
                      <div className="card__header">
                        <h3>Getting Started Tutorial</h3>
                      </div>
                      <div className="card__body">
                        <p>
                         Follow along with this tutorial to learn how to build, test, and deploy a new dbt project.
                        </p>
                      </div>
                      <div className="card__footer">
                          <Link
                            className="button button--primary"
                            to={useBaseUrl('tutorial/setting-up')}>
                            Watch Tutorial
                          </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card large dark darkest">
                      <div className="card__header">
                        <h3>dbt Learn</h3>
                      </div>
                      <div className="card__body">
                        <p>
                          Learn dbt on your own time with our on demand course or sign up for an upcoming, live public course.
                        </p>
                      </div>
                      <div className="card__footer">
                          <Link
                            className="button button--primary"
                            to="https://learn.getdbt.com">
                            Learn Now
                          </Link>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
          <div className="container container--fluid home" style={{"background": "#FFF", "padding": "10px 0"}}>
          	<div className="row" style={{"maxWidth": "var(--ifm-container-width)", "margin": "calc(2vh) auto"}}>
          		<div className="col col--8">
          			 <h1>Build your project</h1>
          			 <p style={{"fontSize": "120%"}}>If you’re getting comfortable with dbt, bookmark these resources! They’ll help you level up quickly.</p>
	  			</div>
	  		</div>
              <div className="row" style={{"maxWidth": "var(--ifm-container-width)", "margin": "calc(2vh) auto"}}>
                  <div className="col col--4">
                    <div className="card large light">
                      <div className="card__header">
                        <h3>Docs</h3>
                      </div>
                      <div className="card__body">
                        <p>
                          The core concepts of dbt, from models, to sources, to tests.
                        </p>
                      </div>
                      <div className="card__footer">
                          <Link
                            className="button button--primary"
                            to="/docs/introduction">
                            Read Up
                          </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card large light lighter">
                      <div className="card__header">
                        <h3>Reference</h3>
                      </div>
                      <div className="card__body">
                        <p>
                         The technical reference for dbt configurations. You’ll need to know the basics of dbt before using this section.
                        </p>
                      </div>
                      <div className="card__footer">
                          <Link
                            className="button button--primary"
                            to={useBaseUrl('reference/dbt_project.yml')}>
                            Browse Reference
                          </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card large light lightest">
                      <div className="card__header">
                        <h3>FAQs</h3>
                      </div>
                      <div className="card__body">
                        <p>
                        	Commonly asked questions about dbt.
                        </p>
                      </div>
                      <div className="card__footer">
                          <Link
                            className="button button--primary"
                            to={useBaseUrl('/faqs/all')}>
                            Get Answers
                          </Link>
                      </div>
                    </div>
                  </div>
              </div>
              <div className="row" style={{"maxWidth": "var(--ifm-container-width)", "margin": "calc(2vh) auto"}}>
          		<div className="col col--8">
          			 <p style={{"fontSize": "120%"}}>If you’re a dbt Cloud user, these resources may also be helpful:</p>
	  			</div>
	  		</div>
	  		<div className="row" style={{"maxWidth": "var(--ifm-container-width)", "margin": "calc(2vh) auto"}}>
                  <div className="col col--4">
                    <div className="card large light">
                      <div className="card__header">
                        <h3>dbt Cloud guides</h3>
                      </div>
                      <div className="card__body">
                        <p>
                          Guides to help you set up your dbt project in dbt Cloud
                        </p>
                      </div>
                      <div className="card__footer">
                          <Link
                            className="button button--primary"
                            to="/docs/dbt-cloud/cloud-overview">
                            Cloud Overview
                          </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card large light lighter">
                      <div className="card__header">
                        <h3>dbt Cloud API</h3>
                      </div>
                      <div className="card__body">
                        <p>
	  				   Technical reference docs for using the dbt Cloud API. These docs assume you&#39;re familiar with REST APIs.
                        </p>
                      </div>
                      <div className="card__footer">
                          <Link
                            className="button button--primary"
                            to={useBaseUrl('/dbt-cloud/api')}>
                            API docs
                          </Link>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
          <div className="container container--fluid home" style={{"background": "#f5f6f7", "padding": "10px 0"}}>
          	<div className="row" style={{"maxWidth": "var(--ifm-container-width)", "margin": "calc(2vh) auto"}}>
          		<div className="col col--8">
          			 <h1>Learn from the community</h1>
          			 <p style={{"fontSize": "120%"}}>Every data team uses dbt to solve different analytics engineering problems. It can be useful to learn how other teams are using dbt with the following resources:</p>
	  			</div>
	  		</div>
              <div className="row" style={{"maxWidth": "var(--ifm-container-width)", "margin": "calc(2vh) auto"}}>
                  <div className="col col--4">
                    <div className="card large dark">
                      <div className="card__header">
                        <h3><i data-icon="discourse" style={{"marginRight": "7px"}}></i>Discourse</h3>
                      </div>
                      <div className="card__body">
                        <p>
                          Common use cases and helpful articles from the community have been published here
                        </p>
                      </div>
                      <div className="card__footer">
                          <Link
                            className="button button--primary"
                            to="https://discourse.getdbt.com/">
                            Get Advice
                          </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card large dark darker">
                      <div className="card__header">
                        <h3><i data-icon="slack" style={{"marginRight": "7px"}}></i>Slack</h3>
                      </div>
                      <div className="card__body">
                        <p>
                         Where the dbt community hangs out, discusses issues, and troubleshoots problems together
                        </p>
                      </div>
                      <div className="card__footer">
                          <Link
                            className="button button--primary"
                            to="http://community.getdbt.com/">
                            Join us on Slack
                          </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="card large dark darkest">
                      <div className="card__header">
                        <h3>Example projects</h3>
                      </div>
                      <div className="card__body">
                        <p>
                         A list of some dbt projects in the wild
                        </p>
                      </div>
                      <div className="card__footer">
                          <Link
                            className="button button--primary"
                            to={useBaseUrl('/faqs/example-projects')}>
                            View Projects
                          </Link>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
          <div className="container container--fluid home" style={{"background": "#FFF", "padding": "10px 0"}}>
          	<div className="row" style={{"maxWidth": "var(--ifm-container-width)", "margin": "calc(2vh) auto"}}>
          		<div className="col col--8">
          			 <h1>Having trouble?</h1>
          			 <p style={{"fontSize": "120%"}}>If you&#39;re having trouble, check out our guide on <a href="/docs/guides/getting-help" >Getting Help</a> for information on getting support and asking questions in the community.</p>
	  			</div>
	  		</div>
          </div>
          <div className="banner-animation"  dangerouslySetInnerHTML={getBanner()}></div>
      </Layout>
    </>
  );
}

export default Home;
