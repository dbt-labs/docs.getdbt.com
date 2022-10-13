---
title: "Dremio setup"
meta:
  maintained_by: Dremio
  authors: 'Dremio (formerly Fabrice Etanchaud)'
  github_repo: 'dbt-dremio/dbt-dremio'
  pypi_package: 'dbt-dremio'
  min_core_version: 'v1.1.0'
  cloud_support: Not Supported
  min_supported_version: 'Dremio 4.7'
  slack_channel_name: 'n/a'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'Dremio'
  config_page: 'no-configs'
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
 
Follow the repository's link for os dependencies.

## Prerequisites for Dremio Cloud
Before connecting from project to Dremio Cloud, follow these prerequisite steps:
* Ensure that you have the ID of the Sonar project that you want to use. See [Obtaining the ID of a Project](https://docs.dremio.com/cloud/cloud-entities/projects/#obtaining-the-id-of-a-project).
* Ensure that you have a personal access token (PAT) for authenticating to Dremio Cloud. See [Creating a Token](https://docs.dremio.com/cloud/security/authentication/personal-access-token/#creating-a-token).


## Prerequisites for Dremio Software

* Ensure that you are using version 22.0 or later.
* Enable these support keys in your Dremio cluster:
  * `dremio.iceberg.enabled`
  * `dremio.iceberg.ctas.enabled`
  * `dremio.execution.support_unlimited_splits`

  See <a target="_blank" href="https://docs.dremio.com/software/advanced-administration/support-settings/#support-keys">Support Keys</a> in the Dremio documentation for the steps.
* If you want to use TLS to secure the connection between dbt and Dremio Software, configure full wire encryption in your Dremio cluster. For instructions, see <a target="_blank" href="https://docs.dremio.com/software/deployment/wire-encryption-config/">Configuring Wire Encryption</a>.


## Initializing a Project

1. Run the command `dbt init <project_name>`.
2. Select `dremio` as the database to use.
3. Select one of these options to generate a profile for your project:
    * `dremio_cloud` for working with Dremio Cloud
    * `software_with_username_password` for working with a Dremio Software cluster and authenticating to the cluster with a username and a password
    * `software_with_pat` for working with a Dremio Software cluster and authenticating to the cluster with a personal access token
4. Append these lines to the end of the content of the `dbt_project.yml` file at the root of your project directory:
```
vars:
    dremio:reflections_enabled: false
```

Next, configure the profile for your project.

## Profiles

When you initialize a project, you create one of these three profiles. You must configure it before trying to connect to Dremio Cloud or Dremio Software.

* [Profile for Dremio Cloud](#cloud)
* [Profile for Dremio Software with Username/Password Authentication](#software_up)
* [Profile for Dremio Software with Authentication Through a Personal Access Token](#software_pat)

For descriptions of the configurations in these profiles, see [Configurations](#configurations).

<a id="cloud"></a>
### Profile for Dremio Cloud
```yaml
[project name]:
  outputs:
    dev:
      cloud_host: https://api.dremio.cloud
      cloud_project_id: [project ID]
      pat: [personal access token]
      threads: [integer >= 1]
      type: dremio
      use_ssl: true
      user: [email address]
  target: dev
```

<a id="software_up"></a>
### Profile for Dremio Software with Username/Password Authentication
```yaml
[project name]:
  outputs:
    dev:
      password: [password]
      port: [port]
      software_host: [hostname or IP address]
      threads: [integer >= 1]
      type: dremio
      use_ssl: [true|false]
      user: [username]
  target: dev
```

<a id="software_pat"></a>
### Profile for Dremio Software with Authentication Through a Personal Access Token
```yaml
[project name]:
  outputs:
    dev:
      pat: [personal access token]
      port: [port]
      software_host: [hostname or IP address]
      threads: [integer >= 1]
      type: dremio
      use_ssl: [true|false]
      user: [username]
  target: dev
```

## Configurations

### Configurations Common to Profiles for Dremio Cloud and Dremio Software

<table>
<tr>
 <td><strong>Configuration</strong>
 </td>
 <td><strong>Required?</strong>
 </td>
 <td><strong>Default Value</strong>
 </td>
 <td><strong>Description</strong>
 </td>
</tr>
<tr>
 <td><code>type</code>
 </td>
 <td>Yes
 </td>
 <td><code>dremio</code>
 </td>
 <td>Auto-populated when creating a Dremio project. Do not change this value.
 </td>
</tr>
<tr>
 <td><code>threads</code>
 </td>
 <td>Yes
 </td>
 <td><code>1</code>
 </td>
 <td>The number of threads the dbt project runs on.
 </td>
</tr>
</table>
  
### Configurations in Profiles for Dremio Cloud
<table>
<tr>
 <td><strong>Configuration</strong>
 </td>
 <td><strong>Required?</strong>
 </td>
 <td><strong>Default Value</strong>
 </td>
 <td><strong>Description</strong>
 </td>
</tr>
<tr>
<td><code>cloud_host</code>
</td>
<td>Yes
</td>
<td><code>https://api.dremio.cloud</code>
</td>
<td>
<p>US Control Plane<br>
<code>https://api.dremio.cloud</code>
<p>
EU Control Plane<br>
<code>https://api.eu.dremio.cloud</code>
   </td>
  </tr>
  <tr>
  <td><code>user</code></td>
  <td>Yes</td>
  <td>None</td>
  <td>Email address used as a username in Dremio Cloud
  </tr>
  <tr>
  <td><code>pat</code></td>
  <td>Yes</td>
  <td>None</td>
  <td>Personal Access Token<br>See <a target="_blank" href="https://docs.dremio.com/cloud/security/authentication/personal-access-token/">Personal Access Tokens</a> for instructions about obtaining a token.</td>
  </tr>
  <tr>
  <td><code>cloud_project_id</code></td>
  <td>Yes</td>
  <td>None</td>
  <td>The ID of the Sonar project in which to run transformations.</td>
  </tr>
  <tr>
   <td><code>use_ssl</code>
   </td>
   <td>Yes
   </td>
   <td><code>true</code>
   </td>
   <td>The value must be <code>true</code>.</td>
  </tr>
  </table>
    
### Configurations in Profiles for Dremio Software
<table>
<tr>
 <td><strong>Configuration</strong>
 </td>
 <td><strong>Required?</strong>
 </td>
 <td><strong>Default Value</strong>
 </td>
 <td><strong>Description</strong>
 </td>
  </tr>
  <tr>
   <td><code>software_host</code>
   </td>
   <td>Yes</td>
   <td>None</td>
   <td>The hostname or IP address of the coordinator node of the Dremio cluster.</strong>
   </td>
  </tr>
  <tr>
   <td><code>port</code>
   </td>
   <td>Yes</td>
   <td><code>9047</code></td>
   <td>Port for Dremio Software cluster API endpoints.
   </td>
  </tr>
  <tr>
   <td><code>user</code>
   </td>
   <td>Yes</td>
   <td>None
   </td>
   <td>The username of the account to use when logging into the Dremio cluster.
   </td>
  </tr>
  <tr>
   <td><code>password</code>
   </td>
   <td>Yes, if you are not using the <code>pat</code> configuration.</td>
   <td>None
   </td>
   <td>The password of the account to use when logging into the Dremio cluster.
   </td>
  </tr>
  <tr>
   <td><code>pat</code>
   </td>
   <td>Yes, if you are not using the <code>user</code> and <code>password</code> configurations.</td>
   <td>None
   </td>
   <td>The personal access token to use for authenticating to Dremio.<br><ul><li>See <a target="_blank" href="https://docs.dremio.com/software/security/personal-access-tokens">Personal Access Tokens</a> for instructions about obtaining a token.</li><li>The use of a personal access token takes precedence if values for the three configurations <code>user</code>, <code>password</code> and <code>pat</code> are specified.</li></ul>
   </td>
  </tr>
  <tr>
   <td><code>use_ssl</code>
   </td>
   <td>Yes
   </td>
   <td><code>true</code>
   </td>
   <td>Acceptable values are <code>true</code> and <code>false</code>. If the value is set to <code>true</code>, ensure that full wire encryption is configured in your Dremio cluster. See [Prerequisites for Dremio Software](#prerequisites-for-dremio-software). 
   </td>
  </tr>
</table>