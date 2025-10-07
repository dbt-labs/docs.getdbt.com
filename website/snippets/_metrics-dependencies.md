## Dependencies

<VersionBlock lastVersion="1.99">
Metric nodes will reflect dependencies on semantic models based on their _measures_. However, dependencies based on filters should not be reflected in:

- [dbt selection syntax](/reference/node-selection/syntax)
- Visualization of the <Term id="dag">DAG</Term> in dbt-docs and the [integrated development environment](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) (IDE).

This is because metrics need to source nodes for their `depends_on` attribute from a few different places:

- `RATIO` and `DERIVED` type metrics should reference `Metric.type_params.input_metrics`.
- `SIMPLE` <!--and `CUMULATIVE`--> type metrics should reference `Metric.type_params.measure`.

For example, when you run the command `dbt list --select my_semantic_model+`, it will show you the metrics that belong to the specified semantic model.

But there's a condition: Only the metrics that actually use measures or derived metrics from that semantic model will be included in the list. In other words, if a metric only uses a dimension from the semantic model in its filters, it won't be considered as part of that semantic model.
</VersionBlock>

<VersionBlock firstVersion="2.0">

Metric nodes will reflect dependencies on semantic models based on their simple metrics. However, dependencies based on filters should not be reflected in:

- [dbt selection syntax](/reference/node-selection/syntax)
- Visualization of the <Term id="dag">DAG</Term> in dbt-docs and the [integrated development environment](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) (IDE).

This is because metrics need to source nodes for their `depends_on` attribute from a few different places:

- `RATIO` metrics depend on `numerator` and `denominator` metrics, while `DERIVED` metrics depend on `input_metrics`.
- `SIMPLE` <!--and `CUMULATIVE`--> type metrics depend on their semantic_model. <!--verify if this is correct-->

For example, when you run the command `dbt list --select my_semantic_model+`, it will show you the metrics that belong to the specified semantic model.

But there's a condition: Only the metrics that actually use simple metrics or derived metrics from that semantic model will be included in the list. In other words, if a metric only uses a dimension from the semantic model in its filters, it won't be considered as part of that semantic model.
</VersionBlock>
