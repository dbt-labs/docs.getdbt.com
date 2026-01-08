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

dbt searches for `profiles.yml` location in a specific order:

1. `--profiles-dir` flag &mdash; Override for CI/CD or testing. 
2. Project root directory &mdash; Project-specific credentials.
3. `~/.dbt/profiles.yml` (Recommended location) &mdash; Shared across all projects.

`~/.dbt/profiles.yml` is the recommended location for the following reasons:

- **Security** &mdash; Keeps credentials out of project directories and version control.
- **Reusability** &mdash; A single file for all dbt projects on the machine.
- **Separation** &mdash; Connection details don't travel with project code.

### When to use project root

Place your `profiles.yml` file in the project root directory for:

- Self-contained demo or tutorial projects.
- Docker containers with baked-in credentials.
- CI/CD pipelines with environment-specific configs.

## Create and configure the `profiles.yml` file

The easiest way to create and configure a `profiles.yml` file is to execute `dbt init` after you've installed dbt on your machine. This takes you through the process of configuring an adapter and places the file into the recommended `~/.dbt/` location.

You can also manually create the file and add it to the proper location. To configure an adapter manually, copy and paste the fields from the [adapter setup instructions](/docs/about-dbt-install) along with the appropriate values for each. 

### Example configuration

<File name='~/.dbt/profiles.yml'>

```yml
my_project_profile:  # Profile name (matches dbt_project.yml)
  target: dev  # Default target to use
  outputs:
    dev: # Development environment
      type: <adapter_type> # Required: snowflake, bigquery, databricks, redshift, postgres, etc
      # Connection identifiers (adapter-specific)
      <account_or_host>: '<value>'  
      <database_field>: '<database>' 
      <schema_field>: '<schema>'       
      # Authentication (adapter-specific)
      <auth_method>: '<method>'  
      <credentials...>: '<values>' 
      # Execution settings (common across adapters)
      threads: 4   # Number of parallel threads

# Multiple profiles (for multiple projects)
another_project:
  target: default
  outputs:
    default:
      type: <adapter_type>
      <connection_fields...>
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
      account: '{{ env_var("ADAPTER_ACCOUNT") }}'
      user: '{{ env_var("ADAPTER_USER") }}'
      password: '{{ env_var("ADAPTER_PASSWORD") }}'
      database: '{{ env_var("ADAPTER_DATABASE") }}'
      schema: '{{ env_var("ADAPTER_SCHEMA") }}'
      warehouse: '{{ env_var("ADAPTER_WAREHOUSE") }}'
      role: '{{ env_var("ADAPTER_ROLE") }}'
      threads: 4
```

</File>

## User config

You can set default values of global configs for all projects that you run using your local machine. Refer to [About global configs](/reference/global-configs/about-global-configs) for details.
