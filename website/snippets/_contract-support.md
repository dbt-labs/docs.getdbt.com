## Prerequisites

**These places support model contracts:**
- `dbt_project.yml` file
- `properties.yml` file
- SQL models
- Models materialized as one of the following:
    - `table`
    - `view` &mdash; views offer limited support for column names and data types, but not `constraints`
    - `incremental` &mdash; with `on_schema_change: append_new_columns` or `on_schema_change: fail`
- Certain data platforms, but the supported and [enforced `constraints`](/reference/resource-properties/constraints) vary by platform

**These places do _NOT_ support model contracts:**
- Python models
- `materialized view` or `ephemeral` &mdash; materialized SQL models
- Custom materializations (unless added by the author)
- Models with recursive <Term id="cte" />'s in BigQuery
- Other resource types, such as `sources`, `seeds`, `snapshots`, and so on
