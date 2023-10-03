---
title: Installing the dbt Cloud CLI (Beta)
id: cloud-cli-installation
description: "Instructions for installing and configuring dbt Cloud CLI"
---

:::warning Beta functionality 

The following installation instructions are for the dbt Cloud CLI, currently in Beta (actively in development).

::: 

## About the Cloud CLI

The Cloud CLI lets your run dbt commands against your dbt Cloud development environment from your local command line.

dbt commands are run against dbt Cloud's infrastructure and benefit from:

* Secure credential storage in the dbt Cloud platform.
* Automatic deferral of build artifacts to your Cloud project's production environment. 
* Speedier, lower cost builds.
* Significant platform improvements, to be released over the coming months.

After installing, you invoke the Cloud CLI the same way you would call dbt Core.  For example, to compile a project using dbt Cloud:

```bash
dbt deps
dbt compile
```


## Installing the dbt Cloud CLI

:::caution

For compatibility, both the Cloud CLI and dbt Core are invoked by running `dbt`. This can cause a path conflict, where your OS invokes either the Cloud CLI or dbt Core depending on it's presence in your $PATH environment variable.

If you have dbt Core installed locally, ensure that you either deactivate your Python environment or uninstall before proceeding.  Alternatively, advanced users can modify the $PATH environment variable to correctly point to the dbt Cloud CLI binary to use both the Cloud CLI and dbt Core together.

You can always uninstall the Cloud CLI to return to using dbt Core.
:::

### Install and update with Brew - MacOS

1. Verify that there is no conflict with a dbt Core installation on your system. 

```bash
which dbt
# Should return "dbt not found"
```

If the dbt help text appears, deactivate your current dbt Core install.

2. Install the dbt Cloud CLI with Brew: 

```bash
brew tap dbt-labs/dbt-cli
brew install dbt-cloud-cli
```

3. Verify the installation. If the help text does not indicate that you're using the dbt Cloud CLI, make sure you've deactivated your pyenv or venv and do not have a version of dbt globally installed.

```bash
dbt --help
```

#### Updating your dbt Cloud installation - MacOS

Run `brew upgrade dbt-cloud-cli` to update the Cloud CLI.  During the beta period, we recommend updating before filing a bug report, as the API is subject to breaking changes!


### Manually install - Windows

1. Download the latest Windows release for your platform from [GitHub](https://github.com/dbt-labs/dbt-cli/releases).

2. Extract the `dbt-cloud-cli.exe` file into the same folder as your dbt project.

:::info

Advanced users can configure multiple projects to use the same Cloud CLI executeable by placing the executeable in the Program Files folder and [adding the Cloud CLI executeable to their Windows PATH environment variable](https://medium.com/@kevinmarkvi/how-to-add-executables-to-your-path-in-windows-5ffa4ce61a53).

Note that if you are using VS Code, you'll need to restart your IDE to pick up modified environment variables.
:::

#### Updating your dbt Cloud installation - Windows

Follow the same process in [Installing dbt Cloud CLI](#manually-install-windows-only) and replace the existing `dbt` executable with the new one. During the beta period, we recommend updating before filing a bug report, as the API is subject to breaking changes!

### Manually install - Linux 

1. Download the latest Linux release for your platform from [GitHub](https://github.com/dbt-labs/dbt-cli/releases).

2. Extract the `dbt-cloud-cli` binary to the same folder as your dbt project.

```bash
tar -xf dbt_0.29.9_linux_amd64.tar.gz
dbt --version
```

:::info

Advanced users can configure multiple projects to use the same Cloud CLI executeable by adding the Cloud CLI executeable to their PATH environment variable in their shell profile.

:::

3. Verify the installation. If the help text does not indicate that you're using the dbt Cloud CLI, make sure you've deactivated your pyenv or venv and do not have a version of dbt globally installed.

```bash
dbt --help
```

## Setting up the CLI - MacOS and Linux

Once installed, we need to configure the Cloud CLI to connect to a dbt Cloud project.

1. Ensure that you have created a project in [dbt Cloud](https://cloud.getdbt.com/).

2. Ensure that your personal [development credentials](https://cloud.getdbt.com/settings/profile/credentials) are set on the project. The Cloud CLI will use these credentials, stored securely in dbt Cloud, to communicate with your data warehouse.

3. Navigate to [your profile](https://cloud.getdbt.com/settings/profile) and enable the **Beta** flag under **Experimental Features.**

4. Create an environment variable with your [dbt Cloud API key](https://cloud.getdbt.com/settings/profile#api-access):

On MacOS, Linux, or Windows add an environment variable:
```bash
export DBT_CLOUD_API_KEY="1234" # Replace 1234 with your API key   
```

In Powershell, add an environment variable:

Note that this variable will be reset if you restart your shell. To add an environment variable permanently, add a system environment variable in your platform.

5. Navigate to a dbt project

```bash
cd ~/dbt-projects/jaffle_shop
```

6. In your `dbt_project.yml` file, ensure there is a section titled "Cloud". This section is required to have a `project-id` field with a valid [project ID](#glossary). 

```yaml
# dbt_project.yml
name:

version:
...

cloud:
    project-id: PROJECT_ID
```

You can find your project ID by navigating to dbt Cloud, selecting your project and clicking on **Develop** in the navigation bar. Your project ID is the number in the URL: https://cloud.getdbt.com/develop/26228/projects/PROJECT_ID.

## Using dbt Cloud CLI

The dbt Cloud CLI is a drop-in replacement for dbt Core. When you invoke a dbt command, that command is sent to dbt Cloud for processing. Since this is still invoking dbt under the hood, you'll still need to run `dbt deps`, followed by the same model build commands you typically run.

Have features you'd like to see in the Cloud CLI? Reach out to us on Slack!

## Glossary

- **dbt cloud API key:** Your API key found by navigating to the **gear icon**, clicking **Profile Settings**, and scrolling down to **API**.
- **Project ID:** The ID of the dbt project you're working with. Can be retrieved from the dbt Cloud URL after a project has been selected, for example, `https://cloud.getdbt.com/deploy/{accountID}/projects/{projectID}`
- **Development credentials:** Your personal warehouse credentials for the project you’re working with. They can be set by selecting the project and entering them in dbt Cloud. Navigate to the **gear icon**, click **Profile Settings**, and click **Credentials** from the left-side menu.
