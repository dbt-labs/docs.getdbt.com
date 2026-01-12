import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Card from '@site/src/components/card';
import allBlogData from './../../.docusaurus/docusaurus-plugin-content-blog/default/p/blog-archive-f05.json';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useDateTimeFormat } from '@docusaurus/theme-common/internal';
import { getSpotlightMember } from '../utils/get-spotlight-member';
import Link from '@docusaurus/Link';
import BlogPostCard from '@site/src/components/blogPostCard';
import StructuredData from '@site/src/components/StructuredData';
import Translate from '@docusaurus/Translate';

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

  const featuredResource = {
    title: 'How we structure our dbt projects',
    description:
      'Our hands-on learnings for how to structure your dbt project for success and gain insights into the principles of analytics engineering.',
    link: '/best-practices/how-we-structure/1-guide-overview',
    image: '/img/structure-dbt-projects.png',
    sectionTitle: 'Featured resource',
  };

  // Set spotlightSection to featuredResource by default
  let spotlightSection = featuredResource;

  // Check if featured community spotlight member set in Docusaurus config
  const { siteConfig } = useDocusaurusContext();
  let communitySpotlightMember =
    siteConfig?.themeConfig?.communitySpotlightMember || null;

  // Get spotlight member by ID or date if available
  const spotlightMember = getSpotlightMember(communitySpotlightMember);
  if (spotlightMember) {
    spotlightSection = spotlightMember;
  }

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
        tags={["dbt", "documentation", "developer hub", "data transformation"]}
      />
      <Layout permalink="/">
        <div
          className="container container--fluid home"
          style={{ padding: 0, background: "#FFF" }}
        >
            <header className="baton-hero baton-hero--compact">
              <div className="container">
                <div>
                  <h1 className="heading-1 heading-1--tight">
                    <Translate id="home.hero.title">
                    The dbt Developer Hub
                    </Translate>
                  </h1>
                  <p className="hero-subcopy">
                    <Translate id="home.hero.description">  
                      Find everything you need to build, document, and collaborate
                      with dbt &mdash; faster.
                    </Translate>
                  </p>

                  {/* quickstarts moved up with tightened spacing */}
                  <div className="hero-cta hero-cta--tight">
                    <Link
                      id="hero-vs-code-cta"
                      className="hero-border-beam-cta"
                      to="/docs/install-dbt-extension"
                    >
                      <span>
                        <Translate id="home.hero.cta">
                          Install dbt VS Code extension + Fusion
                        </Translate>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </header>
          <section className="section--compact home-quickstart">
            <div className="container">
              <div>
                <span className="eyebrow">
                  <Translate id="home.quickstart.eyebrow">
                    Quickstart
                  </Translate>
                </span>
                <h2 className="heading-2">
                  <Translate id="home.quickstart.heading">
                    New to dbt? Start here.
                  </Translate>
                </h2>
              </div>
              <div className="home-card-grid">
                <Card
                  title={<Translate id="home.quickstart.card.dbt-fusion-engine.title">
                    dbt Fusion engine
                  </Translate>}
                  tag="Article"
                  body={<Translate id="home.quickstart.card.dbt-fusion-engine.body">
                    Learn about the dbt Fusion engine and see how it enables dbt to operate at speed and scale like never before.
                  </Translate>}
                  link="/docs/fusion"
                  icon="zap"
                />
                <Card
                  title={<Translate id="home.quickstart.card.get-started-dbt.title">
                    Get started with dbt
                  </Translate>}
                  tag="Guide"
                  body={<Translate id="home.quickstart.card.get-started-dbt.body">
                    Build fast with our quickstart guides.
                  </Translate>}
                  link="/docs/get-started-dbt"
                  icon="settings"
                />
                <Card
                  title={<Translate id="home.quickstart.card.move-to-dbt-platform.title">
                    Move to the dbt platform
                  </Translate>}
                  tag="Guide"
                  body={<Translate id="home.quickstart.card.move-to-dbt-platform.body">
                    Migrate from dbt Core to the powerful, lightning fast dbt platform today!
                  </Translate>}
                  link="/guides/core-to-cloud-1?step=1"
                  icon="tool"
                />
              </div>
            </div>
          </section>

          <section className="baton-1 section--compact">
            <div className="container">
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
                  title="VS Code Extension"
                  body="This free tool brings the full power of the dbt Fusion engine into your local environment with features like live error detection, lightning-fast parse times, insights and rich lineage all in VS Code or Cursor."
                  link="/docs/about-dbt-extension"
                  icon="vsce"
                  showBorderBeam
                />
                <Card
                  title="dbt Orchestrator"
                  body="Every time a job runs, state-aware orchestration automatically determines which models to build by detecting changes in code or data."
                  link="/docs/deploy/state-aware-about"
                  icon="deploy"
                />
                <Card
                  title={<Translate id="home.documentation-by-product.card.dbt-insights.title">
                    dbt Insights
                  </Translate>}
                  body={<Translate id="home.documentation-by-product.card.dbt-insights.body">
                    dbt Insights in dbt empowers users to seamlessly explore and query data with an intuitive, context-rich interface.
                  </Translate>}
                  link="/docs/explore/dbt-insights"
                  icon="insights"
                />
                <Card
                  title={<Translate id="home.documentation-by-product.card.dbt-canvas.title">
                    dbt Canvas
                  </Translate>}
                  body={<Translate id="home.documentation-by-product.card.dbt-canvas.body">
                    dbt Canvas helps you quickly access and transform data through a visual, drag-and-drop experience and with a built-in AI for custom code generation.
                  </Translate>}
                  link="/docs/cloud/canvas"
                  icon="canvas"
                />
                <Card
                  title={<Translate id="home.documentation-by-product.card.dbt-semantic-layer.title">
                    dbt Semantic Layer
                  </Translate>}
                  body={<Translate id="home.documentation-by-product.card.dbt-semantic-layer.body">
                    The dbt Semantic Layer eliminates duplicate coding by allowing data teams to define metrics on top of existing models and automatically handling data joins.
                  </Translate>}
                  link="/docs/use-dbt-semantic-layer/dbt-sl"
                  icon="semantic"
                />
                <Card
                  title={<Translate id="home.documentation-by-product.card.dbt-catalog.title">
                    dbt Catalog
                  </Translate>}
                  body={<Translate id="home.documentation-by-product.card.dbt-catalog.body">
                    Use dbt Catalog to navigate and manage your projects within dbt to help you and other data developers, analysts, and consumers discover and leverage your dbt resources.
                  </Translate>}
                  link="/docs/explore/explore-projects"
                  icon="compass"
                />
                <Card
                  title={<Translate id="home.documentation-by-product.card.studio-ide.title">
                    Studio IDE
                  </Translate>}
                  body={<Translate id="home.documentation-by-product.card.studio-ide.body">
                    The dbt integrated development environment (Studio IDE) is a single web-based interface for building, testing, running, and version-controlling dbt projects.
                  </Translate>}
                  link="/docs/cloud/studio-ide/develop-in-studio#get-started-with-the-cloud-ide"
                  icon="dashboard"
                />
                <Card
                  title={<Translate id="home.documentation-by-product.card.dbt-mesh.title">
                    dbt Mesh
                  </Translate>}
                  body={<Translate id="home.documentation-by-product.card.dbt-mesh.body">
                    dbt Mesh is a framework that helps organizations scale their teams and data assets effectively.
                  </Translate>}
                  link="/docs/mesh/about-mesh"
                  icon="lineage"
                />
              </div>
            </div>
          </section>

          <section className="section--compact">
            <div className="container">
              <div>
                <span className="eyebrow">
                  <Translate id="home.docs-highlights.eyebrow">
                    Docs highlights
                  </Translate>
                </span>
                <h2 className="heading-2">
                  <Translate id="home.docs-highlights.heading">
                    Dive deeper into dbt
                  </Translate>
                </h2>
                <p>
                  <Translate id="home.docs-highlights.body">
                    Learn best practices, explore detailed configuration
                  references, or review our APIs.
                  </Translate>
                </p>
              </div>
              <div className="home-link-grid">
                <div className="home-link-grid-item">
                  <h4 className="heading-4">
                    <Translate id="home.docs-highlights.link.documentation.title">
                      Documentation
                    </Translate>
                  </h4>
                  <Link to="/docs/dbt-cloud-apis/overview">
                    <Translate id="home.docs-highlights.link.api-docs.title">
                      API Docs
                    </Translate>
                  </Link>
                  <Link to="/docs/introduction">
                    <Translate id="home.docs-highlights.link.product-docs.title">
                      Product Docs
                    </Translate>
                  </Link>
                  <Link to="/best-practices">
                    <Translate id="home.docs-highlights.link.best-practices.title">
                      Best Practices
                    </Translate>
                  </Link>
                  <Link to="/docs/cloud/dbt-copilot">
                  <Translate id="home.docs-highlights.link.copilot.title">
                    Copilot
                  </Translate>
                </Link>
                </div>
                <div className="home-link-grid-item">
                  <h4 className="heading-4">
                    <Translate id="home.docs-highlights.link.guides.title">
                      Guides
                    </Translate>
                  </h4>
                  <Link to="/guides/snowflake?step=1">
                    <Translate id="home.docs-highlights.link.quickstart-for-dbt-and-snowflake.title">
                      Quickstart for dbt and Snowflake
                    </Translate>
                  </Link>
                  <Link to="/guides/databricks?step=1">
                    <Translate id="home.docs-highlights.link.quickstart-for-dbt-and-databricks.title">
                      Quickstart for dbt and Databricks
                    </Translate>
                  </Link>
                  <Link to="/guides/airflow-and-dbt-cloud?step=1">
                    <Translate id="home.docs-highlights.link.airflow-and-dbt.title">
                      Airflow and dbt
                    </Translate>
                  </Link>
                  <Link to="/guides/debug-errors?step=1">
                    <Translate id="home.docs-highlights.link.debugging-errors.title">
                      Debugging errors
                    </Translate>
                  </Link>
                </div>
                <div className="home-link-grid-item">
                  <h4 className="heading-4">
                    <Translate id="home.docs-highlights.link.reference-guides.title">
                      Reference Guides
                    </Translate>
                  </h4>
                  <Link to="/reference/dbt-commands">
                    <Translate id="home.docs-highlights.link.command-reference.title">
                      Command Reference
                    </Translate>
                  </Link>
                  <Link to="/category/project-configs">
                    <Translate id="home.docs-highlights.link.project-configurations.title">
                      Project Configurations
                    </Translate>
                  </Link>
                  <Link to="/reference/artifacts/dbt-artifacts">
                    <Translate id="home.docs-highlights.link.dbt-artifacts.title">
                      dbt Artifacts
                    </Translate>
                  </Link>
                </div>
                <div className="home-link-grid-item">
                  <h4 className="heading-4">
                    <Translate id="home.docs-highlights.link.other-resources.title">
                      Other Resources
                    </Translate>
                  </h4>
                  <Link to="/docs/dbt-versions/dbt-cloud-release-notes">
                    <Translate id="home.docs-highlights.link.release-notes.title">
                      Release Notes
                    </Translate>
                  </Link>
                  <Link to="/blog">
                    <Translate id="home.docs-highlights.link.developer-blog.title">
                      Developer Blog
                    </Translate>
                  </Link>
                  <Link to="/community/join">
                    <Translate id="home.docs-highlights.link.join-the-community.title">
                      Join the Community
                    </Translate>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="baton-2 section--compact">
            <div className="container">
              <div>
                <span className="eyebrow">
                  <Translate id="home.get-community.eyebrow">
                    Get help from others
                  </Translate>
                </span>
                <h2 className="heading-2">
                  <Translate id="home.get-community.heading">
                    Join the dbt Community
                  </Translate>
                </h2>
                <p>
                  <Translate id="home.get-community.body">
                    Connect with thousands of developers solving real data
                    problems every day.
                  </Translate>
                </p>
              </div>
              <div className="home-card-grid">
                <Card
                  title={<Translate id="home.get-community.card.join-slack.title">
                    Join Slack
                  </Translate>}
                  body={<Translate id="home.get-community.card.join-slack.body">
                    Ask questions, get answers, and meet people who speak your data language.
                  </Translate>}
                  link="https://www.getdbt.com/community/join-the-community/"
                  icon="annotation"
                  target="_blank"
                />
                <Card
                  title={<Translate id="home.get-community.card.github-discussions.title">
                    GitHub Discussions
                  </Translate>}
                  body={<Translate id="home.get-community.card.github-discussions.body">
                    Join technical threads or open issues.
                  </Translate>}
                  link="https://github.com/dbt-labs/docs.getdbt.com"
                  icon="github-new"
                  target="_blank"
                />
                <Card
                  title={<Translate id="home.get-community.card.subscribe-to-the-newsletter.title">
                    Subscribe to the newsletter
                  </Translate>}
                  body={<Translate id="home.get-community.card.subscribe-to-the-newsletter.body">
                    Get fresh community ideas, job posts, and tools delivered weekly.
                  </Translate>}
                  link="https://www.getdbt.com/learn/newsletter"
                  icon="inbox"
                  target="_blank"
                />
                <Card
                  title={<Translate id="home.get-community.card.answer-a-question-on-discourse.title">
                    Answer a question on Discourse
                  </Translate>}
                  body={<Translate id="home.get-community.card.answer-a-question-on-discourse.body">
                    Help someone solve a real problem—and build your reputation doing it.
                  </Translate>}
                  link="/community/forum"
                  icon="message"
                />
                <Card
                  title={<Translate id="home.get-community.card.events-and-meetups.title">
                    Events and Meetups
                  </Translate>}
                  body={<Translate id="home.get-community.card.events-and-meetups.body">
                    Join local and global dbt meetups.
                  </Translate>}
                  link="/community/events"
                  icon="globe"
                />
                <Card
                  title={<Translate id="home.get-community.card.courses-and-tutorials.title">
                    Courses & Tutorials
                  </Translate>}
                  body={<Translate id="home.get-community.card.courses-and-tutorials.body">
                    Learn dbt with hands-on guidance.
                  </Translate>}
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
                <span className="eyebrow">
                  <Translate id="home.from-the-team.eyebrow">
                    From the team
                  </Translate>
                </span>
                <h2 className="heading-2">
                  <Translate id="home.from-the-team.heading">
                    Read the developer blog
                  </Translate>
                </h2>
                <p>
                  <Translate id="home.from-the-team.body">
                    Deep dives, changelogs, best practices, and new feature
                  highlights from dbt Labs.
                  </Translate>
                </p>
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
