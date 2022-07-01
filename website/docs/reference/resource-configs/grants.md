---
resource_types: [models,seeds,snapshots]
datatype: "string"
default_value: {}
---

<Snippet src="available-prerelease-beta-banner" />

You can manage access to the datasets you're producing with dbt by using grants. Define these grants as resource configs on each model, seed, or snapshot instead of using hooks to implement these permissions. You can define default grants in your `dbt_project.yml` and provide model-specific grants by defining them within each model's SQL or YAML file.



The grant resource configs enable you to automatically apply grants when your dbt model runs. If you want to create even more granular permissions, you can still use grants with hooks, but these hooks can be complicated to implement and require testing thoroughly to make sure they're working as expected. For more information on hooks, see [Hooks & operations](/building-a-dbt-project/hooks-operations).

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

```sql
{{ config(materialized = 'incremental', grants = {
    'select': ['other_user']
}) }}

```
