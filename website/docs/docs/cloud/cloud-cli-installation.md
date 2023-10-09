---
title: Install the dbt Cloud CLI (Alpha)
id: cloud-cli-installation
description: "Instructions for installing and configuring dbt Cloud CLI"
---

:::warning Alpha functionality 

The following installation instructions are for the dbt Cloud CLI, currently in Alpha (actively in development and being tested). 

These instructions are not intended for general audiences at this time. 

::: 


dbt Cloud natively supports developing using a command line (CLI), empowering team members to contribute with enhanced flexibility and collaboration. The dbt Cloud CLI allows you to run dbt commands against your dbt Cloud development environment from your local command line.

dbt commands are run against dbt Cloud's infrastructure and benefit from:

* Secure credential storage in the dbt Cloud platform.
* Automatic deferral of build artifacts to your Cloud project's production environment. 
* Speedier, lower-cost builds.
* Support for dbt Mesh ([cross-project `ref`)](/docs/collaborate/govern/project-dependencies)),
* Significant platform improvements, to be released over the coming months.

The dbt Cloud CLI and [dbt Core](https://github.com/dbt-labs/dbt-core), an open-source project, are both command line tools that let you run your dbt projects and use the same dbt commands. The key difference is that the dbt Cloud CLI is designed to work specifically with dbt Cloud's infrastructure and integrates those builds with all [dbt Cloud features](/docs/cloud/about-cloud/dbt-cloud-features).

## Install dbt Cloud CLI

You can install the dbt Cloud CLI on the command line by using one of these methods:
* Note, the `dbt deps` command is not required anymore.

<Tabs>

<TabItem value="brew" label="macOS">

Before you begin, make sure you have [Homebrew installed](http://brew.sh/) in your code editor or command line terminal. If your operating system runs into path conflicts, refer to the [FAQs](#faqs).

1. Run the following command to verify that there is no conflict with a dbt Core installation on your system:
   
```bash
which dbt
```
   - This should return a `dbt not found`. If the dbt help text appears, use `pip uninstall dbt` to deactivate dbt Core from your machine.
  
2. Install the dbt Cloud CLI with Homebrew: 

```bash
brew tap dbt-labs/dbt-cli
brew install dbt-cloud-cli
```

3. Verify the installation by running `dbt --help` from the command line. If the help text doesn't indicate that you're using the dbt Cloud CLI, make sure you've deactivated your pyenv or venv and don't have a version of dbt globally installed.

</TabItem>

<TabItem value="windows" label="Windows">

If your operating system runs into path conflicts, refer to the [FAQs](#faqs).

1. Download the latest Windows release for your platform from [GitHub](https://github.com/dbt-labs/dbt-cli/releases).

2. Extract the `dbt.exe` executeable into the same folder as your dbt project.

:::info

Advanced users can configure multiple projects to use the same dbt Cloud CLI by placing the executeable in the Program Files folder and [adding it to their Windows PATH environment variable](https://medium.com/@kevinmarkvi/how-to-add-executables-to-your-path-in-windows-5ffa4ce61a53).

Note that if you are using VS Code, you'll need to restart it to pick up modified environment variables.
:::

3. Verify the installation by running `./dbt --help` from the command line. If the help text doesn't indicate that you're using the dbt Cloud CLI, make sure you've deactivated your pyenv or venv and don't have a version of dbt globally installed.

</TabItem>

<TabItem value="linux" label="Linux">

If your operating system runs into path conflicts, refer to the [FAQs](#faqs).

1. Download the latest Linux release for your platform from [GitHub](https://github.com/dbt-labs/dbt-cli/releases). (Pick the file based on your CPU architecture)

2. Extract the `dbt-cloud-cli` binary to the same folder as your dbt project.

```bash
tar -xf dbt_0.29.9_linux_amd64.tar.gz
./dbt --version
```

:::info

Advanced users can configure multiple projects to use the same Cloud CLI executable by adding it to their PATH environment variable in their shell profile.

:::

3. Verify the installation by running `./dbt --help` from the command line. If the help text doesn't indicate that you're using the dbt Cloud CLI, make sure you've deactivated your pyenv or venv and don't have a version of dbt globally installed.">

</TabItem>

</Tabs>

## Update dbt Cloud CLI

The following instructions explain how to update the dbt CLoud CLI to the latest version depending on your operating system. 

#### Update with Homebrew (MacOS)

To update the dbt Cloud CLI, run `brew upgrade dbt-cloud-cli`. 
#### Update manually (Windows and Linux)

To update, follow the same process explained in [Install manually (Windows)](#install-manually-windows) and replace the existing `dbt.exe` executable with the new one.


## Configure the dbt Cloud CLI

After installation, you can configure the dbt Cloud CLI for your dbt Cloud project and use it to run [dbt commands](/reference/dbt-commands) similar to dbt Core. For example, you can execute the following commands to compile a project using dbt Cloud:

```bash
dbt compile
```

### Prerequisites

- You must set up a project in dbt Cloud.
- You must have your [personal development credentials](/docs/dbt-cloud-environments#set-developer-credentials) set for that project. The dbt Cloud CLI will use these credentials, stored securely in dbt Cloud, to communicate with your data platform.
- You must [enroll](/docs/dbt-versions/experimental-features) in the dbt Cloud beta features. 
	- To enroll, navigate to your **Profile Settings** and enable the **Beta** flag under **Experimental Features**.

Once you install the dbt Cloud CLI, you need to configure it to connect to a dbt Cloud project.

1. Ensure you meet the prerequisites above.
2. Create an environment variable with your [dbt Cloud API key](/docs/dbt-cloud-apis/user-tokens):
   - On MacOS, Linux, or Windows add an environment variable:

        ```bash
        export DBT_CLOUD_API_KEY="1234" # Replace 1234 with your API key   
        ```

   - In Powershell, add an environment variable: IS THIS MISSING SOMETHING?
     - Note that this variable resets if you restart your shell. To add an environment variable permanently, add a system environment variable in your platform.

3. Navigate to a dbt project in your terminal:

```bash
cd ~/dbt-projects/jaffle_shop
```

4. In your `dbt_project.yml` file, ensure there is a section titled `dbt-cloud`. This section is required to have a `project-id` field with a valid project ID. 

```yaml
# dbt_project.yml
name:

version:
...

dbt-cloud: 
    project-id: PROJECT_ID
```

- To find your project ID, go to **Develop** in the navigation menu. Select the dbt Cloud project URL, such as `https://cloud.getdbt.com/develop/26228/projects123456`, where the project ID is `123456`.


## Use the dbt Cloud CLI

The dbt Cloud CLI shares the same set of commands as dbt Core. When you invoke a dbt command, that command is sent to dbt Cloud for processing. 

The dbt Cloud CLI supports [project dependencies](/docs/collaborate/govern/project-dependencies), which is an exciting way to depend on another project using the metadata service in dbt Cloud. It instantly resolves references (or  `ref`) to public models defined in other projects. You don't need to execute or analyze these upstream models yourself. Instead, you treat them as an API that returns a dataset.

Share feedback or request features you'd like to see on the [dbt community Slack](https://getdbt.slack.com/archives/C05M77P54FL).


## FAQs

<details>

<summary>How do I solve for path conflicts</summary>
For compatibility, both the dbt Cloud CLI and dbt Core are invoked by running `dbt`. This can create path conflicts if your operating system selects one over the other based on your $PATH environment variable (settings).

If you have dbt Core installed locally, ensure that you deactivate your Python environment or uninstall it using `pip uninstall dbt` before proceeding.  Alternatively, advanced users can modify the $PATH environment variable to correctly point to the dbt Cloud CLI binary to use both dbt Cloud CLI and dbt Core together.

You can always uninstall the Cloud CLI to return to using dbt Core.
</details>

