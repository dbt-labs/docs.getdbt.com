---
title: "Foundational structure" 
id: "6-foundational-structure"
description: "Foundational structure"
---

In this step, we’ll need to create a development branch and set up project level configurations.

1. To get started with development for our project, we'll need to create a new Git branch for our work. Select **create branch** and name your development branch. We'll call our branch `snowpark_python_workshop` then click **Submit**.
2. The first piece of development we'll do on the project is to update the `dbt_project.yml` file. Every dbt project requires a `dbt_project.yml` file &mdash; this is how dbt knows a directory is a dbt project. The [dbt_project.yml](/reference/dbt_project.yml) file also contains important information that tells dbt how to operate on your project.
3. Select the `dbt_project.yml` file from the file tree to open it and replace all of the existing contents with the following code below. When you're done, save the file by clicking **save**. You can also use the Command-S or Control-S shortcut from here on out.

    ```yaml
    # Name your project! Project names should contain only lowercase characters
    # and underscores. A good package name should reflect your organization's
    # name or the intended use of these models
    name: 'snowflake_dbt_python_formula1'
    version: '1.3.0'
    require-dbt-version: '>=1.3.0'
    config-version: 2

    # This setting configures which "profile" dbt uses for this project.
    profile: 'default'

    # These configurations specify where dbt should look for different types of files.
    # The `model-paths` config, for example, states that models in this project can be
    # found in the "models/" directory. You probably won't need to change these!
    model-paths: ["models"]
    analysis-paths: ["analyses"]
    test-paths: ["tests"]
    seed-paths: ["seeds"]
    macro-paths: ["macros"]
    snapshot-paths: ["snapshots"]

    target-path: "target"  # directory which will store compiled SQL files
    clean-targets:         # directories to be removed by `dbt clean`
     - "target"
     - "dbt_packages"

    models:
     snowflake_dbt_python_formula1:
       staging:
    
     +docs:
       node_color: "CadetBlue"
   marts:
     +materialized: table
     aggregates:
       +docs:
         node_color: "Maroon"
       +tags: "bi"

     core:
       +docs:
         node_color: "#800080"
     intermediate:
       +docs:
         node_color: "MediumSlateBlue"
     ml:
       prep:
         +docs:
           node_color: "Indigo"
       train_predict:
         +docs:
           node_color: "#36454f"

    ```

4. The key configurations to point out in the file with relation to the work that we're going to do are in the `models` section.
    - `require-dbt-version` &mdash; Tells dbt which version of dbt to use for your project. We are requiring 1.3.0 and any newer version to run python models and node colors.
    - `materialized` &mdash; Tells dbt how to materialize models when compiling the code before it pushes it down to Snowflake. All models in the `marts` folder will be built as tables.
    - `tags` &mdash; Applies tags at a directory level to all models. All models in the `aggregates` folder will be tagged as `bi` (abbreviation for business intelligence).
    - `docs` &mdash; Specifies the `node_color` either by the plain color name or a hex value.
5. [Materializations](/docs/build/materializations) are strategies for persisting dbt models in a warehouse, with `tables` and `views` being the most commonly utilized types. By default, all dbt models are materialized as views and other materialization types can be configured in the `dbt_project.yml` file or in a model itself. It’s very important to note *Python models can only be materialized as tables or incremental models.* Since all our Python models exist under `marts`, the following portion of our `dbt_project.yml` ensures no errors will occur when we run our Python models. Starting with [dbt version 1.4](/guides/migration/versions/upgrading-to-v1.4#updates-to-python-models), Python files will automatically get materialized as tables even if not explicitly specified.

    ```yaml 
    marts:     
      +materialized: table
    ``` 

