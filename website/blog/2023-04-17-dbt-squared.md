---
title: "dbt Squared: Leveraging dbt Core and dbt Cloud together at scale"
description: "How do you effectively scale dbt? João Antunes from Roche walks through their multi-tool journey."
slug: dbt-squared

authors: [joao_antunes, yannick_misteli, sean_mcintyre]

tags: [analytics craft]
hide_table_of_contents: false

date: 2023-04-17
is_featured: true
---

Teams thrive when each team member is provided with the tools that best complement and enhance their skills. You wouldn’t hand Cristiano Ronaldo a tennis racket and expect a perfect serve! At Roche, getting the right tools in the hands of our teammates was critical to our ability to grow our data team from 10 core engineers to over 100 contributors in just two years. We embraced both dbt Core and dbt Cloud at Roche (a dbt-squared solution, if you will!) to quickly scale our data platform.
<!--truncate-->
We faced three key areas of growth along this journey to scale: technology, people, and processes in an all-or-nothing game—getting only one right wouldn’t cut it.

- **Technology**: dbt on the CLI was the right tool for core engineers, but couldn’t scale to our affiliate teams. dbt Cloud catalyzed their contribution to the platform.
- **People**: We needed to onboard teams well-versed in SQL, but new to dbt, into our workflow with as little friction as possible.
- **Process**: Local CI/CD, GitOps, and development processes on the core team needed to be adapted to allow for more contributors, and enforce quality at scale.

dbt Core jump started our data platform’s growth, and dbt Cloud allowed us to spread it across the globe. Today, we are able to:

- Power our platform in 35 countries, and run over 15,000 models and 40,000 tests every day.
- Support our core and country teams with the workflows that best suit them.
- Promote code to production in two week cycles instead of the previous quarter or semester-long cycles.

To understand the changes that we made, let's dive into what our technology, people and process looked like at the beginning of this path.

## Where we started

Our dbt journey at Roche started roughly 3 years ago when we began to build a cloud native content recommendation system tailored to our Sales Reps. We started with a small team of under 10 people and we designed our core architecture based on some well-defined principles: deploy Everything as Code, choose Serverless whenever feasible, and apply <Term id="elt">Extract Load Transform</Term> as opposed to <Term id="etl">Extract Transform Load</Term>.

With these principles in mind, we designed a highly scalable architecture, leveraging AWS-native services to extract and load the data into an S3-based data lake and a Redshift cluster Data Warehouse.  Keep in mind, when we started, Redshift Serverless was not yet a thing! All of the data transformation occurs in the warehouse with (you guessed it!) dbt.

The simplicity of dbt, combined with the compute power of Redshift, allowed us to implement a Data Vault architecture capable of supporting our content recommendation system. After the success here, there was interest to scale the platform to a plethora of new use cases in the pharma commercial domain.

## The scalability problem

Supporting the pharma domain meant we needed to reevaluate our dbt setup, as dozens of downstream teams would soon be building from the core team’s data assets. To be able to deliver the insights we wanted, we needed to get multiple teams collaborating on many dbt projects in a federated way without sacrificing quality or speed.

### Technology

We needed a way to make this architecture manageable when dozens of downstream teams were collaborating on the codebase simultaneously. Our first major architectural decision was how to separate the core team’s project from the country-specific projects, while still guaranteeing that each country team would be able to access the codebase of any other project if needed. Ensuring ease-of-access to other countries’ projects has a threefold purpose:

1. Act as a catalyst for code reuse and best-practice sharing
2. Share common models and macros that span multiple countries across projects more easily
3. Promote a common workflow—an engineer working today for a Brazilian use-case could easily work tomorrow on a solution for Germany.

The second architectural decision was whether or not to create a single dbt project for all 50+ country teams, or to follow a multi-project approach in which each country would have its own separate dbt project in the shared repo. It was critical that each country team was able to move at different paces and have full control over their domains. This would avoid issues like model name collisions across countries and remove dependencies that would risk cascading errors between countries. Therefore, we opted for a one project per country approach.

<Lightbox src="/img/blog/2023-04-17-dbt-squared/roche-project-tree.png" width="85%" title="Roche project structure as seen in the repository" />

The resulting data flow from core to country teams now follows this pattern. The *Sources* database holds all of the raw data in the Redshift cluster and the *Integrated* database contains the curated and ready-for-consumption outputs from the core dbt project. These outputs are termed Source Data Products (SDPs). These SDPs are then leveraged by the core team to build Global Data Products—products tailored to answering business questions for global stakeholders. They are also filtered at the country-level and used as sources to the country-specific Data Products managed by the country teams. These, in turn, are hosted in the respective `affiliate_db_<country>` database. Segregating at the database-level facilitates data governance and privacy management.

<Lightbox src="/img/blog/2023-04-17-dbt-squared/roche-db-diagram.png" width="85%" title="Roche project structure as seen in the repository" />

### People

At the start of the journey, we built the core team from a blank canvas by cherry-picking individuals with a lot of engineering experience who were comfortable working on the command line. On the other hand, the country teams comprised people working on legacy data systems at the company—some with a deep understanding of technologies like Informatica, Talend, or Hadoop. All had one thing in common—no one had ever used dbt.

We quickly realized that we needed to lower the barrier of entry for new teams to start leveraging the data platform. We wanted to relieve the teams from unnecessary exposure to overly complex, hard-to-read features in the core repo, and empower them to focus on their data modeling work exclusively. While dbt was clearly the right transformation tool, lack of experience on the command line demanded a more approachable, ready-to-use tool for these teams.

### Process

The success of this program relied on adopting DevOps practices from the start. This required a cultural shift, which can be particularly challenging in large scale organizations. We needed to take the DevOps processes that were working well for the core team, and scale them to dozens of teams to ensure the same level of quality and consistency in our data products. By seamlessly integrating dbt with git, our CI/CD processes were able to scale effortlessly, allowing for automated testing, building, and releasing of our pipelines.

Often overlooked, this third pillar of process can be the key to success when scaling a global platform. Simple things, such as accounting for time zone differences, can determine whether a message gets across the board. To facilitate the communication and coordination between Global and Country teams, all the teams follow the same sprint cycle, and we hold weekly scrum of scrums. We needed to set up extensive onboarding documentation, ensure newcomers had proper training and guidance, and create dedicated slack channels for announcements, incident reporting, and occasional random memes, helping build a community that stretches from Brazil to Malaysia.

<Lightbox src="/img/blog/2023-04-17-dbt-squared/roche-meme.png" width="85%" title="Roche project structure as seen in the repository" />

## The solution: dbt Squared

### Technology and people

Our teams’ differing levels of technical maturity demanded different technical solutions. The core team was well versed with dbt Core (even [contributing](https://github.com/dbt-labs/dbt-core/pull/3408) to the project!) and had been working on the same project for 3 years with software engineering best practices  (i.e. CI/CD, unit tests, linting, and pre-commit hooks). The affiliate teams had noticeably different exposure to these tools. Thus, we rolled out dbt Cloud to the country teams to avoid onboarding them to complex core workflows, which would have unnecessarily slowed them down.

dbt Cloud removed the need to set up local environments; no need to worry about library versions or about installing git clients. Instead, they were quickly building and testing dbt models. As SQL is second nature to all of the country teams (irrespective of the platform they were using prior to dbt), they picked up dbt in no time at all, and the need for support from the core team quickly became minimal.

This autonomy proved to be critical; it would otherwise be impractical to have a fully-centralized support team. We appointed regional leads to oversee the work of multiple country teams. This made country teams less reliant on core teams; now different countries could collaborate on dbt work independently.

Doubling down on dbt Cloud had a big impact on how fast we could grow without compromising key features of software development. In the past, the initial setup of the tooling needed to start building data pipelines can take days. With this solution, code versioning, IDE, SQL previewer and lineage graphs were all in one place without any initial setup needed from the developers. In a matter of weeks, we started seeing the first data pipelines fully migrated.

### Process

Operating at scale meant we needed to adapt our processes that once worked for a  core team of ten to now work for a team of hundreds.

- **Project Setup**: We needed to have a scalable way to provision new projects for the first time.
- **Development Flow**: We needed to make sure any team member could develop seamlessly, no matter how far downstream they sat.
- **Release Flow**: Releasing to one project was straightforward, but releasing to connected projects simultaneously needed considerable coordination.

### Project setup flow

Because we decided to go with a multi-project architecture, there was some initial setup needed. Each country would need a dbt project in our Git repository and also needed to be deployed in dbt Cloud…twice, as each affiliate has a dev and a prod project. To avoid setting up all of the projects manually in the dbt Cloud UI, we implemented a python library as a wrapper around the [dbt Cloud Administrative API](https://docs.getdbt.com/docs/dbt-cloud-apis/admin-cloud-api).  This would read a YAML configuration file and deploy all of the projects automatically. This saved a lot of time, as we would already have a new team’s dbt project setup in both the git repository and dbt Cloud as soon as they were ready to start building.

### Development flow

The core teams using dbt on the CLI often leveraged the [defer command](https://docs.getdbt.com/reference/node-selection/defer), which can be used in dbt Cloud, but requires a [workaround](https://discourse.getdbt.com/t/possible-to-use-defer-to-testing-time-in-cloud-ide/6189) that involves injecting a production manifest file into your repo. Several rounds of fruitful discussions with the dbt Labs team lead us towards using  [“Proxy Views”](https://gist.github.com/boxysean/c1e0cb6735f6bbbb422cb06a14c3cd92), which emulate zero-copy clone functionality and allows for a similar `defer` workflow. For this solution to work, we also needed to override the `redshift__list_relations_without_caching` macro (for more details please read the comments of our Lead Engineer Jakub Lanski [here](https://github.com/dbt-labs/dbt-redshift/issues/179)). This enables each engineer to develop and test their models without the need to entirely recreate the upstream dependencies. Instead, these upstream model dependencies are created as views in the developer’s target schema that point to their production counterparts. This is particularly critical when implementing models that rely on dozens of upstream dependencies. By avoiding unnecessary data replication, we dramatically reduced development time.

### Release flow

Last but not least, the core team uses the [pre-commit](https://pre-commit.com/) framework to ensure code quality before opening merge requests to the common branch. The core team also leverages [sqlfluff](https://sqlfluff.com/) to standardize the code across several streams of work. Since dbt Cloud doesn’t yet offer the possibility to run the pre-commit hooks directly in the IDE, we migrated these workflows to CI checks. These checks are triggered when a merge request to the common branch is raised, guaranteeing that even if a developer is not using the framework locally, the code changes are evaluated before the merge is completed.

Now, not only was the pace of delivery much faster, we were also able to make investments in the incident management process. Rather than relying on a separate operations team, we allocate part of the development team to incident management, and we rotate the team members responsible for incident management on a sprint-by-sprint basis. As a result, we achieved a widespread culture of accountability that ultimately led to increased test coverage and code reliability.

## Conclusion

In less than one year, we managed to migrate siloed data pipelines from tools like Informatica, Spark, Talend and Oracle into dbt, powering close to 50 dashboards today.

While we acknowledge the success story so far, we also believe the future of this endeavor depends heavily on how much we continue to invest in people. Therefore, we are creating a dbt fast-track path to prepare our team leads to earn [the dbt Certification](https://www.getdbt.com/blog/dbt-certification-program/). We foster close collaboration with the dbt Labs team which helps our organization set out for success as we plan our roadmap with expert advice.

While successful scaling requires good technology, it also requires empowering your people and establishing strong processes.  Be sure to prioritize collaboration, communication, and training as you grow your dbt footprint. We hope this post has given you some useful insight and strategies for scaling the use of dbt in your organization. If you're facing similar challenges or have found other effective solutions, we'd love to hear from you in the comments below.


*Editor's note: This article was written by the João Antunes and Yannick Misteli of Roche, with editorial and technical guidance from Sean McIntyre of dbt Labs*