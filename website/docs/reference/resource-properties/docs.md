---
resource_types: models
datatype: "{dictionary}"
default_value: {show: true}
---

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Sources', value: 'sources', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
    { label: 'Analyses', value: 'analyses', },
    { label: 'Macros', value: 'macros', },
  ]
}>
<TabItem value="models">

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: model_name
    docs:
      show: true | false

```

</File>

</TabItem>

<TabItem value="sources">

This property is not implemented for sources.

</TabItem>

<TabItem value="seeds">

<File name='seeds/schema.yml'>

```yml
version: 2

seeds:
  - name: seed_name
    docs:
      show: true | false

```

</File>

</TabItem>

<TabItem value="snapshots">

<File name='snapshots/schema.yml'>

```yml
version: 2

snapshots:
  - name: snapshot_name
    docs:
      show: true | false

```

</File>

</TabItem>

<TabItem value="analyses">

<File name='analysis/schema.yml'>

```yml
version: 2

analyses:
  - name: analysis_name
    docs:
      show: true | false
```

</File>

</TabItem>

<TabItem value="macros">

<!----
To-do: check this
--->

<File name='macros/schema.yml'>

```yml
version: 2

macros:
  - name: macro_name
    docs:
      show: true | false

```

</File>

</TabItem>

</Tabs>

## Definition
The `docs` field can be used to provide documentation-specific configuration to models. The only currently supported `docs` attribute is `show`, which controls whether or not models are shown in the auto-generated documentation website.

**Note:** hidden models will still appear in the dbt DAG visualization, but will be identified as "hidden".

<Changelog>

* `v0.16.0`: This property was added

</Changelog>

## Default
The default value for `show` is `true`.

## Examples
### Mark a model as hidden

```yml
models:
  - name: sessions__tmp
    docs:
      show: false
```
<VersionBlock firstVersion="1.3">
The `docs` attribute now supports `node_color` to customize the color of the node in the DAG.

## Examples
### Add custom node colors to models within subdirectories based on hex codes or a plain color name

```yml
models:
  tpch:
    staging:
      +materialized: view
      +docs:
        node_color: "#cd7f32"

    marts:
      core:
        materialized: table
        +docs:
          node_color: "gold"
```

![Example](website/static/img/node_color_example.png)
</VersionBlock>

