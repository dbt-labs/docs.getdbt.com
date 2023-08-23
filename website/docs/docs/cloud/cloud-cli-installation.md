---
title: Installing the dbt Cloud CLI (Alpha)
id: cloud-cli-installation
description: "Instructions for installing and configuring dbt Cloud CLI"
---

:::warning Alpha functionality 

The following installation instructions are for the dbt Cloud CLI, currently in alpha. These instructions are not intended for general audiences at this time. 

::: 

## Installing dbt Cloud CLI

### Install and update with Brew on MacOS (recommended)

1. Install the CLI: 

```bash
brew tap dbt-labs/dbt-cli
brew install dbt-cloud-cli
```

2. Verify the installation by requesting your homebrew installation path (not your dbt core installs). If the `which dbt` command returns nothing, then you should modify your PATH in `~.zshrc` or create an alias.

```bash
which dbt
dbt --help
```

### Manually install (Windows and Linux)

1. Download the latest release for your platform from [Github](https://github.com/dbt-labs/dbt-cli/releases).
2. Add the `dbt` executable to your path.
3. Move to a directory with a dbt project, and create a `dbt_cloud.yml` file containing your `project-id` from dbt Cloud.
4. Invoke `dbt --help` from your terminal to see a list of supported commands.

#### Updating your dbt Cloud installation (Windows + Linux)

Follow the same process in [Installing dbt Cloud CLI](#manually-install-windows-only) and replace the existing `dbt` executable with the new one. You should not have to go through the security steps again.

## Setting up the CLI

1. Ensure that you have created a project in [dbt Cloud](https://cloud.getdbt.com/).

2. Ensure that your personal [development credentials](https://cloud.getdbt.com/settings/profile/credentials) are set on the project.

3. Navigate to [your profile](https://cloud.getdbt.com/settings/profile) and enable the "beta features" flag under "Experimental Features."

4. Create an environment variable with your [dbt cloud API key](https://cloud.getdbt.com/settings/profile#api-access):

```bash

   > $ vi ~/.zshrc

   ...

   # dbt Cloud CLI
    export DBT_CLOUD_API_KEY="1234"
   
```

5. Load the new environment variable. Note: you may need to reactivate your python virtual environment after sourcing your shell's dot file. Alternatively, restart your shell instead of sourcing the shell's dot file

```bash
   > $ source ~/.zshrc
```

6. Navigate to a dbt project

```bash
   > $ cd ~/dbt-projects/jaffle_shop
```

7. Create a dbt_cloud.yml in the root project directory. The file is required to have a `project-id` field with a valid [project ID](#glossary):

```bash
> $ pwd
/Users/user/dbt-projects/jaffle_shop

> $ cat dbt_cloud.yml
project-id: '123456'
```

You can find your project ID by selecting your project and clicking on **Develop** in the navigation bar. Your project ID is the number in the URL: https://cloud.getdbt.com/develop/26228/projects/`PROJECT_ID`.

If dbt_cloud.yml already exists, edit the file and verify the project ID field uses a valid project ID.

#### Upgrade the CLI with Brew

```bash
brew update
brew upgrade dbt-cloud-cli
```

## Using dbt Cloud CLI

**Coming soon**

### Glossary

- **dbt cloud API key:** your API key found by navigating to the **gear icon**, clicking **Profile Settings**, and scrolling down to **API**.
- **Project ID:** the ID of the dbt project you're working with. Can be retrieved from the dbt cloud URL after a project has been selected, for example, `https://cloud.getdbt.com/deploy/{accountID}/projects/{projectID}`
- **Development credentials:** your personal warehouse credentials for the project you’re working with. They can be set by selecting the project and entering them in dbt Cloud. Navigate to the **gear icon**, click **Profile Settings**, and click **Credentials** from the left-side menu.
