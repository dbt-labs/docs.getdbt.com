---
title: Configure and use the dbt CLI
id: configure-cloud-cli
description: "Instructions on how to configure the dbt CLI"
sidebar_label: "Configuration and usage"
pagination_next: null
---

Learn how to configure the <Constant name="cloud_cli" /> for your <Constant name="cloud" /> project to run dbt commands, like `dbt environment show` to view your <Constant name="cloud" /> configuration or `dbt compile` to compile your project and validate models and tests. You'll also benefit from:

- Secure credential storage in the <Constant name="cloud" /> platform.
- [Automatic deferral](/docs/cloud/about-cloud-develop-defer) of build artifacts to your Cloud project's production environment.
- Speedier, lower-cost builds.
- Support for <Constant name="mesh" /> ([cross-project ref](/docs/mesh/govern/project-dependencies)), and more.

## Prerequisites

- You must set up a project in <Constant name="cloud" />.
  - **Note** &mdash; If you're using the <Constant name="cloud_cli" />, you can connect to your [data platform](/docs/cloud/connect-data-platform/about-connections) directly in the <Constant name="cloud" /> interface and don't need a [`profiles.yml`](/docs/core/connect-data-platform/profiles.yml) file. 
- You must have your [personal development credentials](/docs/dbt-cloud-environments#set-developer-credentials) set for that project. The <Constant name="cloud" /> CLI will use these credentials, stored securely in <Constant name="cloud" />, to communicate with your data platform.
- You must be on dbt version 1.5 or higher. Refer to [<Constant name="cloud" /> versions](/docs/dbt-versions/upgrade-dbt-version-in-cloud) to upgrade.

## Configure the dbt CLI

Once you install the <Constant name="cloud_cli" />, you need to configure it to connect to a <Constant name="cloud" /> project.

1. In <Constant name="cloud" />, select the project you want to configure your <Constant name="cloud_cli" /> with. The project must already have a [development environment](/docs/dbt-cloud-environments#create-a-development-environment) set up.
2. From the main menu, go to **CLI**.
3. In the **Configure Cloud authentication** section, click **Download CLI configuration file** to download your `dbt_cloud.yml` credentials file.

    <details>
    <summary>Region URLs to download credentials</summary>

    You can also download the credentials from the links provided based on your region:

    - North America: <a href="https://cloud.getdbt.com/cloud-cli">https://cloud.getdbt.com/cloud-cli</a>
    - EMEA: <a herf="https://emea.dbt.com/cloud-cli">https://emea.dbt.com/cloud-cli</a>
    - APAC: <a href="https://au.dbt.com/cloud-cli">https://au.dbt.com/cloud-cli</a>
    - North American Cell 1: <code>https:/ACCOUNT_PREFIX.us1.dbt.com/cloud-cli</code>
    - Single-tenant: <code>https://YOUR_ACCESS_URL/cloud-cli</code>

    </details>

4. Save the `dbt_cloud.yml` file in the `.dbt` directory, which stores your <Constant name="cloud_cli" /> configuration.

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
        token-name: "<pat-name>"
        token-value: "<pat-value>"
    
      - project-name: "<project-name>"
        project-id: "<project-id>"
        account-name: "<account-name>"
        account-id: "<account-id>"
        account-host: "<account-host>" # for example, "cloud.getdbt.com"
        token-name: "<pat-name>"
        token-value: "<pat-value>"  
    ```

    Store the config file in a safe place as it contains API keys. Check out the [FAQs](#faqs) to learn how to create a `.dbt` directory and move the `dbt_cloud.yml` file. If you have multiple copies and your file has a numerical addendum (for example, `dbt_cloud(2).yml`), remove the additional text from the filename. 

5. After downloading the config file and creating your directory, navigate to a project in your terminal:

    ```bash
    cd ~/dbt-projects/jaffle_shop
    ```

6. In your `dbt_project.yml` file, ensure you have or include a `dbt-cloud` section with a `project-id` field. The `project-id` field contains the <Constant name="cloud" /> project ID you want to use.

    ```yaml
    # dbt_project.yml
    name:
    version:
    # Your project configs...

    dbt-cloud: 
        project-id: PROJECT_ID
    ```

   - To find your project ID, select **Develop** in the <Constant name="cloud" /> navigation menu. You can use the URL to find the project ID. For example, in `https://YOUR_ACCESS_URL/develop/26228/projects/123456`, the project ID is `123456`.

7. You should now be able to [use the <Constant name="cloud_cli" />](#use-the-dbt-cloud-cli) and run [dbt commands](/reference/dbt-commands) like [`dbt environment show`](/reference/commands/dbt-environment) to view your <Constant name="cloud" /> configuration details or `dbt compile` to compile models in your dbt project.

With your repo recloned, you can add, edit, and sync files with your repo.

## Set environment variables

To set environment variables in the <Constant name="cloud" /> CLI for your dbt project:

1. From <Constant name="cloud" />, click on your account name in the left side menu and select **Account settings**.
2. Under the **Your profile** section, select **Credentials**.
3. Click on your project and scroll to the **Environment variables** section.
4. Click **Edit** on the lower right and then set the user-level environment variables.  

## Use the dbt CLI

The <Constant name="cloud_cli" /> uses the same set of [dbt commands](/reference/dbt-commands) and [MetricFlow commands](/docs/build/metricflow-commands) as dbt Core to execute the commands you provide. For example, use the [`dbt environment`](/reference/commands/dbt-environment) command to view your <Constant name="cloud" /> configuration details. With the <Constant name="cloud_cli" />, you can:

- Run [multiple invocations in parallel](/reference/dbt-commands) and ensure [safe parallelism](/reference/dbt-commands#parallel-execution), which is currently not guaranteed by `dbt-core`.
- Automatically defers build artifacts to your Cloud project's production environment.
- Supports [project dependencies](/docs/mesh/govern/project-dependencies), which allows you to depend on another project using the metadata service in <Constant name="cloud" />. 
  - Project dependencies instantly connect to and reference (or  `ref`) public models defined in other projects. You don't need to execute or analyze these upstream models yourself. Instead, you treat them as an API that returns a dataset.
 
:::tip Use the <code>--help</code> flag
As a tip, most command-line tools have a `--help` flag to show available commands and arguments. Use the `--help` flag with dbt in two ways:
- `dbt --help`: Lists the commands available for dbt<br />
- `dbt run --help`: Lists the flags available for the `run` command
:::
 
## Lint SQL files 

From the <Constant name="cloud" /> CLI, you can invoke [SQLFluff](https://sqlfluff.com/) which is a modular and configurable SQL linter that warns you of complex functions, syntax, formatting, and compilation errors. Many of the same flags that you can pass to SQLFluff are available from the <Constant name="cloud" /> CLI.

The available SQLFluff commands are: 

- `lint` &mdash; Lint SQL files by passing a list of files or from standard input (stdin).
- `fix` &mdash; Fix SQL files.
- `format` &mdash; Autoformat SQL files.


To lint SQL files, run the command as follows:  

```
dbt sqlfluff lint [PATHS]... [flags]
```

When no path is set, dbt lints all SQL files in the current project. To lint a specific SQL file or a directory, set `PATHS` to the path of the SQL file(s) or directory of files. To lint multiple files or directories, pass multiple `PATHS` flags.  

To show detailed information on all the dbt supported commands and flags, run the `dbt sqlfluff -h` command. 

#### Considerations

When running `dbt sqlfluff` from the <Constant name="cloud_cli" />, the following are important behaviors to consider:

- dbt reads the `.sqlfluff` file, if it exists, for any custom configurations you might have.
- For continuous integration/continuous development (CI/CD) workflows, your project must have a `dbt_cloud.yml` file and you have successfully run commands from within this dbt project.
- An SQLFluff command will return an exit code of 0 if it ran with any file violations. This dbt behavior differs from SQLFluff behavior, where a linting violation returns a non-zero exit code. dbt Labs plans on addressing this in a later release.

## Considerations

import CloudCliRelativePath from '/snippets/_cloud-cli-relative-path.md';

<CloudCliRelativePath />

## FAQs

import DbtDirectoryFaq from '/snippets/_dbt-directory-faq.md';

<DetailsToggle alt_header="How to create a .dbt directory and move your file">

<DbtDirectoryFaq />

</DetailsToggle>

<DetailsToggle alt_header="How to skip artifacts from being downloaded">

By default, [all artifacts](/reference/artifacts/dbt-artifacts) are downloaded when you execute dbt commands from the <Constant name="cloud_cli" />. To skip these files from being downloaded, add `--download-artifacts=false` to the command you want to run. This can help improve run-time performance but might break workflows that depend on assets like the [manifest](/reference/artifacts/manifest-json). 

</DetailsToggle>

<FAQ path="Troubleshooting/long-sessions-cloud-cli" />
