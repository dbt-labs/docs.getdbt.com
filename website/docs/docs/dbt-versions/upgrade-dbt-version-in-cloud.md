---
title: "Upgrade dbt version in Cloud"
id: "upgrade-dbt-version-in-cloud"
---

In dbt Cloud, both [jobs](/docs/deploy/jobs) and [environments](/docs/dbt-cloud-environments) are configured to use a specific version of dbt Core. The version can be upgraded at any time.

## Environments

Navigate to the settings page of an environment, then click **Edit**. Click the **dbt version** dropdown bar and make your selection. You can select a previous release of dbt Core or go [**Versionless**](#versionless) (recommended). Be sure to save your changes before navigating away.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/example-environment-settings.png" width="90%" title="Example environment settings in dbt Cloud"/>

### Versionless

By choosing to go **Versionless**, you opt for an experience that provides the latest features and early access to new functionality for your dbt project. dbt Labs will handle upgrades for you, as part of testing and redeploying the dbt Cloud SaaS application. Versionless always includes the most recent features before they're in dbt Core, and more.

You can upgrade to the **Versionless** experience no matter which version of dbt you currently have selected. As a best practice, dbt Labs recommends that you test the upgrade in development first; use the [Override dbt version](#override-dbt-version) setting to test _your_ project on the latest dbt version before upgrading your deployment environments and the default development environment for all your colleagues.

To upgrade an environment in the [dbt Cloud Admin API](/docs/dbt-cloud-apis/admin-cloud-api) or [Terraform](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest), set `dbt_version` to the string `versionless`.

### Override dbt version

Configure your project to use a different dbt Core version than what's configured in your [development environment](/docs/dbt-cloud-environments#types-of-environments). This _override_ only affects your user account, no one else's. Use this to safely test new dbt features before upgrading the dbt version for your projects. 

1. Click your account name from the left side panel and select **Account settings**. 
1. Choose **Credentials** from the sidebar and select a project. This opens a side panel.
1. In the side panel, click **Edit** and scroll to the **User development settings** section. Choose a version from the **dbt version** dropdown and click **Save**.

  An example of overriding the configured version with 1.7 for the selected project:

  <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/example-override-version.png" width="60%" title="Example of overriding the dbt version on your user account"/>

1. (Optional) Verify that dbt Cloud will use your override setting to build the project. Invoke `dbt build` in the IDE's command bar. Expand the **System Logs** section and find the output's first line. It should begin with `Running with dbt=` and list the version dbt Cloud is using.

  Example output of a successful `dbt build` run: 

  <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/example-verify-overridden-version.png" title="Example output showing version 1.7 being used, not 1.5"/>

## Jobs

Each job in dbt Cloud can be configured to inherit parameters from the environment it belongs to.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/job-settings.png" width="200%" title="Settings of a dbt Cloud job"/>

The example job seen in the screenshot above belongs to the environment "Prod". It inherits the dbt version of its environment as shown by the **Inherited from ENVIRONMENT_NAME (DBT_VERSION)** selection. You may also manually override the dbt version of a specific job to be any of the current Core releases supported by Cloud by selecting another option from the dropdown.

## Supported versions

dbt Labs has always encouraged users to upgrade dbt Core versions whenever a new minor version is released. We released our first major version of dbt - `dbt 1.0` - in December 2021. Alongside this release, we updated our policy on which versions of dbt Core we will support in dbt Cloud.

> **Starting with v1.0, all subsequent minor versions are available in dbt Cloud. Versions are actively supported, with patches and bug fixes, for 1 year after their initial release. At the end of the 1-year window, we encourage all users to upgrade to a newer version for better ongoing maintenance and support.**

We provide different support levels for different versions, which may include new features, bug fixes, or security patches:

<Snippet path="core-version-support" />

We'll continue to update the following release table so that users know when we plan to stop supporting different versions of Core in dbt Cloud.

<Snippet path="core-versions-table" />

Starting with v1.0, dbt Cloud will ensure that you're always using the latest compatible patch release of `dbt-core` and plugins, including all the latest fixes. You may also choose to try prereleases of those patch releases before they are generally available.

<!--- TODO: Include language to reflect:
  - notifying users when new minor versions are available
  - notifying users when using a minor version that is nearing the end of its critical support period
  - auto-upgrading users to the subsequent minor version when critical support ends
--->

For more on version support and future releases, see [Understanding dbt Core versions](/docs/dbt-versions/core).

#### Need help upgrading?

If you want more advice on how to upgrade your dbt projects, check out our [migration guides](/docs/dbt-versions/core-upgrade/) and our [upgrading Q&A page](/docs/dbt-versions/upgrade-dbt-version-in-cloud#upgrading-legacy-versions-under-10).

## Upgrading legacy versions under 1.0

You can use the following sections to successfully upgrade your version of dbt Core in dbt Cloud. We recommend everyone upgrade to the most recent version of dbt Core, as new versions contain enhancements, bug fixes, and updated security features. We document which [versions of dbt Core are currently supported](/docs/dbt-versions/upgrade-dbt-version-in-cloud#supported-versions).

There aren't many breaking changes between minor versions, and it may be the case that you don't need to change any code to upgrade to a newer version of dbt in dbt Cloud. There are only breaking changes between minor versions of dbt before dbt 1.0. Minor releases starting with dbt 1.0, do not have breaking code changes. If there are no code changes needed, all you have to do is [change the settings](/docs/dbt-versions/upgrade-dbt-version-in-cloud#upgrading-to-the-latest-version-of-dbt-in-cloud) in your environment or job to run a more recent version of dbt.

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

If you believe your project might be affected, read more details in the migration guide [here](/docs/dbt-versions/core-upgrade/Older%20versions/upgrading-to-v1.0).

</details>


<details>
<summary>  Upgrading to v0.21.latest from v0.20 </summary>
<br></br>

- Do you select specific sources to check freshness (`dbt snapshot-freshness --select <source_name>`)?
- Do you have custom scripts that parse dbt JSON artifacts?
- (Snowflake only) Do you have custom macros or <Term id="materialization">materializations</Term> that depend on using transactions, such as statement blocks with `auto_begin=True`?

If you believe your project might be affected, read more details in the migration guide [here](/docs/dbt-versions/core-upgrade).

</details>



<details>
<summary>  Upgrading to v0.20.latest from v0.19 </summary>
<br></br>

- Does your project define any custom schema tests?
- Does your project use `adapter.dispatch` or the `spark_utils` package?
- Do you have custom scripts that parse dbt JSON artifacts?

If you believe your project might be affected, read more details in the migration guide [here](/docs/dbt-versions/core-upgrade).

</details>



<details>
<summary>  Upgrading to v0.19.latest from v0.18 </summary>
<br></br>
<div>

</div>


- Do you have custom scripts that parse dbt JSON artifacts?
- Do you have any custom materializations?

If you believe your project might be affected, read more details in the migration guide [here](/docs/dbt-versions/core-upgrade).

</details>


<details>
<summary>  Upgrading to v0.18.latest from v0.17 </summary>
<br></br>

- Do you directly call `adapter_macro`?

If you believe your project might be affected, read more details in the migration guide [here](/docs/dbt-versions/core-upgrade).

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

If you believe your project might be affected, read more details in the migration guide [here](/docs/dbt-versions/core-upgrade).

</details>


<details>
<summary>  Upgrading to v0.16.latest from v0.15 </summary>
<br></br>

- Do you use the custom `generate_schema_name` macro?
- Do you use `partition_by` config for BigQuery models?

If you believe your project might be affected, read more details in the migration guide [here](/docs/dbt-versions/core-upgrade).
</details>


<details>
<summary>  Upgrading to v0.15.latest from v0.14 </summary>

<br></br>

- Do you have a custom materialization?
- Do you have a macro that accesses `Relations` directly?

If you believe your project might be affected, read more details in the migration guide [here](/docs/dbt-versions/core-upgrade).
</details>

<details>
<summary>  Upgrading to v0.14.latest from v0.13 </summary>
<br></br>

- Do you still use `Archives`?
- Do you use the custom `generate_schema_name` macro?
- Do you use the `—non-destructive` flag?

If you believe your project might be affected, read more details in the migration guide [here](/docs/dbt-versions/core-upgrade).
</details>


#### Testing your changes before upgrading
Once you know what code changes you'll need to make, you can start implementing them. We recommend you create a separate dbt project, **Upgrade Project**, to test your changes before making them live in your main dbt project. In your **Upgrade Project**, connect to the same repository you use for your production project. This time, set the development environment [settings](/docs/dbt-versions/upgrade-dbt-version-in-cloud) to run the latest version of dbt Core. Next, check out a branch `dbt-version-upgrade`, make the appropriate updates to your project, and verify your dbt project compiles and runs with the new version in the IDE. If upgrading directly to the latest version results in too many issues, try testing your project iteratively on successive minor versions. There are years of development and a few breaking changes between distant versions of dbt Core (for example, 0.14 --> 1.0). The likelihood of experiencing problems upgrading between successive minor versions is much lower, which is why upgrading regularly is recommended.

Once you have your project compiling and running on the latest version of dbt in the development environment for your `dbt-version-upgrade` branch, try replicating one of your production jobs to run off your branch's code. You can do this by creating a new deployment environment for testing, setting the custom branch to 'ON' and referencing your `dbt-version-upgrade` branch. You'll also need to set the dbt version in this environment to the latest dbt Core version.



<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-upgrading-dbt-versions/upgrade-environment.png" title="Setting your testing environment" />


Then add a job to the new testing environment that replicates one of the production jobs your team relies on. If that job runs smoothly, you should be all set to merge your branch into main and change your development and deployment environments in your main dbt project to run off the newest version of dbt Core.
