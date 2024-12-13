You can enable bidirectional dependencies across projects so these relationships can go in either direction, meaning that the `jaffle_finance` project can add a new model that depends on any public models produced by the `jaffle_marketing` project, so long as the new dependency doesn't introduce any node-level cycles. dbt checks for cycles across projects and raises errors if any are detected.


When setting up projects that depend on each other, it's important to do so in a stepwise fashion. Each project must run and produce public models before the original producer project can take a dependency on the original consumer project. For example, the order of operations would be as follows for a simple two-project setup:

1. The `project_a` project runs in a deployment environment and produces public models.
2. The `project_b` project adds `project_a` as a dependency.
3. The `project_b` project runs in a deployment environment and produces public models.
4. The `project_a` project adds `project_b` as a dependency.
