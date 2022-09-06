---
title: "Materialize Profile"
---

:::info Vendor-supported plugin

Certain core functionality may vary. If you would like to report a bug, request a feature, or contribute, you can check out the linked repository and open an issue.

:::

## Overview of dbt-materialize

**Maintained by:** Materialize, Inc.
**Source:** [Github](https://github.com/MaterializeInc/materialize/blob/main/misc/dbt-materialize)
**Core version:** v0.18.1 and newer
**dbt Cloud:** Not Supported
**dbt Slack channel** [Link to channel](https://getdbt.slack.com/archives/C01PWAH41A5)

## Installation and distribution

The `dbt-materialize` adapter is managed in the core [Materialize repository](https://github.com/MaterializeInc/materialize/blob/main/misc/dbt-materialize). To get started, install `dbt-materialize` using `pip` (and optionally a virtual environment):

```
python3 -m venv dbt-venv         # create the virtual environment
source dbt-venv/bin/activate     # activate the virtual environment
pip install dbt-materialize      # install the adapter
```

To check that the adapter was successfully installed, run:

```
dbt --version
```

You should see `materialize` listed under “Plugins”. If this is not the case, double-check that the virtual environment is activated!

## Connecting to Materialize

Once you have Materialize [installed and running](https://materialize.com/docs/install/), adapt your `profiles.yml` to connect to your instance using the following reference profile configuration:

<File name='~/.dbt/profiles.yml'>

```yaml
dbt-materialize:
  target: dev
  outputs:
    dev:
      type: materialize
      threads: 1
      host: [host]
      port: [port]
      user: [user]
      pass: [password]
      dbname: [database]
      schema: [name of your dbt schema]
```

</File>

To test the connection to Materialize, run:

```
dbt debug
```

If the output reads "All checks passed!", you’re good to go! Check the [dbt and Materialize guide](https://materialize.com/docs/guides/dbt/) to learn more and get started.

## Supported Features

### Materializations

Because Materialize is optimized for transformations on streaming data and the core of dbt is built around batch, the `dbt-materialize` adapter implements a few custom materialization types:

Type | Supported? | Details
-----|------------|----------------
`source` | YES | Creates a [source](https://materialize.com/docs/sql/create-source/).
`view` | YES | Creates a [view](https://materialize.com/docs/sql/create-view/#main).
`materializedview` | YES | Creates a [materialized view](https://materialize.com/docs/sql/create-materialized-view/#main).
`table` | YES | Creates a [materialized view](https://materialize.com/docs/sql/create-materialized-view/#main). (Actual table support pending [#5266](https://github.com/MaterializeInc/materialize/issues/5266))
`index` | YES | (Deprecated) Creates an index. Use the [`indexes` config](materialize-configs#indexes) to create indexes on `materializedview`, `view` or `source` relations instead.
`sink` | YES | Creates a [sink](https://materialize.com/docs/sql/create-sink/#main).
`ephemeral` | YES | Executes queries using <Term id="cte">CTEs</Term>.
`incremental` | NO | Use the `materializedview` <Term id="materialization" /> instead. Materialized views will always return up-to-date results without manual or configured refreshes. For more information, check out [Materialize documentation](https://materialize.com/docs/).

### Seeds

Running [`dbt seed`](commands/seed) will create a static materialized <Term id="view" /> from a CSV file. You will not be able to add to or update this view after it has been created. If you want to rerun `dbt seed`, you must first drop existing views manually with `drop view`.

### Tests

Running [`dbt test`](commands/test) with the optional `--store-failures` flag or [`store_failures` config](resource-configs/store_failures) will create a materialized view for each test you've chosen to store. This view is a continuously updating representation of failures.

## Resources

- [dbt and Materialize guide](https://materialize.com/docs/guides/dbt/)
- [Get started](https://github.com/MaterializeInc/demos/tree/main/dbt-get-started) using dbt and Materialize together
