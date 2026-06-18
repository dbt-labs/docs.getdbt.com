Use the dbt framework to quickly and collaboratively transform data and deploy analytics code following software engineering best practices like version control, modularity, portability, CI/CD, and documentation. This means anyone on the data team familiar with SQL can safely contribute to production-grade data pipelines.

The dbt framework is composed of a _language_ and an _engine_:

- The _dbt language_ is the code you write in your dbt project &mdash; SQL select statements, Jinja templating, YAML configs, tests, and more. It's the standard for the data industry and the foundation of the dbt framework.

- The _dbt engine_ compiles your project, executes your transformation graph, and produces metadata. dbt supports two engines which you can use depending on your needs:
  - The <Constant name="core" /> engine, which renders Jinja and runs your models. 
  - The <Constant name="fusion_engine" />, which goes beyond Jinja rendering to statically analyze your SQL — validating syntax and logic before your SQL is sent to the database (saving compute resources), and supports <Term id="lsp" /> features.
