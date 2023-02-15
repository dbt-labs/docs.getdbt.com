---
title: "Coding contributions"
id: "contributing-coding"
---

### Contribute to dbt Packages

#### Overview

[dbt Packages](https://docs.getdbt.com/docs/build/packages) are the easiest way for analytics engineers to get involved with contributing code to the dbt Community, because dbt Packages are just standard [dbt Projects](/docs/build/projects). If you can create a dbt Project, write a macro, and ref a model: you can make a dbt Package. Packages function much like libraries do in other programming languages. They allow for prewritten, modularized development of code to solve common problems in analytics engineering. You can view all dbt Packages on the [dbt Package Hub](https://hub.getdbt.com/).

#### Contribution opportunities

- Create a new package for the dbt Package Hub. This might be a new set of macros or tests that have been useful to you in your projects, a set of models for engaging with a commonly used datasource or anything else that can be done from within a dbt project.
- Improve an existing package: Alternatively you can help improve an existing package. This can be done by creating and engaging with Issues or by functionality to address an existing issue via opening a PR.

#### Sample contributions

- [dbt Expectations](https://hub.getdbt.com/calogica/dbt_expectations/latest/)
- [dbt Artifacts](https://hub.getdbt.com/brooklyn-data/dbt_artifacts/latest/)

#### Get started

- Use packages in your own projects! The best way to know how to improve a package is to use it in a production environment then look for ways it can be modified or improved.
- Read the following resources on package development:
  - [So You Want to Build a dbt Package](https://docs.getdbt.com/blog/so-you-want-to-build-a-package)
  - [Package Best Practices](https://github.com/dbt-labs/hubcap/blob/main/package-best-practices.md)
- Need help: Visit #package-ecosystem in the dbt Slack

### Contribute to dbt open source software

#### Overview

dbt Core, adapters, tooling, and the sites powering the Package Hub and Developer Hub are all vibrant open source projects. Unlike dbt Packages, contributing code to these projects typically requires some working knowledge of programming languages outside of SQL and Jinja, but the supportive community around these repositories can help you advance those skills. Even without contributing code, there are many ways to be part of open source development in these projects, detailed below. You can find a curated list of the most active OSS projects that dbt Labs supports [here](/community/resources/oss-projects).

#### Contribution opportunities

There are three primary ways to contribute to the dbt OSS projects. We’ll use dbt Core as an example, as it’s the most active and mature OSS project we support, and a great place to start for newcomers:

- [Open an issue](https://github.com/dbt-labs/dbt-core/issues/new/choose) to suggest an improvement or give feedback.
- Comment / engage on existing [issues](https://github.com/dbt-labs/dbt-core/issues) or [discussions](https://github.com/dbt-labs/dbt-core/discussions). This could be upvoting issues that would be helpful for your organization, commenting to add nuance to a feature request or sharing how a feature would impact your dbt usage.
- Create a pull request that resolves an open Issue. This involves writing the code and tests that add the feature/resolve the bug described in an Issue, and then going through the code review process asynchronously with a dbt Labs engineer.

#### Sample contributions

- Check out [this issue](https://github.com/dbt-labs/dbt-core/issues/3612) about improving error messages and [the PR that the community contributed to fix it](https://github.com/dbt-labs/dbt-core/pull/3703).
- From the above issue [another issue was generated](https://github.com/dbt-labs/dbt-bigquery/issues/202) to change not just the error message, but improve the behavior. This is the virtuous cycle of open source community development! Bit by bit we, the community, craft the tool to better fit our needs.

#### Get started

- Read the dbt Core [contribution guide](https://github.com/dbt-labs/dbt-core/blob/main/CONTRIBUTING.md) and the [Open Source Software Expectations](/community/resources/oss-expectations).
- If contributing to dbt Core, find an issue labeled “[good first issue](https://github.com/dbt-labs/dbt-core/issues?q=is%3Aopen+is%3Aissue+label%3Agood_first_issue)”, or look for similar labels on other repositories. If in doubt, also feel free to ask the maintainers for a good first issue, they’ll be excited to welcome you!

#### Need help?

The following channels in the dbt Community Slack are a great place to ask questions:

- #dbt-core-development
- #adapter-ecosystem
