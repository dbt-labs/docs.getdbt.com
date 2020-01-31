---
title: "dbt Projects"
id: "dbt-projects"
---

### What is a dbt project?
A dbt project is a directory of `.sql` and `.yml` files, which dbt uses to transform your data. At a minimum, a dbt project must contain:
* A project file: A `dbt_project.yml` file tells dbt that a particular directory is a dbt project, and also contains configurations for your project.
* [Models](building-models): A model is a single `.sql` file. Each model contains a single select statement that either transforms raw data into a dataset that is ready for analytics, or, more often, is an intermediate step in such a transformation.

A project may also contain a number of other resources, such as [snapshots](snapshots), [seeds](seeds), [testing](testing), [macros](macros), [documentation](documentation), and [sources](using-sources). 

<Callout type="info" title="Sample dbt project">

We've built a demonstration dbt project for a fictional ecommerce store, [here](https://github.com/fishtown-analytics/jaffle_shop).

</Callout>

### How do I create a dbt project?
If you're creating a dbt project from scratch, use the [init command](init)! This creates a `dbt_project.yml` file with default configurations, as well as a basic directory structure for your project.

### How do I run a dbt project?
dbt projects are run via the command line – check out the docs on the [command line interface](command-line-interface) for more information.

### What goes in the dbt_project.yml file?
Your `dbt_project.yml` file contains configurations for your project, including:
* **Project details**: Values that describe your project, such as your project `name` and `version`.
* **Connection configurations**: The default profile for the project
* **File path configurations**: Values that tell dbt how to operate on your project, such:
  * Resource paths, for example `model-paths`, that tell dbt where it should read files that define each of the resources in your project.
  * Target paths, that tell dbt where to write files to, including compiled SQL, and logs.
* **Resource configurations**: You can configure resources (models, seeds, etc.) from your `dbt_project.yml` file – check out the docs on configuring resources [here](configuring-models).
* **Run hooks**: [Hooks](hooks) are snippets of SQL, often used to perform tasks like granting privileges, or inserting audit records. You can invoke hooks at the start or end of a dbt run, by defining them as `on-run-start` and `on-run-end` hooks.

## Reference
The following is an exhaustive list of the values you can configure in a `dbt_project.yml` file.

<File name='dbt_project.yml'>

```yaml


# This configuration file specifies information about your package
# that dbt needs in order to build your models. This file is _required_

#########################
#### PROJECT DETAILS ####
#########################

# name: Required. This is the name used to reference your package in the configs
# below. Package names must only contain letters and underscores
name: 'jaffle_shop'

# version: Required. This indicates the current version of your package and
# should conform to semantic versioning. The field is currently unused
version: '0.0.1'

# require-dbt-version: Optional. This is used to validate that your project is
# compatible with your dbt version
require-dbt-version: [">=0.14.0", "<0.15.0"]

####################################
#### CONNECTION CONFIGURATIONS #####
####################################

# profile: Required. This config specifies which profile dbt should use to
# connect to your data warehouse. The provided value must exist in the
# profiles.yml file.
profile: "jaffle_shop"


##################################
#### FILE PATH CONFIGURATIONS ####
##################################

# The following configs specify directories that dbt uses to operate. All
# paths are specified relative to the path of dbt_project.yml.

# ALL FILE PATH CONFIGURATIONS ARE OPTIONAL, the default values are listed below.

# source-paths: Specify which path(s) dbt should look in to find models. Model
# are.sql files. Model and source schema files (.yml files) should also be
# included in this path
source-paths: ["models"]

# analysis-paths: Specify which path(s) dbt should look in to find analytical
# queries. These queries are compiled, but not executed, by dbt.
analysis-paths: ["analysis"]

# test-paths: Specify which path(s) dbt should look in to find data test
# definitions.
test-paths: ["tests"]

# data-paths: Specify which path(s) dbt should look in to find CSV files.
# Running `dbt seed` will load these CSVs as tables in your warehouse.
data-paths: ["data"]

# macro-paths: Specify which path(s) dbt should look in to find macros. These
# macros will be globally available to all models in your project.
macro-paths: ["macros"]

# snapshot-paths: Specify with path(s) dbt should look in to finds napshots.
# Running `dbt snapshot` will run these snapshots.
snapshot-paths: ["snapshots"]

# target-path: Specify which path dbt should write  compiled SQL to.
target-path: "target"

# log-path: Specify which path dbt should write debug logs to.
log-path: "logs"

# modules-path: Specify which path dbt should use for storing and finding modules.
modules-path: "dbt_modules"

# clean-targets: Specify which path(s) should be removed by the clean task. Run
# `dbt clean` to delete these directories
clean-targets: ["target", "dbt_modules"]



#################################
#### RESOURCE CONFIGURATIONS ####
#################################

# The following section contains configurations that define how your resources
# are instantiated by dbt. You can configure `models`, and `seeds` from here.
# You can configure resources from both your own project, and installed 
# packages included as dependencies.
#
# Options are specified on a per-package, per-directory, and per-model basis.
# The configs are inherited, so configs applied to a package can be overridden
# for directories and models contained within that package.
#
# The configuration structure within a package should mirror the directory
# structure within that package. The example configs provided below are based
# on the following directory structure.
#
# dbt_project.yml
# models/
# ├── adwords
# │   └── adwords_ads.sql
# └── snowplow
#     ├── base
#     │   └── snowplow_events.sql
#     └── snowplow_sessions.sql

models:
  enabled: true    # configs defined here are applied to _all_ packages
  materialized: view   # but can be overridden in more specific configs below

  # pre- and post- hooks can be defined anywhere within the model hierarchy.
  # when defined at the root level (as they are here), they apply to all models
  # in all packages. These hooks are compiled into the model SQL and run either
  # before or after the model is materializated.
  pre-hook:
    - "insert into audit (model, state, time) values ('{{ this.name }}', 'start', getdate())"

  post-hook:
    - "grant select on {{this}} to user_1"
    - "insert into audit (model, state, time) values ('{{ this.name }}', 'end', getdate())"

  # This is the configuration for the models in your local package. The value
  # for the `name` key (defined above) should be used here
  jaffle_shop:
    # Applies to all SQL files found under ./models/adwords/
    adwords:
      enabled: false
      # Applies to the specific model ./models/adwords/adwords_ads.sql
      adwords_ads:
        enabled: true
        materialized: table

    # Applies to all SQL files found under ./models/snowplow/
    snowplow:
      # Applies to all SQL files found under ./models/snowplow/base
      base:
        # Applies to model ./models/snowplow/base/snowplow_events.sql
        snowplow_events:
          materialized: table
          sort: ['timestamp', 'userid']
          sort_type: interleaved
          dist: 'userid'

      # Applies to model ./models/snowplow/snowplow_sessions.sql
      snowplow_sessions:
        materialized: incremental
        sql_where: "created_at > (select max(created_at) from {{ this }})"
        unique_key: "id"
        sort: "timestamp"
        dist: "user_id"

seeds:
  enabled: true
  pre-hook:
    - "insert into audit (model, state, time) values ('{{ this.name }}', 'start', getdate())"

  post-hook:
    - "grant select on {{ this }} to user_1"
    - "insert into audit (model, state, time) values ('{{ this.name }}', 'end', getdate())"
    
snapshots:
  enabled: true
  tags: ["daily"]
  jaffle_shop:
    target_database: "raw"
    transient: false

###################
#### RUN HOOKS ####
###################
# Like the pre- and post- hooks above, the on-run-start and on-run-end configs
# make it possible to run SQL at the very beginning, and very end of a dbt run.
on-run-start:
  - "create table if not exists audit (model text, state text, time timestamp)"

on-run-end:
  - 'grant usage on schema "{{ target.schema }}" to db_reader'
  - 'grant select on all tables in schema "{{ target.schema }}" to db_reader'
```

</File>
