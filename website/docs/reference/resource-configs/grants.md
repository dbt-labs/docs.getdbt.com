---
resource_types: [models,seeds,snapshots]
datatype: "{<dictionary>}"
default_value: {}
id: "grants"
---

You can manage access to the datasets you're producing with dbt by using grants. To implement these permissions, define grants as resource configs on each model, seed, or snapshot. Define the default grants that apply to the entire project in your `dbt_project.yml`, and define model-specific grants within each model's SQL or YAML file.

The grant resource configs enable you to apply permissions at build time to a specific set of recipients and model, seed, or snapshot. When your model, seed, or snapshot finishes building, dbt ensures that the grants on its view or table match exactly the grants you have configured.

dbt aims to use the most efficient approach when updating grants, which varies based on the adapter you're using, and whether dbt is replacing or updating an object that already exists. You can always check the debug logs for the full set of grant and revoke statements that dbt runs.

dbt encourages you to use grants as resource configs whenever possible in Core v1.2 and higher. In versions prior to Core v1.2, you were limited to using hooks for grants. Occasionally, you still might need to write grants statements manually and run them using hooks. For example, hooks may be appropriate if you want to:

* Apply grants in a more complex or custom manner, beyond what the built-in grants capability can provide.
* Apply grants on other database objects besides views and tables.
* Take advantage of more-advanced permission capabilities offered by your data platform, for which dbt does not (yet!) offer out-of-the-box support using resource configuration.
* Create more granular row- and column-level access, use masking policies, or apply future grants.

For more information on hooks, see [Hooks & operations](/docs/build/hooks-operations).

## Definition

You can use the `grants` field to set permissions or grants for a resource. When you run a model, seed or seed, or snapshot a snapshot, dbt will run `grant` and/or `revoke` statements to ensure that the permissions on the database object match the `grants` you have configured on the resource.

Like all configurations, `grants` will be included in dbt project metadata, including [the manifest artifact](/reference/artifacts/manifest-json).

### Common syntax

Grants have two key components:

* **Privilege:** A right to perform a specific action or set of actions on an object in the database, such as selecting data from a table.
* **Grantees:** One or more recipients of granted privileges. Some platforms also call these "principals." For example, a grantee could be a user, a group of users, a role held by one or more users (Snowflake), or a service account (BigQuery/GCP).

## Configuring grants

You can configure `grants` in `dbt_project.yml` to apply grants to many resources at once—all models in your project, a package, or a subfolder—and you can also configure `grants` one-by-one for specific resources, in YAML `config:` blocks or right within their `.sql` files.

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

See [configs and properties](/reference/configs-and-properties) for details.

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

The `grants` config can also be defined under the `seeds` config block in `dbt_project.yml`. See [configs and properties](/reference/configs-and-properties) for details.

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

See [configs and properties](/reference/configs-and-properties) for details.

</TabItem>
</Tabs>

### Grant config inheritance

When you set `grants` for the same model in multiple places, such as in `dbt_project.yml` and in a more-specific `.sql` or `.yml` file, dbt's default behavior replaces the less-specific set of grantees with the more-specific set of grantees.  This "merge and clobber" behavior updates each privilege when dbt parses your project.

For example:

<File name='dbt_project.yml'>

```yml
models:
  +grants:  # In this case the + is not optional, you must include it for your project to parse.
    select: ['user_a', 'user_b']
```

</File>

<File name='models/specific_model.sql'>

```sql
{{ config(grants = {'select': ['user_c']}) }}
```

</File>

As a result of this configuration, `specific_model` will be configured to grant the `select` privilege to `user_c` _only_. After you run `specific_model`, that is the only granted privilege you would see in the database, and the only `grant` statement you would find in dbt's logs.

Let's say we wanted to _add_ `user_c` to the existing list of grantees receiving the `select` privilege on `specific_model`, rather than _replacing_ that list entirely. To accomplish that, we can use the `+` ("addition") symbol, prefixing the name of the privilege:

<File name='models/specific_model.sql'>

```sql
{{ config(grants = {'+select': ['user_c']}) }}
```

</File>

Now, the model will grant select to `user_a`, `user_b`, AND `user_c`!

**Notes:**
- This will only take effect for privileges which include the `+` prefix. Each privilege controls that behavior separately. If we were granting other privileges, in addition to `select`, and those privilege names lacked the `+` prefix, they would continue to "clobber" rather than "add" new grantees.
- This use of `+`, controlling clobber vs. add merge behavior, is distinct from the use of `+` in `dbt_project.yml` (shown in the example above) for defining configs with dictionary values. For more information, see [the plus prefix](https://docs.getdbt.com/reference/resource-configs/plus-prefix).
- `grants` is the first config to support a `+` prefix for controlling config merge behavior. Currently, it's the only one. If it proves useful, we may extend this capability to new and existing configs in the future.

## General examples

You can grant each permission to a single grantee, or a set of multiple grantees. In this example, we're granting `select` on this model to just `bi_user`, so that it can be queried in our Business Intelligence (BI) tool.

<File name='models/table_model.sql'>

```sql
{{ config(materialized = 'table', grants = {
    'select': 'bi_user'
}) }}
```

</File>

When dbt runs this model for the first time, it will create the table, and then run code like:
```sql
grant select on schema_name.table_model to bi_user;
```

In this case, we're creating an incremental model, and granting the `select` privilege to two recipients: `bi_user` and `reporter`.

<File name='models/incremental_model.sql'>

```sql
{{ config(materialized = 'incremental', grants = {
    'select': ['bi_user', 'reporter']
}) }}
```

</File>

When dbt runs this model for the first time, it will create the table, and then run code like:
```sql
grant select on schema_name.incremental_model to bi_user, reporter;
```

In subsequent runs, dbt will use database-specific SQL to show the grants already on `incremental_model`, and then determine if any `revoke` or `grant` statements are needed.


## Database-specific requirements and notes

While we try to standardize the terms we use to describe different features, you will always find nuances in different databases. This section outlines some of those database-specific requirements and notes.

In our examples above and below, you will find us referring to a privilege named `select`, and a grantee named `another_user`. Many databases use these or similar terms. Be aware that your database may require different syntax for privileges and grantees; you must configure `grants` in dbt with the appropriate names for both.

<WHCode>

<div warehouse="BigQuery">

On BigQuery, "privileges" are called "roles," and they take the form `roles/service.roleName`. For instance, instead of granting `select` on a model, you would grant `roles/bigquery.dataViewer`.

Grantees can be users, groups, service accounts, domains—and each needs to be clearly demarcated as such with a prefix. For instance, to grant access on a model to `someone@yourcompany.com`, you need to specify them as `user:someone@yourcompany.com`.

We encourage you to read Google's documentation for more context:
- [Understanding GCP roles](https://cloud.google.com/iam/docs/understanding-roles)
- [How to format grantees](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-control-language#user_list)

<Snippet path="grants-vs-access-to" />

### BigQuery examples

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
- Databricks automatically enables `grants` on SQL endpoints. For interactive clusters, admins should enable grant functionality using these two setup steps in the Databricks documentation:
  - [Enable table access control for your workspace](https://docs.databricks.com/administration-guide/access-control/table-acl.html)
  - [Enable table access control for a cluster](https://docs.databricks.com/security/access-control/table-acls/table-acl.html)
- In order to grant `READ_METADATA` or `USAGE`, use [post-hooks](https://docs.getdbt.com/reference/resource-configs/pre-hook-post-hook)

</div>

<div warehouse="Redshift">

* Granting to / revoking from is only fully supported for Redshift users (not groups or roles).

</div>

<div warehouse="Snowflake">

* dbt accounts for the [`copy_grants` configuration](/reference/resource-configs/snowflake-configs#copying-grants) when calculating which grants need to be added or removed.

</div>

</WHCode>
