---
title: "Labels and tags"
sidebar_label: "Labels and tags"
description: "How to apply BigQuery labels, resource tags, and policy tags to tables, views, and jobs created by dbt."
---

### Specifying labels

dbt supports the specification of BigQuery labels for the tables and <Term id="view">views</Term> that it creates. These labels can be specified using the `labels` model config.

The `labels` config can be provided in a model config, or in the `dbt_project.yml` file, as shown below.

  BigQuery key-value pair entries for labels larger than 63 characters are truncated.

**Configuring labels in a model file**

<File name='model.sql'>

```sql
{{
  config(
    materialized = "table",
    labels = {'contains_pii': 'yes', 'contains_pie': 'no'}
  )
}}

select * from {{ ref('another_model') }}
```

</File>

**Configuring labels in dbt_project.yml**

<File name='dbt_project.yml'>

```yaml

models:
  my_project:
    snowplow:
      +labels:
        domain: clickstream
    finance:
      +labels:
        domain: finance
```

</File>

<Lightbox src="/img/docs/building-a-dbt-project/building-models/73eaa8a-Screen_Shot_2020-01-20_at_12.12.54_PM.png" title="Viewing labels in the BigQuery console"/>

### Applying labels to jobs

While the `labels` configuration applies labels to the tables and views created by dbt, you can also apply labels to the BigQuery _jobs_ that dbt runs. Job labels are useful for tracking query costs, monitoring job performance, and organizing your BigQuery job history by dbt metadata.

By default, labels are not applied to jobs directly. However, you can enable job labeling through query comments by following these steps:

#### Step 1
Define the `query_comment` macro to add labels to your queries via the query comment:

  ```sql
  -- macros/query_comment.sql
  {% macro query_comment(node) %}
      {%- set comment_dict = {} -%}
      {%- do comment_dict.update(
          app='dbt',
          dbt_version=dbt_version,
          profile_name=target.get('profile_name'),
          target_name=target.get('target_name'),
      ) -%}
      {%- if node is not none -%}
        {%- do comment_dict.update(node.config.get("labels", {})) -%}
      {% else %}
        {%- do comment_dict.update(node_id='internal') -%}
      {%- endif -%}
      {% do return(tojson(comment_dict)) %}
  {% endmacro %}
  ```

  This macro creates a JSON comment containing dbt metadata (app, version, profile, target) and merges in any model-specific labels you've configured.

#### Step 2
Enable job labeling in your `dbt_project.yml` by setting `comment: "{{ query_comment(node) }}"` and `job-label: true` in the `query-comment` configuration:

  ```yaml
  # dbt_project.yml
  name: analytics
  profile: bq
  version: "1.0.0"
  
  models:
    analytics:
      +materialized: table
  
  query-comment:
    comment: "{{ query_comment(node) }}"
    job-label: true
  ```

  When enabled, BigQuery will parse the JSON comment and apply the key-value pairs as labels to each job. You can then filter and analyze jobs in the BigQuery console or via the INFORMATION_SCHEMA.JOBS view using
  these labels.

### Specifying tags
BigQuery table and view *tags* can be created by supplying an empty string for the label value.

<File name='model.sql'>

```sql
{{
  config(
    materialized = "table",
    labels = {'contains_pii': ''}
  )
}}

select * from {{ ref('another_model') }}
```

</File>

You can create a new label with no value or remove a value from an existing label key.

A label with a key that has an empty value can also be referred to as a [tag](https://cloud.google.com/bigquery/docs/adding-labels#adding_a_label_without_a_value) in BigQuery. However, this is different from a [BigQuery tag](https://cloud.google.com/bigquery/docs/tags), which conditionally applies IAM policies to BigQuery tables and datasets. For more information, see the [Tags documentation](https://cloud.google.com/resource-manager/docs/tags/tags-overview).

### Resource tags

[BigQuery tags](https://cloud.google.com/bigquery/docs/tags) enable conditional IAM access control for BigQuery tables and views. You can apply these BigQuery tags using the `resource_tags` configuration. This section contains guidelines for using the `resource_tags` configuration parameter. 

Resource tags are key-value pairs that must follow BigQuery's tag format: `{google_cloud_project_id}/{key_name}: value`. Unlike labels, BigQuery tags are primarily designed for IAM access control using conditional policies, allowing organizations to:

- **Implement conditional access control**: Apply IAM policies conditionally based on BigQuery tags (for example, granting access only to tables tagged with `environment:production`).
- **Enforce data governance**: Use BigQuery tags with IAM policies to protect sensitive data.
- **Control access at scale**: Manage access patterns consistently across different projects and environments.

#### Prerequisites
- [Create tag keys and values](https://cloud.google.com/bigquery/docs/tags#create_tag_keys_and_values) in advance before using them in dbt.
- Grant the [required IAM permissions](https://cloud.google.com/bigquery/docs/tags#required_permissions) to apply tags to resources.

#### Configuring tags in a model file
To configure tags in a model file, refer to the following example:
<File name='model.sql'>

```sql
{{
  config(
    materialized = "table",
    resource_tags = {
      "my-project-id/environment": "production",
      "my-project-id/data_classification": "sensitive",
      "my-project-id/access_level": "restricted"
    }
  )
}}

select * from {{ ref('another_model') }}
```

</File>

#### Configuring tags in `dbt_project.yml`
To configure tags in a `dbt_project.yml` file, refer to the following example:
<File name='dbt_project.yml'>

```yaml
models:
  my_project:
    production:
      +resource_tags:
        my-project-id/environment: production
        my-project-id/data_classification: sensitive
    staging:
      +resource_tags:
        my-project-id/environment: staging
        my-project-id/data_classification: internal
```

</File>

#### Using both dbt tags and BigQuery tags

You can use dbt's existing `tags` configuration alongside BigQuery's `resource_tags`:

<File name='model.sql'>

```sql
{{
  config(
    materialized = "materialized_view",
    tags = ["reporting", "daily"],  # dbt tags for internal organization
    resource_tags = {  # BigQuery tags for IAM access control
      "my-project-id/environment": "production",
      "my-project-id/data_classification": "sensitive"
    }
  )
}}

select * from {{ ref('my_table') }}
```

</File>

For more information on setting up IAM conditional policies with BigQuery tags, see BigQuery's documentation on [tags](https://cloud.google.com/bigquery/docs/tags).

### Policy tags
BigQuery enables [column-level security](https://cloud.google.com/bigquery/docs/column-level-security-intro) by setting [policy tags](https://cloud.google.com/bigquery/docs/best-practices-policy-tags) on specific columns.

dbt enables this feature as a column resource property, `policy_tags` (_not_ a node config).

<File name='models/<filename>.yml'>

```yaml

models:
- name: policy_tag_table
  columns:
    - name: field
      policy_tags:
        - 'projects/<gcp-project>/locations/<location>/taxonomies/<taxonomy>/policyTags/<tag>'
```

</File>

Please note that in order for policy tags to take effect, [column-level `persist_docs`](/reference/resource-configs/persist_docs) must be enabled for the model, seed, or snapshot. Consider using [variables](/docs/build/project-variables) to manage taxonomies and make sure to add the required security [roles](https://cloud.google.com/bigquery/docs/column-level-security-intro#roles) to your BigQuery service account key.
