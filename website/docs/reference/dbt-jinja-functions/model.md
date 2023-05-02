---
title: "model"
id: "model"
sidebar_label: "model"
description: "`model` is the dbt graph object (or node) for the current model."
---

`model` is the dbt [graph object](graph) (or node) for the current model. It can be used to:
- Access `config` settings, say, in a post-hook
- Access the path to the model

For example:
```jinja
{% if model.config.materialization = 'view' %}
  {{ log(model.name ~ " is a view.", info=True) }}
{% endif %}
```

To view the contents of `model` for a given model:

<Tabs>

<TabItem value="cli" label="CLI">

If you're using the CLI, use [log()](/reference/dbt-jinja-functions/log) to print the full contents:

```jinja
{{ log(model, info=True) }}
```
  
 </TabItem>
 
 <TabItem value="ide" label="dbt Cloud IDE">
   
 If you're using the dbt Cloud IDE, compile the following to print the full contents: <br /><br />

 ```jinja
{{ model | tojson(indent = 4) }}
```
   
</TabItem>

</Tabs>

## Model structure and JSON schema

To view the structure of `models` and their definitions:
- Refer to [dbt JSON Schema](https://schemas.getdbt.com/) for describing and consuming dbt generated artifacts
- Select the corresponding manifest version under **Manifest**. For example if you're on dbt v1.3, then you would select Manifest v7
  * The `manifest.json` version number is related to (but not _equal_ to) your dbt version, so you _must_ use the correct `manifest.json` version for your dbt version. To find the correct `manifest.json` version, refer to [Manifest](/reference/artifacts/manifest-json) and select the dbt version on the top navigation (such as `v1.5`). This will help you find out which tags are associated with your model.
- Then go to `nodes` --> Select Additional properties --> `CompiledModelNode` or view other definitions/objects.

Use the following table to understand how the versioning pattern works and match the Manifest version with the dbt version:

| dbt version | Manifest version |
| ----------- | ---------------- |
| `v1.5` | [Manifest v9](https://schemas.getdbt.com/dbt/manifest/v9/index.html)
| `v1.4` | [Manifest v8](https://schemas.getdbt.com/dbt/manifest/v8/index.html)
| `v1.3` | [Manifest v7](https://schemas.getdbt.com/dbt/manifest/v7/index.html)
| `v1.2` | [Manifest v6](https://schemas.getdbt.com/dbt/manifest/v6/index.html)
| `v1.1` | [Manifest v5](https://schemas.getdbt.com/dbt/manifest/v5/index.html)



## Related docs

- [dbt JSON Schema](https://schemas.getdbt.com/)
