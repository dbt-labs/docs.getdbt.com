import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Card from '@site/src/components/card';
import allBlogData from './../../.docusaurus/docusaurus-plugin-content-blog/default/p/blog-archive-f05.json';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useDateTimeFormat } from '@docusaurus/theme-common/internal';
import Link from '@docusaurus/Link';
import BlogPostCard from '@site/src/components/blogPostCard';
import StructuredData from '@site/src/components/StructuredData';

function Home() {
  // Use same date formatting as in theme's BlogPostItem component
  const dateTimeFormat = useDateTimeFormat({
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const formatDate = (blogDate) => dateTimeFormat.format(new Date(blogDate));

  const recentBlogData = allBlogData?.archive?.blogPosts
    ?.slice(0, 3)
    .reduce((accumulator, currentValue) => {
      let postMetaData = {
        title: currentValue.metadata.title,
        date: formatDate(currentValue.metadata.date),
        readingTime: Math.round(currentValue.metadata.readingTime),
        description: currentValue.metadata.description,
        link: currentValue.metadata.permalink,
        image: currentValue.metadata.image,
        tags: currentValue.metadata.tags,
      };
      accumulator.push(postMetaData);
      return accumulator;
    }, []);

  const { siteConfig } = useDocusaurusContext();

  // note: we've removed the in-hero search input so that we can rely on navbar DocSearch (⌘K) only.

  return (
    <>
      <Head>
        <meta
          name="google-site-verification"
          content="ex1EMwuCGU33-nOpoOajLXEpMPgUYK5exBWePCu-0l0"
        />
      </Head>
      <StructuredData
        type="WebPage"
        title="The dbt Developer Hub"
        description="Find everything you need to build, document, and collaborate with dbt — faster."
        url={siteConfig.url}
        tags={['dbt', 'documentation', 'developer hub', 'data transformation']}
      />
      <Layout permalink="/">
        <div
          className="container container--fluid home"
          style={{ padding: 0, background: '#FFF' }}
        >
          <header className="baton-hero baton-hero--compact">
            <div className="container">
              <div>
                <h1 className="heading-1 heading-1--tight">The dbt Developer Hub</h1>
                <p className="hero-subcopy">
                Find everything you need to build, document, and collaborate with dbt &mdash; faster.
                </p>

                {/* quickstarts moved up with tightened spacing */}
                <div className="hero-cta hero-cta--tight">
                  <Link
                    id="hero-vs-code-cta"
                    className="hero-border-beam-cta"
                    to="/docs/local/install-dbt">
                      <span>Install dbt VS Code extension + Fusion</span>
                      </Link>
                </div>
              </div>
            </div>
          </header>
          <section className="section--compact home-quickstart">
            <div className="container">
              <div className="home-start-layout">
                <div>
                  <div>
                    <span className="eyebrow">Quickstarts</span>
                    <h2 className="heading-2">Pick your platform</h2>
                    <p>Choose your data platform and follow a quickstart to build your first project end to end.</p>
                  </div>
                  <div className="home-card-grid home-card-grid--quickstarts">
                    <Card
                      title="Snowflake"
                      body="Build your first dbt project on Snowflake."
                      link="/guides/snowflake?step=1"
                      icon="snowflake"
                    />
                    <Card
                      title="Databricks"
                      body="Build your first dbt project on Databricks."
                      link="/guides/databricks?step=1"
                      icon="databricks"
                    />
                    <Card
                      title="BigQuery"
                      body="Build your first dbt project on BigQuery."
                      link="/guides/bigquery?step=1"
                      icon="bigquery"
                    />
                    <Card
                      title="Redshift"
                      body="Build your first dbt project on Redshift."
                      link="/guides/redshift?step=1"
                      icon="redshift"
                    />
                    <Card
                      title="DuckDB"
                      body="Build your first dbt project locally with DuckDB."
                      link="/guides/duckdb?step=1"
                      icon="duckdb-seeklogo"
                    />
                    <Card
                      title="See all platforms"
                      body="Browse every quickstart and pick your warehouse or engine."
                      link="/docs/get-started-dbt"
                      icon="compass"
                    />
                  </div>
                </div>
                <aside className="home-start-aside">
                  <div>
                    <span className="eyebrow">Get started</span>
                    <h2 className="heading-2">Find the right path</h2>
                  </div>
                  <div className="home-card-grid home-card-grid--path">
                    <Card
                      title="Explore dbt platform"
                      body="Use browser-based development, hosted orchestration, CI/CD, documentation, and collaboration."
                      link="/docs/get-started-dbt#choose-your-path"
                      icon="compass"
                      showBorderBeam
                    />
                    <Card
                      title="Develop locally"
                      body="Use dbt from VS Code or your terminal with the dbt Fusion engine or dbt Core."
                      link="/docs/get-started-dbt#develop-locally"
                      icon="vsce"
                    />
                    <Card
                      title="Build with AI"
                      tag="Beta"
                      body="Use dbt Wizard after you have a project to work in."
                      link="/docs/get-started-dbt#build-with-ai"
                      icon="dbt-copilot"
                    />
                  </div>
                </aside>
              </div>
            </div>
          </section>

          <section className="section--compact">
            <div className="container">
              <div>
                <span className="eyebrow">Docs highlights</span>
                <h2 className="heading-2">Dive deeper into dbt</h2>
                <p>Learn best practices, explore detailed configuration references, or review our APIs.</p>
              </div>
              <div className="home-link-grid">
                <div className="home-link-grid-item">
                  <h4 className="heading-4">Documentation</h4>
                  <Link to="/docs/dbt-apis/overview">API Docs</Link>
                  <Link to="/docs/introduction">Product Docs</Link>
                  <Link to="/best-practices">Best Practices</Link>
                  <Link to="/docs/platform/wizard-overview">dbt Wizard</Link>
                </div>
                <div className="home-link-grid-item">
                  <h4 className="heading-4">Guides</h4>
                  <Link to="/guides/snowflake?step=1">Quickstart for dbt and Snowflake</Link>
                  <Link to="/guides/databricks?step=1">Quickstart for dbt and Databricks</Link>
                  <Link to="/guides/airflow-and-dbt-cloud?step=1">Airflow and dbt</Link>
                  <Link to="/guides/debug-errors?step=1">Debugging errors</Link>
                </div>
                <div className="home-link-grid-item">
                  <h4 className="heading-4">Reference Guides</h4>
                  <Link to="/reference/dbt-commands">Command Reference</Link>
                  <Link to="/category/project-configs">Project Configurations</Link>
                  <Link to="/reference/artifacts/dbt-artifacts">dbt Artifacts</Link>
                </div>
                <div className="home-link-grid-item">
                  <h4 className="heading-4">Other Resources</h4>
                  <Link to="/docs/dbt-versions/dbt-cloud-release-notes">Release Notes</Link>
                  <Link to="/blog">Developer Blog</Link>
                  <Link to="/community/join">Join the Community</Link>
                </div>
              </div>
            </div>
          </section>

          <section className="baton-2 section--compact">
            <div className="container">
              <div>
                <span className="eyebrow">Get help from others</span>
                <h2 className="heading-2">Join the dbt Community</h2>
                <p>Connect with thousands of developers solving real data problems every day.</p>
              </div>
              <div className="home-card-grid">
                <Card
                  title="Join Slack"
                  body="Ask questions, get answers, and meet people who speak your data language."
                  link="https://www.getdbt.com/community/join-the-community/"
                  icon="annotation"
                  target="_blank"
                />
                <Card
                  title="GitHub Discussions"
                  body="Join technical threads or open issues."
                  link="https://github.com/dbt-labs/docs.getdbt.com"
                  icon="github-new"
                  target="_blank"
                />
                <Card
                  title="Subscribe to the newsletter"
                  body="Get fresh community ideas, job posts, and tools delivered weekly."
                  link="https://www.getdbt.com/learn/newsletter"
                  icon="inbox"
                  target="_blank"
                />
                <Card
                  title="Answer a question on Discourse"
                  body="Help someone solve a real problem—and build your reputation doing it."
                  link="https://discourse.getdbt.com/"
                  icon="message"
                  target="_blank"
                />
                <Card
                  title="Webinars"
                  body="Upcoming and on-demand sessions from dbt Labs."
                  link="https://www.getdbt.com/resources/webinars"
                  icon="calendar"
                  target="_blank"
                />
                <Card
                  title="Events"
                  body="Meetups, conferences, and community gatherings."
                  link="https://www.getdbt.com/events"
                  icon="globe"
                  target="_blank"
                />
                <Card
                  title="Courses & Tutorials"
                  body="Learn dbt with hands-on guidance."
                  link="https://learn.getdbt.com/catalog"
                  icon="forward"
                  target="_blank"
                />
              </div>
            </div>
          </section>

          <section className="static-bg section--compact">
            <div className="container">
              <div>
                <span className="eyebrow">From the team</span>
                <h2 className="heading-2">Read the developer blog</h2>
                <p>Deep dives, changelogs, best practices, and new feature highlights from dbt Labs.</p>
              </div>
              <div className="home-card-grid">
                {recentBlogData.map((item) => (
                  <BlogPostCard key={item.link} postMetaData={item} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}

export default Home;
