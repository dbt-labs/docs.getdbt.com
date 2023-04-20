---
title: "model"
id: "model"
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
  <TabIemte value="cli" label="CLI">
  If you're using the CLI, use [log()](/reference/dbt-jinja-functions/log)
to print the full contents:

```jinja
{{ log(model, info=True) }}
```
  
 </TabItem>
 <TabItem value="ide" label="dbt Cloud IDE">
   
 If you're using the dbt Cloud IDE, compile the following to print the full contents:
 
```{{ model | tojson(indent = 4) }}```
   
</TabItem>
</Tabs>

## Model structure and fields

To view the structure of `models` and their definitions, refer to [dbt JSON Schema](https://schemas.getdbt.com/) for describing and consuming dbt generated artifacts.

If you'd like to understand your model's structure, open the `manifest.json` -> `nodes` -> `CompiledModelNode`.

**Note**, you'll need to use the correct `manifest.json` version for your dbt version. The `manifest.json` version number isn't directly related to your dbt version, so find the right `manifest.json` version to look inside `CompiledModelNode` and find the tags linked to your model.


## Related docs

- [dbt JSON Schema](https://schemas.getdbt.com/)
