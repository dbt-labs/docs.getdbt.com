---
resource_types: [models]
datatype: "{<dictionary>}"
default_value: {constraints_enabled: false}
id: "constraints_enabled"
---
# Definition

## Configuring Constraints

## Constraints Enabled Inheritance

### General Examples

### Database-specific Requirements and Notes

<WHCode>

<div warehouse="BigQuery">

On BigQuery, "privileges" are called "roles," and they take the form `roles/service.roleName`. For instance, instead of granting `select` on a model, you would grant `roles/bigquery.dataViewer`.

Grantees can be users, groups, service accounts, domains—and each needs to be clearly demarcated as such with a prefix. For instance, to grant access on a model to `someone@yourcompany.com`, you need to specify them as `user:someone@yourcompany.com`.

We encourage you to read Google's documentation for more context:
- [Understanding GCP roles](https://cloud.google.com/iam/docs/understanding-roles)
- [How to format grantees](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-control-language#user_list)

<Snippet src="grants-vs-access-to" />

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

</div>

<div warehouse="Redshift">

* No special requirements at this time.

</div>

<div warehouse="Snowflake">

* dbt accounts for the [`copy_grants` configuration](/reference/resource-configs/snowflake-configs#copying-grants) when calculating which grants need to be added or removed.

</div>

<div warehouse="PostgreSQL">

* dbt accounts for the [`copy_grants` configuration](/reference/resource-configs/snowflake-configs#copying-grants) when calculating which grants need to be added or removed.

</div>

</WHCode>