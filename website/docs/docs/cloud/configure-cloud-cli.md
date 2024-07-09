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
    - project-id: "<project-id>"
        account-host: "<account-host>"
        api-key: "<user-api-key>"

    - project-id: "<project-id>"
        account-host: "<account-host>"
        api-key: "<user-api-key>"
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

   - To find your project ID, select **Develop** in the dbt Cloud navigation menu. You can use the URL to find the project ID. For example, in `https://cloud.getdbt.com/develop/26228/projects/123456`, the project ID is `123456`.

5. You should now be able to [use the dbt Cloud CLI](#use-the-dbt-cloud-cli) and run [dbt commands](/reference/dbt-commands) like [`dbt environment show`](/reference/commands/dbt-environment) to view your dbt Cloud configuration details or `dbt compile` to compile models in your dbt project.

With your repo recloned, you can add, edit, and sync files with your repo.

## Set environment variables

To set environment variables in the dbt Cloud CLI for your dbt project:

1. Select the gear icon on the upper right of the page.
2. Then select **Profile Settings**, then **Credentials**.
3. Click on your project and scroll to the **Environment Variables** section.
4. Click **Edit** on the lower right and then set the user-level environment variables.  
   - Note, when setting up the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), using [environment variables](/docs/build/environment-variables) like `{{env_var('DBT_WAREHOUSE')}}` is not supported. You should use the actual credentials instead.

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

From the dbt Cloud CLI, you can invoke [SQLFluff](https://sqlfluff.com/) which is a modular and configurable SQL linter that warns you of complex functions, syntax, formatting, and compilation errors. The available SQLFluff commands are: `fix`, `format`, and `lint`. To show detailed information about these commands and the available flags, run the `dbt sqlfluff -h` command. 

The `lint` command in dbt supports many of the same flags that you can pass to SQLFluff, except for those that might pose a security risk. To lint SQL files, run the command as follows:  

```shell
dbt sqlfluff lint [PATHS]... [flags]
```

When no path is set, dbt lints all SQL files in the project. To lint a specific SQL file or a directory of SQL files, set `PATHS` to the path of the SQL file or the directory path, respectively. 

To show a list of all the dbt supported flags, run the `dbt sqlfluff lint -h` command. For example:  

```shell
dbt sqlfluff lint -h
Lint SQL files via passing a list of files or using stdin.

PATH is the path to a sql file or directory to lint. This can be either a file ('path/to/file.sql'), a path ('directory/of/sql/files'), a single ('-') character to indicate reading from *stdin* or a dot/blank ('.'/' ') which will be interpreted like passing the current working directory as a path argument.

Usage:
  dbt sqlfluff lint [PATHS]... [flags]

Flags:
  -d, --dialect string                The dialect of SQL to lint.
      --encoding string               Specify encoding to use when reading and writing files. Defaults to autodetect.
  -e, --exclude-rules string          Exclude specific rules. For example specifying -–exclude-rules LT01 will remove rule LT01 (Unnecessary trailing whitespace) from the set of considered rules. This could either be the allowlist, or the general set if there is no specific allowlist. Multiple rules can be specified with commas e.g. –-exclude-rules LT01,LT02 will exclude violations of rule LT01 and rule LT02.
  -f, --format SqlfluffOutputFormat   What format to return the lint result in, one of "human", "json", "yaml", "github-annotation", "github-annotation-native", "none". (default human)
  -h, --help                          help for lint
  -i, --ignore string                 Ignore particular families of errors so that they don't cause a failed run. For example –-ignore parsing would mean that any parsing errors are ignored and don't influence the success or fail of a run. –-ignore behaves somewhat like noqa comments, except it applies globally. Multiple options are possible if comma separated: e.g. –ignore parsing,templating.
      --ignore-local-config           Ignore config files in default search path locations. This option allows the user to lint with the default config or can be used in conjunction with –config to only reference the custom config file.
      --rules string                  Narrow the search to only specific rules. For example specifying –-rules LT01 will only search for rule LT01 (Unnecessary trailing whitespace). Multiple rules can be specified with commas e.g. –-rules LT01,LT02 will specify only looking for violations of rule LT01 and rule LT02.
  -t, --templater SqlfluffTemplater   The templater to use, one of "raw", "jinja", "python", "placeholder", "dbt". (default jinja)
  -v, --verbose count                 Verbosity, how detailed should the output be. This is stackable, so -vv is more verbose than -v. For the most verbose option try -vvvv or -vvvvv.

Global Flags:
      --log-format LogFormat   The log format, either json or plain. (default plain)
      --log-level LogLevel     The log level, one of debug, info, warning, error or fatal. (default info)
      --no-color               Disables colorization of the output.
  -q, --quiet                  Suppress all non-error logging to stdout.
```

#### Considerations
Keep the following points in mind when using SQLFluff with dbt Cloud:

- When you run `dbt sqlfluff`, it picks up changes to your local .sqlfluff config.
- To use SQLFluff in continuous integration/continuous development, you need to have a `dbt_cloud.yml` file in your project and run commands from a valid dbt project.
- SQLFluff commands in the dbt Cloud CLI do not return exit codes yet.

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
