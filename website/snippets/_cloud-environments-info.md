
## Types of environments

In dbt Cloud, there are two types of environments:
- Deployment environment &mdash; Determines the settings used when jobs created within that environment are executed. 
- Development environment &mdash; Determines the settings used in the dbt Cloud IDE for that particular dbt Cloud project. 

Each dbt Cloud project can only have a single development environment but can have any number of deployment environments.

|  | Development Environments | Deployment Environments |
| --- | --- | --- |
| Determines settings for | dbt Cloud IDE | dbt Cloud Job runs |
| How many can I have in my project? | 1 | Any number |

:::note 
For users familiar with development on the CLI, each environment is roughly analogous to an entry in your `profiles.yml` file, with some additional information about your repository to ensure the proper version of code is executed. More info on dbt core environments [here](/docs/core/dbt-core-environments).
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

- dbt Cloud allows users to select any dbt release. At this time, **environments must use a dbt version greater than or equal to v1.0.0;** [lower versions are no longer supported](/docs/dbt-versions/upgrade-core-in-cloud).
- If you select a current version with `(latest)` in the name, your environment will automatically install the latest stable version of the minor version selected.
:::

### Custom branch behavior

By default, all environments will use the default branch in your repository (usually the `main` branch) when accessing your dbt code. This is overridable within each dbt Cloud Environment using the **Default to a custom branch** option. This setting have will have slightly different behavior depending on the environment type:

- **Development**: determines which branch in the dbt Cloud IDE developers create branches from and open PRs against
- **Deployment:** determines the branch is cloned during job executions for each environment.

For more info, check out this [FAQ page on this topic](/faqs/Environments/custom-branch-settings)!


### Extended attributes (Beta)

:::important This feature is currently in beta

Extended Attributes is currently in [beta](/docs/dbt-versions/product-lifecycles?) for select users and is subject to change.
:::

Extended Attributes is a feature that allows users to set a flexible [profiles.yml](/docs/core/connect-data-platform/profiles.yml) snippet in their dbt Cloud Environment settings. It provides users with more control over environments (both deployment and development) and extends how dbt Cloud connects to the data platform within a given environment.

Extended Attributes is a text box extension at the environment level that overrides connection or environment credentials, including any custom environment variables. You can set any YAML attributes that a dbt adapter accepts in its `profiles.yml`.

Something to note, Extended Attributes doesn't mask secret values. We recommend avoiding setting secret values to prevent visibility in the text box and logs. 

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/extended-attributes.jpg" width="95%" title="Extended Attributes helps users add profiles.yml attributes to dbt Cloud Environment settings using a free form text box." /> <br />

If you're developing in the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) or [orchestrating job runs](/docs/deploy/deployments), Extended Attributes parses through the provided YAML and extracts the `profiles.yml` attributes. For each individual attribute:

- If the attribute exists in another source (such as your project settings), it will replace its value (like environment-level values) in the profile. It also overrides any custom environment variables.

- If the attribute doesn't exist, it will add the attribute or value pair to the profile. 

The following code is an example of the types of attributes you can add in the **Extended Attributes** text box:

```yaml
dbname: jaffle_shop      
schema: dbt_alice      
threads: 4
```

