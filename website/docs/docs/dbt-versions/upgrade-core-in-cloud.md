---
title: "Upgrade Core version in Cloud"
id: "upgrade-core-in-cloud"
---

## Upgrading to the latest version of dbt in Cloud

In dbt Cloud, both jobs and environments are configured to use a specific version of dbt Core. The version can be upgraded at any time.

### Environments

Navigate to the settings page of an environment, then click **edit**. Click the **dbt Version** dropdown bar and make your selection. From this list, you can select an available version of Core to associate with this environment.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/Environment-settings.png" title="Settings of a dbt Cloud environment"/>

Be sure to save your changes before navigating away.

### Jobs

Each job in dbt Cloud can be configured to inherit parameters from the environment it belongs to.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/job-settings.png" title="Settings of a dbt Cloud job"/>

The example job seen in the screenshot above belongs to the environment "Prod". It inherits the dbt version of its environment as shown by the **Inherited from ENVIRONMENT_NAME (DBT_VERSION)** selection. You may also manually override the dbt version of a specific job to be any of the current Core releases supported by Cloud by selecting another option from the dropdown.

## Supported Versions

We have always encouraged our customers to upgrade dbt Core versions whenever a new minor version is released. We released our first major version of dbt - `dbt 1.0` - in December 2021. Alongside this release, we updated our policy on which versions of dbt Core we will support in dbt Cloud.



 > **Starting with v1.0, any subsequent minor versions will be supported in dbt Cloud for 1 year post release. At the end of the 1 year window, accounts must upgrade to a supported version of dbt or risk service disruption.**

We will continue to update this table so that customers know when we plan to stop supporting different versions of Core in dbt Cloud.

<Snippet src="core-versions-table" />


:::warning ⚠️ v0.X Non-Supported Period
 Accounts had until the end of June 2022 to upgrade to dbt 1.0 or later. Pre-dbt 1.0 versions will no longer receive patch fixes, and our support team will no longer assist with dbt version specific help on non-supported versions of dbt. Additionally, jobs running dbt versions prior to 1.0 may experience service disruptions before the end of the year and may be removed from the dbt Cloud context by year end. You will receive additional notification before any planned disruption to your production jobs.
:::

Starting in v1.0, dbt Cloud will ensure that you're always using the latest compatible patch release of `dbt-core` and plugins, including all the latest fixes. You may also choose to try prereleases of those patch releases before they are generally available.

<!--- TODO: Include language to reflect:
  - notifying users when new minor versions are available
  - notifying users when using a minor version that is nearing the end of its critical support period
  - auto-upgrading users to the subsequent minor version when critical support ends
--->

For more on version support and future releases, see [Understanding dbt Core versions](core-versions).

#### What will actually happen on the end of support date?

1 year post a minor version release of v1.X, we will try to run our users' projects on the latest release of dbt if they have not already upgraded their projects themselves. In a post dbt v1.0 world, there won't be breaking changes between minor versions of dbt, so we might be reasonably successful at upgrading our users' versions for them. However, our strong preference is for accounts to try to manage the upgrade process themselves which is a more cautious way to prevent failures to their production pipelines. We will give accounts consistent communication that they're hitting the end of their supported window, so they can plan accordingly.

#### What should you be doing today?

You should **upgrade to v1.0 as soon as you can** - and we recommend that you proceed **slowly and steadily**.

Why? Because attempting to upgrade 6 minor versions at one time (v0.15.0 —> v0.21.0) implies 6x the potential for breaking changes, versus upgrading a single minor version.

Refactoring code is much easier when you're updating a well-defined, constrained surface area. Doing things incrementally is the way to go.

Additionally upgrading to more recent versions of dbt Core will enable better performance and more features in dbt Cloud. Below is a compatability matrix between dbt versions and dbt Cloud features. Hopefully this provides more motivation to always update your environments and jobs to run the latest version of dbt.

| dbt Cloud Feature | dbt Core Version Needed |
| ------------- | -------------- |
| [Environment variable secret scrubbing](/docs/build/environment-variables#handling-secrets)| v1.0+ |
| DAG in the IDE | v0.20.0+|
| [Metadata API](/docs/dbt-cloud-apis/metadata-api) |v0.19.0+|
| [Dashboard status tiles](/docs/deploy/dashboard-status-tiles) | v0.19.0+ |
| [Slim CI](/docs/deploy/cloud-ci-job) | v0.18.0+ |

#### Need help upgrading?

If you want more advice on how to upgrade your dbt projects, check out our [migration guides](/guides/migration/versions/) and our [upgrading Q&A page](/docs/dbt-versions/upgrade-core-in-cloud#upgrading-legacy-versions-under-10).

## Upgrading legacy versions under 1.0

This Q&A guide should help you figure out what changes you might need to make to successfully upgrade your version of dbt Core in dbt Cloud. As a reminder, we recommend everyone upgrade to the most recent version of dbt, as we will not support all versions of dbt in Cloud indefinitely. We document which versions of dbt Core we support [here](docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-choosing-a-dbt-version#supported-versions).

There aren't many breaking changes between minor versions, and it may be the case that you don't need to change any code to upgrade to a newer version of dbt in dbt Cloud. There are only breaking changes between minor versions of dbt before dbt 1.0. Minor releases starting with dbt 1.0, do not have breaking code changes. If there are no code changes needed, all you have to do is [change the settings](/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-choosing-a-dbt-version.md) in your environment or job to run a more recent version of dbt.

#### Changes between minor versions of dbt that will affect your project

Below we try to help you answer the question of whether a known breaking change between minor versions of dbt will affect your project. If you answer "yes" to any of the questions below, we recommend that you read the migration guides that we've put together for every dbt minor version release.

:::info An Important Note on Packages

If you use any packages from [dbt Hub](https://hub.getdbt.com/), make sure you also upgrade to a version of the package that supports the dbt version you intend to upgrade to. You can see which dbt versions a package supports by checking on the `require-dbt-version:` in the package's dbt_project.yml file on GitHub.

As an example, dbt-utils version 0.7.6 supports dbt v0.20, v0.21, and v1.0, as described in its [dbt_project.yml](https://github.com/dbt-labs/dbt-utils/blob/0.7.6/dbt_project.yml).

After you've changed the package version in your packages.yml file, be sure to run `dbt deps` in the IDE to install the updated version.

:::

<details>
<summary>  Upgrading to v1.0.latest from v0.21 </summary>
<br></br>

:::info Universal change
Certain configurations in dbt_project.yml have been renamed
:::

Existing projects will see non-breaking deprecation warnings. You can change three lines in most projects to remove the warnings:

<File name='dbt_project.yml'>

```yml
model-paths: ["models"] # formerly named "source-paths"
seed-paths: ["data"]    # formerly named "data-paths"
clean-targets:
  - "target"
  - "dbt_packages"      # formerly named "dbt_modules"
```

</File>

- Do you select tests using the old names for test types? (`test_type:schema`, `test_type:data`, `--schema`, `--data`)
- Do you have custom macro code that calls the (undocumented) global macros `column_list`, `column_list_for_create_table`, `incremental_upsert`?
- Do you have custom scripts that parse dbt <Term id="json" /> artifacts?
- (BigQuery only) Do you use dbt's legacy capabilities around ingestion-time-partitioned tables?

If you believe your project might be affected, read more details in the migration guide [here](/guides/migration/versions/upgrading-to-v1.0).

</details>


<details>
<summary>  Upgrading to v0.21.latest from v0.20 </summary>
<br></br>

- Do you select specific sources to check freshness (`dbt snapshot-freshness --select <source_name>`)?
- Do you have custom scripts that parse dbt JSON artifacts?
- (Snowflake only) Do you have custom macros or <Term id="materialization">materializations</Term> that depend on using transactions, such as statement blocks with `auto_begin=True`?

If you believe your project might be affected, read more details in the migration guide [here](/guides/migration/versions).

</details>



<details>
<summary>  Upgrading to v0.20.latest from v0.19 </summary>
<br></br>

- Does your project define any custom schema tests?
- Does your project use `adapter.dispatch` or the `spark_utils` package?
- Do you have custom scripts that parse dbt JSON artifacts?

If you believe your project might be affected, read more details in the migration guide [here](/guides/migration/versions).

</details>



<details>
<summary>  Upgrading to v0.19.latest from v0.18 </summary>
<br></br>
<div>

:::info Important   

If you have not already, you must add `config-version: 2` to your dbt_project.yml file.
See **Upgrading to v0.17.latest from v0.16** below for more details.

:::
</div>


- Do you have custom scripts that parse dbt JSON artifacts?
- Do you have any custom materializations?

If you believe your project might be affected, read more details in the migration guide [here](/guides/migration/versions).

</details>


<details>
<summary>  Upgrading to v0.18.latest from v0.17 </summary>
<br></br>

- Do you directly call `adapter_macro`?

If you believe your project might be affected, read more details in the migration guide [here](/guides/migration/versions).

</details>



<details>
<summary>  Upgrading to v0.17.latest from v0.16 </summary>
<br></br>
<div>

:::info Universal change

You must add `config-version: 2` to your dbt_project.yml file.
:::
</div>

<File name='dbt_project.yml'>

```yml
name: my_project
version: 1.0.0

config-version: 2

vars:
  my_var: 1
  another_var: true

models:
  ...
```

</File>

<div>

:::info Universal change

`vars:` are now defined not in your `models:` but are a separate section in dbt_project.yml file.
:::
</div>


<File name='dbt_project.yml'>

```yml
name: my_project
version: 1.0.0

config-version: 2

vars:
  my_var: 1
  another_var: true

models:
  ...
```

</File>


- Do you have dictionary configs in your dbt_project.yml such as `partition_by` or `persist_docs`? If yes, you need to add a preceding +.

<File name='dbt_project.yml'>

```yml

models:
  my_project:
    reporting:
      +partition_by:
        field: date_day
        data_type: timestamp
```
</File>

If you believe your project might be affected, read more details in the migration guide [here](/guides/migration/versions).

</details>


<details>
<summary>  Upgrading to v0.16.latest from v0.15 </summary>
<br></br>

- Do you use the custom `generate_schema_name` macro?
- Do you use `partition_by` config for BigQuery models?

If you believe your project might be affected, read more details in the migration guide [here](/guides/migration/versions).
</details>


<details>
<summary>  Upgrading to v0.15.latest from v0.14 </summary>

<br></br>

- Do you have a custom materialization?
- Do you have a macro that accesses `Relations` directly?

If you believe your project might be affected, read more details in the migration guide [here](/guides/migration/versions).
</details>

<details>
<summary>  Upgrading to v0.14.latest from v0.13 </summary>
<br></br>

- Do you still use `Archives`?
- Do you use the custom `generate_schema_name` macro?
- Do you use the `—non-destructive` flag?

If you believe your project might be affected, read more details in the migration guide [here](/guides/migration/versions).
</details>


#### Testing your changes before upgrading
Once you have an idea about what code changes you'll need to make, you can start implementing them. We recommend that you create a separate dbt project, **Upgrade Project**, to test your changes before making them live in your main dbt project. In your **Upgrade Project**, connect to the same repository that you use for your main dbt project, but this time, set the development environment [settings](docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-choosing-a-dbt-version) to run the latest version of dbt Core. Next check out a branch `dbt-version-upgrade`, make the appropriate updates to your project (if needed), and see if your dbt project compiles and runs with the new version of dbt in the IDE. If jumping directly to the latest version of dbt is too far of a leap for your project, try iteratively getting your project to work on each successive minor version. There are years of development and a handful of breaking changes between two distant versions of dbt (e.g. 0.14 --> 1.0). There are far fewer between two subsequent versions of dbt, which is why upgrading regularly is important.

Once you have your project compiling and running on the latest version of dbt in the development environment for your `dbt-version-upgrade` branch, try replicating one of your production jobs to run off your branch's code. You can do this by creating a new deployment environment for testing, setting the custom branch to 'ON' and referencing your `dbt-version-upgrade` branch. You'll also need to set the dbt version in this environment to the latest dbt Core version.



<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-upgrading-dbt-versions/upgrade-environment.png" title="Setting your testing environment" />


Then add a job to the new testing environment that replicates one of the production jobs your team relies on. If that job runs smoothly, you should be all set to merge your branch into main and change your development and deployment environments in your main dbt project to run off the newest version of dbt Core.
