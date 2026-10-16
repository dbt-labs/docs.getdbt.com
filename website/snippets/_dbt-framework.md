Use the dbt framework to quickly and collaboratively transform data and deploy analytics code following software engineering best practices like version control, modularity, portability, CI/CD, and documentation. This means anyone on the data team familiar with SQL can safely contribute to production-grade data pipelines.

The dbt framework is composed of a _language_ and an _engine_:

- The _dbt language_ is the code you write in your dbt project &mdash; SQL select statements, Jinja templating, YAML configs, tests, and more. It's the standard for the data industry and the foundation of the dbt framework.

- The _dbt engine_ compiles your project, executes your transformation graph, and produces metadata. Today, the current Rust-based version generation is v2. By default, installing dbt gives you SQL comprehension, editor features, and richer development workflows.

