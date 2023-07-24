---
title: "Connection profiles"
id: "connection-profiles"
description: "Configure your profile using the command line."
---

When you invoke dbt from the command line, dbt parses your `dbt_project.yml` and obtains the `profile` name, which dbt needs to connect to your <Term id="data-warehouse" />.

<File name='dbt_project.yml'>

```yaml
# Example dbt_project.yml file
name: 'jaffle_shop'
profile: 'jaffle_shop'
...
```

</File>

dbt then checks your [`profiles.yml` file](/docs/core/connect-data-platform/profiles.yml) for a profile with the same name. A profile contains all the details required to connect to your data warehouse.

<VersionBlock lastVersion="1.2">

By default, dbt expects the `profiles.yml` file to be located in the `~/.dbt/` directory.

</VersionBlock>
<VersionBlock firstVersion="1.3">

dbt will search the current working directory for the `profiles.yml` file and will default to the `~/.dbt/` directory if not found.

</VersionBlock>

This file generally lives outside of your dbt project to avoid sensitive credentials being checked in to version control, but `profiles.yml` can be safely checked in when [using environment variables](#advanced-using-environment-variables) to load sensitive credentials.

<File name='~/.dbt/profiles.yml'>

```yaml
# example profiles.yml file
jaffle_shop:
  target: dev
  outputs:
    dev:
      type: postgres
      host: localhost
      user: alice
      password: <password>
      port: 5432
      dbname: jaffle_shop
      schema: dbt_alice
      threads: 4
```

</File>


## About the `profiles.yml` file

In your `profiles.yml` file, you can store as many profiles as you need. Typically, you would have one profile for each warehouse you use. Most organizations only have one profile.

For information about configuring advanced options, see [the `profiles.yml` reference page](/docs/core/connect-data-platform/profiles.yml).

## About profiles

A profile consists of _targets_, and a specified _default target_.

Each _target_ specifies the type of warehouse you are connecting to, the credentials to connect to the warehouse, and some dbt-specific configurations.

The credentials you need to provide in your target varies across warehouses &mdash; sample profiles for each supported warehouse are available in the [Supported Data Platforms](/docs/supported-data-platforms) section.

**Pro Tip:** You may need to surround your password in quotes if it contains special characters. More details [here](https://stackoverflow.com/a/37015689/10415173).

## Setting up your profile

To set up your profile, copy the correct sample profile for your warehouse into your `profiles.yml` file and update the details as follows:

* Profile name: Replace the name of the profile with a sensible name – it’s often a good idea to use the name of your organization. Make sure that this is the same name as the `profile` indicated in your `dbt_project.yml` file.
* `target`: This is the default target your dbt project will use. It must be one of the targets you define in your profile. Commonly it is set to `dev`.
* Populating your target:
  * `type`: The type of data warehouse you are connecting to
  * Warehouse credentials: Get these from your database administrator if you don’t already have them. Remember that user credentials are very sensitive information that should not be shared.
  * `schema`: The default schema that dbt will build objects in.
  * `threads`: The number of threads the dbt project will run on.

You can find more information on which values to use in your targets below.

:::info Validating your warehouse credentials

Use the [debug](/reference/dbt-jinja-functions/debug-method) command to check whether you can successfully connect to your warehouse. Simply run `dbt debug` from within a dbt project to test your connection.

:::

## Understanding targets in profiles

dbt supports multiple targets within one profile to encourage the use of separate development and production environments as discussed in [dbt Core Environments](/docs/core/dbt-core-environments).

A typical profile for an analyst using dbt locally will have a target named `dev`, and have this set as the default.

You may also have a `prod` target within your profile, which creates the objects in your production schema. However, since it's often desirable to perform production runs on a schedule, we recommend deploying your dbt project to a separate machine other than your local machine. Most dbt users only have a `dev` target in their profile on their local machine.

If you do have multiple targets in your profile, and want to use a target other than the default, you can do this using the `--target` option when issuing a dbt command.

## Understanding warehouse credentials

We recommend that each dbt user has their own set of database credentials, including a separate user for production runs of dbt – this helps debug rogue queries, simplifies ownerships of schemas, and improves security.

To ensure the user credentials you use in your target allow dbt to run, you will need to ensure the user has appropriate privileges. While the exact privileges needed varies between data warehouses, at a minimum your user must be able to:

* read source data
* create schemas¹
* read system <Term id="table">tables</Term>

:::info Running dbt without create schema privileges

If your user is unable to be granted the privilege to create schemas, your dbt runs should instead target an existing schema that your user has permission to create relations within.

:::

## Understanding target schemas

The target schema represents the default schema that dbt will build objects into, and is often used as the differentiator between separate environments within a warehouse.

:::info Schemas in BigQuery

dbt uses the term "schema" in a target across all supported warehouses for consistency. Note that in the case of BigQuery, a schema is actually a dataset.

:::

The schema used for production should be named in a way that makes it clear that it is ready for end-users to use for analysis – we often name this  `analytics`.

In development, a pattern we’ve found to work well is to name the schema in your `dev` target `dbt_<username>`. Suffixing your name to the schema enables multiple users to develop in dbt, since each user will have their own separate schema for development, so that users will not build over the top of each other, and ensuring that object ownership and permissions are consistent across an entire schema.

Note that there’s no need to create your target schema beforehand – dbt will check if the schema already exists when it runs, and create it if it doesn’t.

While the target schema represents the default schema that dbt will use, it may make sense to split your models into separate schemas, which can be done by using [custom schemas](/docs/build/custom-schemas).

## Understanding threads

When dbt runs, it creates a directed acyclic graph (DAG) of links between models. The number of threads represents the maximum number of paths through the graph dbt may work on at once – increasing the number of threads can minimize the run time of your project.  The default value for threads in user profiles is [4 threads](/docs/dbt-versions/release-notes/Dec-2022/default-thread-value).

For more information, check out [using threads](/docs/running-a-dbt-project/using-threads).

## Advanced: Customizing a profile directory

The parent directory for `profiles.yml` is determined using the following precedence:

<VersionBlock lastVersion="1.2">

1. `--profiles-dir` option
1. `DBT_PROFILES_DIR` environment variable
1. `~/.dbt/` directory

</VersionBlock>
<VersionBlock firstVersion="1.3">

1. `--profiles-dir` option
1. `DBT_PROFILES_DIR` environment variable
1. current working directory
1. `~/.dbt/` directory

</VersionBlock>

To check the expected location of your `profiles.yml` file for your installation of dbt, you can run the following:

```bash
$ dbt debug --config-dir
To view your profiles.yml file, run:

open /Users/alice/.dbt
```

You may want to have your `profiles.yml` file stored in a different directory than `~/.dbt/` – for example, if you are [using environment variables](#advanced-using-environment-variables) to load your credentials, you might choose to include this file in the root directory of your dbt project.

Note that the file always needs to be called `profiles.yml`, regardless of which directory it is in.

There are multiple ways to direct dbt to a different location for your `profiles.yml` file:

### 1. Use the `--profiles-dir` option when executing a dbt command
This option can be used as follows:

 ```
$ dbt run --profiles-dir path/to/directory
 ```

If using this method, the `--profiles-dir` option needs to be provided every time you run a dbt command.

### 2. Use the `DBT_PROFILES_DIR` environment variable to change the default location
Specifying this environment variable overrides the directory that dbt looks for your `profiles.yml` file in. You can specify this by running:
```
$ export DBT_PROFILES_DIR=path/to/directory
```

## Advanced: Using environment variables

Credentials can be placed directly into the `profiles.yml` file or loaded from environment variables. Using environment variables is especially useful for production deployments of dbt. You can find more information about environment variables [here](/reference/dbt-jinja-functions/env_var).

## Related docs

* [About `profiles.yml`](/docs/core/connect-data-platform/profiles.yml) to learn more about profile configuration.
