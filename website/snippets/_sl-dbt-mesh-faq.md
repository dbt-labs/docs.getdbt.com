When using the dbt Semantic Layer in a [dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro) setting, we recommend the following:

- You have one standalone project that contains your semantic models and metrics.
- Then as you build your Semantic Layer, you can [cross-reference dbt models](/docs/collaborate/govern/project-dependencies) across your various projects or packages to create your semantic models using the [two-argument `ref` function](/reference/dbt-jinja-functions/ref#ref-project-specific-models)( `ref('project_name', 'model_name')`).
- Your dbt Semantic Layer project serves as a global source of truth across the rest of your projects.

#### Usage example 
For example, let's say you have a public model (`fct_orders`) that lives in the `jaffle_finance` project. As you build your semantic model, use the following syntax to ref the model:

<File name="models/metrics/semantic_model_name.yml">

```yaml
semantic_models:
  - name: customer_orders
    defaults:
      agg_time_dimension: first_ordered_at
    description: |
      Customer grain mart that aggregates customer orders.
    model: ref('jaffle_finance', 'fct_orders') # ref('project_name', 'model_name')
    entities:
      ...rest of configuration...
    dimensions:
      ...rest of configuration...
    measures:
      ...rest of configuration...
```
</File>

Notice that in the `model` parameter, we're using the `ref` function with two arguments to reference the public model `fct_orders` defined in the `jaffle_finance` project.
<br />
