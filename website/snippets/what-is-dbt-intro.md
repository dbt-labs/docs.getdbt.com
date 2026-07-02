dbt is the industry standard for data transformation. Your team writes simple SQL `select` statements, and dbt handles everything else &mdash; creating tables and views, managing dependencies, testing data quality, and generating documentation. The result is a data platform built on modular, version-controlled, well-tested models that your whole organization can trust.

What sets dbt apart is the structured context it builds as you work. Every model you write contributes to a living map of your data: lineage, tests, contracts, metrics, and semantic definitions. That context isn't just useful for documentation &mdash; it's what makes dbt-powered AI like [<Constant name="wizard" />](#dbt-wizard) so precise. Instead of guessing at relationships or walking your schema to figure out structure, <Constant name="wizard" /> starts with full project awareness and can investigate, build, validate, and ship changes with governance enabled by default.

dbt spans the full analytics development lifecycle:

- **Transform**: Write business logic as SQL `select` statements. dbt materializes them as tables, views, or incremental models in your cloud data platform &mdash; no boilerplate DDL, no manual dependency ordering.
- **Test**: Define data quality tests alongside your models. Catch broken assumptions at build time, not in a dashboard at 9 a.m.
- **Document**: Generate documentation from your code automatically and keep it in sync as your project evolves.
- **Deploy**: Schedule, monitor, and orchestrate production runs. Use [state-aware orchestration](/docs/deploy/state-aware-about) to build only what changed and cut unnecessary compute costs.
- **Collaborate**: Work like a software team &mdash; branches, pull requests, CI/CD, and package management for your data pipelines.
- **Develop with AI**: Use <Constant name="wizard" /> to go from a question in plain language to a validated, governed change in your project.

More than 100,000 [community](/community/join) members and thousands of data teams trust dbt to turn raw warehouse data into reliable data products &mdash; faster than any approach that came before it.
