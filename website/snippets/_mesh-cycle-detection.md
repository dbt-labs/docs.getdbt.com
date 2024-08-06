Currently, the default behavior for "project" dependencies enforces that these relationships only go in one direction, meaning that the `jaffle_finance` project could not add a new model that depends, on any public models produced by the `jaffle_marketing` project. dbt will check for cycles across projects and raise errors if any are detected.

However, many teams may want to be able to share data assets back and forth between teams. _We've added support for enabling bidirectional dependencies across projects, currently in beta_. 

To enable this in your account, set the environment variable `DBT_CLOUD_PROJECT_CYCLES_ALLOWED` to `TRUE` in all your dbt Cloud environments. This allows you to create bidirectional dependencies between projects, so long as the new dependency does not introduce any node-level cycles.

When setting up projects that depend on each other, it's important to do so in a stepwise fashion. Each project must run and produce public models before the original producer project can take a dependency on the original consumer project. For example, the order of operations would be as follows for a simple two-project setup:

1. The `project_a` project runs in a deployment environment and produces public models.
2. The `project_b` project adds `project_a` as a dependency.
3. The `project_b` project runs in a deployment environment and produces public models.
4. The `project_a` project adds `project_b` as a dependency.

If you enable this feature and experience any issues, please reach out to [dbt Cloud support](mailto:support@getdbt.com).
