import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Card from '@site/src/components/card';
import allBlogData from './../../.docusaurus/docusaurus-plugin-content-blog/default/p/blog-archive-f05.json'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useDateTimeFormat } from '@docusaurus/theme-common/internal';
import { getSpotlightMember } from '../utils/get-spotlight-member';
import Link from '@docusaurus/Link';
import BlogPostCard from '@site/src/components/blogPostCard';

const bannerAnimation = require('@site/static/img/banner-white.svg');

function getBanner() {
  return { __html: bannerAnimation };
}

function Home() {

  // Use same date formatting as in theme's BlogPostItem component
  // https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-theme-classic/src/theme/BlogPostItem/Header/Info/index.tsx
  const dateTimeFormat = useDateTimeFormat({
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
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
        tags: currentValue.metadata.tags
      };
      accumulator.push(postMetaData);
      return accumulator;
    }, []);

  const featuredResource = {
    title: "How we structure our dbt projects",
    description:
      "Our hands-on learnings for how to structure your dbt project for success and gain insights into the principles of analytics engineering.",
    link: "/best-practices/how-we-structure/1-guide-overview",
    image: "/img/structure-dbt-projects.png",
    sectionTitle: "Featured resource",
  };

  // Set spotlightSection to featuredResource by default
  let spotlightSection = featuredResource;

  // Check if featured community spotlight member set in Docusaurus config
  const { siteConfig } = useDocusaurusContext();
  let communitySpotlightMember =
    siteConfig?.themeConfig?.communitySpotlightMember || null;

  // Get spotlight member by ID or date if available
  // If found, update section to show community spotlight member
  // Otherwise, show featured resource
  const spotlightMember = getSpotlightMember(communitySpotlightMember);
  if (spotlightMember) {
    spotlightSection = spotlightMember;
  }

  const handleSearch = (e) => {
    // Trigger Algolia search modal
    document.querySelector('.DocSearch-Button').click();
  };

  return (
    <>
      <Head>
        <meta
          name="google-site-verification"
          content="ex1EMwuCGU33-nOpoOajLXEpMPgUYK5exBWePCu-0l0"
        />
      </Head>
      <Layout permalink="/">
        <div
          className="container container--fluid home"
          style={{ padding: "0", background: "#FFF" }}
        >
          <header className='baton-hero'>
            <div className='container'>
              <div>
                <h1 className="heading-1">The dbt Developer Hub</h1>
                <p>Find everything you need to build, document, and collaborate with dbt — faster.</p>
                <div 
                  className="hero-search-input" 
                  onClick={handleSearch}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Open search"
                >
                  <input
                    type="text"
                    placeholder="⌘K to search"
                    readOnly
                    className="input"
                    aria-hidden="true"
                  />
                </div>
                <div className="quick-links">
                  <span>Quick links</span>
                  <Link to="/guides">Guides</Link>
                  <Link to="/docs/dbt-versions/dbt-cloud-release-notes">Release notes</Link>
                  <Link to="/docs/introduction">Product docs</Link>
                </div>
                <div className="hero-cta">
                  <Link to="/docs/install-dbt-extension" class="primary-cta">Install Fusion + VS Code extension</Link>
                </div>
              </div>
            </div>
          </header>
          <section>
            <div className='container'>
              <div>
                <span className="eyebrow">Quickstart</span>
                <h2 className="heading-2">New to dbt? Start here.</h2>
              </div>
                <div className="home-card-grid">
                  <Card
                    title="dbt Fusion engine"
                    tag="Article"
                    body="Learn about the dbt Fusion engine and see how it enables dbt to operate at speed and scale like never before."
                    link="/docs/fusion/about-fusion"
                    icon="zap"
                  />
                  <Card
                    title="Get started with dbt"
                    tag="Guide"
                    body="Build fast with our quickstart guides."
                    link="/docs/get-started-dbt"
                    icon="settings"
                  />
                  <Card
                    title="Move to the dbt platform"
                    tag="Guide"
                    body="Migrate from dbt Core to the powerful, lightning fast dbt platform today!"
                    link="/guides/core-to-cloud-1?step=1"
                    icon="tool"
                  />
                </div>
              </div>
          </section>
          <section className='baton-1'>
            <div className='container'>
              <div>
                <span className="eyebrow">Documentation by product</span>
                <h2 className="heading-2">Explore the docs by product</h2>
              </div>
              <div className="home-card-grid">
                <Card
                  title="dbt Copilot"
                  body="AI-powered assistant that automates code, tests, and documentation in your workflow."
                  link="/docs/cloud/dbt-copilot"
                  icon="dbt-copilot"
                />
                <Card
                  title="dbt Mesh"
                  body="dbt Mesh is a framework that helps organizations scale their teams and data assets effectively."
                  link="/docs/mesh/about-mesh"
                  icon="lineage"
                />
                <Card
                  title="dbt Orchestrator"
                  body="Every time a job runs, state-aware orchestration automatically determines which models to build by detecting changes in code or data."
                  link="/docs/deploy/state-aware-about"
                  icon="deploy"
                />
                <Card
                  title="dbt Insights"
                  body="dbt Insights in dbt empowers users to seamlessly explore and query data with an intuitive, context-rich interface."
                  link="/docs/explore/dbt-insights"
                  icon="insights"
                />
                <Card
                  title="dbt Canvas"
                  body="dbt Canvas helps you quickly access and transform data through a visual, drag-and-drop experience and with a built-in AI for custom code generation."
                  link="/docs/cloud/canvas"
                  icon="canvas"
                />
                <Card
                  title="dbt Semantic Layer"
                  body="The dbt Semantic Layer eliminates duplicate coding by allowing data teams to define metrics on top of existing models and automatically handling data joins."
                  link="/docs/use-dbt-semantic-layer/dbt-sl"
                  icon="semantic"
                />
                <Card
                  title="dbt Catalog"
                  body="Use dbt Catalog to navigate and manage your projects within dbt to help you and other data developers, analysts, and consumers discover and leverage your dbt resources."
                  link="/docs/explore/explore-projects"
                  icon="compass"
                />
                <Card
                  title="Studio IDE"
                  body="The dbt integrated development environment (Studio IDE) is a single web-based interface for building, testing, running, and version-controlling dbt projects."
                  link="/docs/cloud/dbt-cloud-ide/develop-in-the-cloud#get-started-with-the-cloud-ide"
                  icon="dashboard"
                />
                <Card
                  title="VS Code Extension"
                  body="This free tool brings the full power of the dbt Fusion engine into your local environment with features like live error detection, lightning-fast parse times, insights and rich lineage all in VS Code or Cursor."
                  link="/docs/about-dbt-extension"
                  icon="vsce"
                  showBorderBeam
                />
              </div>
            </div>
          </section>

          <section>
            <div className='container'>
              <div>
                <span className="eyebrow">Docs highlights</span>
                <h2 className="heading-2">Dive deeper into dbt</h2>
                <p>Learn best practices, explore detailed configuration references, or review our APIs.</p>
              </div>
              <div className="home-link-grid">
                <div className="home-link-grid-item">
                  <h4 className="heading-4">Documentation</h4>
                  <Link to="/docs/dbt-cloud-apis/overview">API Docs</Link>
                  <Link to="/docs/introduction">Product Docs</Link>
                  <Link to="/best-practices">Best Practices</Link>
                  <Link to="/docs/cloud/dbt-copilot">Copilot</Link>
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

          <section className='baton-2'>
            <div className='container'>
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
                  link="/community/forum"
                  icon="message"
                />
                <Card
                  title="Events and Meetups"
                  body="Join local and global dbt meetups."
                  link="/community/events"
                  icon="globe"
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

          <section className='static-bg'>
            <div className='container'>
              <div>
                <span className="eyebrow">From the team</span>
                <h2 className="heading-2">Read the developer blog</h2>
                <p>Deep dives, changelogs, best practices, and new feature highlights from dbt Labs.</p>
              </div>
              <div className="home-card-grid">
                {recentBlogData.map((item) => (
                  <BlogPostCard postMetaData={item} />
                ))}
              </div>
            </div>
          </section>
        </div>

        <div
          className="banner-animation"
          dangerouslySetInnerHTML={getBanner()}
        ></div>
      </Layout>
    </>
  );
}

export default Home;
