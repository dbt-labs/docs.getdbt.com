---
title: "Upgrading dbt versions in cloud"
id: "cloud-upgrading-dbt-versions"
---

This Q&A guide should help you figure out what changes you might need to make to successfully upgrade your version of dbt Core in dbt Cloud. As a reminder, we recommend everyone upgrade to the most recent version of dbt, as we will not support running all versions of dbt in Cloud indefinitely. We document which versions of dbt Core we support [here](docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-choosing-a-dbt-version#supported-versions). 

There aren't many breaking changes between versions, and it may be the case that you don't need to change any code to upgrade to a newer version of dbt in dbt Cloud. You may only need to change the settings in your environment or job to call a more recent version of dbt - directions to do so can be found [here](/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-choosing-a-dbt-version.md).


### How to run the latest version of dbt in Cloud

To get started, read the next section to figure out if your project might be affected when upgrading to a newer version of dbt. This should help you identify what changes, if any, you'll need to make. 

#### Changes between minor versions of dbt that will affect your project

Below we try to help you answer the question of whether a known breaking change between minor versions of dbt will affect your project. If you answer "yes" to any of the questions below, we recommend that you read the migration guides that we've put together for every dbt minor version release.

:::caution An Important Note on Packages

If you use any packages from [dbt Hub]([https://hub.getdbt.com/](https://hub.getdbt.com/)), make sure you also upgrade to a version of the package that supports the dbt version you intend to upgrade to. You can see which dbt versions a package supports by checking on the `require-dbt-version:` in the package's dbt_project.yml file on Github. As an example dbt-utils version 0.7.1 supports dbt v0.20.0 to v0.21.x, as described in its [dbt_project.yml]([https://github.com/dbt-labs/dbt-utils/blob/0.7.1/dbt_project.yml](https://github.com/dbt-labs/dbt-utils/blob/0.7.1/dbt_project.yml)). Importantly, after you've changed the package version in your packages.yml file, be sure to run `dbt deps` in the IDE; otherwise dbt will not know to clone the a different version of the package and will likely give an error message.

:::


<details>
<summary>  Upgrading to v0.20.0 from v0.19.x </summary>

- Does your project define any custom schema tests?
- Does your project use `adapter.dispatch` or the `spark_utils` package?
- Do you have custom scripts that parse dbt JSON artifacts?

If you believe your project might be affected, read more details in the migration guide [here](/docs/guides/migration-guide/upgrading-to-0-20-0).

</details>



<details>
<summary>  Upgrading to v0.19.0 from v0.18.x </summary>

<div>

:::info Important   

If you have not already, you must add `config-version: 2` to your dbt_project.yml file.

:::
</div>


- Do you have custom scripts that parse dbt JSON artifacts?
- Do you have any custom materializations?

If you believe your project might be affected, read more details in the migration guide [here](/docs/guides/migration-guide/upgrading-to-0-19-0).

</details>


<details>
<summary>  Upgrading to v0.18.0 from v0.17.x </summary>

- Do you directly call `adapter_macro`?

If you believe your project might be affected, read more details in the migration guide [here](/docs/guides/migration-guide/upgrading-to-0-18-0).

</details>



<details>
<summary>  Upgrading to v0.17.0 from v0.16.x </summary>
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

If you believe your project might be affected, read more details in the migration guide [here](/docs/guides/migration-guide/upgrading-to-0-17-0).

</details>


<details>
<summary>  Upgrading to v0.16.0 from v0.15.x </summary>

- Do you use the custom `generate_schema_name` macro?
- Do you use `partition_by` config for BigQuery models?

If you believe your project might be affected, read more details in the migration guide [here](/docs/guides/migration-guide/upgrading-to-0-16-0).
</details>


<details>
<summary>  Upgrading to v0.15.0 from v0.14.x </summary>

- Do you have a custom materialization?
- Do you have a macro that accesses `Relations` directly?

If you believe your project might be affected, read more details in the migration guide [here](/docs/guides/migration-guide/upgrading-to-0-15-0).
</details>

<details>
<summary>  Upgrading to v0.14.0 from v0.13.x </summary>

- Do you still use `Archives`?
- Do you use the custom `generate_schema_name` macro?
- Do you use the `—non-destructive` flag?

If you believe your project might be affected, read more details in the migration guide [here](/docs/guides/migration-guide/upgrading-to-0-14-0).
</details>


#### Testing your changes before upgrading
Once you have an idea about what code changes you'll need to make, you can start implementing them in your development environment. You'll first need to [change the project's development environment settings](docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-choosing-a-dbt-version#supported-versions) to run the latest version of dbt. Next check out a branch `dbt-version-upgrade`, make the appropriate updates to your project, and see if your dbt project compiles and runs with the new version of dbt in the IDE. If jumping directly to the latest version of dbt is too far of a leap for your project, try iteratively getting your project to work on each successive version between the version you're currently running and the latest release of dbt. While there may be a handful of changes between two distant versions of dbt, there shouldn't be many between two subsequent versions of dbt, which is why upgrading regularly is important.

Once you have your project compiling and running on the latest version of dbt in the development environment for your `dbt-version-upgrade` branch, try replicating one of your production jobs to run off your branch's code. You can do this by creating a new environment for testing, setting the custom branch to 'ON' and referencing your `dbt-version-upgrade` branch. You'll also need to set the dbt version in this environment to the latest dbt version. 



<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-upgrading-dbt-versions/custom-branch.png" title="Setting your testing environment" />


Then add a job to the new testing environment that replicates one of the production jobs your team relies on. If that job runs smoothly, you should be all set to merge your branch into main and change your deployment environments to run off the newest version of dbt core.

