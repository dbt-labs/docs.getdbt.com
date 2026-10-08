---
title: "Coordinating model versions"
description: Use this guide to coordinate producers and consumers when introducing model versions
hoverSnippet: Learn how to coordinate producers and consumers when introducing model versions
intro_text: Coordinating model versions across your mesh is a critical part of the model versioning process. This guide will walk you through the safe best practices for coordinating producers and consumers when introducing model versions.
---

import DeprecationDateCallout from '/snippets/_deprecation-date-callout.md'; 

[Model versions](/docs/mesh/govern/model-versions) are an important part of your dbt <Constant name="mesh" /> workflow. They enable better data model management and are critical when multiple teams share models across projects.

Releasing a new model version safely requires coordination between model producers (who build the models) and model consumers (who depend on them).

This guide goes over the following topics:
- [How producers introduce new model versions safely](#best-practices-for-producers)
- [How consumers evaluate and migrate to those new versions](#best-practices-for-consumers)

For how versioning works at a technical level (YAML structure, contracts, aliasing), see [model versions](/docs/mesh/govern/model-versions).

## Best practices for producers

Producers own the creation, rollout, communication, and deprecation of model versions. The following steps go over what producers should do when introducing a new version of a model.

<!-- no toc -->
  - [Step 1: Decide when a change needs a new version](#step-1-decide-when-a-change-needs-a-new-version)
  - [Step 2: Create the new version safely](#step-2-create-the-new-version-safely)
  - [Step 3: Add a deprecation date](#step-3-add-a-deprecation-date)
  - [Step 4: Communicate the new version](#step-4-communicate-the-new-version)
  - [Step 5: Set the new latest version](#step-5-set-the-new-latest-version)
  - [Step 6: Clean up deprecated versions](#step-6-clean-up-deprecated-versions)

#### Step 1: Decide when a change needs a new version

When creating an original version of a model, use [model contracts](/docs/mesh/govern/model-contracts) to ensure that breaking changes produce errors during development. The model contract ensures you, as a producer, are not changing the shape or data type of the output model. If a change breaks the contract, like removing or changing a column type, create a new model version with an updated contract instead of changing the existing version in place.

Here are some examples of breaking changes that might need a new version:
- Removing a column
- Renaming a column
- Changing a column type

Here are some examples of non-breaking changes:
- Adding a new column
- Fixing a bug in an existing column

Here are examples of changes that might be breaking depending on your business logic:
- Changing logic behind a metric
- Changing granularity
- Modifying filters
- Rewriting `CASE` statements

#### Step 2: Create the new version safely
After deciding that a change needs a new [version](/reference/resource-properties/versions), follow these steps to create the new version without disrupting existing workflows. Let's say you're removing a column:

1. Create a new version of the model file. For example, `fishtown_analytics_orders_v2.sql`. Each version of a model must have its own SQL file.
2. Keep the default version stable. In the model's `properties.yml` file:
   - Set [`versions`](/reference/resource-properties/versions) to include the old version and the new version: `- v: 1` and `- v: 2` respectively.
   - Set the [`latest_version:`](/reference/resource-properties/latest_version) to `latest_version: 1`.

    This ensures that downstream consumers using `ref(...)` won’t accidentally start using v2. Without setting this, the default will be the highest numerical version, which could be a breaking change for consumers.

3. Set an [alias](/reference/resource-configs/alias) or create a view over the latest model version. By aliasing or creating a view over the latest model version, you ensure `fishtown_analytics_orders` (without the version suffix) always exists as an object in the warehouse, pointing to the latest version. This also protects external tools and BI dashboards.

#### Step 3: Add a deprecation date

1. In the model's `properties.yml` file, set a [`deprecation_date`](/reference/resource-properties/deprecation_date) for the model's old version. The `deprecation_date` is a date in the future that signifies when the old version will be removed.
   
   This notifies downstream consumers and will appear in the `dbt run` logs as a warning that the old version is nearing deprecation and consumers will need to [migrate](#best-practices-for-consumers) to the new version.

   <DeprecationDateCallout />
   
    <File name='models/properties.yml'>
    ```yaml
    models:
      - name: fishtown_analytics_orders
        latest_version: 1
        columns:
          - name: column_to_remove
          - name: column_to_keep

        versions:
          - v: 1                 # old version (uses all top-level columns)
            deprecation_date: "2025-12-31"
          - v: 2                 # new version
            columns:
              - include: all
                exclude: [column_to_remove]   # columns removed in v2
    ```
    </File>
2. Merge the new version into the main branch.
3. Run the job to build the new version.
4. Verify that the new version builds successfully.
5. Verify that the deprecation date is set correctly in the `dbt run` logs.

If you try to reference models (for example, `{{ ref('upstream_project', 'model_name', v=1) }}`) using the `v=1` argument after the deprecation date, the `ref` call will fail once the producer project removes the `v1` version.

#### Step 4: Communicate the new version
After creating a new version and setting a deprecation date for the old version, communicate the new version to downstream consumers. Let them know that:
- A new version is available and a deprecation timeline exists.
- Consumers can test the new version and [migrate](#best-practices-for-consumers) over. 
- To test the new version, consumers can use `v=2` when referencing the model. For example, `{{ ref('upstream_project', 'model_name', v=2) }}`.

#### Step 5: Set the new latest version

Once consumers have migrated, set the new version as the latest version. v1 remains in the project until you complete [Step 6](#step-6-clean-up-deprecated-versions).

<File name='models/properties.yml'>

```yaml
models:
  - name: fishtown_analytics_orders
    latest_version: 2 # update from 1 to 2 to set the new version as the latest version
    versions:
      - v: 1 # this represents the old version
      - v: 2 # this represents the new version
```
</File>

This then updates the default `ref` to the new version. For example, `{{ ref('upstream_project', 'fishtown_analytics_orders') }}` will now resolve to the `fishtown_analytics_orders_v2` model in the `upstream_project`. If consumers want to use the old version, they can use `v=1` when referencing the model: `{{ ref('upstream_project', 'fishtown_analytics_orders', v=1) }}`.

#### Step 6: Clean up deprecated versions

After all consumers have [migrated](#best-practices-for-consumers) to the new version, you can clean up the deprecated version. You could choose to "hard delete" all old versions, or "soft delete" them for continuity.

:::info
When removing or renaming a versioned model with an enforced contract, first deprecate the version you plan to retire.

Set a `deprecation_date` on the retiring version. Use a date in the past if you are removing it immediately. Merge that change and run your production job so [state-aware CI](/docs/deploy/ci-jobs) records the deprecation. In a follow-up change, remove or rename the model, such as renaming `fishtown_analytics_orders_v2.sql` to `fishtown_analytics_orders.sql`.

Skipping this intermediate step may cause dbt to treat the removal as an unexpected breaking contract change and fail CI. For an optional walkthrough, refer to the [video walkthrough on removing a versioned model with an enforced contract](https://www.youtube.com/watch?v=FQ905Zj5C1o).
:::

<Tabs>
<TabItem value="hard-delete" label="Hard delete (cleanest)">

"Hard deleting" old versions is the cleanest approach. It removes version artifacts from your project and the warehouse.

If the model has an enforced contract, complete the workflow in the callout above first. Then, in a follow-up change:

1. Delete the SQL file for the deprecated version (for example, `fishtown_analytics_orders_v1.sql`).
2. If you are removing versioning entirely, rename the latest version file to the base name (for example, `fishtown_analytics_orders_v2.sql` to `fishtown_analytics_orders.sql`).
3. Delete all version specifications from your `.yml` file.
4. Drop or delete deprecated version objects from your warehouse with a manual script or a cleanup macro.

</TabItem>

<TabItem value="soft-delete" label="Soft delete (retains continuity)">

"Soft deleting" old versions retains all old version artifacts to avoid confusion if more model versions get introduced in the future, and for continuity. Bear in mind that your version control platform will also have the history of all of these changes.

If the model has an enforced contract, complete the workflow in the callout above first. Then, in a follow-up change:

1. Repoint the `fishtown_analytics_orders` alias to your latest version file (for example, `fishtown_analytics_orders_v2`), or create a view on top of the latest model version.
2. Use the `enabled` [config option](/reference/resource-configs/enabled) to disable the deprecated model version so that it doesn’t run in dbt jobs and can’t be referenced in a cross-project ref. For example:
       <File name='models/properties.yml'>
    ```yaml
    models:
      - name: fishtown_analytics_orders
        latest_version: 2
        columns:
          - name: column_to_remove
          - name: column_to_keep

        versions:
          - v: 1                 # old version (uses all top-level columns)
            deprecation_date: "2025-12-31"
            config:
              enabled: false  #  disable deprecated version so it no longer runs
          - v: 2                 # new version
            columns:
              - include: all
                exclude: [column_to_remove]   # columns removed in v2
    ```
    </File>
3. Drop or delete the `fishtown_analytics_orders_v1` object from your warehouse with a manual script or appropriate process or using a cleanup macro.

</TabItem>
</Tabs>

<ConfettiTrigger>

... and that's it! You've introduced a new model version and completed producer cleanup. The next section is for consumers to evaluate and migrate to new versions.
</ConfettiTrigger>

## Best practices for consumers
Consumers rely on upstream models and need to make sure that version transitions don’t introduce unintended breakages. Refer to the following steps to migrate to the new version:

1. Begin writing a cross-project reference to use a public model from a different project. In this case, `{{ ref('upstream_project', 'fishtown_analytics_orders') }}`.
2. Once you see deprecation warnings, test the latest version of a model by explicitly referencing it in your `ref`. For example, `{{ ref('upstream_project', 'fishtown_analytics_orders', v=2) }}`. Check if it's a breaking change for you or has any unintended impacts on your project. 
   - If it does, consider explicitly “pinning” to the current, working version of the model before the new version becomes the default: `{{ ref('upstream_project', 'fishtown_analytics_orders', v=1) }}`. Bear in mind that you will need to migrate at some point before the deprecation date.
3. Before the deprecation date, you can migrate to the new version of the model by removing the version specification in your cross-project reference: `{{ ref('upstream_project', 'fishtown_analytics_orders') }}`. Make any downstream logic changes needed to accommodate this new version.

Consumers should plan migrations to align with their own team’s release cycles.


## Related docs

- [Model versions](/docs/mesh/govern/model-versions)
- [Model contracts](/docs/mesh/govern/model-contracts)
- [`deprecation_date`](/reference/resource-properties/deprecation_date)
- [CI jobs](/docs/deploy/ci-jobs)
- [Project dependencies](/docs/mesh/govern/project-dependencies)
- [Quickstart with <Constant name="mesh" />](/guides/mesh-qs)
