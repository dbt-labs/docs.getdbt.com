:::info Cross-project refs unsupported in latest SL YAML spec
When using [dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro) with the [Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), [referencing models from different projects](/reference/dbt-jinja-functions/ref#ref-project-specific-models) is only supported in the legacy YAML spec, where semantic models are defined as top-level resources and can reference models across projects.

In the [latest YAML spec](/docs/build/latest-metrics-spec), semantic models are defined within model YAML files, and cross-project references are not yet supported. Support for this capability in the latest spec is planned for a future release.
:::