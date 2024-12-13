---
resource_types: [models]
datatype: deprecation_date
required: no
---

<File name='models/<schema>.yml'>

```yml
models:
  - name: my_model
    description: deprecated
    deprecation_date: 1999-01-01 00:00:00.00+00:00
```
</File>

<File name='models/<schema>.yml'>

```yml
version: 2
models:
  - name: my_model
    description: deprecating in the future
    deprecation_date: 2999-01-01 00:00:00.00+00:00
```

</File>

## Definition

The deprecation date of the model is formatted as a date, optionally with a timezone offset. Supported RFC 3339 formats include:
- `YYYY-MM-DD hh:mm:ss.sss±hh:mm`
- `YYYY-MM-DD hh:mm:ss.sss`
- `YYYY-MM-DD`

When `deprecation_date` does not include an offset from UTC, then it is interpreted as being in the system time zone of the dbt execution environment.

## Explanation

### Purpose

Declaring a `deprecation_date` for a dbt model provides a mechanism to communicate plans and timelines for long-term support and maintenance and to facilitate change management.

Setting a `deprecation_date` works well in conjunction with other [model governance](/docs/collaborate/govern/about-model-governance) features like [model versions](/docs/collaborate/govern/model-versions), but can also be used independently from them.

### Warning messages

When a project references a model that's slated for deprecation or the deprecation date has passed, a warning is generated. If it's a versioned model, with a newer version available, then the warning says so. This added bit of cross-team communication, from producers to consumers, is an advantage of using dbt's built-in functionality around model versions to facilitate migrations.

Additionally, [`WARN_ERROR_OPTIONS`](/reference/global-configs/warnings) gives a mechanism whereby users can promote these warnings to actual runtime errors:

| Warning                        | Scenario                                           | Affected projects      |
|--------------------------------|----------------------------------------------------|------------------------|
|        `DeprecatedModel`       | Parsing a project that defines a deprecated model  | Producer               |
| `DeprecatedReference`          | Referencing a model with a past deprecation date   | Producer and consumers |
| `UpcomingReferenceDeprecation` | Referencing a model with a future deprecation date | Producer and consumers |

**Example**

Example output for an `UpcomingReferenceDeprecation` warning:
```
$ dbt parse
15:48:14  Running with dbt=1.6.0
15:48:14  Registered adapter: postgres=1.6.0
15:48:14  [WARNING]: While compiling 'my_model_ref': Found a reference to my_model, which is slated for deprecation on '2038-01-19T03:14:07-00:00'.
```

### Selection syntax

There is not specific [node selection syntax](/reference/node-selection/syntax) for `deprecation_date`. [Programmatic invocations](/reference/programmatic-invocations) is one way to identify deprecated models (potentially in conjunction with [dbt list](/reference/commands/list)). e.g., `dbt -q ls  --output json --output-keys database schema alias deprecation_date`.

### Deprecation process

Additional steps are necessary to save on build-related compute and storage costs for a deprecated model.

Deprecated models can continue to be built by producers and be selected by consumers until they are [disabled](/reference/resource-configs/enabled) or removed.

Just like it does not automatically [drop relations when models are deleted](/faqs/Models/removing-deleted-models), dbt does not drop relations for deprecated models.

Strategies similar to [here](https://discourse.getdbt.com/t/faq-cleaning-up-removed-models-from-your-production-schema/113) or [here](https://discourse.getdbt.com/t/clean-your-warehouse-of-old-and-deprecated-models/1547) can be used to drop relations that have been deprecated and are no longer in use.

### Table expiration on BigQuery

dbt-bigquery can set an [`hours_to_expiration`](/reference/resource-configs/bigquery-configs#controlling-table-expiration) that translates to `expiration_timestamp` within BigQuery.

dbt does not automatically synchronize `deprecation_date` and `hours_to_expiration`, but users may want to coordinate them in some fashion (such as setting a model to expire 48 hours after its `deprecation_date`). Expired tables in BigQuery will be deleted and their storage reclaimed.
