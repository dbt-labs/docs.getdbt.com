---
resource_types: [tests]
datatype: boolean
---

The configured test(s) will store their failures when `dbt test --store-failures` is invoked. If you set this configuration as `false` but [`store_failures_as`](/reference/resource-configs/store_failures_as) is configured, it will be overridden. 

## Description
Optionally set a test to always or never store its failures in the database.
- If specified as `true` or `false`, the
`store_failures` config will take precedence over the presence or absence of the `--store-failures` flag.
- If the `store_failures` config is `none` or omitted, the resource will use the value of the `--store-failures` flag.
- When true, `store_failures` saves all records (up to [limit](/reference/resource-configs/limit)) that failed the test. Failures are saved in a new table with the name of the test. By default, `store_failures` uses the schema `{{ profile.schema }}_dbt_test__audit`, but you can [configure](/reference/resource-configs/schema#tests) the schema suffix to a different value.
- A test's results will always **replace** previous failures for the same test, even if that test results in no failures.
- By default, `store_failures` uses a schema named `dbt_test__audit`, but, you can [configure](/reference/resource-configs/schema#tests) the schema to a different value. Ensure you have the authorization to create or access schemas for your work. For more details, refer to the [FAQ](#faqs).

This logic is encoded in the [`should_store_failures()`](https://github.com/dbt-labs/dbt-adapters/blob/60005a0a2bd33b61cb65a591bc1604b1b3fd25d5/dbt/include/global_project/macros/materializations/configs.sql#L15) macro.


<Tabs
  defaultValue="specific"
  values={[
    { label: 'Specific test', value: 'specific', },
    { label: 'Singular test', value: 'singular', },
    { label: 'Generic test block', value: 'generic', },
    { label: 'Project level', value: 'project', },
  ]
}>

<TabItem value="specific">

Configure a specific instance of a generic (schema) test:

<File name='models/<filename>.yml'>

```yaml
version: 2

models:
  - name: my_model
    columns:
      - name: my_column
        tests:
          - unique:
              config:
                store_failures: true  # always store failures
          - not_null:
              config:
                store_failures: false  # never store failures
```

</File>

</TabItem>

<TabItem value="singular">

Configure a singular (data) test:

<File name='tests/<filename>.sql'>

```sql
{{ config(store_failures = true) }}

select ...
```

</File>

</TabItem>

<TabItem value="generic">

Set the default for all instances of a generic (schema) test, by setting the config inside its test block (definition):

<File name='macros/<filename>.sql'>

```sql
{% test <testname>(model, column_name) %}

{{ config(store_failures = false) }}

select ...

{% endtest %}
```

</File>

</TabItem>

<TabItem value="project">

Set the default for all tests in a package or project:

<File name='dbt_project.yml'>

```yaml
tests:
  +store_failures: true  # all tests
  
  <package_name>:
    +store_failures: false # tests in <package_name>
```

</File>

</TabItem>

</Tabs>

## FAQs

<DetailsToggle alt_header="Receiving a 'permissions denied for schema' error">

If you're receiving a `Adapter name adapter: Adapter_name error: permission denied for schema dev_username_dbt_test__audit`, this is most likely due to your user not having permission to create new schemas, despite having owner access to your own development schema.

To resolve this, you need proper authorization to create or access custom schemas. Run the following SQL command in your respective data platform environment. Note that the exact authorization query may differ from one data platform to another:

```sql
create schema if not exists dev_username_dbt_test__audit authorization username;
```
_Replace `dev_username` with your specific development schema name and `username` with the appropriate user who should have the permissions._

This command grants the appropriate permissions to create and access the `dbt_test__audit` schema, which is often used with the `store_failures` configuration.

</DetailsToggle>
