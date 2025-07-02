---
title: "Upgrade dbt version in Cloud"
id: "upgrade-dbt-version-in-cloud"
---

import FusionDWH from '/snippets/_fusion-dwh.md';

In <Constant name="cloud" />, both [jobs](/docs/deploy/jobs) and [environments](/docs/dbt-cloud-environments) are configured to use a specific version of <Constant name="core" />. The version can be upgraded at any time.

## Environments

Navigate to the settings page of an environment, then click **Edit**. Click the **dbt version** dropdown bar and make your selection. You can select a [release track](#release-tracks) to receive ongoing updates (recommended), or a legacy version of <Constant name="core" />. Be sure to save your changes before navigating away.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/example-environment-settings.png" width="90%" title="Example environment settings in dbt"/>

### Release Tracks

Starting in 2024, your project will be upgraded automatically on a cadence that you choose

The **Latest** track ensures you have up-to-date <Constant name="cloud" /> functionality, and early access to new features of the dbt framework. The **Compatible** and **Extended** tracks are designed for customers who need a less-frequent release cadence, the ability to test new dbt releases before they go live in production, and/or ongoing compatibility with the latest open source releases of <Constant name="core" />.

As a best practice, dbt Labs recommends that you test the upgrade in development first; use the [Override dbt version](#override-dbt-version) setting to test _your_ project on the latest dbt version before upgrading your deployment environments and the default development environment for all your colleagues.

To upgrade an environment in the [<Constant name="cloud" /> Admin API](/docs/dbt-cloud-apis/admin-cloud-api) or [Terraform](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest), set `dbt_version` to the name of your release track:
- `latest` (formerly called `versionless`; the old name is still supported)
- `compatible` (available to Starter, Enterprise, Enterprise+ plans)
- `extended` (available to all Enterprise plans)

### Override dbt version

Configure your project to use a different dbt version than what's configured in your [development environment](/docs/dbt-cloud-environments#types-of-environments). This _override_ only affects your user account, no one else's. Use this to safely test new dbt features before upgrading the dbt version for your projects. 

1. Click your account name from the left side panel and select **Account settings**. 
2. Choose **Credentials** from the sidebar and select a project. This opens a side panel.
3. In the side panel, click **Edit** and scroll to the **User development settings** section. 
4. Choose a version from the **dbt version** dropdown and click **Save**.

  An example of overriding the configured version to ["Latest" release track](/docs/dbt-versions/cloud-release-tracks) for the selected project:

  <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/example-override-version.png" width="60%" title="Example of overriding the dbt version on your user account"/>

5. (Optional) Verify that <Constant name="cloud" /> will use your override setting to build the project by invoking a `dbt build` command in the <Constant name="cloud_ide" />'s command bar. Expand the **System Logs** section and find the output's first line. It should begin with `Running with dbt=` and list the version <Constant name="cloud" /> is using. <br /><br />
   For users on Release tracks, the output will display `Running dbt...` instead of a specific version, reflecting the flexibility and continuous automatic updates provided by the release track functionality.

## Jobs

Each job in <Constant name="cloud" /> can be configured to inherit parameters from the environment it belongs to.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/job-settings.png" width="200%" title="Settings of a dbt job"/>

The example job seen in the screenshot above belongs to the environment "Prod". It inherits the dbt version of its environment as shown by the **Inherited from ENVIRONMENT_NAME (DBT_VERSION)** selection. You may also manually override the dbt version of a specific job to be any of the current Core releases supported by Cloud by selecting another option from the dropdown.

## Supported versions

dbt Labs has always encouraged users to upgrade dbt Core versions whenever a new minor version is released. We released our first major version of dbt - `dbt 1.0` - in December 2021. Alongside this release, we updated our policy on which versions of dbt Core we will support in the <Constant name="dbt_platform" />.

> **Starting with v1.0, all subsequent minor versions are available in <Constant name="cloud" />. Versions are actively supported, with patches and bug fixes, for 1 year after their initial release. At the end of the 1-year window, we encourage all users to upgrade to a newer version for better ongoing maintenance and support.**

We provide different support levels for different versions, which may include new features, bug fixes, or security patches:

<Snippet path="core-version-support" />

We'll continue to update the following release table so that users know when we plan to stop supporting different versions of Core in <Constant name="cloud" />.

<Snippet path="core-versions-table" />

Starting with v1.0, <Constant name="cloud" /> will ensure that you're always using the latest compatible patch release of `dbt-core` and plugins, including all the latest fixes. You may also choose to try prereleases of those patch releases before they are generally available.

<!--- TODO: Include language to reflect:
  - notifying users when new minor versions are available
  - notifying users when using a minor version that is nearing the end of its critical support period
  - auto-upgrading users to the subsequent minor version when critical support ends
--->

For more on version support and future releases, see [Understanding <Constant name="core" /> versions](/docs/dbt-versions/core).

### dbt Fusion engine

dbt Labs has introduced the new [dbt Fusion engine](/docs/fusion/about-fusion), a ground-up rebuild of dbt. This is currently in beta on the dbt platform. Eligible customers can update environments to Fusion using the same workflows as v1.x, but there are a few things to keep in mind:
- **To gain access to the Fusion Latest release track, you must reach out to your dbt Labs account team to request it. Week by week we'll expand the beta cohort based on project eligibility, including Starter plans**. Once we transition from Beta to Preview, all users will see it as an option for their environments, projects, jobs, etc.


 To increase the compatibility of your project, update all jobs and environments to the `Latest` release track and follow our [upgrade guide](/docs/dbt-versions/core-upgrade/upgrading-to-fusion). 
- There are some significant changes, these can also be found in the [upgrade guide](/docs/dbt-versions/core-upgrade/upgrading-to-fusion).
- Make sure you're using a supported adapter and authentication method:
  <FusionDWH /> 
- When you change your development environment(s) to `Fusion Latest`, every user will have to restart the IDE.


  <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-upgrading-dbt-versions/upgrade-fusion.png" width="90%" title="Upgrade to the Fusion engine in your environment settings." />


### Need help upgrading?

If you want more advice on how to upgrade your dbt projects, check out our [migration guides](/docs/dbt-versions/core-upgrade/) and our [upgrading Q&A page](/docs/dbt-versions/upgrade-dbt-version-in-cloud#upgrading-legacy-versions-under-10).


### Testing your changes before upgrading

Once you know what code changes you'll need to make, you can start implementing them. We recommend you:
- Create a separate dbt project, "Upgrade project", to test your changes before making them live in your main dbt project.
- In your "Upgrade project", connect to the same repository you use for your production project.
- Set the development environment [settings](/docs/dbt-versions/upgrade-dbt-version-in-cloud) to run the latest version of <Constant name="core" />.
- Check out a branch `dbt-version-upgrade`, make the appropriate updates to your project, and verify your dbt project compiles and runs with the new version in the <Constant name="cloud_ide" />.
  - If upgrading directly to the latest version results in too many issues, try testing your project iteratively on successive minor versions. There are years of development and a few breaking changes between distant versions of <Constant name="core" /> (for example, 1.0 --> 1.10). The likelihood of experiencing problems upgrading between successive minor versions is much lower, which is why upgrading regularly is recommended.
- Once you have your project compiling and running on the latest version of dbt in the development environment for your `dbt-version-upgrade` branch, try replicating one of your production jobs to run off your branch's code.
- You can do this by creating a new deployment environment for testing, setting the custom branch to 'ON' and referencing your `dbt-version-upgrade` branch. You'll also need to set the dbt version in this environment to the latest dbt Core version.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-upgrading-dbt-versions/upgrade-environment.png" width="90%" title="Setting your testing environment" />

- Then add a job to the new testing environment that replicates one of the production jobs your team relies on.
  - If that job runs smoothly, you should be all set to merge your branch into main. 
  - Then change your development and deployment environments in your main dbt project to run off the newest version of <Constant name="core" />.
