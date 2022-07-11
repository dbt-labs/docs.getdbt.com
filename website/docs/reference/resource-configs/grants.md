---
resource_types: [models,seeds,snapshots]
datatype: "string"
default_value: {}
id: "grants"
---

<Snippet src="available-prerelease-beta-banner" />

You can manage access to the datasets you're producing with dbt by using grants. To implement these permissions, define grants as resource configs on each model, seed, or snapshot. Define the default grants that apply to the entire project in your `dbt_project.yml`, and define model-specific grants within each model's SQL or YAML file.

The grant resource configs enable you to apply permissions at build time to a specific set of recipients and model, seed, or snapshot. When your model, seed, or snapshot finishes building, dbt ensures that the grants on its view or table match exactly the grants you have configured.

dbt always finds the most efficient approach when updating grants, which varies based on the adapter you're using, and whether dbt is replacing or updating an object that already exists. You can always check the debug logs for the full set of grant and revoke statements that dbt runs.

When you have a more advanced problem to solve, you might instead use grants with hooks instead of grants as resource configs. For example, if you want to create more granular row- and column-level access, use masking policies, or apply future grants. For more information on hooks, see [Hooks & operations](/building-a-dbt-project/hooks-operations).

You can set grants in `dbt_project.yml` and as a `config` yaml property that applies to the entire dbt project.

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
  ]
}>

<TabItem value="models">

<File name='models/schema.yml'>

```yml
models:
  - name: specific_model
    config:
      grants:
        select: ['reporter', 'bi']
```

</File>

The `grants` config can also be defined:

- under the `models` config block in `dbt_project.yml`
- in a `config()` Jinja macro within a model's SQL file

See [configs and properties](configs-and-properties) for details.

</TabItem>

<TabItem value="seeds">

<File name='seeds/schema.yml'>

```yml
seeds:
  - name: seed_name
    config:
      grants:
        select: ['reporter', 'bi']
```

</File>

The `grants` config can also be defined under the `seeds` config block in `dbt_project.yml`. See [configs and properties](configs-and-properties) for details.

</TabItem>

<TabItem value="snapshots">

<File name='snapshots/schema.yml'>

```yml
snapshots:
  - name: snapshot_name
    config:  
      grants:
        select: ['reporter', 'bi']
```

</File>

The `grants` config can also be defined:

- under the `snapshots` config block in `dbt_project.yml`
- in a `config()` Jinja macro within a snapshot's SQL block

See [configs and properties](configs-and-properties) for details.

</TabItem>
</Tabs>

## Definition

You can use the `grants` field to set permissions or grants for a resource. These grants will be compiled into the `manifest.json` file complied by dbt.

## Database-specific requirements and notes

While we try to standardize the terms we use to describe different features, you will always find nuances in different databases. This section outlines some of those database-specific requirements and notes.

### Common syntax 

In our examples, you find terms like `select` and `another_user` because many databases use these terms, but be aware of the syntax your own database supports:

* Privileges: A right to perform an action in a database.
* Grantees: A way to manage privileges. Recipients of granted privileges, also called "principals." Grantees can be a user, a group of users, a role held by users (Snowflake), a service account (GCP), and more.

<WHCode>

<div warehouse="BigQuery">

- Be aware that the `grants` config is unrelated to the `grant_access_to` config:
  - **`grants_access_to`:** Enables you to set up authorized views. When configured, dbt provides authorized view access to other datasets, without leaking additional data from those datasets. Fore more on this, see [BigQuery configurations: Authorized views](/reference/resource-configs/bigquery-configs#authorized-views)
  - **`grants`:** Provides specific permissions to users, groups, or service accounts for managing access to datasets you're producing with dbt.You could grant a user, group or service account access to an authorized view set up by the `grants_access_to` feature.
- Use BigQuery-specific grantee and privilege names. 
  * Use `user:jeremy@dbtlabs.com` (do not use `jerco_user`)
  * Use  `roles/bigquery.dataViewer` (do not use `select`)


## BigQuery examples

Granting permission using SQL and BigQuery:

```sql
{{ config(grants = {'roles/bigquery.dataViewer': ['user:someone@yourcompany.com']}) }}
```

Granting permission in a model schema using BigQuery:

<File name='models/schema.yml'>

```yml
models:
  - name: specific_model
    config:
      grants:
        roles/bigquery.dataViewer: ['user:someone@yourcompany.com']
```

</File>

</div>

<div warehouse="Databricks">

- OSS Apache Spark / Delta Lake do not support `grants`.
- Databricks automatically enables `grants` on SQL endpoints. For interactive clusters, admins should enable grant functionality using these two setup steps in teh Dataabricks documentation:
  - [Enable table access control for your workspace](https://docs.databricks.com/administration-guide/access-control/table-acl.html)
  - [Enable table access control for a cluster](https://docs.databricks.com/security/access-control/table-acls/table-acl.html)

</div>

<div warehouse="Redshift">

* No special requirements at this time.

</div>

<div warehouse="Snowflake">

* dbt recognizes the `copy_grants` when calculating which grants need to be added or removed.

</div>

</WHCode>

## General examples

When granting permissions, you can optimize for single or multiple users.

Granting a single permission:

```sql
{{ config(materialized = 'incremental', grants = {
    'select': 'other_user'
}) }}

```

Granting multiple users the same permission:

```sql
{{ config(materialized = 'incremental', grants = {
    'select': ['other_user','admin_user']
}) }}

```
