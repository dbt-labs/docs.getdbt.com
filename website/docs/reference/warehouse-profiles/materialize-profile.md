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

The easiest way to install is to use pip:

    pip install dbt-materialize

## Connecting to Materialize with **dbt-materialize**

The dbt profile for Materialize is nearly identical to the [profile configuration for Postgres](postgres-profile):

<File name='profiles.yml'>

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

## Supported Features

### Materializations

Type | Supported? | Details
-----|------------|----------------
source | YES | Creates a [source](https://materialize.com/docs/sql/create-source/).
view | YES | Creates a [view](https://materialize.com/docs/sql/create-view/#main).
materializedview | YES | Creates a [materialized view](https://materialize.com/docs/sql/create-materialized-view/#main).
table | YES | Creates a [materialized view](https://materialize.com/docs/sql/create-materialized-view/#main). (Actual table support pending [#5266](https://github.com/MaterializeInc/materialize/issues/5266))
index | YES | Creates an [index](https://materialize.com/docs/sql/create-index/#main).
sink | YES | Creates a [sink](https://materialize.com/docs/sql/create-sink/#main).
ephemeral | YES | Executes queries using <Term id="cte">CTEs</Term>.
incremental | NO | Use the `materializedview` <Term id="materialization" /> instead. Materialized views will always return up-to-date results without manual or configured refreshes. For more information, check out [Materialize documentation](https://materialize.com/docs/).

### Seeds

Running [`dbt seed`](commands/seed) will create a static materialized <Term id="view" /> from a CSV file. You will not be able to add to or update this view after it has been created. If you want to rerun `dbt seed`, you must first drop existing views manually with `drop view`.

## Resources

- [dbt and Materialize guide](https://materialize.com/docs/guides/dbt/)
- [Get started](https://github.com/MaterializeInc/materialize/blob/main/play/wikirecent-dbt/README.md) using dbt and Materialize together
