---
resource_types: [models,seeds,snapshots]
datatype: "string"
default_value: {}
id: "grants"
---

<Snippet src="available-prerelease-beta-banner" />

You can manage access to the datasets you're producing with dbt by using grants. To implement these permissions, define grants as resource configs on each model, seed, or snapshot. Define the default grants that apply to the entire project in your `dbt_project.yml`, and define model-specific grants within each model's SQL or YAML file.

The grant resource configs enable you to apply permissions to a specific model and set of recipients as soon as the model finishes building.

Use grants with hooks when you have a more advanced problem to solve. For example, if you want to create more granular row- and column-level access, use masking policies, or apply future grants. For more information on hooks, see [Hooks & operations](/building-a-dbt-project/hooks-operations).

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

You can use the `grants` field to set permissions or grants for a resource. These grants will be compiled into the `manifest.json` file complied by dbt, which you can view in the automatically generated documentation.

## Examples

Granting a single user a permission:

```sql
{{ config(materialized = 'incremental', grants = {
    'select': 'other_user'
}) }}

```

Granting multiple users the same permission:

```sql
{{ config(materialized = 'incremental', grants = {
    'select': ['other_user','this_user']
}) }}

```
