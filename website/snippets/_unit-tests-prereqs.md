## Prerequisites

- We currently only support unit testing SQL models.
- We currently only support adding unit tests to models in your _current_ project.
- We currently _don't_ support unit testing models that use the [`materialized view`](/docs/build/materializations#materialized-view) materialization.
- We currently _don't_ support unit testing models that use recursive SQL.
- We currently _don't_ support unit testing models that use introspective queries.
- If your model has multiple versions, by default the unit test will run on *all* versions of your model. Read [unit testing versioned models](/reference/resource-properties/unit-testing-versions) for more information.
- Unit tests must be defined in a YML file in your [`models/` directory](/reference/project-configs/model-paths).
- Table names must be aliased in order to unit test `join` logic.
- Include all [`ref`](/reference/dbt-jinja-functions/ref) or [`source`](/reference/dbt-jinja-functions/source) model references in the unit test configuration as `input`s to avoid "node not found" errors during compilation.

Unit tests are discovered from `model-paths` (by default, the `models/` directory), so define them alongside your models in a `.yml` file under your `model-paths`. Don't define unit test YAML in the `tests/` directory, which is reserved for [data tests](/docs/build/data-tests).