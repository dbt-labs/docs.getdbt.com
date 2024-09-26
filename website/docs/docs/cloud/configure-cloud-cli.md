---
title: Configure and use the dbt Cloud CLI
id: configure-cloud-cli
description: "Instructions on how to configure the dbt Cloud CLI"
sidebar_label: "Configuration and usage"
pagination_next: null
---

Learn how to configure the dbt Cloud CLI for your dbt Cloud project to run dbt commands, like `dbt environment show` to view your dbt Cloud configuration or `dbt compile` to compile your project and validate models and tests. You'll also benefit from:

- Secure credential storage in the dbt Cloud platform.
- [Automatic deferral](/docs/cloud/about-cloud-develop-defer) of build artifacts to your Cloud project's production environment.
- Speedier, lower-cost builds.
- Support for dbt Mesh ([cross-project ref](/docs/collaborate/govern/project-dependencies)), and more.

## Prerequisites

- You must set up a project in dbt Cloud.
  - **Note** &mdash; If you're using the dbt Cloud CLI, you can connect to your [data platform](/docs/cloud/connect-data-platform/about-connections) directly in the dbt Cloud interface and don't need a [`profiles.yml`](/docs/core/connect-data-platform/profiles.yml) file. 
- You must have your [personal development credentials](/docs/dbt-cloud-environments#set-developer-credentials) set for that project. The dbt Cloud CLI will use these credentials, stored securely in dbt Cloud, to communicate with your data platform.
- You must be on dbt version 1.5 or higher. Refer to [dbt Cloud versions](/docs/dbt-versions/upgrade-dbt-version-in-cloud) to upgrade.

## Configure the dbt Cloud CLI

Once you install the dbt Cloud CLI, you need to configure it to connect to a dbt Cloud project.

1. In dbt Cloud, navigate to **Develop** and click **Configure dbt Cloud CLI** to download your `dbt_cloud.yml` credentials file.

    <details>
    <summary>Region URLs to download credentials</summary>
    You can also download the credentials from the links provided based on your region:

    - North America: <a href="https://cloud.getdbt.com/cloud-cli">https://cloud.getdbt.com/cloud-cli</a>
    - EMEA: <a herf="https://emea.dbt.com/cloud-cli">https://emea.dbt.com/cloud-cli</a>
    - APAC: <a href="https://au.dbt.com/cloud-cli">https://au.dbt.com/cloud-cli</a>
    - North American Cell 1: <code>https:/ACCOUNT_PREFIX.us1.dbt.com/cloud-cli</code>
    - Single-tenant: <code>https://YOUR_ACCESS_URL/cloud-cli</code>

    </details>

2. Save the `dbt_cloud.yml` file in the `.dbt` directory, which stores your dbt Cloud CLI configuration. Store it in a safe place as it contains API keys. Check out the [FAQs](#faqs) to learn how to create a `.dbt` directory and move the `dbt_cloud.yml` file.
   
    - North America: https://YOUR_ACCESS_URL/cloud-cli
    - EMEA: https://emea.dbt.com/cloud-cli
    - APAC: https://au.dbt.com/cloud-cli
    - North American Cell 1: `https:/ACCOUNT_PREFIX.us1.dbt.com/cloud-cli`
    - Single-tenant: `https://YOUR_ACCESS_URL/cloud-cli`
  
3. Follow the banner instructions and download the config file to:
   - Mac or Linux:  `~/.dbt/dbt_cloud.yml`
   - Windows:  `C:\Users\yourusername\.dbt\dbt_cloud.yml`  

  The config file looks like this:

  ```yaml
  version: "1"
  context:
    active-project: "<project id from the list below>"
    active-host: "<active host from the list>"
    defer-env-id: "<optional defer environment id>"
  projects:
    - project-name: "<project-name>"
      project-id: "<project-id>"
      account-name: "<account-name>"
      account-id: "<account-id>"
      account-host: "<account-host>" # for example, "cloud.getdbt.com"
      token-name: "<pat-or-service-token-name>"
      token-value: "<pat-or-service-token-value>"
  
    - project-name: "<project-name>"
      project-id: "<project-id>"
      account-name: "<account-name>"
      account-id: "<account-id>"
      account-host: "<account-host>" # for example, "cloud.getdbt.com"
      token-name: "<pat-or-service-token-name>"
      token-value: "<pat-or-service-token-value>"  
  ```

3. After downloading the config file and creating your directory, navigate to a dbt project in your terminal:

    ```bash
    cd ~/dbt-projects/jaffle_shop
    ```

4. In your `dbt_project.yml` file, ensure you have or include a `dbt-cloud` section with a `project-id` field. The `project-id` field contains the dbt Cloud project ID you want to use.

    ```yaml
    # dbt_project.yml
    name:
    version:
    # Your project configs...

    dbt-cloud: 
        project-id: PROJECT_ID
    ```

   - To find your project ID, select **Develop** in the dbt Cloud navigation menu. You can use the URL to find the project ID. For example, in `https://YOUR_ACCESS_URL/develop/26228/projects/123456`, the project ID is `123456`.

5. You should now be able to [use the dbt Cloud CLI](#use-the-dbt-cloud-cli) and run [dbt commands](/reference/dbt-commands) like [`dbt environment show`](/reference/commands/dbt-environment) to view your dbt Cloud configuration details or `dbt compile` to compile models in your dbt project.

With your repo recloned, you can add, edit, and sync files with your repo.

## Set environment variables

To set environment variables in the dbt Cloud CLI for your dbt project:

1. Select the gear icon on the upper right of the page.
2. Then select **Profile Settings**, then **Credentials**.
3. Click on your project and scroll to the **Environment Variables** section.
4. Click **Edit** on the lower right and then set the user-level environment variables.  

## Use the dbt Cloud CLI

The dbt Cloud CLI uses the same set of [dbt commands](/reference/dbt-commands) and [MetricFlow commands](/docs/build/metricflow-commands) as dbt Core to execute the commands you provide. For example, use the [`dbt environment`](/reference/commands/dbt-environment) command to view your dbt Cloud configuration details. With the dbt Cloud CLI, you can:

- Run [multiple invocations in parallel](/reference/dbt-commands) and ensure [safe parallelism](/reference/dbt-commands#parallel-execution), which is currently not guaranteed by `dbt-core`.
- Automatically defers build artifacts to your Cloud project's production environment.
- Supports [project dependencies](/docs/collaborate/govern/project-dependencies), which allows you to depend on another project using the metadata service in dbt Cloud. 
  - Project dependencies instantly connect to and reference (or  `ref`) public models defined in other projects. You don't need to execute or analyze these upstream models yourself. Instead, you treat them as an API that returns a dataset.
 
:::tip Use the <code>--help</code> flag
As a tip, most command-line tools have a `--help` flag to show available commands and arguments. Use the `--help` flag with dbt in two ways:
- `dbt --help`: Lists the commands available for dbt<br />
- `dbt run --help`: Lists the flags available for the `run` command
:::
 
### Lint SQL files 

From the dbt Cloud CLI, you can invoke [SQLFluff](https://sqlfluff.com/) which is a modular and configurable SQL linter that warns you of complex functions, syntax, formatting, and compilation errors. Many of the same flags that you can pass to SQLFluff are available from the dbt Cloud CLI.

The available SQLFluff commands are: 

- `lint` &mdash; Lint SQL files by passing a list of files or from standard input (stdin).
- `fix` &mdash; Fix SQL files.
- `format` &mdash; Autoformat SQL files.


To lint SQL files, run the command as follows:  

```shell
dbt sqlfluff lint [PATHS]... [flags]
```

When no path is set, dbt lints all SQL files in the current project. To lint a specific SQL file or a directory, set `PATHS` to the path of the SQL file(s) or directory of files. To lint multiple files or directories, pass multiple `PATHS` flags.  

To show detailed information on all the dbt supported commands and flags, run the `dbt sqlfluff -h` command. 

#### Considerations

When running `dbt sqlfluff` from the dbt Cloud CLI, the following are important behaviors to consider:

- dbt reads the `.sqlfluff` file, if it exists, for any custom configurations you might have.
- For continuous integration/continuous development (CI/CD) workflows, your project must have a `dbt_cloud.yml` file and you have successfully run commands from within this dbt project.
- An SQLFluff command will return an exit code of 0 if it ran with any file violations. This dbt behavior differs from SQLFluff behavior, where a linting violation returns a non-zero exit code. dbt Labs plans on addressing this in a later release.

## FAQs
<Expandable alt_header="How to create a .dbt directory and move your file">

If you've never had a `.dbt` directory, you should perform the following recommended steps to create one. If you already have a `.dbt` directory, move the `dbt_cloud.yml` file into it.

<Tabs>
<TabItem value="Create a .dbt directory">

  1. Clone your dbt project repository locally.
  2. Use the `mkdir` command followed by the name of the folder you want to create. Add the `~` prefix to create a `.dbt` folder in the root of your filesystem:

     ```bash
     mkdir ~/.dbt
     ```

This will create a `.dbt` folder in the root directory.

For Mac users, since it's a hidden folder (due to the dot prefix), it won't be visible in Finder by default. To view hidden files and folders, press Command + Shift + G.

</TabItem>

<TabItem value="Move the dbt_cloud.yml file">

### Mac or Linux
In your command line, use the `mv` command to move your `dbt_cloud.yml` file into the `.dbt` directory. If you've just downloaded the `dbt_cloud.yml` file and it's in your Downloads folder, the command might look something like this:

```bash
mv ~/Downloads/dbt_cloud.yml ~/.dbt/dbt_cloud.yml
```

### Windows
In your command line, use the move command. Assuming your file is in the Downloads folder, the command might look like this:

```bash
move %USERPROFILE%\Downloads\dbt_cloud.yml %USERPROFILE%\.dbt\dbt_cloud.yml
```

</TabItem>
</Tabs>

This command moves the `dbt_cloud.yml` from the `Downloads` folder to the `.dbt` folder. If your `dbt_cloud.yml` file is located elsewhere, adjust the path accordingly.

</Expandable>

<Expandable alt_header="How to skip artifacts from being downloaded">

By default, [all artifacts](/reference/artifacts/dbt-artifacts) are downloaded when you execute dbt commands from the dbt Cloud CLI. To skip these files from being downloaded, add `--download-artifacts=false` to the command you want to run. This can help improve run-time performance but might break workflows that depend on assets like the [manifest](/reference/artifacts/manifest-json). 


</Expandable>
