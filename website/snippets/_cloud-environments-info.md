
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

Extended Attributes is currently in beta for select users and is subject to change.
:::

Extended Attributes is a feature that allows users to set a flexible [profiles.yml](/docs/core/connect-data-platform/profiles.yml) snippet in their dbt Cloud Environment settings. It provides users with more control over environments (both deployment and development) and extends how dbt Cloud connects to the data platform within a given environment.

Extended Attributes is a text box extension at the environment level that overrides connection or environment credentials. It accepts any attributes accepted by a dbt adapter in its `profiles.yml`. 

However, something to note is that it doesn't mask secret values. We recommend avoiding setting secret values to prevent visibility in the text box and logs.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/extended-attributes.jpg" width="95%" title="Extended Attributes helps users add profiles.yml attributes to dbt Cloud Environment settings using a free form text box." /> <br />

The **Extended Attributes** text box must contain valid characters only. Any invalid characters will result in an error message. Invalid characters include:

- `/` (forward slash)
- `\` (backslash)
- `$` (dollar sign)
- `!` (exclamation point)
- `@` (at sign)
- `#` (hash) (NEED CONFIRMATION)
- `+` (plus sign)
- `%` (percentage sign)

If you're developing in the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) or [orchestrating job runs](/docs/deploy/deployments), Extended Attributes parses through the provided YAML and extracts the profiles.yml attributes. For each individual attribute:

- If the key exists in another source (such as your project settings), it will replace its value in the profile.
- If the key doesn't exist, it will add the key or value pair to the profile. 

The following code is an example of the types of attributes you can add to the **Extended Attributes** text box:

```yaml
type: postgres      
host: localhost      
user: alice      
password: <your_password>      
port: 5432      
dbname: jaffle_shop      
schema: dbt_alice      
threads: 4
```
