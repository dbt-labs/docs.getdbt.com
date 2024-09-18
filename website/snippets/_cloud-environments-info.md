## Types of environments

In dbt Cloud, there are two types of environments:
- **Deployment environment** &mdash; Determines the settings used when jobs created within that environment are executed.<br></br>
    Types of deployment environments:
    - General
    - Staging
    - Production
- **Development environment** &mdash; Determines the settings used in the dbt Cloud IDE or dbt Cloud CLI, for that particular project. 

Each dbt Cloud project can only have a single development environment but can have any number of deployment environments.

|| Development  | Staging | Deployment |
|------| --- | --- | --- |
| **Determines settings for** | dbt Cloud IDE or dbt Cloud CLI | dbt Cloud Job runs | dbt Cloud Job runs |
| **How many can I have in my project?** | 1 | Any number | Any number |

:::note 
For users familiar with development on dbt Core, each environment is roughly analogous to an entry in your `profiles.yml` file, with some additional information about your repository to ensure the proper version of code is executed. More info on dbt core environments [here](/docs/core/dbt-core-environments).
:::

## Common environment settings

Both development and deployment environments have a section called **General Settings**, which has some basic settings that all environments will define:

| Setting | Example Value | Definition | Accepted Values |
| --- | --- | --- | --- |
| Name | Production  | The environment name  | Any string! |
| Environment Type | Deployment | The type of environment | [Deployment, Development] |
| dbt Version | 1.4 (latest) | The dbt version used  | Any dbt version in the dropdown |
| Default to Custom Branch | ☑️ | Determines whether to use a branch other than the repository’s default  | See below |
| Custom Branch | dev | Custom Branch name | See below |

:::note About dbt version

- dbt Cloud allows users to select any dbt release. At this time, **environments must use a dbt version greater than or equal to v1.0.0;** [lower versions are no longer supported](/docs/dbt-versions/upgrade-dbt-version-in-cloud).
- If you select a current version with `(latest)` in the name, your environment will automatically install the latest stable version of the minor version selected.
- Go **Versionless**, which removes the need for manually upgrading environment, while ensuring you are always up to date with the latest fixes and features.
:::

### Custom branch behavior

By default, all environments will use the default branch in your repository (usually the `main` branch) when accessing your dbt code. This is overridable within each dbt Cloud Environment using the **Default to a custom branch** option. This setting will have slightly different behavior depending on the environment type:

- **Development**: determines which branch in the dbt Cloud IDE or dbt Cloud CLI developers create branches from and open PRs against.
- **Deployment:** determines the branch is cloned during job executions for each environment.

For more info, check out this [FAQ page on this topic](/faqs/Environments/custom-branch-settings)!

### Extended attributes

:::note 
Extended attributes are are currently _not_ supported for SSH tunneling
:::

Extended attributes allows users to set a flexible [profiles.yml](/docs/core/connect-data-platform/profiles.yml) snippet in their dbt Cloud Environment settings. It provides users with more control over environments (both deployment and development) and extends how dbt Cloud connects to the data platform within a given environment.

Extended attributes are set at the environment level, and can partially override connection or environment credentials, including any custom environment variables. You can set any YAML attributes that a dbt adapter accepts in its `profiles.yml`.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/extended-attributes.jpg" width="95%" title="Extended Attributes helps users add profiles.yml attributes to dbt Cloud Environment settings using a free form text box." /> <br />

The following code is an example of the types of attributes you can add in the **Extended Attributes** text box:

```yaml
dbname: jaffle_shop      
schema: dbt_alice      
threads: 4
username: alice
password: '{{ env_var(''DBT_ENV_SECRET_PASSWORD'') }}'
```

#### Extended Attributes don't mask secret values
We recommend avoiding setting secret values to prevent visibility in the text box and logs. A common workaround is to wrap extended attributes in [environment variables](/docs/build/environment-variables). In the earlier example, `password: '{{ env_var(''DBT_ENV_SECRET_PASSWORD'') }}'` will get a value from the `DBT_ENV_SECRET_PASSWORD` environment variable at runtime.

#### How extended attributes work
If you're developing in the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud), [dbt Cloud CLI](/docs/cloud/cloud-cli-installation), or [orchestrating job runs](/docs/deploy/deployments), extended attributes parses through the provided YAML and extracts the `profiles.yml` attributes. For each individual attribute:

- If the attribute exists in another source (such as your project settings), it will replace its value (like environment-level values) in the profile. It also overrides any custom environment variables (if not itself wired using the syntax described for secrets above)

- If the attribute doesn't exist, it will add the attribute or value pair to the profile.

#### Only the **top-level keys** are accepted in extended attributes
This means that if you want to change a specific sub-key value, you must provide the entire top-level key as a JSON block in your resulting YAML. For example, if you want to customize a particular field within a [service account JSON](/docs/core/connect-data-platform/bigquery-setup#service-account-json) for your BigQuery connection (like 'project_id' or 'client_email'), you need to provide an override for the entire top-level `keyfile_json` main key/attribute using extended attributes. Include the sub-fields as a nested JSON block.



