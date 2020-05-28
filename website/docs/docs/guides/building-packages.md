---
title: "Building packages"
id: "building-packages"
---

## What are packages?

Modern programming is collaborative, both within organizations and across them. Until somewhat recently, collaboration has eluded the analyst community. The advent of data warehouses like Redshift, Snowflake, and BigQuery make it possible to funnel all of an organization's data into a single place. Further, ETL-as-a-service tools replicate data into these warehouses in a (mostly) uniform way. Raw Mailchimp data has roughly the same schema for every company using Mailchimp.

dbt packages are self-contained collections of models, tests, macros, and so on, that make it easier to conduct data modeling. Some packages, like [Mailchimp](https://github.com/fishtown-analytics/mailchimp) are dataset-specific. Other packages like [dbt-utils](https://github.com/fishtown-analytics/dbt-utils) are dataset-agnostic and instead provide helpful macros for implementing common data transformations. These packages can be [pulled into your dbt project](package-management)  as *dependencies*, giving your project access to all of the models, macros, and tests defined within them.

## Creating a dbt package

Since dbt packages are just projects intended for general use, the two are created and configured similarly. To create a new dbt package, use the `dbt init` command:

```shell
# create a package in the project_name/ directory
dbt init [project_name]
```

This will start you off with a couple of key files and directories, namely:

**Files:**
- `README.md`
- `dbt_project.yml`


**Directories:**
- `models/`
- `macros/`
- `tests/`
- `analysis/`

First, open the `README.md` file and edit the contents to reflect the name of your package, and its intended purpose.

Next, open the `dbt_project.yml` file. You should change a few things here before you begin creating other files in this package.

1. Change the `name` option to be something descriptive for your package. Make sure the name is all lowercase, and only contains the letters `a-z` and `_`.
2. Set the `version` option to be `0.0.1`. This field is currently unused by dbt, but will become significant in the future.
3. Set the `profile` value to the same value you used for `name` above. This will require you to make a new entry in your `~/.dbt/profiles.yml` file.
4. Remove any superfluous configurations in the `models:` configuration.

Assuming you're working on a Mailchimp package, your `dbt_project.yml` file should look like this:

<File name='dbt_project.yml'>

```yaml
name: 'mailchimp'
version: '0.0.1'

# HEY! Make sure you have a `mailchimp` profile
#       defined in ~/.dbt/profiles.yml
profile: 'mailchimp'

source-paths: ["models"]
analysis-paths: ["analysis"]
test-paths: ["tests"]
data-paths: ["data"]
macro-paths: ["macros"]

target-path: "target"
clean-targets:
    - "target"
    - "dbt_modules"

models:
```

</File>

And your `~/.dbt/profiles.yml` file should look like this:

<File name='~/.dbt/profiles.yml'>

```yaml

...

# Place this at the bottom of your `~/.dbt/profiles.yml` file,
# below any other profiles that you've already defined

# Use the value you set for `profile:` in the `dbt_project.yml` file here
mailchimp:
  target: dev
  outputs:
    dev:
      type: xxx
      host: xxx
      user: xxx
      pass: xxx
      port: xxx
      dbname: xxx
      schema: package_mailchimp # call this whatever makes sense for you
```

</File>

Once these files are set up, you're ready to begin adding models, tests, macros, and so on, to your package!

## Building a dbt package

dbt packages can contain any of the dbt constructs that you're already familiar with: models, tests, analyses, macros, and even other dependencies! Since the rest of this website is dedicated to explaining these topics, an in-depth explanation of them will not be given here. Instead, this section will outline some of the best-practices we've encountered to-date while building dozens of open-source packages.

<Callout type="info" title="">

Have a tip you don't see here? Feel free to suggest an edit!

</Callout>

**1. Keep it generic**

The code in your package should be specific to a given dataset, topic, or domain. A Mailchimp package should only contain models that transform raw Mailchimp data, for instance.

**2. Use variables to point to raw data**

ETL services often allow users to configure the schema in which their data resides. For that reason, it's a bad idea to hardcode raw data tables (eg. `"mailchimp"."campaigns"`) in your base models. Instead, select from [vars](var) in your base models so end-users can point your package to their source data. You can find an example of variable configuration [here](https://github.com/fishtown-analytics/mailchimp/blob/master/dbt_project.yml#L12). The base model SQL should look something like this:

<File name='models/base/mailchimp_base_campaigns.sql'>

```sql
{{ config(materialized='ephemeral') }}

select * from {{ var('mailchimp:campaigns_table') }}
```

</File>

**3. Install upstream packages from dbt Hub**

If your package relies on another package (for example, you use some of the cross-database macros from [dbt-utils](https://hub.getdbt.com/fishtown-analytics/dbt_utils/latest/), see below), we recommend you install the package from [dbt Hub](https://hub.getdbt.com), specifying a version range like so:

<File name='packages.yml'>

```yaml
packages:
  - package: fishtown-analytics/dbt_utils
    version: ">0.1.23"
```

</File>

When packages are installed from dbt Hub, dbt is able to handle duplicate dependencies – using a range of versions helps prevent version conflicts.

**4. Implement cross-database compatibility**

Many SQL functions are specific to a particular database. For example, the function name and order of arguments to calculate the difference between two dates varies between Redshift, Snowflake and BigQuery, and no similar function exists on Postgres! To help with this, we've made a number of macros that compile to valid SQL snippets on each of our [fully supported databases](supported-databases) – check them out [here](https://github.com/fishtown-analytics/dbt-utils#cross-database). While we generally don't recommend you implement these in a project designed for one warehouse, we do recommend you use them in a package that will be used on multiple data warehouses.

**5. Prefix model names**

Many datasets have a concept of a "user" or "account" or "session". To make sure things are unambiguous in dbt, prefix all of your models with `[package_name]_`. For example, `mailchimp_campaigns.sql` is a good name for a model, whereas `campaigns.sql` is not.

**6. Default to views**

dbt makes it possible for users of your package to override your model materialization settings. In general, default to materializing models as `view`s instead of `table`s. Base models, as always, should be materialized as `ephemeral`.

**7. Test your models**

It's critical that you [test](building-a-dbt-project/tests) your models using both schema tests and, when appropriate, custom data tests. This will give your end users confidence that your package is actually working on top of their dataset as intended.

## Documenting a dbt package

The better documented your package is, the more likely it is that other people will use it! Good package docs include:
- An index of important models along with a short description of the model if necessary
- A picture of the package's dependency graph generated via your project's [documentation website](documentation).
- A list of any `var`s required by the package along with a short description of the variable

An example of good package documentation can be found [here](https://github.com/fishtown-analytics/snowplow).

## Releasing a dbt package

To "release" your package, simply push your code to a public GitHub repo. This repo can either belong to your personal GitHub account or the organization that you represent. Once this code is live and public on GitHub, other dbt users can import the package into their own dbt projects. Hooray for open source!

In the future, you may need to update your package. If these changes mutate the interfaces for models, macros, or variables defined in your project, then these are called "breaking changes".

Breaking changes are sometimes necessary, but they can be unpleasant for end-users. To avoid headaches here, you should create a [release](https://help.github.com/articles/creating-releases/) in GitHub for each new version of your package. If you do this, then end-users can include a specific version of your package and upgrade to newer version when they're ready.

<Callout type="info" title="ProTip">

Name your releases something like `0.1` or `2.9` so users can include it with:
```yml
packages:
- git: https://github.com/fishtown-analytics/my-new-package.git
  revision: 0.1
```

</Callout>

Each release should contain an overview of the changes introduced in the new version. Be sure to call out any changes that break the existing interface!

## Promoting your dbt package

After releasing your dbt package on GitHub, be sure to let people know about it! The best way to do this is by posting about it on [dbt Discourse](https://discourse.getdbt.com).
