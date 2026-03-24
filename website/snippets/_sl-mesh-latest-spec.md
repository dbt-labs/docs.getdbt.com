:::info Cross-project refs not yet supported in latest YAML spec
When using [dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro) with the [Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), [referencing models from different projects](/reference/dbt-jinja-functions/ref#ref-project-specific-models) is only supported in the legacy YAML spec, where semantic models are defined as top-level resources and can reference models across projects.

In the [latest YAML spec](/docs/build/latest-metrics-spec), semantic models are defined in model YAML files, and cross-project references are not yet supported. Therefore, maintaining a centralized Semantic Layer project that references models across projects is not compatible.

Support for cross-project references in the latest spec is planned for a future release.
:::