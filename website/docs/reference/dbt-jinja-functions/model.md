---
title: "About model object"
sidebar_label: "model"
id: "model"
description: "`model` is the dbt graph object (or node) for the current model."
---

`model` is the dbt [graph object](/reference/dbt-jinja-functions/graph) (or node) for the current model. It can be used to:
- Access `config` settings, say, in a post-hook
- Access the path to the model

For example:
```jinja
{% if model.config.materialized == 'view' %}
  {{ log(model.name ~ " is a view.", info=True) }}
{% endif %}
```

To view the contents of `model` for a given model:

<Tabs>

<TabItem value="cli" label="Command line interface">

If you're using the command line interface (CLI), use [log()](/reference/dbt-jinja-functions/log) to print the full contents:

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

## Batch properties for microbatch models

Starting in dbt Core v1.9, the model object includes a `batch` property (`model.batch`), which provides details about the current batch when executing an [incremental microbatch](/docs/build/incremental-microbatch) model. This property is only populated during the batch execution of a microbatch model.

The following table describes the properties of the `batch` object. Note that dbt appends the property to the `model` and `batch` objects. 

| Property | Description | Example |  
| -------- | ----------- | ------- |
| `id` | The unique identifier for the batch within the context of the microbatch model. | `model.batch.id` |
| `event_time_start` | The start time of the batch's [`event_time`](/reference/resource-configs/event-time) filter (inclusive). | `model.batch.event_time_start` |
| `event_time_end` | The end time of the batch's `event_time` filter (exclusive). | `model.batch.event_time_end` |

### Usage notes

`model.batch` is only available during the execution of a microbatch model batch. Outside of the microbatch execution, `model.batch` is `None`, and its sub-properties aren't accessible.

#### Example of safeguarding access to batch properties

We recommend to always check if `model.batch` is populated before accessing its properties. To do this, use an `if` statement for safe access to `batch` properties:

```jinja
{% if model.batch %}
  {{ log(model.batch.id) }}  # Log the batch ID #
  {{ log(model.batch.event_time_start) }}  # Log the start time of the batch #
  {{ log(model.batch.event_time_end) }}  # Log the end time of the batch #
{% endif %}
```

In this example, the `if model.batch` statement makes sure that the code only runs during a batch execution. `log()` is used to print the `batch` properties for debugging.

#### Example of log batch details

This is a practical example of how you might use `model.batch` in a microbatch model to log batch details for the `batch.id`:

```jinja
{% if model.batch %}
  {{ log("Processing batch with ID: " ~ model.batch.id, info=True) }}
  {{ log("Batch event time range: " ~ model.batch.event_time_start ~ " to " ~ model.batch.event_time_end, info=True) }}
{% endif %}
```
In this example, the `if model.batch` statement makes sure that the code only runs during a batch execution. `log()` is used to print the `batch` properties for debugging.

## Model structure and JSON schema

To view the structure of `models` and their definitions:
- Refer to [dbt JSON Schema](https://schemas.getdbt.com/) for describing and consuming dbt generated artifacts
- Select the corresponding manifest version under **Manifest**. For example if you're on dbt v1.8, then you would select Manifest v12
  * The `manifest.json` version number is related to (but not _equal_ to) your dbt version, so you _must_ use the correct `manifest.json` version for your dbt version. To find the correct `manifest.json` version, refer to [Manifest](/reference/artifacts/manifest-json) and select the dbt version on the top navigation (such as `v1.5`). This will help you find out which tags are associated with your model.
- Then go to `nodes` --> Select Additional properties --> `CompiledModelNode` or view other definitions/objects.

Use the following table to understand how the versioning pattern works and match the Manifest version with the dbt version:

import ManifestVersions from '/snippets/_manifest-versions.md';

<ManifestVersions />

## Related docs

- [dbt JSON Schema](https://schemas.getdbt.com/)
