---
resource_types: [models]
datatype: list
required: no
keyword: governance, model version, model versioning, dbt model versioning
---

import VersionsCallout from '/snippets/_version-callout.md';

<VersionsCallout />

<File name='models/<schema>.yml'>

```yml
version: 2

models:
  - name: model_name
    versions:
      - v: <version_identifier> # required
        defined_in: <file_name> # optional -- default is <model_name>_v<v>
        columns:
          # specify all columns, or include/exclude columns from the top-level model YAML definition
          - [include](/reference/resource-properties/include-exclude): <include_value>
            [exclude](/reference/resource-properties/include-exclude): <exclude_list>
          # specify additional columns
          - name: <column_name> # required
      - v: ...
    
    # optional
    [latest_version](/reference/resource-properties/latest_version): <version_identifier> 
```

</File>

The standard convention for naming model versions is `<model_name>_v<v>`. This holds for the file where dbt expects to find the model's definition (SQL or Python), and the alias it will use by default when materializing the model in the database.

### `v`

The version identifier for a version of a model. This value can be numeric (integer or float), or any string.

The value of the version identifier is used to order versions of a model relative to one another. If a versioned model does _not_ explicitly configure a [`latest_version`](/reference/resource-properties/latest_version), the highest version number is used as the latest version to resolve `ref` calls to the model without a `version` argument.

In general, we recommend that you use a simple "major versioning" scheme for your models: `1`, `2`, `3`, and so on, where each version reflects a breaking change from previous versions. You are able to use other versioning schemes. dbt will sort your version identifiers alphabetically if the values are not all numeric. You should **not** include the letter `v` in the version identifier, as dbt will do that for you.

### `defined_in`

The name of the model file (excluding the file extension, e.g. `.sql` or `.py`) where the model version is defined.

If `defined_in` is not specified, dbt searches for the definition of a versioned model in a model file named `<model_name>_v<v>`. The **latest** version of a model may also be defined in a file named `<model_name>`, without the version suffix. Model file names must be globally unique, even when defining versioned implementations of a model with a different name.

### `alias`

The default resolved `alias` for a versioned model is `<model_name>_v<v>`. The logic for this is encoded in the `generate_alias_name` macro.

This default can be overwritten in two ways:
- Configuring a custom `alias` within the version yaml, or the versioned model's definition
- Overwriting dbt's `generate_alias_name` macro, to use different behavior based on `node.version`

See ["Custom aliases"](https://docs.getdbt.com/docs/build/custom-aliases) for more details.

Note that the value of `defined_in` and the `alias` configuration of a model are not coordinated, except by convention. The two are declared and determined independently.

### Our recommendations
- Follow a consistent naming convention for model versions and aliases.
- Use `defined_in` and `alias` only if you have good reason.
- Create a view that always points to the latest version of your model. You can automate this for all versioned models in your project with an `on-run-end` hook. For more details, read the full docs on ["Model versions"](/docs/collaborate/govern/model-versions#configuring-database-location-with-alias)

### Detecting breaking changes

When you use the `state:modified` selection method in Slim CI, dbt will detect changes to versioned model contracts, and raise an error if any of those changes could be breaking for downstream consumers.

Breaking changes include:
- Removing an existing column
- Changing the `data_type` of an existing column
- Removing or modifying one of the `constraints` on an existing column (dbt v1.6 or higher)
- Changing unversioned, contracted models. 
  - dbt also warns if a model has or had a contract but isn't versioned
  
<Tabs>

<TabItem value="unversioned" label="Example message for unversioned models">

```
  Breaking Change to Unversioned Contract for contracted_model (models/contracted_models/contracted_model.sql)
  While comparing to previous project state, dbt detected a breaking change to an unversioned model.
    - Contract enforcement was removed: Previously, this model's configuration included contract: {enforced: true}. It is no longer configured to enforce its contract, and this is a breaking change.
    - Columns were removed:
      - color
      - date_day
    - Enforced column level constraints were removed:
      - id (ConstraintType.not_null)
      - id (ConstraintType.primary_key)
    - Enforced model level constraints were removed:
      - ConstraintType.check -> ['id']
    - Materialization changed with enforced constraints:
      - table -> view
```
</TabItem>

<TabItem value="versioned" label="Example message for versioned models">

```
Breaking Change to Contract Error in model sometable (models/sometable.sql)
  While comparing to previous project state, dbt detected a breaking change to an enforced contract.

  The contract's enforcement has been disabled.

  Columns were removed:
   - order_name

  Columns with data_type changes:
   - order_id (number -> int)

  Consider making an additive (non-breaking) change instead, if possible.
  Otherwise, create a new model version: https://docs.getdbt.com/docs/collaborate/govern/model-versions
```

</TabItem>


</Tabs>

Additive changes are **not** considered breaking:
- Adding a new column to a contracted model
- Adding new `constraints` to an existing column in a contracted model
