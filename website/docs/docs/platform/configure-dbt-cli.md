---
title: Configure and use the dbt CLI
id: configure-dbt-cli
description: "Instructions on how to configure the dbt CLI"
sidebar_label: "Configuration and usage"
pagination_next: null
---

import LongSession from '/snippets/_long-sessions-cli.md';

Learn how to configure the <Constant name="platform_cli" /> for your <Constant name="dbt" /> project to run dbt commands, like `dbt environment show` to view your <Constant name="dbt" /> configuration or `dbt compile` to compile your project and validate models and tests. You'll also benefit from:

- Secure credential storage in the <Constant name="dbt_platform" />.
- [Automatic deferral](/docs/platform/about-defer) of build artifacts to your project's production environment.
- Speedier, lower-cost builds.
- Support for <Constant name="mesh" /> ([cross-project ref](/docs/mesh/govern/project-dependencies)), and more.

## Prerequisites

- You must set up a project in <Constant name="dbt" />.
  - **Note** &mdash; If you're using the <Constant name="platform_cli" />, you can connect to your [data platform](/docs/platform/connect-data-platform/about-connections) directly in the <Constant name="dbt_platform" /> interface and don't need a [`profiles.yml`](/docs/local/profiles.yml) file. 
- You must have your [personal development credentials](/docs/dbt-platform-environments#set-developer-credentials) set for that project. The <Constant name="platform_cli" /> will use these credentials, stored securely in <Constant name="dbt" />, to communicate with your data platform.
- You must be on dbt version 1.5 or higher. Refer to [<Constant name="dbt" /> versions](/docs/dbt-versions/upgrade-dbt-platform-version) to upgrade.

## Configure the dbt CLI

Once you install the <Constant name="platform_cli" />, you need to configure it to connect to a <Constant name="dbt" /> project.

1. In <Constant name="dbt" />, select the project you want to configure your <Constant name="platform_cli" /> with. The project must already have a [development environment](/docs/dbt-platform-environments#create-a-development-environment) set up.
2. Download your `dbt_cloud.yml` credentials file and save it to your `.dbt` directory (`~/.dbt/dbt_cloud.yml` on macOS/Linux, `C:\Users\yourusername\.dbt\dbt_cloud.yml` on Windows). For download steps, the full file structure, and a field reference, refer to [`dbt_cloud.yml`](/reference/dbt_cloud.yml).

3. After downloading the config file and creating your directory, navigate to a project in your terminal:

    ```bash
    cd ~/dbt-projects/jaffle_shop
    ```

4. In your `dbt_project.yml` file, ensure you have or include a [`dbt-cloud` block](/reference/dbt_cloud.yml#the-dbt-cloud-block-in-dbt_projectyml) with a `project-id` field that points to your <Constant name="dbt" /> project.

    ```yaml
    # dbt_project.yml
    dbt-cloud:
        project-id: PROJECT_ID
    ```

5. You should now be able to [use the <Constant name="dbt_cli"/>](#use-the-dbt-cli) and run [dbt commands](/reference/dbt-commands) like [`dbt environment show`](/reference/commands/dbt-environment) to view your <Constant name="dbt" /> configuration details or `dbt compile` to compile models in your dbt project.

With your repo recloned, you can add, edit, and sync files with your repo.

## Set environment variables

To set environment variables in the <Constant name="platform_cli" /> for your dbt project:

1. From <Constant name="dbt" />, click on your account name in the left side menu and select **Account settings**.
2. Under the **Your profile** section, select **Credentials**.
3. Click on your project and scroll to the **Environment variables** section.
4. Click **Edit** on the lower right and then set the user-level environment variables.  

## Use the dbt CLI

The <Constant name="platform_cli" /> uses the same set of [dbt commands](/reference/dbt-commands) and [MetricFlow commands](/docs/build/metricflow-commands) as dbt Core to execute the commands you provide. For example, use the [`dbt environment`](/reference/commands/dbt-environment) command to view your <Constant name="dbt" /> configuration details. With the <Constant name="platform_cli" />, you can:

- Run [multiple invocations in parallel](/reference/dbt-commands) and ensure [safe parallelism](/reference/dbt-commands#parallel-execution), which `dbt-core` doesn't currently guarantee.
- Automatically defer build artifacts to your project's production environment.
- Support [project dependencies](/docs/mesh/govern/project-dependencies), which allows you to depend on another project using the metadata service in <Constant name="dbt" />. 
  - Project dependencies instantly connect to and reference (or  `ref`) public models defined in other projects. You don't need to execute or analyze these upstream models yourself. Instead, you treat them as an API that returns a dataset.
 
:::tip Use the <code>--help</code> flag
As a tip, most command-line tools have a `--help` flag to show available commands and arguments. Use the `--help` flag with dbt in two ways:
- `dbt --help`: Lists the commands available for dbt<br />
- `dbt run --help`: Lists the flags available for the `run` command
:::
 
## Lint SQL files 

From the <Constant name="platform_cli" />, you can invoke [SQLFluff](https://sqlfluff.com/), which is a modular and configurable SQL linter that warns you of complex functions, syntax, formatting, and compilation errors. Many of the same flags that you can pass to SQLFluff are available from the <Constant name="platform_cli" />.

The available SQLFluff commands are: 

- `lint` &mdash; Lint SQL files by passing a list of files or from standard input (stdin).
- `fix` &mdash; Fix SQL files.
- `format` &mdash; Autoformat SQL files.


To lint SQL files, run the command as follows:  

```
dbt sqlfluff lint [PATHS]... [flags]
```

When you don't specify a path, dbt lints all SQL files in the current project. To lint a specific SQL file or a directory, set `PATHS` to the path of the SQL file(s) or directory of files. To lint multiple files or directories, pass multiple `PATHS` flags.  

To show detailed information on all the dbt supported commands and flags, run the `dbt sqlfluff -h` command. 

#### Considerations

When running `dbt sqlfluff` from the <Constant name="platform_cli" />, the following are important behaviors to consider:

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

By default, the <Constant name="platform_cli" /> downloads [all artifacts](/reference/artifacts/dbt-artifacts) when you execute dbt commands. To skip these files from being downloaded, add `--download-artifacts=false` to the command you want to run. This can help improve run-time performance but might break workflows that depend on assets like the [manifest](/reference/artifacts/manifest-json). 

</DetailsToggle>

<DetailsToggle alt_header="I'm getting a `Session occupied` error in dbt CLI?">

<LongSession />

</DetailsToggle>
