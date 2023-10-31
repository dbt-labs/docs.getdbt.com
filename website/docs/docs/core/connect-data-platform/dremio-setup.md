---
title: "Dremio setup"
description: "Read this guide to learn about the Dremio warehouse setup in dbt."
meta:
  maintained_by: Dremio
  authors: 'Dremio (formerly Fabrice Etanchaud)'
  github_repo: 'dremio/dbt-dremio'
  pypi_package: 'dbt-dremio'
  min_core_version: 'v1.2.0'
  cloud_support: Not Supported
  min_supported_version: 'Dremio 22.0'
  slack_channel_name: 'n/a'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'Dremio'
  config_page: '/reference/resource-configs/no-configs'
---

:::info Vendor plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

<h2> Overview of {frontMatter.meta.pypi_package} </h2>

<ul>
    <li><strong>Maintained by</strong>: {frontMatter.meta.maintained_by}</li>
    <li><strong>Authors</strong>: {frontMatter.meta.authors}</li>
    <li><strong>GitHub repo</strong>: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a><a href={`https://github.com/${frontMatter.meta.github_repo}`}><img src={`https://img.shields.io/github/stars/${frontMatter.meta.github_repo}?style=for-the-badge`}/></a></li>
    <li><strong>PyPI package</strong>: <code>{frontMatter.meta.pypi_package}</code> <a href={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}`}><img src={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}.svg`}/></a></li>
    <li><strong>Slack channel</strong>: <a href={frontMatter.meta.slack_channel_link}>{frontMatter.meta.slack_channel_name}</a></li>
    <li><strong>Supported dbt Core version</strong>: {frontMatter.meta.min_core_version} and newer</li>
    <li><strong>dbt Cloud support</strong>: {frontMatter.meta.cloud_support}</li>
    <li><strong>Minimum data platform version</strong>: {frontMatter.meta.min_supported_version}</li>
    </ul>


<h2> Installing {frontMatter.meta.pypi_package} </h2>

pip is the easiest way to install the adapter:

<code>pip install {frontMatter.meta.pypi_package}</code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>
 
Follow the repository's link for OS dependencies.

:::note 
[Model contracts](/docs/collaborate/govern/model-contracts) are not supported.
:::

## Prerequisites for Dremio Cloud
Before connecting from project to Dremio Cloud, follow these prerequisite steps:
* Ensure that you have the ID of the Sonar project that you want to use. See [Obtaining the ID of a Project](https://docs.dremio.com/cloud/cloud-entities/projects/#obtaining-the-id-of-a-project).
* Ensure that you have a personal access token (PAT) for authenticating to Dremio Cloud. See [Creating a Token](https://docs.dremio.com/cloud/security/authentication/personal-access-token/#creating-a-token).
* Ensure that Python 3.9.x or later is installed on the system that you are running dbt on.



## Prerequisites for Dremio Software

* Ensure that you are using version 22.0 or later.
* Ensure that Python 3.9.x or later is installed on the system that you are running dbt on.
* Enable these support keys in your Dremio cluster:
  * `dremio.iceberg.enabled`
  * `dremio.iceberg.ctas.enabled`
  * `dremio.execution.support_unlimited_splits`

  See <a target="_blank" rel="noopener noreferrer" href="https://docs.dremio.com/software/advanced-administration/support-settings/#support-keys">Support Keys</a> in the Dremio documentation for the steps.
* If you want to use TLS to secure the connection between dbt and Dremio Software, configure full wire encryption in your Dremio cluster. For instructions, see <a target="_blank" rel="noopener noreferrer" href="https://docs.dremio.com/software/deployment/wire-encryption-config/">Configuring Wire Encryption</a>.


## Initializing a Project

1. Run the command `dbt init <project_name>`.
2. Select `dremio` as the database to use.
3. Select one of these options to generate a profile for your project:
    * `dremio_cloud` for working with Dremio Cloud
    * `software_with_username_password` for working with a Dremio Software cluster and authenticating to the cluster with a username and a password
    * `software_with_pat` for working with a Dremio Software cluster and authenticating to the cluster with a personal access token

Next, configure the profile for your project.

## Profiles

When you initialize a project, you create one of these three profiles. You must configure it before trying to connect to Dremio Cloud or Dremio Software.

## Profiles

When you initialize a project, you create one of these three profiles. You must configure it before trying to connect to Dremio Cloud or Dremio Software.

* Profile for Dremio Cloud
* Profile for Dremio Software with Username/Password Authentication
* Profile for Dremio Software with Authentication Through a Personal Access Token

For descriptions of the configurations in these profiles, see [Configurations](#configurations).

<Tabs
  defaultValue="cloud"
  values={[
    {label: 'Cloud',
  value: 'cloud'},
    {label: 'Software (Username/Password)',
  value: 'software1'},
    {label: 'Software (Personal Access Token)',
  value: 'software2'}
    ]}
>

<TabItem value="cloud">

```yaml
[project name]:
  outputs:
    dev:
      cloud_host: https://api.dremio.cloud
      cloud_project_id: [project ID]
      object_storage_source: [name]
      object_storage_path: [path]
      dremio_space: [name]
      dremio_space_folder: [path]
      pat: [personal access token]
      threads: [integer >= 1]
      type: dremio
      use_ssl: true
      user: [email address]
  target: dev
```

</TabItem>

<TabItem value="software1">

```yaml
[project name]:
  outputs:
    dev:
      password: [password]
      port: [port]
      software_host: [hostname or IP address]
      object_storage_source: [name
      object_storage_path: [path]
      dremio_space: [name]
      dremio_space_folder: [path]
      threads: [integer >= 1]
      type: dremio
      use_ssl: [true|false]
      user: [username]
  target: dev
```

</TabItem>

<TabItem value="software2">

```yaml
[project name]:
  outputs:
    dev:
      pat: [personal access token]
      port: [port]
      software_host: [hostname or IP address]
      object_storage_source: [name
      object_storage_path: [path]
      dremio_space: [name]
      dremio_space_folder: [path]
      threads: [integer >= 1]
      type: dremio
      use_ssl: [true|false]
      user: [username]
  target: dev
```

</TabItem>
</Tabs>

## Configurations

### Configurations Common to Profiles for Dremio Cloud and Dremio Software


| Configuration | Required? | Default Value | Description |
| --- | --- | --- | --- |
| `type` | Yes | dremio | Auto-populated when creating a Dremio project. Do not change this value.  |
| `threads` | Yes | 1 | The number of threads the dbt project runs on. |
| `object_storage_source` | No | $scratch | The name of the filesystem in which to create tables, materialized views, tests, and other objects. The dbt alias is `datalake`. This name corresponds to the name of a source in the **Object Storage** section of the Datasets page in Dremio, which is "Samples" in the following image:  ![dbt samples path](/img/reference/dremio-setup/dbt-Samples.png) |
| `object_storage_path` | No | `no_schema` | The path in the filesystem in which to create objects. The default is the root level of the filesystem. The dbt alias is `root_path`. Nested folders in the path are separated with periods. This value corresponds to the path in this location in the Datasets page in Dremio, which is "samples.dremio.com.Dremio University" in the following image: ![dbt samples path](/img/reference/dremio-setup/dbt-SamplesPath.png) |
| `dremio_space` | No | `@\<username>` | The value of the Dremio space in which to create views. The dbt alias is `database`. This value corresponds to the name in this location in the **Spaces** section of the Datasets page in Dremio:  ![dbt spaces](/img/reference/dremio-setup/dbt-Spaces.png) |
| `dremio_space_folder` | No | `no_schema` | The folder in the Dremio space in which to create views. The default is the top level in the space. The dbt alias is `schema`. Nested folders are separated with periods. This value corresponds to the path in this location in the Datasets page in Dremio, which is `Folder1.Folder2` in the following image:  ![Folder1.Folder2](/img/reference/dremio-setup/dbt-SpacesPath.png) |

### Configurations in Profiles for Dremio Cloud

| Configuration | Required? | Default Value | Description |
| --- | --- | --- | --- |
| `cloud_host` | Yes | `https://api.dremio.cloud` | US Control Plane: `https://api.dremio.cloud`<br></br>EU Control Plane: `https://api.eu.dremio.cloud` |
| `user` | Yes | None | Email address used as a username in Dremio Cloud | 
| `pat` | Yes | None | The personal access token to use for authentication. See [Personal Access Tokens](https://docs.dremio.com/cloud/security/authentication/personal-access-token/) for instructions about obtaining a token. | 
| `cloud_project_id` | Yes | None | The ID of the Sonar project in which to run transformations. | 
| `use_ssl` | Yes | `true` | The value must be `true`. |
    
### Configurations in Profiles for Dremio Software
| Configuration | Required? | Default Value | Description | 
| ---  | ---  | ---  | ---  | 
| `software_host` | Yes | None | The hostname or IP address of the coordinator node of the Dremio cluster. | 
| `port` | Yes | `9047` | Port for Dremio Software cluster API endpoints. | 
| `user` | Yes | None | The username of the account to use when logging into the Dremio cluster. | 
| `password` | Yes, if you are not using the pat configuration. | None | The password of the account to use when logging into the Dremio cluster. | 
| `pat` | Yes, if you are not using the user and password configurations. | None | The personal access token to use for authenticating to Dremio. See [Personal Access Tokens](https://docs.dremio.com/software/security/personal-access-tokens/) for instructions about obtaining a token. The use of a personal access token takes precedence if values for the three configurations user, password and pat are specified. | 
| `use_ssl` | Yes | `true` | Acceptable values are `true` and `false`. If the value is set to true, ensure that full wire encryption is configured in your Dremio cluster. See [Prerequisites for Dremio Software](#prerequisites-for-dremio-software). | 
