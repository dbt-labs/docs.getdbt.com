
Organizations of all sizes rely upon dbt to manage their data transformations, from small startups to large enterprises. At scale, it can be challenging to coordinate all the organizational and technical requirements demanded by your stakeholders within the scope of a single dbt project.

To date, there also hasn't been a first-class way to effectively manage the dependencies, governance, and workflows between multiple dbt projects. 

That's where **<Constant name="mesh" />** comes in - empowering data teams to work *independently and collaboratively*; sharing data, code, and best practices without sacrificing security or autonomy. 

 <Constant name="mesh" /> is not a single product - it is a pattern enabled by a convergence of several features in dbt:

- **[Cross-project references](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref)** - this is the foundational feature that enables the multi-project deployments. `{{ ref() }}`s now work across <Constant name="cloud" /> projects on Enterprise and Enterprise+ plans.
- **[<Constant name="explorer" />](/docs/explore/explore-projects)** - <Constant name="cloud" />'s metadata-powered documentation platform, complete with full, cross-project lineage.
- **Governance** - dbt's governance features allow you to manage access to your dbt models both within and across projects.
  - **[Groups](/docs/mesh/govern/model-access#groups)** - With groups, you can organize nodes in your dbt DAG that share a logical connection (for example, by functional area) and assign an owner to the entire group.
  - **[Access](/docs/mesh/govern/model-access#access-modifiers)** - access configs allow you to control who can reference models.
  - **[Model Versions](/docs/mesh/govern/model-versions)** - when coordinating across projects and teams, we recommend treating your data models as stable APIs. Model versioning is the mechanism to allow graceful adoption and deprecation of models as they evolve.
  - **[Model Contracts](/docs/mesh/govern/model-contracts)** - data contracts set explicit expectations on the shape of the data to ensure data changes upstream of dbt or within a project's logic don't break downstream consumers' data products.

## When is the right time to use dbt Mesh?

The multi-project architecture helps organizations with mature, complex transformation workflows in dbt increase the flexibility and performance of their dbt projects. If you're already using dbt and your project has started to experience any of the following, you're likely ready to start exploring this paradigm:

- The **number of models** in your project is degrading performance and slowing down development.
- Teams have developed **separate workflows** and need to decouple development from each other.
- Teams are experiencing **communication challenges**, and the reliability of some of your data products has started to deteriorate.
- **Security and governance** requirements are increasing and would benefit from increased isolation.

