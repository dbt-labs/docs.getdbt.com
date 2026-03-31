---
title: "Analyses"
description: "Configure SQL files in dbt to create compiled code used for analyses."
id: "analyses"
pagination_next: null
---

## Overview

dbt's notion of `models` makes it easy for data teams to version control and collaborate on data transformations. Sometimes though, a certain SQL statement doesn't quite fit into the mold of a dbt model. These more "analytical" SQL files can be versioned inside of your dbt project using the `analysis` functionality of dbt.

Any `.sql` files found in the `analyses/` directory of a dbt project will be compiled, but not executed. This means that analysts can use dbt functionality like `{{ ref(...) }}` to select from models in an environment-agnostic way.

In practice, an analysis file might look like this (via the [open source Quickbooks models](https://github.com/dbt-labs/quickbooks)):

<File name='analyses/running_total_by_account.sql'>

```sql
-- analyses/running_total_by_account.sql

with journal_entries as (

  select *
  from {{ ref('quickbooks_adjusted_journal_entries') }}

), accounts as (

  select *
  from {{ ref('quickbooks_accounts_transformed') }}

)

select
  txn_date,
  account_id,
  adjusted_amount,
  description,
  account_name,
  sum(adjusted_amount) over (partition by account_id order by id rows unbounded preceding)
from journal_entries
order by account_id, id
```

</File>

You can configure individual analyses in their property file. For example:

<File name='analyses/<filename>.yml'>

```yaml
analyses:
  - name: running_total_by_account
    description: Calculates the running total of adjusted amounts per account over time.
    config:
      docs:
        show: true
        node_color: purple
      tags: ['finance', 'accounting']
    columns:
      - name: account_id
        description: The unique identifier for the account.
      - name: adjusted_amount
        description: The adjusted transaction amount for the account.
```

</File>

For more information, refer to [Analysis properties](/reference/analysis-properties).

<VersionBlock firstVersion="1.12">

## Project-level configuration <Lifecycle status="beta" />

:::info Beta feature
The project-level configuration for analyses is a beta feature in <Constant name="core" /> v1.12.
:::

You can also configure analyses at the project level in `dbt_project.yml`, including enabling or disabling them by folder. This requires enabling the [`require_corrected_analysis_fqns`](/reference/global-configs/behavior-changes#project-level-configuration-for-analyses) behavior change flag. Note that `enabled` is the only config supported for project-level configuration of analyses.

<File name='dbt_project.yml'>

```yaml
flags:
  require_corrected_analysis_fqns: true

analyses:
  +enabled: true
```
</File>

You can also configure analyses at the folder level by nesting subfolders under your project name in the `analyses` block.

<File name='dbt_project.yml'>

```yaml
analyses:
  your_project:
    +enabled: false  # disable all analyses by default
    my_subfolder:
      +enabled: true  # enable a specific subfolder
```

</File>

</VersionBlock>

## Compiling analyses

To compile this analysis into runnable sql, run:
```
dbt compile
```

Then, look for the compiled SQL file in `target/compiled/{project name}/analyses/running_total_by_account.sql`. This SQL can then be pasted into a data visualization tool, for instance. Note that no `running_total_by_account` relation will be materialized in the database as this is an `analysis`, not a `model`.
