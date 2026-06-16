## Types of environments

In <Constant name="dbt" />, there are two types of environments:
- **Deployment environment** &mdash; Determines the settings used when jobs created within that environment are executed.<br></br>
    Types of deployment environments:
    - General
    - Staging
    - Production
- **Development environment** &mdash; Determines the settings used in the <Constant name="studio_ide" /> or <Constant name="platform_cli" />, for that particular project. 

Each <Constant name="dbt" /> project can only have a single development environment, but can have any number of General deployment environments, one Production deployment environment and one Staging deployment environment.

|          | Development | General | Production | Staging |
|----------|-------------|---------|------------|---------|
| **Determines settings for** | <Constant name="studio_ide" /> or <Constant name="platform_cli" /> | <Constant name="dbt" /> Job runs | <Constant name="dbt" /> Job runs | <Constant name="dbt" /> Job runs |
| **How many can I have in my project?** | 1 | Any number | 1 | 1 |

:::note 
For users familiar with development on <Constant name="core" />, each environment is roughly analogous to an entry in your `profiles.yml` file, with some additional information about your repository to ensure the proper version of code is executed. More info on dbt core environments [here](/docs/local/dbt-core-environments).
:::

## Common environment settings

Both development and deployment environments have a section called **General Settings**, which has some basic settings that all environments will define:

| Setting | Example Value | Definition | Accepted Values |
| --- | --- | --- | --- |
| Environment name | Production  | The environment name  | Any string! |
| Environment type | Deployment | The type of environment | Deployment, Development|
| Set deployment type | PROD |  Designates the deployment environment type. | Production, Staging, General | 
| dbt version | Latest | <Constant name="dbt" /> automatically upgrades the dbt version running in this environment, based on the [release track](/docs/dbt-versions/dbt-release-tracks) you select. | Latest, Compatible, Extended |
| Only run on a custom branch | ☑️ | Determines whether to use a branch other than the repository’s default  | See below |
| Custom branch | dev | Custom Branch name | See below |

:::note About dbt version

<Constant name="dbt" /> allows users to select a [release track](/docs/dbt-versions/dbt-release-tracks) to receive ongoing dbt version upgrades at the cadence that makes sense for their team.
:::

### Custom branch behavior

By default, all environments will use the default branch in your repository (usually the `main` branch) when accessing your dbt code. This is overridable within each <Constant name="dbt" /> Environment using the **Default to a custom branch** option. This setting will have slightly different behavior depending on the environment type:

- **Development**: determines which branch in the <Constant name="studio_ide" /> or <Constant name="platform_cli" /> developers create branches from and open PRs against.
- **Deployment:** determines the branch is cloned during job executions for each environment.

For more info, check out this [FAQ page on this topic](/faqs/Environments/custom-branch-settings)!

### Extended attributes

:::note 
Extended attributes are currently _not_ supported for SSH tunneling
:::

Extended attributes allows users to set a flexible [profiles.yml](/docs/local/profiles.yml) snippet in their <Constant name="dbt" /> Environment settings. It provides users with more control over environments (both deployment and development) and extends how <Constant name="dbt" /> connects to the data platform within a given environment.

Extended attributes are set at the environment level, and can partially override connection or environment credentials, including any custom environment variables. You can set any YAML attributes that a dbt adapter accepts in its `profiles.yml`.

<Lightbox src="/img/docs/dbt-platform/using-dbt-platform/extended-attributes.png" width="95%" title="Extended Attributes helps users add profiles.yml attributes to dbt Environment settings using a free form text box." /> <br />

The following code is an example of the types of attributes you can add in the **Extended Attributes** text box:

```yaml
dbname: jaffle_shop      
schema: dbt_alice      
threads: 4
username: alice
password: '{{ env_var(''DBT_ENV_SECRET_PASSWORD'') }}'
```

You can also use arrays as values for keys. For example, to pass a list of database groups:

```yaml
db_groups:
  - db_editor
  - db_viewer
```

#### Extended Attributes don't mask secret values

- We recommend you avoid setting secret values to prevent visibility in the text box and logs. A common workaround is to wrap extended attributes in [environment variables](/docs/build/environment-variables). In the earlier example, `password: '{{ env_var(''DBT_ENV_SECRET_PASSWORD'') }}'` will get a value from the `DBT_ENV_SECRET_PASSWORD` environment variable at runtime.
- If you're using [profiles](/docs/platform/about-profiles) for deployment environments, any `env_var` references in Extended Attributes must use _project-scoped_ environment variables. Since profiles are environment-agnostic, environment-scoped variables aren't available during connection tests. Jobs run normally since they have a real environment, but connection tests will fail if the referenced variable is only set at the environment level.
  
  To set a project-scoped variable, go to **Orchestration** > **Environments** > **Environment variables**, and set a value in the **Project default** column. This value applies across all environments in the project, making it available to profiles during connection tests. See [environment variables](/docs/build/environment-variables?version=2.0#setting-environment-variables) for more information.

#### How extended attributes work
If you're developing in the [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio), [<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation), or [orchestrating job runs](/docs/deploy/deployments), extended attributes parses through the provided YAML and extracts the `profiles.yml` attributes. For each individual attribute:

- If the attribute exists in another source (such as your project settings), it will replace its value (like environment-level values) in the profile. It also overrides any custom environment variables (if not itself wired using the syntax described for secrets above)

- If the attribute doesn't exist, it will add the attribute or value pair to the profile.

#### Only the **top-level keys** are accepted in extended attributes
This means that if you want to change a specific sub-key value, you must provide the entire top-level key as a JSON block in your resulting YAML. For example, if you want to customize a particular field within a [service account JSON](/docs/local/connect-data-platform/bigquery-setup#service-account-json) for your BigQuery connection (like 'project_id' or 'client_email'), you need to provide an override for the entire top-level `keyfile_json` main key/attribute using extended attributes. Include the sub-fields as a nested JSON block.
