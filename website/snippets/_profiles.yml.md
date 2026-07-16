import EnvFileBeta from '/snippets/_env-file-beta.md';

If you're using dbt from the command line, you need a `profiles.yml` file that contains the connection details for your data platform.

:::note dbt platform accounts
<Constant name="dbt_platform" /> projects don't require a profiles.yml file unless you're developing from your local machine instead of the cloud-based UI. 
:::

## About profiles.yml

The `profiles.yml` file stores database connection credentials and configuration for dbt projects, including:

- **Connection details** &mdash; Account identifiers, hosts, ports, and authentication credentials.
- **Target definitions** &mdash; Define different environments (dev, staging, prod) within a single profile.
- **Default target** &mdash; Set which environment to use by default.
- **Execution parameters** &mdash; Thread count, timeouts, and retry settings.
- **Credential separation** &mdash; Keep sensitive information out of version control.

The `profile` field in [`dbt_project.yml`](/reference/dbt_project.yml) references a profile name defined in `profiles.yml`.

## Location of profiles.yml

Only one `profiles.yml` file is required and it can manage multiple projects and connections. 

<Tabs>
<TabItem value="fusion" label="dbt Fusion">

<Constant name="fusion"/> searches for the parent directory of `profiles.yml` in the following order and uses the first location it finds:

1. `--profiles-dir` flag &mdash; Override for CI/CD or testing.
2. Project root directory &mdash; Project-specific credentials.
3. `~/.dbt/` directory (Recommended location) &mdash; Shared across all projects.

</TabItem>
<TabItem value="core" label="dbt Core">

<Constant name="core"/> searches for the parent directory of `profiles.yml` in the following order and uses the first location it finds:

<VersionBlock lastVersion="1.10">

1. `--profiles-dir` flag
2. `DBT_PROFILES_DIR` environment variable
3. Current working directory
4. `~/.dbt/` directory (Recommended location)

</VersionBlock>

<VersionBlock firstVersion="1.11">

1. `--profiles-dir` flag
2. `DBT_ENGINE_PROFILES_DIR` environment variable
3. `DBT_PROFILES_DIR` environment variable (legacy variable but supported for backward compatibility)
4. Current working directory
5. `~/.dbt/` directory (Recommended location)

**Note:** <Constant name="core"/> prefers `DBT_ENGINE_PROFILES_DIR` for the profiles directory, which aligns with the `DBT_ENGINE_*` env var naming in v1.11. Use `DBT_ENGINE_PROFILES_DIR` going forward; `DBT_PROFILES_DIR` remains supported for compatibility.

</VersionBlock>

Note: <Constant name="core"/> supports using the <VersionBlock lastVersion="1.10">`DBT_PROFILES_DIR`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_PROFILES_DIR`</VersionBlock> environment variable or a `profiles.yml` file in the current working directory. These options aren't currently supported in <Constant name="fusion"/>.

</TabItem>
</Tabs>

`~/.dbt/profiles.yml` is the recommended location for the following reasons:

- **Security** &mdash; Keeps credentials out of project directories and version control.
- **Reusability** &mdash; A single file for all dbt projects on the machine.
- **Separation** &mdash; Connection details don't travel with project code.

#### When should I use project root?

Place your `profiles.yml` file in the project root directory for:

- Self-contained demo or tutorial projects.
- Docker containers with baked-in credentials.
- CI/CD pipelines with environment-specific configs.

## Create and configure the `profiles.yml` file

The easiest way to create and configure a `profiles.yml` file is to execute `dbt init` after you've installed dbt on your machine. This takes you through the process of configuring an adapter and places the file into the recommended `~/.dbt/` location. 

If your project has an existing `profiles.yml` file, running `dbt init` will prompt you to amend or overwrite it. If you select the existing adapter for configuration, dbt will automatically populate the existing values.

You can also manually create the file and add it to the proper location. To configure an adapter manually, copy and paste the fields from the adapter setup instructions for [<Constant name="core" />](/docs/local/connect-data-platform/about-dbt-connections) or [<Constant name="fusion" />](/docs/local/profiles.yml) along with the appropriate values for each. 

### Example configuration

To set up your profile, copy the correct sample profile for your warehouse into your `profiles.yml` file and update the details as follows:

- Profile name: Replace the name of the profile with a sensible name – it’s often a good idea to use the name of your organization. Make sure that this is the same name as the `profile` indicated in your `dbt_project.yml` file.
- `target`: This is the default target your dbt project will use. It must be one of the targets you define in your profile. Commonly it is set to `dev`.
- Populating your `outputs`:
  - `type`: The type of data warehouse you are connecting to
  - Warehouse credentials: Get these from your database administrator if you don’t already have them. Remember that user credentials are very sensitive information that should not be shared. May include fields like `account`, `username`, and `password`.
  - `schema`: The default schema that dbt will build objects in.
  - `threads`: The number of threads the dbt project will run on.

The following example highlighs the format of the `profiles.yml` file. Note that many of the configs are adapter-specific and their syntax varies. 

<File name='~/.dbt/profiles.yml'>

```yml
my_project_profile:  # Profile name (matches dbt_project.yml)
  target: dev  # Default target to use
  outputs:
    dev: # Development environment
      type: adapter_type # Required: snowflake, bigquery, databricks, redshift, postgres, etc
      # Connection identifiers (placeholder examples, see adapter-specific pages for supported configs)
      account: abc123  
      database: docs_team 
      schema: dev_schema       
      # Authentication (adapter-specific)
      auth_method: username_password  
      username: username
      password_credentials: password
      # Execution settings (common across adapters)
      threads: 4   # Number of parallel threads

# Multiple profiles (for multiple projects)
my_second_project_profile:
  target: dev
  outputs:
    dev:
      type: snowflake  # Example adapter
      account: account
      user: user
      password: password
      database: database
      schema: schema
      warehouse: warehouse
      threads: 4
```

</File>

### Environment variables

Use environment variables to keep sensitive credentials out of your `profiles.yml` file. Check out the [env_var](/reference/dbt-jinja-functions/env_var) reference for more information.

Example:

<File name='~/.dbt/profiles.yml'>

```yml
my_profile:
  target: dev
  outputs:
    dev:
      type: ADAPTER_NAME
      account: "{{ env_var("ADAPTER_ACCOUNT") }}"
      user: "{{ env_var("ADAPTER_USER") }}"
      password: "{{ env_var("ADAPTER_PASSWORD") }}"
      database: "{{ env_var("ADAPTER_DATABASE") }}"
      schema: "{{ env_var("ADAPTER_SCHEMA") }}"
      warehouse: "{{ env_var("ADAPTER_WAREHOUSE") }}"
      role: "{{ env_var("ADAPTER_ROLE") }}"
      threads: 4
```

</File>

When using dbt locally, you can also store environment variables in a `.env` file in your project root instead of setting them directly in your shell. The <Constant name="fusion"/> CLI, the dbt VS Code extension, and <Constant name="core"/> v1.12+ automatically load the `.env` file from your current working directory. Environment variables set in your shell take precedence over values in the `.env` file. For more information, refer to [About env_var function](/reference/dbt-jinja-functions/env_var#using-the-env-file).

<EnvFileBeta />

To keep credentials out of version control, add `.env` to your `.gitignore` file &mdash; new projects on v1.12 and higher created with `dbt init` include this by default.

## User config

You can set default values of global configs for all projects that you run using your local machine. Refer to [About global configs](/reference/global-configs/about-global-configs) for details.

## Understanding targets in profiles

dbt supports multiple targets within one profile to encourage the use of separate development and production environments as discussed in [dbt environments](/docs/local/dbt-core-environments).

A typical profile for an analyst using dbt locally will have a target named `dev`, and have this set as the default.

You may also have a `prod` target within your profile, which creates the objects in your production schema. However, since it's often desirable to perform production runs on a schedule, we recommend deploying your dbt project to a separate machine other than your local machine. Most dbt users only have a `dev` target in their profile on their local machine.

If you do have multiple targets in your profile, and want to use a target other than the default, you can do this using the `--target` flag when running a dbt command.

For example, to run against your `prod` target instead of the default `dev` target:

```bash
dbt run --target prod
```

You can use the `--target` flag with any dbt command, such as:

```bash
dbt build --target prod
dbt test --target dev
dbt compile --target qa
```

### Overriding profiles and targets

When running dbt commands, you can specify which profile and target to use from the CLI using the `--profile` and `--target` [flags](/reference/global-configs/about-global-configs#available-flags). These flags override what’s defined in your `dbt_project.yml` as long as the specified profile and target are already defined in your `profiles.yml` file.

To run your dbt project with a different profile or target than the default, you can do so using the followingCLI flags:
- `--profile` flag &mdash; Overrides the profile set in `dbt_project.yml` by pointing to another profile defined in `profiles.yml`.
- `--target` flag &mdash; Specifies the target within that profile to use (as defined in `profiles.yml`).

These flags help when you're working with multiple profiles and targets and want to override defaults without changing your files.

```bash
dbt run --profile my-profile-name --target dev
```
In this example, the `dbt run` command will use the `my-profile-name` profile and the `dev` target.

## Understanding warehouse credentials

We recommend that each dbt user has their own set of database credentials, including a separate user for production runs of dbt – this helps debug rogue queries, simplifies ownerships of schemas, and improves security.

To ensure the user credentials you use in your target allow dbt to run, you will need to ensure the user has appropriate privileges. While the exact privileges needed varies between data warehouses, at a minimum your user must be able to:

* Read source data
* Create schemas¹
* Read system <Term id="table">tables</Term>

:::info Running dbt without create schema privileges

If your user is unable to be granted the privilege to create schemas, your dbt runs should instead target an existing schema that your user has permission to create relations within.

:::

## Understanding target schemas

The target schema represents the default schema that dbt will build objects into, and is often used as the differentiator between separate environments within a warehouse.

:::info Schemas in BigQuery

dbt uses the term "schema" in a target across all supported warehouses for consistency. Note that in the case of BigQuery, a schema is actually a dataset.

:::

The schema used for production should be named in a way that makes it clear that it is ready for end-users to use for analysis – we often name this  `analytics`.

In development, a pattern we’ve found to work well is to name the schema in your `dev` target `dbt_<username>`. Suffixing your name to the schema enables multiple users to develop in dbt, since each user will have their own separate schema for development, so that users will not build over the top of each other, and ensuring that object ownership and permissions are consistent across an entire schema.

Note that there’s no need to create your target schema beforehand – dbt will check if the schema already exists when it runs, and create it if it doesn’t.

While the target schema represents the default schema that dbt will use, it may make sense to split your models into separate schemas, which can be done by using [custom schemas](/docs/build/custom-schemas).

## Understanding threads

When dbt runs, it creates a directed acyclic graph (DAG) of links between models. The number of threads represents the maximum number of paths through the graph dbt may work on at once – increasing the number of threads can minimize the run time of your project.  The default value for threads in user profiles is 4 threads.

For more information, check out [using threads](/docs/running-a-dbt-project/using-threads).
